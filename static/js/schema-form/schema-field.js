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

class SchemaField {
  constructor(schema,
              formData,
              idSchema,
              name,
              definitions,
              onChange,
              required = false,
              disabled = false,
              readOnly = false) {
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
    this.readOnly = readOnly;
  }

  getFieldType() {
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
  }

  render() {
    const fieldType = this.getFieldType();
    const type = this.retrievedSchema.type;
    const id = Utils.escapeHtmlForIdClass(this.idSchema.$id);
    const description = this.retrievedSchema.description;
    const classNames = [
      'form-group',
      'field',
      `field-${type}`,
    ]
      .join(' ')
      .trim();
    let label = this.retrievedSchema.title || this.name;
    if (typeof label !== 'undefined' && label !== null) {
      label = Utils.escapeHtml(label);
      label = this.required ? label + SchemaUtils.REQUIRED_FIELD_SYMBOL : label;
    }

    let displayLabel = true;
    let displayDescription = true;
    if (type === 'array') {
      displayLabel = displayDescription =
        SchemaUtils.isMultiSelect(this.schema, this.definitions);
    }
    if (type === 'object') {
      displayLabel = displayDescription = false;
    }
    if (type === 'boolean') {
      displayLabel = false;
    }

    const field = document.createElement('div');
    field.className = classNames;
    field.innerHTML =
      (displayLabel && label ?
        `<label class="control-label" htmlFor="${id}">${
          label}</label>` :
        '') +
      (displayDescription && description ?
        `<p id="${id}__description" class="field-description">${
          Utils.escapeHtml(description)}</p>` :
        '');

    const child = new fieldType(
      this.schema,
      this.formData,
      this.idSchema,
      this.name,
      this.definitions,
      this.onChange,
      this.required,
      this.disabled,
      this.readOnly).render();

    field.appendChild(child);

    return field;
  }
}

module.exports = SchemaField;

// avoid circular dependency
ObjectField = require('./object-field');
ArrayField = require('./array-field');
