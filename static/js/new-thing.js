/**
 * New Thing.
 *
 * Represents a new thing ready to be saved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const API = require('./api');
const Utils = require('./utils');

/**
 * New Thing constructor.
 *
 * @param String id Thing ID.
 * @param Object description Thing description object.
 */
const NewThing = function(id, description) {
  this.id = id;
  this.description = description;
  this.pinSet = false;
  this.re = null;
  if (description.hasOwnProperty('pin') && description.pin.pattern !== null) {
    this.re = RegExp(description.pin.pattern);
  }

  this.container = document.getElementById('new-things');
  this.element = document.createElement('div');
  this.element.classList.add('new-thing');
  this.element.id = `new-thing-${Utils.escapeHtmlForIdClass(this.id)}`;
  this.render();
  this.container.appendChild(this.element);
};

NewThing.prototype.requiresPin = function() {
  return this.description.hasOwnProperty('pin') &&
    this.description.pin.required &&
    !this.pinSet;
};

/**
 * HTML view for New Thing.
 */
NewThing.prototype.buildView = function() {
  if (this.requiresPin()) {
    this.element.classList.add('pin-required');
    this.element.innerHTML = `
      <div class="new-thing-icon"></div>
      <div class="new-thing-metadata">
        <span class="new-thing-initial-name">
          ${Utils.escapeHtml(this.description.name)}
        </span>
        <input type="text" class="new-thing-pin" required autofocus
               placeholder="Enter PIN"/>
        <span class="new-thing-pin-error hidden">Incorrect PIN</span>
      </div>
      <div class="new-thing-controls">
        <button class="new-thing-cancel-button text-button">
          Cancel
        </button>
        <button class="new-thing-submit-button text-button" disabled>
          Submit
        </button>
      </div>`;
  } else {
    this.element.classList.remove('pin-required');

    let cls = '', type = '';
    switch (this.description.type) {
      case 'binarySensor':
        cls = 'binary-sensor';
        type = 'Binary Sensor';
        break;
      case 'multiLevelSensor':
        cls = 'binary-sensor';
        type = 'Multi Level Sensor';
        break;
      case 'onOffLight':
        cls = 'on-off-light';
        type = 'On/Off Light';
        break;
      case 'onOffColorLight':
        cls = 'on-off-light';
        type = 'Color Light';
        break;
      case 'dimmableLight':
        cls = 'on-off-light';
        type = 'Dimmable Light';
        break;
      case 'dimmableColorLight':
        cls = 'on-off-light';
        type = 'Dimmable Color Light';
        break;
      case 'multiLevelSwitch':
        cls = 'on-off-switch';
        type = 'Multi Level Switch';
        break;
      case 'onOffSwitch':
        cls = 'on-off-switch';
        type = 'On/Off Switch';
        break;
      case 'smartPlug':
        cls = 'smart-plug';
        type = 'Smart Plug';
        break;
      default:
        type = 'Unknown device type';
        break;
    }

    if (cls) {
      this.element.classList.add(cls);
    }

    this.element.innerHTML = `
      <div class="new-thing-icon"></div>
      <div class="new-thing-metadata">
        <input type="text" class="new-thing-name"
               value="${Utils.escapeHtml(this.description.name)}"/>
        <span class="new-thing-type">${type}</span>
      </div>
      <button class="new-thing-save-button text-button">
        Save
      </button>`;
  }
};

/**
 * Render New Thing view and add to DOM.
 */
NewThing.prototype.render = function() {
  this.buildView();

  if (this.requiresPin()) {
    this.pinInput = this.element.getElementsByClassName('new-thing-pin')[0];
    this.pinError = this.element.getElementsByClassName(
      'new-thing-pin-error')[0];
    this.cancelButton = this.element.getElementsByClassName(
      'new-thing-cancel-button')[0];
    this.submitButton = this.element.getElementsByClassName(
      'new-thing-submit-button')[0];

    this.pinInput.addEventListener('input', this.handlePinInput.bind(this));
    this.cancelButton.addEventListener('click', this.handleCancel.bind(this));
    this.submitButton.addEventListener('click', this.handleSubmit.bind(this));
  } else {
    this.nameInput = this.element.getElementsByClassName('new-thing-name')[0];
    this.saveButton = this.element.getElementsByClassName(
      'new-thing-save-button')[0];

    this.saveButton.addEventListener('click', this.handleSave.bind(this));
  }
};

NewThing.prototype.handlePinInput = function() {
  const input = this.pinInput.value.trim();

  let valid = false;
  if (this.re !== null) {
    valid = this.re.test(input);
  } else {
    valid = input.length > 0;
  }

  this.submitButton.disabled = !valid;

  if (valid) {
    this.pinInput.setCustomValidity('');
  } else {
    this.pinInput.setCustomValidity('Invalid PIN');
  }
};

NewThing.prototype.handleCancel = function() {
  this.container.removeChild(this.element);
};

NewThing.prototype.handleSubmit = function() {
  const input = this.pinInput.value.trim();
  this.submitButton.disabled = true;

  fetch('/things', {
    method: 'PATCH',
    body: JSON.stringify({thingId: this.id, pin: input}),
    headers: {
      Authorization: `Bearer ${API.jwt}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    if (!response.ok) {
      return response.text();
    }

    return response.json();
  }).then((json) => {
    if (typeof json === 'string') {
      throw new Error(json);
    }

    this.pinError.classList.add('hidden');
    this.description = json;
    this.pinSet = true;
    this.render();
  }).catch((error) => {
    console.error(`Failed to set PIN: ${error}`);
    this.submitButton.disabled = false;
    this.pinError.classList.remove('hidden');
  });
};

NewThing.prototype.handleSave = function() {
  const thing = this.description;
  thing.id = this.id;
  thing.name = this.nameInput.value;
  fetch('/things', {
    method: 'POST',
    body: JSON.stringify(thing),
    headers: {
      Authorization: `Bearer ${API.jwt}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    return response.json();
  }).then((json) => {
    console.log(`Successfully created thing ${json}`);
    this.nameInput.disabled = true;
    this.saveButton.innerHTML = 'Saved';
    this.saveButton.disabled = true;
  }).catch((error) => {
    console.error(`Failed to save thing ${error}`);
  });
};

module.exports = NewThing;
