/**
 * Input Field for JSON-schema type:string.
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
const Utils = require('../utils');

function StringField(schema,
                     formData,
                     idSchema,
                     name,
                     definitions,
                     onChange,
                     required = false,
                     disabled = false,
                     readonly = false) {
  this.schema = SchemaUtils.retrieveSchema(schema, definitions, formData);
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

StringField.prototype.toFormData = function(value) {
  // eslint-disable-next-line no-undefined
  return value === '' ? undefined : value;
};

StringField.prototype.onStringChange = function(event) {
  const value = event.target.value;
  // If an user input nothing on required field, we should set undefined
  // in order to raise error.
  this.formData = this.toFormData(value);

  if (this.onChange) {
    this.onChange(this.formData);
  }
};

StringField.prototype.render = function() {
  const id = Utils.escapeHtmlForIdClass(this.idSchema.$id);
  const value = this.formData;
  const field = document.createElement('span');

  // list item
  if (SchemaUtils.isSelect(this.schema)) {
    const enumOptions = SchemaUtils.getOptionsList(this.schema);
    const selectedValue = value;
    let selectedAny = false;
    field.className = 'field-list-wrapper';

    // User can select undefiend value on field not required.
    if (!this.required) {
      enumOptions.unshift({value: '', label: ''});
    }

    const selects = enumOptions.map(({value, label}, i) => {
      const selected = selectedValue === this.toFormData(value);
      selectedAny |= selected;

      return `
        <option
        key="${i}"
        value="${Utils.escapeHtml(value)}"
        ${selected ? 'selected' : ''}>
          ${Utils.escapeHtml(label)}
        </option>`;
    });

    field.innerHTML = `
      <select
      id="${id}"
      class="form-control"
      ${this.required ? 'required' : ''}
      ${this.readonly ? 'readonly' : ''}
      ${this.disabled ? 'disabled' : ''}
      >
      ${selects.join(' ')}
      </select>`;

    if (!selectedAny) {
      const select = field.querySelector(`#${id}`);
      select.selectedIndex = -1;
    }
  } else {
    field.className = 'field-string-wrapper';
    field.innerHTML = `
      <input
      id="${id}"
      type="text"
      class="form-control"
      ${this.required ? 'required' : ''}
      ${this.readonly ? 'readonly' : ''}
      ${this.disabled ? 'disabled' : ''}
      value="${value == null ? '' : Utils.escapeHtml(value)}"
      />`;
  }

  const input = field.querySelector(`#${id}`);
  input.onchange = this.onStringChange.bind(this);
  input.oninput = this.onStringChange.bind(this);

  return field;
};

module.exports = StringField;
