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

const SchemaUtils = require('./schema-utils');
const NumberField = require('./number-field');
const StringField = require('./string-field');
const BooleanField = require('./boolean-field');
const UnsupportedField = require('./unsupported-field');
const Utils = require('../utils');

// eslint-disable-next-line prefer-const
let ObjectField;
// eslint-disable-next-line prefer-const
let ArrayField;

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
  this.retrievedSchema = SchemaUtils.retrieveSchema(schema,
                                                    definitions,
                                                    formData);
  this.schema = schema;
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

SchemaField.prototype.getFieldType = function() {
  const FIELD_TYPES = {
    array: ArrayField,
    boolean: BooleanField,
    integer: NumberField,
    number: NumberField,
    object: ObjectField,
    string: StringField,
  };

  const field = FIELD_TYPES[this.retrievedSchema.type];
  return field ? field : UnsupportedField;
};

SchemaField.prototype.render = function() {
  const fieldType = this.getFieldType();
  const type = this.retrievedSchema.type;
  const id = Utils.escapeHtmlForIdClass(this.idSchema.$id);
  const description = this.retrievedSchema.description;
  const unit = this.retrievedSchema.unit;

  let label = this.retrievedSchema.title || this.name;
  if (typeof label !== 'undefined' && label !== null) {
    label = Utils.escapeHtml(label);
    label = this.required ? label + SchemaUtils.REQUIRED_FIELD_SYMBOL : label;
  }

  let displayUnit = true;
  let displayLabel = true;
  let displayDescription = true;
  if (type === 'array') {
    displayUnit = false;
    displayLabel = displayDescription =
      SchemaUtils.isMultiSelect(this.schema, this.definitions);
  }
  if (type === 'object') {
    displayUnit = false;
    displayLabel = displayDescription = false;
  }

  const field = document.createElement('div');
  field.className = `form-group field field-${type}`;

  if (displayLabel && label) {
    field.insertAdjacentHTML(
      'beforeend',
      `<label class="control-label" htmlFor="${id}">${label}</label>`
    );
  }

  if (displayDescription && description) {
    field.insertAdjacentHTML(
      'beforeend',
      `<p id="${id}__description" class="field-description">${
        Utils.escapeHtml(description)}</p>`
    );
  }

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

  if (displayUnit && unit) {
    field.insertAdjacentHTML(
      'beforeend',
      `<span class="field-unit">${Utils.escapeHtml(unit)}</span>`,
    );
  }

  return field;
};

module.exports = SchemaField;

// avoid circular dependency
ObjectField = require('./object-field');
ArrayField = require('./array-field');
