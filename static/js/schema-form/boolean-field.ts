/**
 * Input Field for JSON-schema type:boolean.
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

import * as Utils from '../utils';

export default class BooleanField {
  private formData: boolean;

  private idSchema: Record<string, unknown>;

  private onChange: ((value: boolean) => void) | null;

  private required: boolean;

  private disabled: boolean;

  private readOnly: boolean;

  constructor(
    _schema: Record<string, unknown>,
    formData: boolean,
    idSchema: Record<string, unknown>,
    _name: string,
    _definitions: Record<string, unknown>,
    onChange: ((value: boolean) => void) | null = null,
    required = false,
    disabled = false,
    readOnly = false
  ) {
    this.formData = formData;
    this.idSchema = idSchema;
    this.onChange = onChange;
    this.required = required;
    this.disabled = disabled;
    this.readOnly = readOnly;
  }

  onBooleanChange(event: Event): void {
    this.formData = (<HTMLInputElement>event.target).checked;

    if (this.onChange) {
      this.onChange(this.formData);
    }
  }

  render(): HTMLDivElement {
    const id = Utils.escapeHtmlForIdClass(<string>this.idSchema.$id);
    const value = this.formData;
    const field = document.createElement('div');
    field.className = 'checkbox';

    field.innerHTML = `
      <input
      type="checkbox"
      id="${id}"
      ${value ? 'checked' : ''}
      ${this.required ? 'required' : ''}
      ${this.disabled || this.readOnly ? 'disabled' : ''}
      />
      <label for="${id}"></span>
      `;

    const input = <HTMLInputElement>field.querySelector(`#${id}`)!;
    input.onchange = this.onBooleanChange.bind(this);

    return field;
  }
}
