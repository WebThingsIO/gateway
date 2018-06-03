/**
 * ActionInputForm.
 *
 * Represents an input form for an action.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const API = require('./api');
const Utils = require('./utils');
const SchemaForm = require('./schema-form/schema-form');

const ActionInputForm = function(href, name, schema) {
  this.container = document.getElementById('things');
  this.href = href;
  this.name = name;
  this.schema = schema;

  this.element = this.render();
};

ActionInputForm.prototype.render = function() {
  const element = document.createElement('div');

  element.className = 'action-input';

  let input;
  switch (this.schema.type) {
    case 'number':
    case 'integer':
    case 'boolean':
    case 'string':
      input = null;
      break;
    case 'object':
      input = {};
      break;
    case 'array':
      input = [];
      break;
    default:
      break;
  }

  this.inputForm = new SchemaForm(
    this.schema,
    `action-${Utils.escapeHtmlForIdClass(this.name)}`,
    this.name,
    input,
    this.handleSubmit.bind(this),
    {submitText: this.name}
  );
  element.appendChild(this.inputForm.render());
  this.inputForm.submitButton.classList.add('action-button');

  return this.container.appendChild(element);
};

ActionInputForm.prototype.handleSubmit = function(formData, errors) {
  if (errors.length === 0) {
    const body = JSON.stringify({[this.name]: {input: formData}});

    fetch(this.href, {
      method: 'POST',
      body,
      headers: {
        Authorization: `Bearer ${API.jwt}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(() => {
      window.history.back();
    }).catch((e) => {
      console.error(`Error performing action "${this.name}": ${e}`);
    });
  }
};

module.exports = ActionInputForm;
