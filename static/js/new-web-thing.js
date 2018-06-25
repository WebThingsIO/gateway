/**
 * New Web Thing.
 *
 * Represents a new web thing that can potentially be saved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const API = require('./api');
const Utils = require('./utils');

let idCounter = -1;
const getNewWebThingId = function() {
  idCounter += 1;
  return idCounter;
};

/**
 * New Web Thing constructor.
 */
const NewWebThing = function() {
  this.id = getNewWebThingId();
  this.originalId = this.id;
  this.url = null;
  this.description = null;
  this.container = document.getElementById('new-things');
  this.render();
  this.element = document.getElementById(
    `new-web-thing-${Utils.escapeHtmlForIdClass(this.originalId)}`);
  this.thingTypeLabel =
    this.element.getElementsByClassName('new-thing-type')[0];
  this.originLabel =
    this.element.getElementsByClassName('new-web-thing-origin')[0];
  this.urlInput = this.element.getElementsByClassName('new-web-thing-url')[0];
  this.nameInput = this.element.getElementsByClassName('new-web-thing-name')[0];
  this.cancelButton =
    this.element.getElementsByClassName('new-web-thing-cancel-button')[0];
  this.submitButton =
    this.element.getElementsByClassName('new-web-thing-submit-button')[0];
  this.saveButton =
    this.element.getElementsByClassName('new-web-thing-save-button')[0];
  this.element.addEventListener('click', this.handleClick.bind(this));
};

/**
 * HTML view for New Web Thing.
 */
NewWebThing.prototype.view = function() {
  return `
    <div id="new-web-thing-${Utils.escapeHtmlForIdClass(this.originalId)}"
         class="new-thing web-thing">
      <div class="new-thing-icon"></div>
      <div class="new-thing-metadata">
        <input type="text" class="new-web-thing-url"
          placeholder="Enter web thing URL"></input>
        <input type="text" class="new-web-thing-name hidden"></input>
        <span class="new-thing-type">Web Thing</span>
        <span class="new-web-thing-origin hidden"></span>
        <div class="new-web-thing-controls">
          <button class="new-web-thing-cancel-button text-button">
            Cancel
          </button>
          <button class="new-web-thing-submit-button text-button">
            Submit
          </button>
          <button class="new-web-thing-save-button text-button hidden">
            Save
          </button>
        </div>
      </div>
    </div>`;
};

/**
 * Render New Web Thing view and add to DOM.
 */
NewWebThing.prototype.render = function() {
  this.container.insertAdjacentHTML('beforeend', this.view());
};

/**
 * Handle click on a Thing.
 */
NewWebThing.prototype.handleClick = function(event) {
  if (event.target.classList.contains('new-web-thing-save-button')) {
    this.save();
  } else if (event.target.classList.contains('new-web-thing-submit-button')) {
    this.submit();
  } else if (event.target.classList.contains('new-web-thing-cancel-button')) {
    this.cancel();
  }
};

NewWebThing.prototype.cancel = function() {
  this.container.removeChild(this.element);
};

NewWebThing.prototype.submit = function() {
  this.thingTypeLabel.innerText = 'Loading...';
  this.thingTypeLabel.classList.remove('error');

  // Clean up the provided URL
  let url = this.urlInput.value.replace(/\/$/, '');
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `http://${url}`;
  }

  this.urlInput.value = url;
  this.url = url;

  let urlObj;
  try {
    urlObj = new URL(url);
  } catch (err) {
    return;
  }

  fetch('/new_things', {
    method: 'POST',
    body: JSON.stringify({url}),
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
  }).then((description) => {
    if (typeof description === 'string') {
      throw new Error(description);
    }

    // We don't support other gateways from this interface
    if (Array.isArray(description)) {
      this.thingTypeLabel.innerText = 'Multiple web things found';
      this.thingTypeLabel.classList.add('error');
      return;
    }

    this.thingTypeLabel.classList.remove('error');
    this.element.classList.remove('web-thing');
    switch (description.type) {
      case 'binarySensor':
        this.thingTypeLabel.innerText = 'Binary Sensor';
        this.element.classList.add('binary-sensor');
        break;
      case 'multiLevelSensor':
        this.thingTypeLabel.innerText = 'Multi Level Sensor';
        this.element.classList.add('binary-sensor');
        break;
      case 'onOffLight':
        this.thingTypeLabel.innerText = 'On/Off Light';
        this.element.classList.add('on-off-light');
        break;
      case 'onOffColorLight':
        this.thingTypeLabel.innerText = 'Color Light';
        this.element.classList.add('on-off-light');
        break;
      case 'dimmableLight':
        this.thingTypeLabel.innerText = 'Dimmable Light';
        this.element.classList.add('on-off-light');
        break;
      case 'dimmableColorLight':
        this.thingTypeLabel.innerText = 'Dimmable Color Light';
        this.element.classList.add('on-off-light');
        break;
      case 'multiLevelSwitch':
        this.thingTypeLabel.innerText = 'Multi Level Switch';
        this.element.classList.add('on-off-switch');
        break;
      case 'onOffSwitch':
        this.thingTypeLabel.innerText = 'On/Off Switch';
        this.element.classList.add('on-off-switch');
        break;
      case 'smartPlug':
        this.thingTypeLabel.innerText = 'Smart Plug';
        this.element.classList.add('smart-plug');
        break;
      default:
        this.thingTypeLabel.innerText = 'Unknown device type';
        break;
    }

    this.description = description;

    // If an href was included, use that for the URL instead.
    if (this.description.hasOwnProperty('href')) {
      this.url = urlObj.origin + description.href;
    }

    // Generate an ID. This must generate IDs identical to thing-url-adapter.
    this.id = this.url.replace(/[:/]/g, '-');

    this.nameInput.value = description.name;
    this.originLabel.innerText = `from ${urlObj.host}`;
    this.urlInput.classList.add('hidden');
    this.nameInput.classList.remove('hidden');
    this.submitButton.classList.add('hidden');
    this.saveButton.classList.remove('hidden');
    this.originLabel.classList.remove('hidden');
  }).catch((error) => {
    this.thingTypeLabel.innerText = error.message;
    this.thingTypeLabel.classList.add('error');
    console.error('Failed to check web thing:', error.message);
  });
};

NewWebThing.prototype.save = function() {
  const thing = this.description;
  thing.id = this.id;
  thing.name = this.nameInput.value;
  thing.webthingUrl = this.url;
  fetch('/things', {
    method: 'POST',
    body: JSON.stringify(thing),
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
  }).then((description) => {
    if (typeof description === 'string') {
      throw new Error(description);
    }

    this.nameInput.disabled = true;
    this.saveButton.innerHTML = 'Saved';
    this.saveButton.disabled = true;
    this.cancelButton.classList.add('hidden');
  }).catch((error) => {
    this.thingTypeLabel.innerText = error.message;
    this.thingTypeLabel.classList.add('error');
    this.reset();
    console.error('Failed to save web thing:', error.message);
  });
};

NewWebThing.prototype.reset = function() {
  this.description = null;
  this.url = null;
  this.id = this.originalId;

  this.urlInput.value = '';
  this.nameInput.value = '';
  this.originLabel.innerText = '';
  this.element.classList.remove(
    'binary-sensor', 'on-off-light', 'on-off-switch', 'smart-plug');
  this.element.classList.add('web-thing');
  this.urlInput.classList.remove('hidden');
  this.nameInput.classList.add('hidden');
  this.submitButton.classList.remove('hidden');
  this.saveButton.classList.add('hidden');
  this.originLabel.classList.add('hidden');
};

module.exports = NewWebThing;
