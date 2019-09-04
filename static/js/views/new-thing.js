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
const fluent = require('../fluent');

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
      type = fluent.getMessageStrict(capability) || capability;
      switch (capability) {
        case 'OnOffSwitch':
          cls = cls || 'on-off-switch';
          break;
        case 'MultiLevelSwitch':
          cls = cls || 'multi-level-switch';
          break;
        case 'ColorControl':
          cls = cls || 'color-control';
          break;
        case 'EnergyMonitor':
          cls = cls || 'energy-monitor';
          break;
        case 'BinarySensor':
          cls = cls || 'binary-sensor';
          break;
        case 'MultiLevelSensor':
          cls = cls || 'multi-level-sensor';
          break;
        case 'SmartPlug':
          cls = cls || 'smart-plug';
          break;
        case 'Light':
          cls = cls || 'light';
          break;
        case 'DoorSensor':
          cls = cls || 'door-sensor';
          break;
        case 'MotionSensor':
          cls = cls || 'motion-sensor';
          break;
        case 'LeakSensor':
          cls = cls || 'leak-sensor';
          break;
        case 'PushButton':
          cls = cls || 'push-button';
          break;
        case 'VideoCamera':
          cls = cls || 'video-camera';
          break;
        case 'Camera':
          cls = cls || 'camera';
          break;
        case 'TemperatureSensor':
          cls = cls || 'temperature-sensor';
          break;
        case 'Alarm':
          cls = cls || 'alarm';
          break;
        case 'Custom':
          cls = cls || (capabilities.length > 1 ? '' : 'custom-thing');
          break;
        default:
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
      type = fluent.getMessage('unknown-device-type');
    }

    const id = Utils.escapeHtmlForIdClass(`new-thing-custom-icon-${this.id}`);
    this.element.innerHTML = `
      <div class="new-thing-icon">
        <webthing-custom-icon class="new-thing-custom-icon ${customIconClass}">
        </webthing-custom-icon>
      </div>
      <div class="new-thing-metadata">
        <input type="text" class="new-thing-title"
               value="${Utils.escapeHtml(this.description.title)}"/>
        <select class="new-thing-type">${options.join('')}</select>
        <span class="new-thing-spacer"></span>
        <input type="file" class="new-thing-custom-icon-input hidden"
          id="${id}" accept="image/jpeg,image/png,image/svg+xml">
        <label for="${id}"
          class="new-thing-custom-icon-label text-button ${customIconClass}"
          data-l10n-id="new-thing-choose-icon">
        </label>
        <span class="new-thing-label"></span>
      </div>
      <button class="new-thing-save-button text-button"
              data-l10n-id="new-thing-save">
      </button>`;
  }

  buildPinView() {
    this.element.classList.add('pin-required');
    this.element.innerHTML = `
      <div class="new-thing-icon"></div>
      <div class="new-thing-metadata">
        <span class="new-thing-initial-title">
          ${Utils.escapeHtml(this.description.title)}
        </span>
        <input type="text" class="new-thing-pin" required autofocus
               data-l10n-id="new-thing-pin"/>
        <span class="new-thing-pin-error hidden"
              data-l10n-id="new-thing-pin-error"></span>
      </div>
      <div class="new-thing-controls">
        <button class="new-thing-cancel-button text-button"
                data-l10n-id="new-thing-cancel">
        </button>
        <button class="new-thing-submit-button text-button"
                data-l10n-id="new-thing-submit" disabled>
        </button>
      </div>`;
  }

  buildCredentialsView() {
    this.element.classList.add('credentials-required');
    this.element.innerHTML = `
      <div class="new-thing-icon"></div>
      <div class="new-thing-metadata">
        <span class="new-thing-initial-title">
          ${Utils.escapeHtml(this.description.title)}
        </span>
        <input type="text" class="new-thing-username" required autofocus
               data-l10n-id="new-thing-username"/>
        <input type="password" class="new-thing-password" required
               data-l10n-id="new-thing-password"/>
        <span class="new-thing-credentials-error hidden"
              data-l10n-id="new-thing-credentials-error">
        </span>
      </div>
      <div class="new-thing-controls">
        <button class="new-thing-cancel-button text-button"
                data-l10n-id="new-thing-cancel">
        </button>
        <button class="new-thing-submit-button text-button" disabled
                data-l10n-id="new-thing-submit">
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
      this.titleInput = this.element.querySelector('.new-thing-title');
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
      this.pinInput.setCustomValidity(
        fluent.getMessage('new-thing-pin-invalid'));
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
      this.label.innerText = fluent.getMessage('invalid-file');
      this.label.classList.add('error');
      this.label.classList.remove('hidden');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = (e) => {
      if (e.target.error) {
        console.error(e.target.error);
        this.label.innerText = fluent.getMessage('failed-read-file');
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
    this.titleInput.disabled = true;
    this.saveButton.disabled = true;
    this.customIconInput.disabled = true;

    const thing = this.description;
    thing.id = this.id;
    thing.title = this.titleInput.value;

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
      this.saveButton.textContent = fluent.getMessage('new-thing-saved');

      const cancelButton = document.getElementById('add-thing-cancel-button');
      if (cancelButton) {
        cancelButton.textContent = fluent.getMessage('new-thing-done');
      }
    }).catch((error) => {
      console.error(`Failed to save thing ${error}`);
      this.label.innerText = fluent.getMessage('failed-save');
      this.label.classList.add('error');
      this.label.classList.remove('hidden');
      this.thingType.disabled = false;
      this.titleInput.disabled = false;
      this.saveButton.disabled = false;
      this.customIconInput.disabled = false;
    });
  }
}

module.exports = NewThing;
