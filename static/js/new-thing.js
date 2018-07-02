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

class NewThing {
  /**
   * New Thing constructor.
   *
   * @param {String} id Thing ID.
   * @param {Object} description Thing description object.
   */
  constructor(id, description) {
    this.id = id;
    this.description = description;
    this.pinSet = false;
    this.iconData = null;
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
  }

  requiresPin() {
    return this.description.hasOwnProperty('pin') &&
      this.description.pin.required &&
      !this.pinSet;
  }

  buildStandardView() {
    this.element.classList.remove('pin-required');

    let capabilities = [];
    if (Array.isArray(this.description['@type']) &&
        this.description['@type'].length > 0) {
      capabilities = this.description['@type'];
    } else if (this.description.type) {
      capabilities = Utils.legacyTypeToCapabilities(this.description.type);
    }

    capabilities = Utils.sortCapabilities(capabilities);
    capabilities.push('Custom');

    let cls = '', type = '', customIconClass = 'hidden';
    const options = [];
    for (let capability of capabilities) {
      switch (capability) {
        case 'OnOffSwitch':
          type = 'On/Off Switch';
          cls = cls || 'on-off-switch';
          break;
        case 'MultiLevelSwitch':
          type = 'Multi Level Switch';
          cls = cls || 'multi-level-switch';
          break;
        case 'ColorControl':
          type = 'Color Control';
          cls = cls || 'color-control';
          break;
        case 'EnergyMonitor':
          type = 'Energy Monitor';
          cls = cls || 'energy-monitor';
          break;
        case 'BinarySensor':
          type = 'Binary Sensor';
          cls = cls || 'binary-sensor';
          break;
        case 'MultiLevelSensor':
          type = 'Multi Level Sensor';
          cls = cls || 'multi-level-sensor';
          break;
        case 'SmartPlug':
          type = 'Smart Plug';
          cls = cls || 'smart-plug';
          break;
        case 'Light':
          type = 'Light';
          cls = cls || 'light';
          break;
        case 'Custom':
          type = 'Custom Thing';
          cls = cls || (capabilities.length > 1 ? '' : ' ');
          break;
        default:
          type = capability;
          cls = cls || (capabilities.length > 1 ? '' : ' ');
          break;
      }

      capability = Utils.escapeHtml(capability);
      type = Utils.escapeHtml(type);

      let selected = '';
      if (options.length === 0) {
        selected = 'selected';

        if (capability === 'Custom') {
          customIconClass = '';
        }
      }

      options.push(
        `<option value="${capability}" ${selected}>${type}</option>`);
    }

    cls = cls.trim();
    if (cls) {
      this.element.classList.add(cls);
    }

    if (!type) {
      type = 'Unknown device type';
    }

    const id = Utils.escapeHtmlForIdClass(`new-thing-custom-icon-${this.id}`);
    this.element.innerHTML = `
      <div class="new-thing-icon">
        <webthing-custom-icon class="new-thing-custom-icon ${customIconClass}">
        </webthing-custom-icon>
      </div>
      <div class="new-thing-metadata">
        <input type="text" class="new-thing-name"
               value="${Utils.escapeHtml(this.description.name)}"/>
        <select class="new-thing-type">${options.join('')}</select>
        <span class="new-thing-spacer"></span>
        <label for="${id}"
          class="new-thing-custom-icon-label text-button ${customIconClass}">
          Choose icon...
        </label>
        <input type="file" class="new-thing-custom-icon-input hidden"
          id="${id}" accept="image/jpeg,image/png,image/svg+xml">
        <span class="new-thing-label"></span>
      </div>
      <button class="new-thing-save-button text-button">
        Save
      </button>`;
  }

  buildPinView() {
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
  }

  /**
   * HTML view for New Thing.
   */
  buildView() {
    if (this.requiresPin()) {
      this.buildPinView();
    } else {
      this.buildStandardView();
    }
  }

  /**
   * Render New Thing view and add to DOM.
   */
  render() {
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
      this.thingType = this.element.getElementsByClassName('new-thing-type')[0];
      this.customIcon =
        this.element.getElementsByClassName('new-thing-custom-icon')[0];
      this.customIconInput =
        this.element.getElementsByClassName('new-thing-custom-icon-input')[0];
      this.customIconLabel =
        this.element.getElementsByClassName('new-thing-custom-icon-label')[0];
      this.label = this.element.getElementsByClassName('new-thing-label')[0];

      this.saveButton.addEventListener('click', this.handleSave.bind(this));
      this.thingType.addEventListener('change',
                                      this.handleTypeChange.bind(this));
      this.customIconInput.addEventListener('change',
                                            this.handleIconUpload.bind(this));
    }
  }

  handlePinInput() {
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
  }

  handleCancel() {
    this.container.removeChild(this.element);
  }

  handleSubmit() {
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
  }

  handleTypeChange() {
    const capability =
      this.thingType.options[this.thingType.selectedIndex].value;

    this.customIconLabel.classList.add('hidden');
    this.customIcon.classList.add('hidden');

    let cls = '';
    switch (capability) {
      case 'OnOffSwitch':
        cls = 'on-off-switch';
        break;
      case 'MultiLevelSwitch':
        cls = 'multi-level-switch';
        break;
      case 'ColorControl':
        cls = 'color-control';
        break;
      case 'EnergyMonitor':
        cls = 'energy-monitor';
        break;
      case 'BinarySensor':
        cls = 'binary-sensor';
        break;
      case 'MultiLevelSensor':
        cls = 'multi-level-sensor';
        break;
      case 'SmartPlug':
        cls = 'smart-plug';
        break;
      case 'Light':
        cls = 'light';
        break;
      case 'Custom':
        this.customIconLabel.classList.remove('hidden');
        this.customIcon.classList.remove('hidden');
        break;
      default:
        break;
    }

    this.element.classList.remove('on-off-switch',
                                  'multi-level-switch',
                                  'color-control',
                                  'energy-monitor',
                                  'binary-sensor',
                                  'multi-level-sensor',
                                  'smart-plug',
                                  'light');

    if (cls) {
      this.element.classList.add(cls);
    }
  }

  handleIconUpload() {
    this.label.classList.add('hidden');

    if (this.customIconInput.files.length === 0) {
      return;
    }

    const file = this.customIconInput.files[0];
    if (!['image/jpeg', 'image/png', 'image/svg+xml'].includes(file.type)) {
      this.label.innerText = 'Invalid file.';
      this.label.classList.add('error');
      this.label.classList.remove('hidden');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = (e) => {
      if (e.target.error) {
        console.error(e.target.error);
        this.label.innerText = 'Failed to read file.';
        this.label.classList.add('error');
        this.label.classList.remove('hidden');
        this.saveButton.disabled = false;
        return;
      }

      this.iconData = {
        mime: file.type,
        data: btoa(e.target.result),
      };
      this.saveButton.disabled = false;

      this.customIcon.iconHref = URL.createObjectURL(file);
      this.customIcon.classList.remove('hidden');
    };

    this.saveButton.disabled = true;
    reader.readAsBinaryString(file);
  }

  handleSave() {
    this.saveButton.disabled = true;

    const thing = this.description;
    thing.id = this.id;
    thing.name = this.nameInput.value;

    if (this.thingType.options.length > 0) {
      thing.selectedCapability =
        this.thingType.options[this.thingType.selectedIndex].value;
    }

    if (thing.selectedCapability === 'Custom' && this.iconData) {
      thing.iconData = this.iconData;
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
      return response.json();
    }).then(() => {
      this.thingType.disabled = true;
      this.nameInput.disabled = true;
      this.saveButton.innerHTML = 'Saved';
      this.saveButton.disabled = true;
    }).catch((error) => {
      console.error(`Failed to save thing ${error}`);
      this.label.innerText = 'Failed to save.';
      this.label.classList.add('error');
      this.label.classList.remove('hidden');
      this.saveButton.disabled = false;
    });
  }
}

module.exports = NewThing;
