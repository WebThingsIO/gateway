/**
 * Field for result of JSON-schema validation.
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

function ErrorField() {
  const field = document.createElement('div');
  field.className = 'panel panel-danger errors';

  field.innerHTML = `
    <div class="panel-heading hidden">
      <h3 class="panel-title">Errors</h3>
    </div>
    <ul class="list-group">
    </ul>`

  field.classList.add('hidden');

  this.field = field;
  this.errorlist = field.querySelector('ul');

  return this;
}

ErrorField.prototype.render = function (errors) {

  const errorHtml = errors.map((error) => {
    return `
          <li key={i} class="list-group-item text-danger">
            ${(error.dataPath + ' ' + error.message).trim()}
          </li>`
  });

  this.errorlist.innerHTML = errorHtml.join(' ');

  this.field.classList.remove('hidden');

  return this.field;
}