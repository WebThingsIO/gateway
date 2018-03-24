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

'use strict';

/* globals SchemaUtils, NumberField, ObjectField, StringField,
BooleanField, UnsupportedField, Utils */

function SchemaField(
  schema,
  formData,
  idSchema,
  name,
  definitions,
  onChange,
  required = false,
  disabled = false,
  readonly = false) {

  this.schema = SchemaUtils.retrieveSchema(schema, definitions);
  this.formData = formData;
  this.idSchema = idSchema;
  this.name = name;
  this.definitions = definitions;
  this.onChange = onChange;
  this.required = required;
  this.disabled = disabled;
  this.readonly = readonly;

  return this;
}

SchemaField.prototype.getFieldType = function () {
  const FIELD_TYPES = {
    //array: "ArrayField",
    boolean: BooleanField,
    integer: NumberField,
    number: NumberField,
    object: ObjectField,
    string: StringField,
  };

  const field = FIELD_TYPES[this.schema.type];
  return field ? field : UnsupportedField;
}

SchemaField.prototype.render = function () {
  const fieldType = this.getFieldType();
  const type = this.schema.type;
  const id = Utils.escapeHtml(this.idSchema.$id);
  const description = this.schema.description;
  const classNames = [
    'form-group',
    'field',
    `field-${type}`
  ]
    .join(' ')
    .trim();
  let label = this.schema.title || this.name;
  label = Utils.escapeHtml(label);
  label = this.required ? label + SchemaUtils.REQUIRED_FIELD_SYMBOL : label;

  let displayLabel = true;
  if (type === 'array') {
    displayLabel = SchemaUtils.isMultiSelect(this.schema, this.definitions);
  }
  if (type === 'object') {
    displayLabel = false;
  }
  if (type === 'boolean') {
    displayLabel = false;
  }

  const field = document.createElement('div');
  field.className = classNames;
  field.innerHTML =
    (displayLabel ?
      '<label class="control-label" htmlFor="' + id + '">' +
      label + '</label>' : '') +
    (displayLabel && description ?
      '<p id="' + id + '__description" class="field-description">' +
      Utils.escapeHtml(description) + '</p>' : '');

  const child = new fieldType(
    this.schema,
    this.formData,
    this.idSchema,
    this.name,
    this.definitions,
    this.onChange,
    this.required,
    this.disabled,
    this.readonly).render();

  field.appendChild(child);

  return field;
}