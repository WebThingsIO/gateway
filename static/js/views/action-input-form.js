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

const API = require('../api');
const Utils = require('../utils');

class ActionInputForm {
  constructor(href, name, label, schema) {
    this.container = document.getElementById('things');
    this.href = href;
    this.name = name;
    this.label = label || name;
    this.schema = schema;
    this.inputs = {};

    this.element = this.render();

    this.form = this.element.querySelector(`.action-input-form`);
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
  }

  render() {
    const element = document.createElement('div');

    let form = `<div class="action-input">
      <div class="action-input-title">${Utils.escapeHtml(this.label)}</div>
      <form class="action-input-form">`;

    const inputs = [];
    let requiredFields = [];
    if (this.schema.type === 'object') {
      if (this.schema.hasOwnProperty('required') &&
          Array.isArray(this.schema.required)) {
        requiredFields = this.schema.required;
      }

      const props = Array.from(Object.keys(this.schema.properties)).sort();
      for (const name of props) {
        inputs.push(Object.assign({}, this.schema.properties[name], {name}));
      }
    } else {
      inputs.push(Object.assign({}, this.schema, {name: '__default__'}));
      requiredFields.push('__default__');
    }

    for (const input of inputs) {
      const name = Utils.escapeHtmlForIdClass(input.name);
      this.inputs[name] = input.name;

      form += `<span class="action-input-name">`;
      if (input.name !== '__default__') {
        form += Utils.escapeHtml(input.name);
      }
      form += '</span>';

      let required = '';
      if (requiredFields.includes(input.name)) {
        required = 'required';
      }

      let unit = '<span class="action-input-unit">';
      if (input.hasOwnProperty('unit')) {
        unit += Utils.escapeHtml(Utils.unitNameToAbbreviation(input.unit));
      }
      unit += '</span>';

      // list item
      if (Array.isArray(input.enum) &&
         (input.type === 'number' ||
          input.type === 'integer' ||
          input.type === 'string')) {
        // User can select undefiend value on field not required.
        if (required === '') {
          input.enum.unshift('');
        }

        const selects = input.enum.map((value, i) => {
          return `<option key="${i}" value="${Utils.escapeHtml(value)}">
                    ${Utils.escapeHtml(value)}
                  </option>`;
        });

        form += `<select name="${name}" class="action-input-enum" ${required}>
                   ${selects.join(' ')}
                 </select>${unit}`;
        continue;
      }

      switch (input.type) {
        case 'number':
        case 'integer': {
          let step;
          if (input.hasOwnProperty('multipleOf')) {
            step = `${input.multipleOf}`;
          } else if (input.type === 'number') {
            step = 'any';
          } else {
            step = '1';
          }

          let min = '';
          if (input.hasOwnProperty('minimum')) {
            min = `min="${input.minimum}"`;
          }

          let max = '';
          if (input.hasOwnProperty('maximum')) {
            max = `max="${input.maximum}"`;
          }

          const numberClass = min && max ? '' : 'hide-number-spinner';

          form += `<input type="number" name="${name}" step="${step}" ${min}
                          ${max} class="action-input-number ${numberClass}"
                          ${required}>${unit}`;
          break;
        }
        case 'boolean':
          // Do NOT add "required" to the checkbox, as it will always fail
          // validation when unchecked. Its value will always be sent anyway.
          form += `<span>
            <input type="checkbox" name="${name}" class="action-input-checkbox"
                   id="checkbox-${name}">
            <label for="checkbox-${name}"></label>
            </span>
            ${unit}`;
          break;
        case 'object':
        case 'array':
        case 'string':
        default:
          // We don't currently handle arrays or nested objects. Just treat
          // them as a string.
          form += `<input type="text" name="${name}"
                          class="action-input-string" ${required}>${unit}`;
          break;
      }
    }

    form += `
      <input id="action-submit-button" type="submit"
        class="action-button" value="Submit">
      </form></div>`;

    element.innerHTML = form;
    return this.container.appendChild(element.firstChild);
  }

  handleSubmit(e) {
    e.preventDefault();

    let input;
    if (this.schema.type === 'object') {
      input = {};
    } else {
      input = null;
    }

    for (const el of this.element.getElementsByTagName('select')) {
      if (el.value.length == 0) {
        continue;
      }

      let schema;
      if (el.name === '__default__') {
        schema = this.schema;
      } else {
        schema = this.inputs[el.name];
      }

      let value;
      if (schema.type === 'number') {
        value = Number(el.value);
      } else {
        value = el.value;
      }

      if (el.name === '__default__') {
        input = value;
        break;
      } else {
        input[this.inputs[el.name]] = value;
      }
    }

    for (const el of this.element.getElementsByTagName('input')) {
      let value;
      if (el.type === 'submit') {
        continue;
      } else if (el.type === 'checkbox') {
        value = el.checked;
      } else if (el.value.length > 0) {
        if (el.type === 'number') {
          value = Number(el.value);
        } else {
          value = el.value;
        }
      } else {
        continue;
      }

      if (el.name === '__default__') {
        input = value;
        break;
      } else {
        input[this.inputs[el.name]] = value;
      }
    }

    let body;
    if (input) {
      body = JSON.stringify({[this.name]: {input}});
    } else {
      body = JSON.stringify({[this.name]: {}});
    }

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

    return false;
  }
}

module.exports = ActionInputForm;
