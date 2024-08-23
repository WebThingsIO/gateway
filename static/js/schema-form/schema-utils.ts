/**
 * Utility functions for JSON-schema form.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * This Source Code includes react-jsonschema-form
 * released under the Apache License 2.0.
 * https://github.com/mozilla-services/react-jsonschema-form
 * Date on whitch referred: Thu, Mar 08, 2018  1:08:52 PM
 */

import Validator from './validator';

export const REQUIRED_FIELD_SYMBOL = '*';

export function findSchemaDefinition(
  $ref: string,
  definitions: Record<string, unknown> = {}
): Record<string, unknown> {
  // Extract and use the referenced definition if we have it.
  const match = /^#\/definitions\/(.*)$/.exec($ref);
  if (match && match[1]) {
    const parts = match[1].split('/');
    let current = definitions;
    for (let part of parts) {
      part = part.replace(/~1/g, '/').replace(/~0/g, '~');
      if (current.hasOwnProperty(part)) {
        current = <Record<string, unknown>>current[part];
      } else {
        // No matching definition found, that's an error (bogus schema?)
        throw new Error(`Could not find a definition for ${$ref}.`);
      }
    }
    return current;
  }

  // No matching definition found, that's an error (bogus schema?)
  throw new Error(`Could not find a definition for ${$ref}.`);
}

export function retrieveSchema(
  schema: Record<string, unknown>,
  definitions: Record<string, unknown> = {},
  formData: unknown = {}
): Record<string, unknown> {
  // No $ref attribute found, returning the original schema.
  if (schema.hasOwnProperty('$ref')) {
    // Retrieve the referenced schema definition.
    const $refSchema = findSchemaDefinition(<string>schema.$ref, definitions);
    // Drop the $ref property of the source schema.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { $ref, ...localSchema } = schema;
    // Update referenced schema definition with local schema properties.
    return retrieveSchema({ ...$refSchema, ...localSchema }, definitions, formData);
  } else if (schema.hasOwnProperty('dependencies')) {
    const resolvedSchema = resolveDependencies(
      schema,
      definitions,
      <Record<string, unknown>>formData
    );
    return retrieveSchema(resolvedSchema, definitions, formData);
  } else {
    return schema;
  }
}

export function resolveDependencies(
  schema: Record<string, unknown>,
  definitions: Record<string, unknown>,
  formData: Record<string, unknown>
): Record<string, unknown> {
  // Drop the dependencies from the source schema.
  const { dependencies = {}, ...localSchema } = schema;
  let resolvedSchema = localSchema;
  // Process dependencies updating the local schema properties as
  // appropriate.
  for (const dependencyKey in <Record<string, unknown>>dependencies) {
    // Skip this dependency if its trigger property is not present.
    if (typeof formData[dependencyKey] === 'undefined') {
      continue;
    }
    const dependencyValue = (<Record<string, unknown>>dependencies)[dependencyKey];
    if (Array.isArray(dependencyValue)) {
      resolvedSchema = withDependentProperties(resolvedSchema, dependencyValue);
    } else if (isObject(dependencyValue)) {
      resolvedSchema = withDependentSchema(
        resolvedSchema,
        definitions,
        formData,
        dependencyKey,
        <Record<string, unknown>>dependencyValue
      );
    }
  }
  return resolvedSchema;
}

export function withDependentProperties(
  schema: Record<string, unknown>,
  additionallyRequired: unknown[]
): Record<string, unknown> {
  if (!additionallyRequired) {
    return schema;
  }
  const required = Array.isArray(schema.required)
    ? Array.from(new Set([...schema.required, ...additionallyRequired]))
    : additionallyRequired;
  return { ...schema, required };
}

export function withDependentSchema(
  schema: Record<string, unknown>,
  definitions: Record<string, unknown>,
  formData: Record<string, unknown>,
  dependencyKey: string,
  dependencyValue: Record<string, unknown>
): Record<string, unknown> {
  const { oneOf, ...dependentSchema } = retrieveSchema(dependencyValue, definitions, formData);
  schema = mergeSchemas(schema, dependentSchema);
  return typeof oneOf === 'undefined'
    ? schema
    : withExactlyOneSubschema(schema, definitions, formData, dependencyKey, <JsonSchema[]>oneOf);
}

export function withExactlyOneSubschema(
  schema: Record<string, unknown>,
  definitions: Record<string, unknown>,
  formData: Record<string, unknown>,
  dependencyKey: string,
  oneOf: JsonSchema[]
): Record<string, unknown> {
  if (!Array.isArray(oneOf)) {
    throw new Error(`invalid oneOf: it is some ${typeof oneOf} instead of an array`);
  }
  const validSubschemas = oneOf.filter((subschema) => {
    if (!subschema.properties) {
      return false;
    }
    const { [dependencyKey]: conditionPropertySchema } = subschema.properties;
    if (conditionPropertySchema) {
      const conditionSchema = {
        type: 'object',
        properties: {
          [dependencyKey]: conditionPropertySchema,
        },
      };
      const { errors } = Validator.validateFormData(formData, conditionSchema);
      return errors.length === 0;
    }

    return false;
  });
  if (validSubschemas.length !== 1) {
    console.warn(
      // eslint-disable-next-line @typescript-eslint/quotes
      "ignoring oneOf in dependencies because there isn't exactly one subschema that is valid"
    );
    return schema;
  }
  const subschema = validSubschemas[0];
  // Drop the dependency property from the subschema.
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    [dependencyKey]: conditionPropertySchema,
    ...dependentSubschema
  } = subschema.properties;
  const dependentSchema = { ...subschema, properties: dependentSubschema };
  return mergeSchemas(schema, retrieveSchema(dependentSchema, definitions, formData));
}

export function mergeSchemas(
  schema1: Record<string, unknown>,
  schema2: Record<string, unknown>
): Record<string, unknown> {
  return mergeObjects(schema1, schema2, true);
}

export function isConstant(schema: Record<string, unknown>): boolean {
  return (Array.isArray(schema.enum) && schema.enum.length === 1) || schema.hasOwnProperty('const');
}

export function isFixedItems(schema: Record<string, unknown>): boolean {
  return (
    Array.isArray(schema.items) &&
    schema.items.length > 0 &&
    schema.items.every((item) => isObject(item))
  );
}

export function isObject(thing: unknown): boolean {
  return typeof thing === 'object' && thing !== null && !Array.isArray(thing);
}

export function isSelect(
  _schema: Record<string, unknown>,
  definitions: Record<string, unknown> = {}
): boolean {
  const schema = retrieveSchema(_schema, definitions);
  const altSchemas = schema.oneOf || schema.anyOf;
  if (Array.isArray(schema.enum)) {
    return true;
  } else if (Array.isArray(altSchemas)) {
    return altSchemas.every((altSchemas) => isConstant(altSchemas));
  }
  return false;
}

export function isMultiSelect(
  schema: Record<string, unknown>,
  definitions: Record<string, unknown> = {}
): boolean {
  if (!schema.uniqueItems || !schema.items) {
    return false;
  }
  return isSelect(<Record<string, unknown>>schema.items, definitions);
}

export function toConstant(schema: Record<string, unknown>): unknown {
  if (Array.isArray(schema.enum) && schema.enum.length === 1) {
    return schema.enum[0];
  } else if (schema.hasOwnProperty('const')) {
    return schema.const;
  } else {
    throw new Error('schema cannot be inferred as a constant');
  }
}

export function toIdSchema(
  schema: Record<string, unknown>,
  id: string | null,
  definitions: Record<string, unknown>,
  formData: Record<string, unknown> = {}
): Record<string, unknown> {
  const idSchema: Record<string, unknown> = {
    $id: id || 'root',
  };
  if ('$ref' in schema) {
    const _schema = retrieveSchema(schema, definitions, formData);
    return toIdSchema(_schema, id, definitions, formData);
  }
  if ('items' in schema && !(<Record<string, unknown>>schema.items).$ref) {
    return toIdSchema(<Record<string, unknown>>schema.items, id, definitions, formData);
  }
  if (schema.type !== 'object') {
    return idSchema;
  }
  for (const name in <Record<string, unknown>>schema.properties || {}) {
    const field = <Record<string, unknown>>(<Record<string, unknown>>schema.properties)[name];
    const fieldId = `${idSchema.$id}_${name}`;
    idSchema[name] = toIdSchema(
      field,
      fieldId,
      definitions,
      <Record<string, unknown>>formData[name]
    );
  }
  return idSchema;
}

export function mergeObjects(
  obj1: Record<string, unknown>,
  obj2: Record<string, unknown>,
  concatArrays = false
): Record<string, unknown> {
  // Recursively merge deeply nested objects.
  const acc = Object.assign({}, obj1); // Prevent mutation of source object.
  return Object.keys(obj2).reduce((acc, key) => {
    const left = obj1[key];
    const right = obj2[key];
    if (obj1.hasOwnProperty(key) && isObject(right)) {
      acc[key] = mergeObjects(
        <Record<string, unknown>>left,
        <Record<string, unknown>>right,
        concatArrays
      );
    } else if (concatArrays && Array.isArray(left) && Array.isArray(right)) {
      acc[key] = left.concat(right);
    } else {
      acc[key] = right;
    }
    return acc;
  }, acc);
}

export function optionsList(schema: Record<string, unknown>): Record<string, unknown>[] {
  if (schema.enum) {
    return (<unknown[]>schema.enum).map((value, i) => {
      const label = (schema.enumNames && (<string[]>schema.enumNames)[i]) || String(value);
      return { label, value };
    });
  } else {
    const altSchemas = <Record<string, unknown>[]>(schema.oneOf || schema.anyOf);
    return altSchemas.map((schema) => {
      const value = toConstant(schema);
      const label = <string>schema.title || String(value);
      return { label, value };
    });
  }
}

export function computeDefaults(
  schema: Record<string, unknown>,
  parentDefaults: unknown,
  definitions: Record<string, unknown> = {}
): unknown {
  // Compute the defaults recursively: give highest priority to deepest
  // nodes.
  let defaults = parentDefaults;
  if (isObject(defaults) && isObject(schema.default)) {
    // For object defaults, only override parent defaults that are defined
    // in schema.default.
    defaults = mergeObjects(
      <Record<string, unknown>>defaults,
      <Record<string, unknown>>schema.default
    );
  } else if ('default' in schema) {
    // Use schema defaults for this node.
    defaults = schema.default;
  } else if ('$ref' in schema) {
    // Use referenced schema defaults for this node.
    const refSchema = findSchemaDefinition(<string>schema.$ref, definitions);
    return computeDefaults(refSchema, defaults, definitions);
  } else if (isFixedItems(schema)) {
    defaults = (<unknown[]>schema.items).map((itemSchema) => {
      // eslint-disable-next-line no-undefined
      return computeDefaults(<Record<string, unknown>>itemSchema, undefined, definitions);
    });
  }
  // No defaults defined for this node, fallback to generic typed ones.
  if (typeof defaults === 'undefined') {
    defaults = schema.default;
  }

  switch (schema.type) {
    // We need to recur for object schema inner default values.
    case 'object':
      return Object.keys(
        <Record<string, unknown>>schema.properties || <Record<string, unknown>>{}
      ).reduce((acc, key) => {
        // Compute the defaults for this node, with the parent defaults
        // we might have from a previous run: defaults[key].
        acc[key] = computeDefaults(
          <Record<string, unknown>>(<Record<string, unknown>>schema.properties)[key],
          (<Record<string, unknown>>(defaults || {}))[key],
          definitions
        );
        return acc;
      }, <Record<string, unknown>>{});

    case 'array':
      if (schema.minItems) {
        if (!isMultiSelect(schema, definitions)) {
          const defaultsLength = defaults ? (<unknown[]>defaults).length : 0;
          const minItems = <number>schema.minItems;
          if (minItems > defaultsLength) {
            const defaultEntries = defaults || [];
            // populate the array with the defaults
            const fillerEntries = new Array(minItems - defaultsLength).fill(
              // then fill up the rest with either the item default or empty, up to minItems
              computeDefaults(
                <Record<string, unknown>>schema.items,
                (<Record<string, unknown>>schema.items).defaults,
                definitions
              )
            );

            return (<unknown[]>defaultEntries).concat(fillerEntries);
          }
        } else {
          return [];
        }
      }
      break;

    // We need default value with a range form.
    case 'number':
    case 'integer':
      if (typeof defaults === 'undefined') {
        if (schema.hasOwnProperty('minimum') && schema.hasOwnProperty('maximum')) {
          defaults = schema.minimum;
        } else {
          defaults = 0;
        }
      }
      break;

    // We need default value with a checkbox.
    case 'boolean':
      if (typeof defaults === 'undefined') {
        defaults = false;
      }
      break;
  }
  return defaults;
}

export function getDefaultFormState(
  _schema: Record<string, unknown>,
  formData: unknown,
  definitions: Record<string, unknown> = {}
): unknown {
  if (!isObject(_schema)) {
    throw new Error(`Invalid schema: ${_schema}`);
  }
  const schema = retrieveSchema(_schema, definitions, formData);
  const defaults = computeDefaults(schema, _schema.default, definitions);
  if (typeof formData === 'undefined') {
    // No form data? Use schema defaults.
    return defaults;
  }
  if (isObject(formData)) {
    // Override schema defaults with form data.
    return mergeObjects(<Record<string, unknown>>defaults, <Record<string, unknown>>formData);
  }
  return formData || defaults;
}

export function getOptionsList(schema: Record<string, unknown>): Record<string, unknown>[] {
  if (schema.enum) {
    return (<unknown[]>schema.enum).map((value, i) => {
      const label = (schema.enumNames && (<string[]>schema.enumNames)[i]) || String(value);
      return { label, value };
    });
  } else {
    const altSchemas = <Record<string, unknown>[]>(schema.oneOf || schema.anyOf);
    return altSchemas.map((schema) => {
      const value = toConstant(schema);
      const label = schema.title || String(value);
      return { label, value };
    });
  }
}

interface JsonSchema {
  properties: Record<string, PropertySchema>;
}

interface PropertySchema {
  type: string;
}
