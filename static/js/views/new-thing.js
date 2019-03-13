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

const API = require('../api');
const Utils = require('../utils');

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
    this.credentialsSet = false;
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

  requiresCredentials() {
    return this.description.credentialsRequired && !this.credentialsSet;
  }

  buildStandardView() {
    this.element.classList.remove('pin-required');
    this.element.classList.remove('credentials-required');

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
        case 'DoorSensor':
          type = 'Door Sensor';
          cls = cls || 'door-sensor';
          break;
        case 'MotionSensor':
          type = 'Motion Sensor';
          cls = cls || 'motion-sensor';
          break;
        case 'LeakSensor':
          type = 'Leak Sensor';
          cls = cls || 'leak-sensor';
          break;
        case 'PushButton':
          type = 'Push Button';
          cls = cls || 'push-button';
          break;
        case 'VideoCamera':
          type = 'Video Camera';
          cls = cls || 'video-camera';
          break;
        case 'Camera':
          type = 'Camera';
          cls = cls || 'camera';
          break;
        case 'TemperatureSensor':
          type = 'Temperature Sensor';
          cls = cls || 'temperature-sensor';
          break;
        case 'Alarm':
          type = 'Alarm';
          cls = cls || 'alarm';
          break;
        case 'Custom':
          type = 'Custom Thing';
          cls = cls || (capabilities.length > 1 ? '' : 'custom-thing');
          break;
        default:
          type = capability;
          cls = cls || (capabilities.length > 1 ? '' : 'custom-thing');
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
        <input type="file" class="new-thing-custom-icon-input hidden"
          id="${id}" accept="image/jpeg,image/png,image/svg+xml">
        <label for="${id}"
          class="new-thing-custom-icon-label text-button ${customIconClass}">
          Choose icon...
        </label>
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

  buildCredentialsView() {
    this.element.classList.add('credentials-required');
    this.element.innerHTML = `
      <div class="new-thing-icon"></div>
      <div class="new-thing-metadata">
        <span class="new-thing-initial-name">
          ${Utils.escapeHtml(this.description.name)}
        </span>
        <input type="text" class="new-thing-username" required autofocus
               placeholder="Enter username"/>
        <input type="password" class="new-thing-password" required
               placeholder="Enter password"/>
        <span class="new-thing-credentials-error hidden">
          Incorrect credentials
        </span>
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
    } else if (this.requiresCredentials()) {
      this.buildCredentialsView();
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
      this.pinInput = this.element.querySelector('.new-thing-pin');
      this.pinError = this.element.querySelector('.new-thing-pin-error');
      this.cancelButton =
        this.element.querySelector('.new-thing-cancel-button');
      this.submitButton =
        this.element.querySelector('.new-thing-submit-button');

      this.pinInput.addEventListener('input', this.handlePinInput.bind(this));
      this.cancelButton.addEventListener('click', this.handleCancel.bind(this));
      this.submitButton.addEventListener('click', this.handleSubmit.bind(this));
    } else if (this.requiresCredentials()) {
      this.usernameInput = this.element.querySelector('.new-thing-username');
      this.passwordInput = this.element.querySelector('.new-thing-password');
      this.credentialsError =
        this.element.querySelector('.new-thing-credentials-error');
      this.cancelButton =
        this.element.querySelector('.new-thing-cancel-button');
      this.submitButton =
        this.element.querySelector('.new-thing-submit-button');

      this.usernameInput.addEventListener(
        'input',
        this.handleCredentialsInput.bind(this)
      );
      this.passwordInput.addEventListener(
        'input',
        this.handleCredentialsInput.bind(this)
      );
      this.cancelButton.addEventListener('click', this.handleCancel.bind(this));
      this.submitButton.addEventListener('click', this.handleSubmit.bind(this));
    } else {
      this.nameInput = this.element.querySelector('.new-thing-name');
      this.saveButton = this.element.querySelector('.new-thing-save-button');
      this.thingType = this.element.querySelector('.new-thing-type');
      this.customIcon = this.element.querySelector('.new-thing-custom-icon');
      this.customIconInput =
        this.element.querySelector('.new-thing-custom-icon-input');
      this.customIconLabel =
        this.element.querySelector('.new-thing-custom-icon-label');
      this.label = this.element.querySelector('.new-thing-label');

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

  handleCredentialsInput() {
    const username = this.usernameInput.value;
    const password = this.passwordInput.value;
    this.submitButton.disabled = username.length === 0 || password.length === 0;
  }

  handleCancel() {
    this.container.removeChild(this.element);
  }

  handleSubmit() {
    this.submitButton.disabled = true;

    const data = {
      thingId: this.id,
    };

    if (this.requiresPin()) {
      data.pin = this.pinInput.value.trim();
    } else if (this.requiresCredentials()) {
      data.username = this.usernameInput.value;
      data.password = this.passwordInput.value;
    }

    fetch('/things', {
      method: 'PATCH',
      body: JSON.stringify(data),
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

      this.description = json;

      if (this.requiresPin()) {
        this.pinError.classList.add('hidden');
        this.pinSet = true;
      } else if (this.requiresCredentials()) {
        this.credentialsError.classList.add('hidden');
        this.credentialsSet = true;
      }

      this.render();
    }).catch((error) => {
      console.error(`Failed to set PIN/credentials: ${error}`);
      this.submitButton.disabled = false;

      if (this.pinError) {
        this.pinError.classList.remove('hidden');
      } else if (this.credentialsError) {
        this.credentialsError.classList.remove('hidden');
      }
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
      case 'DoorSensor':
        cls = 'door-sensor';
        break;
      case 'MotionSensor':
        cls = 'motion-sensor';
        break;
      case 'LeakSensor':
        cls = 'leak-sensor';
        break;
      case 'PushButton':
        cls = 'push-button';
        break;
      case 'VideoCamera':
        cls = 'video-camera';
        break;
      case 'Camera':
        cls = 'camera';
        break;
      case 'TemperatureSensor':
        cls = 'temperature-sensor';
        break;
      case 'Alarm':
        cls = 'alarm';
        break;
      case 'Custom':
        this.customIconLabel.classList.remove('hidden');
        this.customIcon.classList.remove('hidden');
        break;
      default:
        break;
    }

    this.element.classList.remove(
      'on-off-switch',
      'multi-level-switch',
      'color-control',
      'energy-monitor',
      'binary-sensor',
      'multi-level-sensor',
      'smart-plug',
      'light',
      'door-sensor',
      'motion-sensor',
      'leak-sensor',
      'push-button',
      'video-camera',
      'camera',
      'temperature-sensor',
      'alarm'
    );

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
    this.thingType.disabled = true;
    this.nameInput.disabled = true;
    this.saveButton.disabled = true;
    this.customIconInput.disabled = true;

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
      this.saveButton.innerHTML = 'Saved';

      const cancelButton = document.getElementById('add-thing-cancel-button');
      if (cancelButton) {
        cancelButton.textContent = 'Done';
      }
    }).catch((error) => {
      console.error(`Failed to save thing ${error}`);
      this.label.innerText = 'Failed to save.';
      this.label.classList.add('error');
      this.label.classList.remove('hidden');
      this.thingType.disabled = false;
      this.nameInput.disabled = false;
      this.saveButton.disabled = false;
      this.customIconInput.disabled = false;
    });
  }
}

module.exports = NewThing;
