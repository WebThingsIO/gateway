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

const API = require('../api');
const Utils = require('../utils');

let idCounter = -1;
const getNewWebThingId = () => {
  idCounter += 1;
  return idCounter;
};

class NewWebThing {
  /**
   * New Web Thing constructor.
   */
  constructor() {
    this.id = `web-thing-${getNewWebThingId()}`;
    this.originalId = this.id;
    this.url = null;
    this.iconData = null;
    this.description = null;
    this.container = document.getElementById('new-things');
    this.render();
    this.element = document.getElementById(
      `new-web-thing-${Utils.escapeHtmlForIdClass(this.originalId)}`);
    this.thingType = this.element.querySelector('.new-thing-type');
    this.customIcon = this.element.querySelector('.new-thing-custom-icon');
    this.customIconInput =
      this.element.querySelector('.new-thing-custom-icon-input');
    this.customIconLabel =
      this.element.querySelector('.new-thing-custom-icon-label');
    this.label = this.element.querySelector('.new-web-thing-label');
    this.originLabel = this.element.querySelector('.new-web-thing-origin');
    this.urlInput = this.element.querySelector('.new-web-thing-url');
    this.nameInput = this.element.querySelector('.new-web-thing-name');
    this.cancelButton =
      this.element.querySelector('.new-web-thing-cancel-button');
    this.submitButton =
      this.element.querySelector('.new-web-thing-submit-button');
    this.saveButton = this.element.querySelector('.new-web-thing-save-button');
    this.element.addEventListener('click', this.handleClick.bind(this));
    this.thingType.addEventListener('change', this.handleTypeChange.bind(this));
    this.customIconInput.addEventListener('change',
                                          this.handleIconUpload.bind(this));
  }

  /**
   * HTML view for New Web Thing.
   */
  view() {
    const id = Utils.escapeHtmlForIdClass(`new-thing-custom-icon-${this.id}`);
    return `
      <div id="new-web-thing-${Utils.escapeHtmlForIdClass(this.originalId)}"
           class="new-thing web-thing">
        <div class="new-thing-icon">
          <webthing-custom-icon class="new-thing-custom-icon hidden">
          </webthing-custom-icon>
        </div>
        <div class="new-thing-metadata">
          <input type="text" class="new-web-thing-url"
            placeholder="Enter web thing URL"></input>
          <input type="text" class="new-web-thing-name hidden"></input>
          <span class="new-web-thing-origin hidden"></span>
          <select class="new-thing-type hidden"></select>
          <span class="new-thing-spacer"></span>
          <input type="file" class="new-thing-custom-icon-input hidden"
            id="${id}" accept="image/jpeg,image/png,image/svg+xml">
          <label for="${id}"
            class="new-thing-custom-icon-label text-button hidden">
            Choose icon...
          </label>
          <span class="new-web-thing-label">Web Thing</span>
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
      this.label.clsssList.remove('hidden');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = (e) => {
      if (e.target.error) {
        console.error(e.target.error);
        this.label.innerText = 'Failed to read file.';
        this.label.classList.add('error');
        this.label.clsssList.remove('hidden');
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
      capabilities.push('Custom');

      this.customIconLabel.classList.add('hidden');

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
            cls = cls || 'multi-level-switch';
            break;
          case 'ColorControl':
            option.innerText = 'Color Control';
            cls = cls || 'color-control';
            break;
          case 'EnergyMonitor':
            option.innerText = 'Energy Monitor';
            cls = cls || 'energy-monitor';
            break;
          case 'BinarySensor':
            option.innerText = 'Binary Sensor';
            cls = cls || 'binary-sensor';
            break;
          case 'MultiLevelSensor':
            option.innerText = 'Multi Level Sensor';
            cls = cls || 'multi-level-sensor';
            break;
          case 'SmartPlug':
            option.innerText = 'Smart Plug';
            cls = cls || 'smart-plug';
            break;
          case 'Light':
            option.innerText = 'Light';
            cls = cls || 'light';
            break;
          case 'DoorSensor':
            option.innerText = 'Door Sensor';
            cls = cls || 'door-sensor';
            break;
          case 'MotionSensor':
            option.innerText = 'Motion Sensor';
            cls = cls || 'motion-sensor';
            break;
          case 'LeakSensor':
            option.innerText = 'Leak Sensor';
            cls = cls || 'leak-sensor';
            break;
          case 'PushButton':
            option.innerText = 'Push Button';
            cls = cls || 'push-button';
            break;
          case 'VideoCamera':
            option.innerText = 'Video Camera';
            cls = cls || 'video-camera';
            break;
          case 'Camera':
            option.innerText = 'Camera';
            cls = cls || 'camera';
            break;
          case 'TemperatureSensor':
            option.innerText = 'Temperature Sensor';
            cls = cls || 'temperature-sensor';
            break;
          case 'Alarm':
            option.innerText = 'Alarm';
            cls = cls || 'alarm';
            break;
          case 'Custom':
            option.innerText = 'Custom Thing';
            cls = cls || (capabilities.length > 1 ? '' : 'custom-thing');
            break;
          default:
            option.innerText = capability;
            cls = cls || (capabilities.length > 1 ? '' : 'custom-thing');
            break;
        }

        if (this.thingType.options.length === 0) {
          option.selected = true;

          if (capability === 'Custom') {
            this.customIconLabel.classList.remove('hidden');
          }
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

      cls = cls.trim();
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
    this.thingType.disabled = true;
    this.nameInput.disabled = true;
    this.saveButton.disabled = true;
    this.customIconInput.disabled = true;
    this.cancelButton.classList.add('hidden');

    const thing = this.description;
    thing.id = this.id;
    thing.name = this.nameInput.value;
    thing.webthingUrl = this.url;

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
      if (!response.ok) {
        return response.text();
      }

      return response.json();
    }).then((description) => {
      if (typeof description === 'string') {
        throw new Error(description);
      }

      this.saveButton.innerHTML = 'Saved';

      const cancelButton = document.getElementById('add-thing-cancel-button');
      if (cancelButton) {
        cancelButton.textContent = 'Done';
      }
    }).catch((error) => {
      console.error('Failed to save web thing:', error.message);
      this.label.innerText = 'Failed to save.';
      this.label.classList.add('error');
      this.label.classList.remove('hidden');
      this.thingType.disabled = false;
      this.nameInput.disabled = false;
      this.saveButton.disabled = false;
      this.customIconInput.disabled = false;
      this.cancelButton.classList.remove('hidden');
      this.reset();
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
      'binary-sensor',
      'multi-level-sensor',
      'light',
      'on-off-switch',
      'multi-level-switch',
      'color-control',
      'energy-monitor',
      'smart-plug',
      'door-sensor',
      'motion-sensor',
      'leak-sensor',
      'push-button',
      'video-camera',
      'camera',
      'temperature-sensor',
      'alarm'
    );
    this.element.classList.add('web-thing');
    this.urlInput.classList.remove('hidden');
    this.nameInput.classList.add('hidden');
    this.submitButton.classList.remove('hidden');
    this.saveButton.classList.add('hidden');
    this.originLabel.classList.add('hidden');
  }
}

module.exports = NewWebThing;
