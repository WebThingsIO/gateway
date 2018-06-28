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

class NewWebThing {
  /**
   * New Web Thing constructor.
   */
  constructor() {
    this.id = getNewWebThingId();
    this.originalId = this.id;
    this.url = null;
    this.description = null;
    this.container = document.getElementById('new-things');
    this.render();
    this.element = document.getElementById(
      `new-web-thing-${Utils.escapeHtmlForIdClass(this.originalId)}`);
    this.thingType = this.element.getElementsByClassName('new-thing-type')[0];
    this.label =
      this.element.getElementsByClassName('new-web-thing-label')[0];
    this.originLabel =
      this.element.getElementsByClassName('new-web-thing-origin')[0];
    this.urlInput = this.element.getElementsByClassName('new-web-thing-url')[0];
    this.nameInput =
      this.element.getElementsByClassName('new-web-thing-name')[0];
    this.cancelButton =
      this.element.getElementsByClassName('new-web-thing-cancel-button')[0];
    this.submitButton =
      this.element.getElementsByClassName('new-web-thing-submit-button')[0];
    this.saveButton =
      this.element.getElementsByClassName('new-web-thing-save-button')[0];
    this.element.addEventListener('click', this.handleClick.bind(this));
    this.thingType.addEventListener('change', this.handleTypeChange.bind(this));
  }

  /**
   * HTML view for New Web Thing.
   */
  view() {
    return `
      <div id="new-web-thing-${Utils.escapeHtmlForIdClass(this.originalId)}"
           class="new-thing web-thing">
        <div class="new-thing-icon"></div>
        <div class="new-thing-metadata">
          <input type="text" class="new-web-thing-url"
            placeholder="Enter web thing URL"></input>
          <input type="text" class="new-web-thing-name hidden"></input>
          <span class="new-web-thing-label">Web Thing</span>
          <select class="new-thing-type hidden"></select>
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
  }

  /**
   * Render New Web Thing view and add to DOM.
   */
  render() {
    this.container.insertAdjacentHTML('beforeend', this.view());
  }

  handleTypeChange() {
    const capability =
      this.thingType.options[this.thingType.selectedIndex].value;

    let cls = '';
    switch (capability) {
      case 'OnOffSwitch':
      case 'MultiLevelSwitch':
        cls = 'on-off-switch';
        break;
      case 'ColorControl':
        // TODO: cls
        break;
      case 'EnergyMonitor':
        // TODO: cls
        break;
      case 'BinarySensor':
      case 'MultiLevelSensor':
        cls = 'binary-sensor';
        break;
      case 'SmartPlug':
        cls = 'smart-plug';
        break;
      case 'Light':
        cls = 'on-off-light';
        break;
      default:
        break;
    }

    this.element.classList.remove('on-off-switch',
                                  'binary-sensor',
                                  'smart-plug',
                                  'on-off-light');

    if (cls) {
      this.element.classList.add(cls);
    }
  }

  /**
   * Handle click on a Thing.
   */
  handleClick(event) {
    if (event.target.classList.contains('new-web-thing-save-button')) {
      this.save();
    } else if (event.target.classList.contains('new-web-thing-submit-button')) {
      this.submit();
    } else if (event.target.classList.contains('new-web-thing-cancel-button')) {
      this.cancel();
    }
  }

  cancel() {
    this.container.removeChild(this.element);
  }

  submit() {
    this.label.innerText = 'Loading...';
    this.label.classList.remove('error');

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
        this.label.innerText = 'Multiple web things found';
        this.label.classList.add('error');
        return;
      }

      let capabilities = [];
      if (Array.isArray(description['@type']) &&
          description['@type'].length > 0) {
        capabilities = description['@type'];
      } else if (description.type) {
        capabilities = Utils.legacyTypeToCapabilities(description.type);
      }

      capabilities = Utils.sortCapabilities(capabilities);

      let cls = '';
      for (const capability of capabilities) {
        const option = document.createElement('option');
        option.value = capability;

        switch (capability) {
          case 'OnOffSwitch':
            option.innerText = 'On/Off Switch';
            cls = cls || 'on-off-switch';
            break;
          case 'MultiLevelSwitch':
            option.innerText = 'Multi Level Switch';
            cls = cls || 'on-off-switch';
            break;
          case 'ColorControl':
            option.innerText = 'Color Control';
            // TODO: cls
            break;
          case 'EnergyMonitor':
            option.innerText = 'Energy Monitor';
            // TODO: cls
            break;
          case 'BinarySensor':
            option.innerText = 'Binary Sensor';
            cls = cls || 'binary-sensor';
            break;
          case 'MultiLevelSensor':
            option.innerText = 'Multi Level Sensor';
            cls = cls || 'binary-sensor';
            break;
          case 'SmartPlug':
            option.innerText = 'Smart Plug';
            cls = cls || 'smart-plug';
            break;
          case 'Light':
            option.innerText = 'Light';
            cls = cls || 'on-off-light';
            break;
          default:
            option.innerText = capability;
            cls = cls || (capabilities.length > 1 ? '' : ' ');
            break;
        }

        if (this.thingType.options.length === 0) {
          option.selected = true;
        }

        this.thingType.appendChild(option);
      }

      this.description = description;

      // If an href was included, use that for the URL instead.
      if (this.description.hasOwnProperty('href')) {
        this.url = urlObj.origin + description.href;
      }

      // Generate an ID. This must generate IDs identical to thing-url-adapter.
      this.id = this.url.replace(/[:/]/g, '-');

      this.element.classList.remove('web-thing');
      this.label.classList.remove('error');
      this.label.classList.add('hidden');
      this.thingType.classList.remove('hidden');
      this.nameInput.value = description.name;
      this.originLabel.innerText = `from ${urlObj.host}`;
      this.urlInput.classList.add('hidden');
      this.nameInput.classList.remove('hidden');
      this.submitButton.classList.add('hidden');
      this.saveButton.classList.remove('hidden');
      this.originLabel.classList.remove('hidden');

      if (cls) {
        this.element.classList.add(cls);
      }
    }).catch((error) => {
      this.label.innerText = error.message;
      this.label.classList.add('error');
      console.error('Failed to check web thing:', error.message);
    });
  }

  save() {
    const thing = this.description;
    thing.id = this.id;
    thing.name = this.nameInput.value;
    thing.webthingUrl = this.url;

    if (this.thingType.options.length > 0) {
      thing.selectedCapability =
        this.thingType.options[this.thingType.selectedIndex].value;
    }

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

      this.thingType.disabled = true;
      this.nameInput.disabled = true;
      this.saveButton.innerHTML = 'Saved';
      this.saveButton.disabled = true;
      this.cancelButton.classList.add('hidden');
    }).catch((error) => {
      this.label.innerText = error.message;
      this.label.classList.add('error');
      this.reset();
      console.error('Failed to save web thing:', error.message);
    });
  }

  reset() {
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
  }
}

module.exports = NewWebThing;
