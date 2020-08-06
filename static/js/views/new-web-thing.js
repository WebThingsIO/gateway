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
const fluent = require('../fluent');
const Utils = require('../utils');
const {getClassFromCapability} =
  require('../schema-impl/capability/capabilities');

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
    this.titleInput = this.element.querySelector('.new-web-thing-title');
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
            data-l10n-id="new-web-thing-url"></input>
          <input type="text" class="new-web-thing-title hidden"></input>
          <span class="new-web-thing-origin hidden"></span>
          <select class="new-thing-type hidden"></select>
          <span class="new-thing-spacer"></span>
          <input type="file" class="new-thing-custom-icon-input hidden"
            id="${id}" accept="image/jpeg,image/png,image/svg+xml">
          <label for="${id}"
            class="new-thing-custom-icon-label text-button hidden"
            data-l10n-id="new-thing-choose-icon">
          </label>
          <span class="new-web-thing-label"
                data-l10n-id="new-web-thing-label"></span>
          <div class="new-web-thing-controls">
            <button class="new-web-thing-cancel-button text-button"
              data-l10n-id="new-thing-cancel">
            </button>
            <button class="new-web-thing-submit-button text-button"
              data-l10n-id="new-thing-submit">
            </button>
            <button class="new-web-thing-save-button text-button hidden"
              data-l10n-id="new-thing-save">
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

    const cls = getClassFromCapability(capability);

    if (capability == 'Custom') {
      this.customIconLabel.classList.remove('hidden');
      this.customIcon.classList.remove('hidden');
    }

    this.element.classList.remove(
      'on-off-switch',
      'multi-level-switch',
      'color-control',
      'color-sensor',
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
      'alarm',
      'thermostat',
      'lock'
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
      this.label.clsssList.remove('hidden');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = (e) => {
      if (e.target.error) {
        console.error(e.target.error);
        this.label.innerText = fluent.getMessage('failed-read-file');
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
    this.label.innerText = fluent.getMessage('loading');
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

    API.addWebThing(url).then((description) => {
      // We don't support other gateways from this interface
      if (Array.isArray(description)) {
        this.label.innerText = fluent.getMessage('new-web-thing-multiple');
        this.label.classList.add('error');
        return;
      }

      let capabilities = [];
      if (Array.isArray(description['@type']) &&
          description['@type'].length > 0) {
        capabilities = description['@type'];
      }

      capabilities = Utils.sortCapabilities(capabilities);
      capabilities.push('Custom');

      this.customIconLabel.classList.add('hidden');

      let cls = '';
      for (const capability of capabilities) {
        const option = document.createElement('option');
        option.value = capability;
        option.innerText = fluent.getMessageStrict(capability) || capability;

        if (!cls) {
          cls = getClassFromCapability(capability);

          if (!cls && capabilities.length == 1) {
            cls = 'custom-thing';
          }
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
      this.titleInput.value = description.title;
      this.originLabel.innerText = `${fluent.getMessage('new-web-thing-from')} ${urlObj.host}`;
      this.urlInput.classList.add('hidden');
      this.titleInput.classList.remove('hidden');
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
    this.titleInput.disabled = true;
    this.saveButton.disabled = true;
    this.customIconInput.disabled = true;
    this.cancelButton.classList.add('hidden');

    const thing = this.description;
    thing.id = this.id;
    thing.title = this.titleInput.value;
    thing.webthingUrl = this.url;

    if (this.thingType.options.length > 0) {
      thing.selectedCapability =
        this.thingType.options[this.thingType.selectedIndex].value;
    }

    if (thing.selectedCapability === 'Custom' && this.iconData) {
      thing.iconData = this.iconData;
    }

    API.addThing(thing).then(() => {
      this.saveButton.innerHTML = fluent.getMessage('new-thing-saved');

      const cancelButton = document.getElementById('add-thing-cancel-button');
      if (cancelButton) {
        cancelButton.textContent = fluent.getMessage('new-thing-done');
      }
    }).catch((error) => {
      console.error('Failed to save web thing:', error.message);
      this.label.innerText = fluent.getMessage('failed-save');
      this.label.classList.add('error');
      this.label.classList.remove('hidden');
      this.thingType.disabled = false;
      this.titleInput.disabled = false;
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
    this.titleInput.value = '';
    this.originLabel.innerText = '';
    this.element.classList.remove(
      'binary-sensor',
      'multi-level-sensor',
      'light',
      'on-off-switch',
      'multi-level-switch',
      'color-control',
      'color-sensor',
      'energy-monitor',
      'smart-plug',
      'door-sensor',
      'motion-sensor',
      'leak-sensor',
      'push-button',
      'video-camera',
      'camera',
      'temperature-sensor',
      'alarm',
      'thermostat',
      'lock'
    );
    this.element.classList.add('web-thing');
    this.urlInput.classList.remove('hidden');
    this.titleInput.classList.add('hidden');
    this.submitButton.classList.remove('hidden');
    this.saveButton.classList.add('hidden');
    this.originLabel.classList.add('hidden');
  }
}

module.exports = NewWebThing;
