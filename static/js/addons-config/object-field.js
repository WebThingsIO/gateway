/**
 * Input Field for JSON-schema type:object.
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

/* globals SchemaUtils, SchemaField, Utils */

function ObjectField(
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

ObjectField.prototype.require = function (name) {
  return (
    Array.isArray(this.schema.required) &&
    this.schema.required.indexOf(name) !== -1
  );
}

ObjectField.prototype.onPropertyChange = function (name) {
  return function (value) {
    let newFormData = {};
    newFormData[name] = value;

    this.formData = Object.assign(this.formData, newFormData);

    if (this.onChange) {
      this.onChange(this.formData);
    }
  }.bind(this);
};

ObjectField.prototype.render = function () {
  const id = Utils.escapeHtml(this.idSchema.$id);
  const description = this.schema.description;
  let title = this.schema.title ? this.schema.title : this.name;
  if (title !== undefined && title !== null) {
    title = Utils.escapeHtml(title);
    title = this.required ? title + SchemaUtils.REQUIRED_FIELD_SYMBOL : title;
  }

  const field = document.createElement('fieldset');


  field.innerHTML =
    (title ?
      `<legend id="${id + '__title'}">${title}</legend>` : '') +
    (description ?
      `<p id="${id}__description" class="field-description">
      ${Utils.escapeHtml(description)}</p>` : '');

  // TODO support to specific properties order
  let orderedProperties = Object.keys(this.schema.properties);

  orderedProperties.forEach(function (name) {
    const child = new SchemaField(
      this.schema.properties[name],
      this.formData[name],
      this.idSchema[name],
      name,
      this.definitions,
      this.onPropertyChange(name),
      this.require(name),
      this.disabled,
      this.readonly).render();

    field.appendChild(child);
  }.bind(this));

  return field;
}