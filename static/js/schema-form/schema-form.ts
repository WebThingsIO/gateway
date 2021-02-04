/**
 * Create input form using JSON-schema.
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

import { ErrorObject } from 'ajv';
import * as SchemaUtils from './schema-utils';
import Validator from './validator';
import SchemaField from './schema-field';
import ErrorField from './error-field';
import * as Utils from '../utils';
import * as Fluent from '../fluent';

export default class SchemaForm {
  private definitions: Record<string, unknown>;

  private schema: Record<string, unknown>;

  private id: string;

  private name: string;

  private onSubmit: ((formData: unknown, errors: ErrorObject[]) => void) | null;

  private idSchema: Record<string, unknown>;

  private submitText: string;

  private noValidate: boolean;

  private liveValidate: boolean;

  private submitButton?: HTMLButtonElement;

  private errorField?: ErrorField;

  formData: unknown;

  constructor(
    schema: Record<string, unknown>,
    id: string,
    name: string,
    formData: unknown,
    onSubmit: ((formData: unknown, errors: ErrorObject[]) => void) | null = null,
    options: Record<string, unknown> = {}
  ) {
    this.definitions = <Record<string, unknown>>schema.definitions;
    this.schema = schema;
    this.id = id;
    this.name = name;
    this.onSubmit = onSubmit;
    this.idSchema = SchemaUtils.toIdSchema(
      schema,
      null,
      this.definitions,
      <Record<string, unknown>>formData
    );
    this.formData = SchemaUtils.getDefaultFormState(schema, formData, this.definitions);
    this.submitText = options.hasOwnProperty('submitText') ? <string>options.submitText : '';
    this.noValidate = options.hasOwnProperty('validate') ? !(<boolean>options.validate) : false;
    this.liveValidate = options.hasOwnProperty('liveValidate')
      ? <boolean>options.liveValidate
      : true;
  }

  onChange(formData: unknown): void {
    let error = null;
    this.formData = formData;

    this.submitButton!.disabled = false;

    if (!this.noValidate && this.liveValidate) {
      const { errors } = this.validate(formData);
      error = errors;
    }
    if (!this.noValidate && error) {
      this.errorField!.render(error);
    } else if (!this.noValidate) {
      this.errorField!.render([]);
    }
  }

  validate(formData: unknown): { errors: ErrorObject[]; errorSchema: Record<string, unknown> } {
    return Validator.validateFormData(formData, this.schema);
  }

  handleSubmit(e: MouseEvent): void {
    const { errors } = this.validate(this.formData);
    const button = <HTMLButtonElement>e.target!;
    button.disabled = true;

    if (this.onSubmit) {
      this.onSubmit(this.formData, errors);
    }
  }

  renderSubmitButton(): HTMLButtonElement {
    const submitButton = document.createElement('button');
    submitButton.id = `submit-${Utils.escapeHtml(this.id)}`;
    submitButton.type = 'button';
    submitButton.className = 'button-submit';
    if (this.submitText) {
      submitButton.innerText = this.submitText;
    } else {
      submitButton.innerText = Fluent.getMessage('submit');
    }
    submitButton.addEventListener('click', this.handleSubmit.bind(this));
    submitButton.disabled = true;

    this.submitButton = submitButton;

    return submitButton;
  }

  render(): HTMLFormElement {
    const form = document.createElement('form');
    form.className = 'json-schema-form';
    form.id = this.id;
    form.innerHTML = `<p></p>`;

    const p = form.querySelector('p')!;

    const submit = this.renderSubmitButton();
    p.appendChild(submit);

    const onChangeHandle = this.onChange.bind(this);
    const child = new SchemaField(
      this.schema,
      this.formData,
      this.idSchema,
      this.name,
      this.definitions,
      onChangeHandle
    ).render();

    this.errorField = new ErrorField();

    p.insertBefore(child, p.firstChild);
    p.insertBefore(this.errorField.render([]), p.firstChild);

    return form;
  }
}

// Elevate this to the window level.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).SchemaForm = SchemaForm;
