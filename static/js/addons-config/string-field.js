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

/* globals SchemaUtils */

function StringField(
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

StringField.prototype.onStringChange = function (event) {
    const value = event.target.value;
    this.formData = value;

    if (this.onChange) {
        this.onChange(this.formData);
    }
}

StringField.prototype.render = function () {
    const id = this.idSchema.$id;
    const value = this.formData;
    const field = document.createElement('div');

    // list item
    if (SchemaUtils.isSelect(this.schema)) {
        const enumOptions = SchemaUtils.getOptionsList(this.schema);
        const selects = enumOptions.map(({ value, label }, i) => {
            return `
            <option key="${i}" value="${value}">
              ${label}
            </option>`;
        });

        field.innerHTML = `
        <select
        id="${id}"
        class="form-control"
        ${this.readonly ? 'readonly' : ''}
        ${this.disabled ? 'disabled' : ''}
        value="${value == null ? '' : value}"
        >
        ${selects.join(' ')}
        </select>`;
    } else {
        field.innerHTML = `
        <input
        id="${id}"
        class="form-control"
        ${this.readonly ? 'readonly' : ''}
        ${this.disabled ? 'disabled' : ''}
        value="${value == null ? '' : value}"
        />`;
    }

    const input = field.querySelector(`#${id}`);
    input.onchange = this.onStringChange.bind(this);

    return field;
}