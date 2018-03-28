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

/* globals SchemaUtils, Utils */

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
};

StringField.prototype.render = function () {
    const id = Utils.escapeHtml(this.idSchema.$id);
    const value = this.formData;
    const field = document.createElement('div');

    // list item
    if (SchemaUtils.isSelect(this.schema)) {
        const enumOptions = SchemaUtils.getOptionsList(this.schema);
        const selectedValue = value;
        let selectedAny = false;

        const selects = enumOptions.map(({ value, label }, i) => {
            const selected = selectedValue === value;
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
        field.innerHTML = `
        <input
        id="${id}"
        class="form-control"
        ${this.readonly ? 'readonly' : ''}
        ${this.disabled ? 'disabled' : ''}
        value="${value == null ? '' : Utils.escapeHtml(value)}"
        />`;
    }

    const input = field.querySelector(`#${id}`);
    input.onchange = this.onStringChange.bind(this);

    return field;
};