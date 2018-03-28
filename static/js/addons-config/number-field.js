/**
 * Input Field for JSON-schema type:number.
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

/* globals SchemaUtils, StringField, Utils */

function NumberField(
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

NumberField.prototype.onRangeChange = function (event) {
  const value = event.target.value;
  this.rangeValue.innerText = value;

  const number = Number(value);
  this.formData = number;
  if (this.onChange) {
    this.onChange(this.formData);
  }
};

NumberField.prototype.onNumberChange = function (value) {
  const number = Number(value);

  if (isNaN(number)) {
    this.formData = value;
  } else {
    this.formData = number;
  }

  if (this.onChange) {
    this.onChange(this.formData);
  }
};

NumberField.prototype.render = function () {
  const id = this.idSchema.$id;
  let value = Number(this.formData);
  value = isNaN(value) ? 0 : value;

  // range item
  if (this.schema.hasOwnProperty('minimum') &&
    this.schema.hasOwnProperty('maximum')) {
    const field = document.createElement('div');
    field.className = 'field-range-wrapper';
    field.innerHTML = `
        <input
        type="range"
        id="${Utils.escapeHtml(id)}"
        class="form-control"
        ${this.readonly ? 'readonly' : ''}
        ${this.disabled ? 'disabled' : ''}
        value=${value == null ? '' : value}
        ${this.schema.multipleOf ?
        'step=' + Number(this.schema.multipleOf) : ''}
        min=${Number(this.schema.minimum)}
        max=${Number(this.schema.maximum)}
        />
        <span class="range-view">${value}</span>`;

    const input = field.querySelector('input');
    input.onchange = this.onRangeChange.bind(this);

    this.rangeValue = field.querySelector('span');

    return field;
  }

  const onNumberChangeHandle = this.onNumberChange.bind(this);
  return new StringField(
    this.schema,
    this.formData,
    this.idSchema,
    this.name,
    this.definitions,
    onNumberChangeHandle,
    this.required,
    this.disabled,
    this.readonly).render();
};