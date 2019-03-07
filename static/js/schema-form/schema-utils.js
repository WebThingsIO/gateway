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

'use strict';

const Validator = require('./validator');

const SchemaUtils = {

  REQUIRED_FIELD_SYMBOL: '*',

  findSchemaDefinition: ($ref, definitions = {}) => {
    // Extract and use the referenced definition if we have it.
    const match = /^#\/definitions\/(.*)$/.exec($ref);
    if (match && match[1]) {
      const parts = match[1].split('/');
      let current = definitions;
      for (let part of parts) {
        part = part.replace(/~1/g, '/').replace(/~0/g, '~');
        if (current.hasOwnProperty(part)) {
          current = current[part];
        } else {
          // No matching definition found, that's an error (bogus schema?)
          throw new Error(`Could not find a definition for ${$ref}.`);
        }
      }
      return current;
    }

    // No matching definition found, that's an error (bogus schema?)
    throw new Error(`Could not find a definition for ${$ref}.`);
  },

  retrieveSchema: (schema, definitions = {}, formData = {}) => {
    // No $ref attribute found, returning the original schema.
    if (schema.hasOwnProperty('$ref')) {
      // Retrieve the referenced schema definition.
      const $refSchema =
        SchemaUtils.findSchemaDefinition(schema.$ref, definitions);
      // Drop the $ref property of the source schema.
      // eslint-disable-next-line no-unused-vars
      const {$ref, ...localSchema} = schema;
      // Update referenced schema definition with local schema properties.
      return SchemaUtils.retrieveSchema({...$refSchema, ...localSchema},
                                        definitions,
                                        formData);
    } else if (schema.hasOwnProperty('dependencies')) {
      const resolvedSchema = SchemaUtils.resolveDependencies(schema,
                                                             definitions,
                                                             formData);
      return SchemaUtils.retrieveSchema(resolvedSchema,
                                        definitions,
                                        formData);
    } else {
      return schema;
    }
  },

  resolveDependencies: (schema, definitions, formData) => {
    // Drop the dependencies from the source schema.
    const {dependencies = {}, ...localSchema} = schema;
    let resolvedSchema = localSchema;
    // Process dependencies updating the local schema properties as
    // appropriate.
    for (const dependencyKey in dependencies) {
      // Skip this dependency if its trigger property is not present.
      if (typeof formData[dependencyKey] === 'undefined') {
        continue;
      }
      const dependencyValue = dependencies[dependencyKey];
      if (Array.isArray(dependencyValue)) {
        resolvedSchema = SchemaUtils.withDependentProperties(resolvedSchema,
                                                             dependencyValue);
      } else if (SchemaUtils.isObject(dependencyValue)) {
        resolvedSchema = SchemaUtils.withDependentSchema(resolvedSchema,
                                                         definitions,
                                                         formData,
                                                         dependencyKey,
                                                         dependencyValue
        );
      }
    }
    return resolvedSchema;
  },

  withDependentProperties: (schema, additionallyRequired) => {
    if (!additionallyRequired) {
      return schema;
    }
    const required = Array.isArray(schema.required) ?
      Array.from(new Set([...schema.required, ...additionallyRequired])) :
      additionallyRequired;
    return {...schema, required};
  },

  withDependentSchema: (
    schema,
    definitions,
    formData,
    dependencyKey,
    dependencyValue
  ) => {
    const {oneOf, ...dependentSchema} = SchemaUtils.retrieveSchema(
      dependencyValue,
      definitions,
      formData
    );
    schema = SchemaUtils.mergeSchemas(schema, dependentSchema);
    return typeof oneOf === 'undefined' ?
      schema :
      SchemaUtils.withExactlyOneSubschema(schema,
                                          definitions,
                                          formData,
                                          dependencyKey,
                                          oneOf);
  },

  withExactlyOneSubschema: (
    schema,
    definitions,
    formData,
    dependencyKey,
    oneOf
  ) => {
    if (!Array.isArray(oneOf)) {
      throw new Error(
        `invalid oneOf: it is some ${typeof oneOf} instead of an array`
      );
    }
    const validSubschemas = oneOf.filter((subschema) => {
      if (!subschema.properties) {
        return false;
      }
      const {[dependencyKey]: conditionPropertySchema} = subschema.properties;
      if (conditionPropertySchema) {
        const conditionSchema = {
          type: 'object',
          properties: {
            [dependencyKey]: conditionPropertySchema,
          },
        };
        const {errors} = Validator.validateFormData(formData,
                                                    conditionSchema);
        return errors.length === 0;
      }

      return false;
    });
    if (validSubschemas.length !== 1) {
      console.warn(
        'ignoring oneOf in dependencies because there isn\'t ' +
        'exactly one subschema that is valid'
      );
      return schema;
    }
    const subschema = validSubschemas[0];
    // Drop the dependency property from the subschema.
    const {
      // eslint-disable-next-line no-unused-vars
      [dependencyKey]: conditionPropertySchema,
      ...dependentSubschema
    } = subschema.properties;
    const dependentSchema = {...subschema, properties: dependentSubschema};
    return SchemaUtils.mergeSchemas(
      schema,
      SchemaUtils.retrieveSchema(dependentSchema, definitions, formData)
    );
  },

  // eslint-disable-next-line max-len
  mergeSchemas: (schema1, schema2) => SchemaUtils.mergeObjects(schema1, schema2, true),

  isConstant: (schema) => (
    (Array.isArray(schema.enum) && schema.enum.length === 1) ||
    schema.hasOwnProperty('const')
  ),

  isFixedItems: (schema) => (
    Array.isArray(schema.items) &&
    schema.items.length > 0 &&
    schema.items.every((item) => SchemaUtils.isObject(item))
  ),

  isObject: (thing) => typeof thing === 'object' &&
    thing !== null && !Array.isArray(thing),

  isSelect: (_schema, definitions = {}) => {
    const schema = SchemaUtils.retrieveSchema(_schema, definitions);
    const altSchemas = schema.oneOf || schema.anyOf;
    if (Array.isArray(schema.enum)) {
      return true;
    } else if (Array.isArray(altSchemas)) {
      return altSchemas.every(
        (altSchemas) => SchemaUtils.isConstant(altSchemas));
    }
    return false;
  },

  isMultiSelect: (schema, definitions = {}) => {
    if (!schema.uniqueItems || !schema.items) {
      return false;
    }
    return SchemaUtils.isSelect(schema.items, definitions);
  },

  toConstant: (schema) => {
    if (Array.isArray(schema.enum) && schema.enum.length === 1) {
      return schema.enum[0];
    } else if (schema.hasOwnProperty('const')) {
      return schema.const;
    } else {
      throw new Error('schema cannot be inferred as a constant');
    }
  },

  toIdSchema: (schema, id, definitions, formData = {}) => {
    const idSchema = {
      $id: id || 'root',
    };
    if ('$ref' in schema) {
      const _schema = SchemaUtils.retrieveSchema(schema,
                                                 definitions,
                                                 formData);
      return SchemaUtils.toIdSchema(_schema, id, definitions, formData);
    }
    if ('items' in schema && !schema.items.$ref) {
      return SchemaUtils.toIdSchema(schema.items, id, definitions, formData);
    }
    if (schema.type !== 'object') {
      return idSchema;
    }
    for (const name in schema.properties || {}) {
      const field = schema.properties[name];
      const fieldId = `${idSchema.$id}_${name}`;
      idSchema[name] = SchemaUtils.toIdSchema(field,
                                              fieldId,
                                              definitions,
                                              formData[name]);
    }
    return idSchema;
  },

  mergeObjects: (obj1, obj2, concatArrays = false) => {
    // Recursively merge deeply nested objects.
    const acc = Object.assign({}, obj1); // Prevent mutation of source object.
    return Object.keys(obj2).reduce((acc, key) => {
      const left = obj1[key],
        right = obj2[key];
      if (obj1.hasOwnProperty(key) && SchemaUtils.isObject(right)) {
        acc[key] = SchemaUtils.mergeObjects(left, right, concatArrays);
      } else if (concatArrays &&
        Array.isArray(left) &&
        Array.isArray(right)) {
        acc[key] = left.concat(right);
      } else {
        acc[key] = right;
      }
      return acc;
    }, acc);
  },

  optionsList: (schema) => {
    if (schema.enum) {
      return schema.enum.map((value, i) => {
        const label = (schema.enumNames && schema.enumNames[i]) ||
          String(value);
        return {label, value};
      });
    } else {
      const altSchemas = schema.oneOf || schema.anyOf;
      return altSchemas.map((schema) => {
        const value = SchemaUtils.toConstant(schema);
        const label = schema.title || String(value);
        return {label, value};
      });
    }
  },

  computeDefaults: (schema, parentDefaults, definitions = {}) => {
    // Compute the defaults recursively: give highest priority to deepest
    // nodes.
    let defaults = parentDefaults;
    if (SchemaUtils.isObject(defaults) &&
      SchemaUtils.isObject(schema.default)) {
      // For object defaults, only override parent defaults that are defined
      // in schema.default.
      defaults = SchemaUtils.mergeObjects(defaults, schema.default);
    } else if ('default' in schema) {
      // Use schema defaults for this node.
      defaults = schema.default;
    } else if ('$ref' in schema) {
      // Use referenced schema defaults for this node.
      const refSchema = SchemaUtils.findSchemaDefinition(
        schema.$ref,
        definitions);
      return SchemaUtils.computeDefaults(refSchema, defaults, definitions);
    } else if (SchemaUtils.isFixedItems(schema)) {
      defaults = schema.items.map((itemSchema) => {
        return SchemaUtils.computeDefaults(
          // eslint-disable-next-line no-undefined
          itemSchema, undefined, definitions);
      });
    }
    // No defaults defined for this node, fallback to generic typed ones.
    if (typeof defaults === 'undefined') {
      defaults = schema.default;
    }

    switch (schema.type) {
      // We need to recur for object schema inner default values.
      case 'object':
        return Object.keys(schema.properties || {}).reduce((acc, key) => {
          // Compute the defaults for this node, with the parent defaults
          // we might have from a previous run: defaults[key].
          acc[key] = SchemaUtils.computeDefaults(
            schema.properties[key],
            (defaults || {})[key],
            definitions
          );
          return acc;
        }, {});

      case 'array':
        if (schema.minItems) {
          if (!SchemaUtils.isMultiSelect(schema, definitions)) {
            const defaultsLength = defaults ? defaults.length : 0;
            if (schema.minItems > defaultsLength) {
              const defaultEntries = defaults || [];
              // populate the array with the defaults
              const fillerEntries = new Array(
                schema.minItems - defaultsLength
              ).fill(
                SchemaUtils.computeDefaults(
                  schema.items,
                  schema.items.defaults,
                  definitions)
              );
              // then fill up the rest with either the item default or empty,
              // up to minItems

              return defaultEntries.concat(fillerEntries);
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
          if (schema.hasOwnProperty('minimum') &&
            schema.hasOwnProperty('maximum')) {
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
  },

  getDefaultFormState: (_schema, formData, definitions = {}) => {
    if (!SchemaUtils.isObject(_schema)) {
      throw new Error(`Invalid schema: ${_schema}`);
    }
    const schema = SchemaUtils.retrieveSchema(_schema, definitions, formData);
    const defaults = SchemaUtils.computeDefaults(
      schema,
      _schema.default,
      definitions);
    if (typeof formData === 'undefined') {
      // No form data? Use schema defaults.
      return defaults;
    }
    if (SchemaUtils.isObject(formData)) {
      // Override schema defaults with form data.
      return SchemaUtils.mergeObjects(defaults, formData);
    }
    return formData || defaults;
  },

  getOptionsList: (schema) => {
    if (schema.enum) {
      return schema.enum.map((value, i) => {
        const label = (schema.enumNames && schema.enumNames[i]) ||
          String(value);
        return {label, value};
      });
    } else {
      const altSchemas = schema.oneOf || schema.anyOf;
      return altSchemas.map((schema) => {
        const value = SchemaUtils.toConstant(schema);
        const label = schema.title || String(value);
        return {label, value};
      });
    }
  },
};

module.exports = SchemaUtils;
