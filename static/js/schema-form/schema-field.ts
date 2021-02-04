/**
 * Input Field for JSON-schema.
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

import ArrayField from './array-field';
import BooleanField from './boolean-field';
import NumberField from './number-field';
import ObjectField from './object-field';
import * as SchemaUtils from './schema-utils';
import StringField from './string-field';
import UnsupportedField from './unsupported-field';
import * as Utils from '../utils';

/* eslint-disable @typescript-eslint/no-explicit-any */
type FieldClass = {
  new (
    schema: Record<string, unknown>,
    formData: any,
    idSchema: Record<string, unknown>,
    name: string,
    definitions: Record<string, unknown>,
    onChange: ((value: unknown) => void) | null,
    required: boolean,
    disabled: boolean,
    readOnly: boolean
  ): any;
};
/* eslint-enable @typescript-eslint/no-explicit-any */

export default class SchemaField {
  private schema: Record<string, unknown>;

  private formData: unknown;

  private idSchema: Record<string, unknown>;

  private name: string | null;

  private definitions: Record<string, unknown>;

  private onChange: ((value: unknown) => void) | null;

  private required: boolean;

  private disabled: boolean;

  private readOnly: boolean;

  private retrievedSchema: Record<string, unknown>;

  constructor(
    schema: Record<string, unknown>,
    formData: unknown,
    idSchema: Record<string, unknown>,
    name: string | null,
    definitions: Record<string, unknown>,
    onChange: ((value: unknown) => void) | null = null,
    required = false,
    disabled = false,
    readOnly = false
  ) {
    this.retrievedSchema = SchemaUtils.retrieveSchema(schema, definitions, formData);
    this.schema = schema;
    this.formData = formData;
    this.idSchema = idSchema;
    this.name = name;
    this.definitions = definitions;
    this.onChange = onChange;
    this.required = required;
    this.disabled = disabled;
    this.readOnly = readOnly;
  }

  getFieldType(): FieldClass {
    const FIELD_TYPES: Record<string, FieldClass> = {
      array: ArrayField,
      boolean: BooleanField,
      integer: NumberField,
      number: NumberField,
      object: ObjectField,
      string: StringField,
    };

    const field = FIELD_TYPES[<string>this.retrievedSchema.type];
    return field ?? UnsupportedField;
  }

  render(): HTMLDivElement {
    const fieldType = this.getFieldType();
    const type = this.retrievedSchema.type;
    const id = Utils.escapeHtmlForIdClass(<string>this.idSchema.$id);
    const descr = <string>this.retrievedSchema.description;
    const classNames = ['form-group', 'field', `field-${type}`].join(' ').trim();
    let label = <string>this.retrievedSchema.title || this.name;
    if (typeof label !== 'undefined' && label !== null) {
      label = Utils.escapeHtml(label);
      label = this.required ? label + SchemaUtils.REQUIRED_FIELD_SYMBOL : label;
    }

    let displayLabel = true;
    let displayDescription = true;
    if (type === 'array') {
      displayLabel = displayDescription = SchemaUtils.isMultiSelect(this.schema, this.definitions);
    }
    if (type === 'object') {
      displayLabel = displayDescription = false;
    }

    const field = document.createElement('div');
    field.className = classNames;
    field.innerHTML =
      (displayLabel && label ? `<div id="${id}__label" class="control-label">${label}</div>` : '') +
      (displayDescription && descr
        ? `<p id="${id}__description" class="field-description">${Utils.escapeHtml(descr)}</p>`
        : '');

    const child = new fieldType(
      this.schema,
      this.formData,
      this.idSchema,
      this.name || '',
      this.definitions,
      this.onChange,
      this.required,
      this.disabled,
      this.readOnly
    ).render();

    field.appendChild(child);

    return field;
  }
}
