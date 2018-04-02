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

/* globals SchemaUtils, Validator, SchemaField, ErrorField,
page, Utils */

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

SchemaForm.prototype.onChange = function(formData) {
  let error = null;
  this.formData = formData;

  this.applyButton.disabled = false;

  if (!this.noValidate && this.liveValidate) {
    const {errors} = this.validate(formData);
    error = errors;
  }
  if (!this.noValidate && error) {
    this.errorField.render(error);
  } else if (!this.noValidate) {
    this.errorField.render([]);
  }
};

SchemaForm.prototype.validate = function(formData) {
  return Validator.validateFormData(formData, this.schema);
};

SchemaForm.prototype.scrollToTop = function() {
  document.getElementById('addon-config-settings').scrollTop = 0;
};

SchemaForm.prototype.handleApply = function(e) {
  const {errors} = this.validate(this.formData);
  const button = e.target;
  button.disabled = true;

  if (errors) {
    this.scrollToTop();
  } else {
    this.applyButton.innerText = 'Applying...';
    window.API.setAddonConfig(this.name, this.formData)
      .then(() => {
        page('/settings/addons');
      })
      .catch((err) => {
        console.error(`Failed to set config add-on: ${this.name}\n${err}`);
        this.errorField.render([err]);
      });
  }
};

SchemaForm.prototype.renderApplyButton = function() {
  const applyButton = document.createElement('button');
  applyButton.id = `addon-apply-${Utils.escapeHtml(this.id)}`;
  applyButton.type = 'button';
  applyButton.className = 'addon-config-button-apply';
  applyButton.innerText = 'Apply';
  applyButton.addEventListener('click', this.handleApply.bind(this));
  applyButton.disabled = true;

  this.applyButton = applyButton;

  return applyButton;
};

SchemaForm.prototype.render = function(data) {
  this.formData =
    SchemaUtils.getDefaultFormState(
      this.schema,
      data,
      this.definitions);

  const form = document.createElement('form');
  form.className = 'addons-form';
  form.id = this.id;
  form.innerHTML = `<p></p>`;

  const p = form.querySelector('p');

  const apply = this.renderApplyButton();
  p.appendChild(apply);

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
};
