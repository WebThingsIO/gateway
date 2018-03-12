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

/* globals SchemaUtils, Validater, SchemaField, ErrorField */

function SchemaForm(schema, id, name, options = {}) {
  this.definitions = schema.definitions;
  this.schema = schema;
  this.id = id;
  this.name = name;
  this.idSchema = SchemaUtils.toIdSchema(schema, null, this.definitions);
  this.noValidate =
    options.hasOwnProperty('validate') ? !options.validate : false;
  this.liveValidate =
    options.hasOwnProperty('liveValidate') ? options.liveValidate : true;

  return this;
}

SchemaForm.prototype.onChange = function (formData) {
  let error = null;

  if (!this.noValidate && this.liveValidate) {
    const { errors } = this.validate(formData);
    error = errors;
  }
  if (!this.noValidate && error) {
    this.errorField.render(error);
  } else if (!this.noValidate) {
    this.errorField.render([]);
  }
};

SchemaForm.prototype.validate = function (formData) {
  return Validater.validateFormData(formData, this.schema);
}

SchemaForm.prototype.render = function (data) {
  this.formData =
    SchemaUtils.getDefaultFormState(
      this.schema,
      data,
      this.definitions);

  const form = document.createElement('form');
  form.className = 'addons-form';
  form.id = this.id;
  form.innerHTML = `
  <p>
    <button type="submit" class="btn btn-info">
      Submit
    </button>
  </p>`

  const onChangeHandle = this.onChange.bind(this);
  const child = new SchemaField(this.schema,
    this.formData,
    this.idSchema,
    this.name,
    this.definitions,
    onChangeHandle).render();

  this.errorField = new ErrorField();

  const p = form.querySelector('p');
  p.insertBefore(child, p.firstChild);
  p.insertBefore(this.errorField.render([]), p.firstChild);

  return form;
}