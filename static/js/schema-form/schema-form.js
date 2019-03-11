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

'use strict';

const SchemaUtils = require('./schema-utils');
const Validator = require('./validator');
const SchemaField = require('./schema-field');
const ErrorField = require('./error-field');
const Utils = require('../utils');

class SchemaForm {
  constructor(schema, id, name, formData, onSubmit, options = {}) {
    this.definitions = schema.definitions;
    this.schema = schema;
    this.id = id;
    this.name = name;
    this.onSubmit = onSubmit;
    this.idSchema = SchemaUtils.toIdSchema(schema,
                                           null,
                                           this.definitions,
                                           formData);
    this.formData = SchemaUtils.getDefaultFormState(schema,
                                                    formData,
                                                    this.definitions);
    this.submitText =
      options.hasOwnProperty('submitText') ? options.submitText : 'Submit';
    this.noValidate =
      options.hasOwnProperty('validate') ? !options.validate : false;
    this.liveValidate =
      options.hasOwnProperty('liveValidate') ? options.liveValidate : true;
  }

  onChange(formData) {
    let error = null;
    this.formData = formData;

    this.submitButton.disabled = false;

    if (!this.noValidate && this.liveValidate) {
      const {errors} = this.validate(formData);
      error = errors;
    }
    if (!this.noValidate && error) {
      this.errorField.render(error);
    } else if (!this.noValidate) {
      this.errorField.render([]);
    }
  }

  validate(formData) {
    return Validator.validateFormData(formData, this.schema);
  }

  handleSubmit(e) {
    const {errors} = this.validate(this.formData);
    const button = e.target;
    button.disabled = true;

    if (this.onSubmit) {
      this.onSubmit(this.formData, errors);
    }
  }

  renderSubmitButton() {
    const submitButton = document.createElement('button');
    submitButton.id = `submit-${Utils.escapeHtml(this.id)}`;
    submitButton.type = 'button';
    submitButton.className = 'button-submit';
    submitButton.innerText = this.submitText;
    submitButton.addEventListener('click', this.handleSubmit.bind(this));
    submitButton.disabled = true;

    this.submitButton = submitButton;

    return submitButton;
  }

  render() {
    const form = document.createElement('form');
    form.className = 'json-schema-form';
    form.id = this.id;
    form.innerHTML = `<p></p>`;

    const p = form.querySelector('p');

    const submit = this.renderSubmitButton();
    p.appendChild(submit);

    const onChangeHandle = this.onChange.bind(this);
    const child = new SchemaField(
      this.schema,
      this.formData,
      this.idSchema,
      this.name,
      this.definitions,
      onChangeHandle).render();

    this.errorField = new ErrorField();

    p.insertBefore(child, p.firstChild);
    p.insertBefore(this.errorField.render([]), p.firstChild);

    return form;
  }
}

module.exports = SchemaForm;
