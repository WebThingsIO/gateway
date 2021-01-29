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

import * as SchemaUtils from './schema-utils';
import * as Utils from '../utils';

export default class StringField {
  private schema: Record<string, unknown>;

  private formData?: string;

  private idSchema: Record<string, unknown>;

  private onChange: ((value?: string) => void) | null;

  private required: boolean;

  private disabled: boolean;

  private readOnly: boolean;

  constructor(schema: Record<string, unknown>,
              formData: string | undefined,
              idSchema: Record<string, unknown>,
              _name: string,
              definitions: Record<string, unknown>,
              onChange: ((value?: string) => void) | null = null,
              required = false,
              disabled = false,
              readOnly = false) {
    this.schema = SchemaUtils.retrieveSchema(schema, definitions, formData);
    this.formData = formData;
    this.idSchema = idSchema;
    this.onChange = onChange;
    this.required = required;
    this.disabled = disabled;
    this.readOnly = readOnly;
  }

  toFormData(value: string): string | undefined {
    // eslint-disable-next-line no-undefined
    return value === '' ? undefined : value;
  }

  onStringChange(event: Event): void {
    const value = (<HTMLInputElement>event.target!).value;

    // If a user input nothing on required field, we should set undefined
    // in order to raise error.
    this.formData = this.toFormData(value);

    if (this.onChange) {
      this.onChange(this.formData);
    }
  }

  render(): HTMLDivElement {
    const id = Utils.escapeHtmlForIdClass(<string> this.idSchema.$id);
    const value = this.formData;
    const field = document.createElement('div');

    // list item
    if (SchemaUtils.isSelect(this.schema)) {
      const enumOptions = <Record<string, string>[]>SchemaUtils.getOptionsList(this.schema);
      const selectedValue = value;
      let selectedAny = false;

      // User can select undefiend value on field not required.
      if (!this.required) {
        enumOptions.unshift({value: '', label: ''});
      }

      const selects = enumOptions.map(({value, label}, i) => {
        const selected = selectedValue === this.toFormData(value);
        selectedAny = selectedAny || selected;

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
        ${(this.disabled || this.readOnly) ? 'disabled' : ''}
        >
        ${selects.join(' ')}
        </select>`;

      if (!selectedAny) {
        const select = <HTMLSelectElement>field.querySelector(`#${id}`)!;
        select.selectedIndex = -1;
      }
    } else {
      field.innerHTML = `
        <input
        id="${id}"
        type="text"
        class="form-control"
        ${this.required ? 'required' : ''}
        ${(this.disabled || this.readOnly) ? 'disabled' : ''}
        value="${value == null ? '' : Utils.escapeHtml(value)}"
        />`;
    }

    const input = <HTMLInputElement>field.querySelector(`#${id}`)!;
    input.onchange = this.onStringChange.bind(this);
    input.oninput = this.onStringChange.bind(this);

    return field;
  }
}
