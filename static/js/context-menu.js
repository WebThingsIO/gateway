/**
 * Context Menu.
 *
 * A menu of functions to perform on a Thing.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const API = require('./api');
const App = require('./app');
const Icons = require('./icons');
const page = require('page');
const Utils = require('./utils');

// eslint-disable-next-line no-unused-vars
const ContextMenu = {

  /**
   * Initialise Add Thing Screen.
   */
  init: function() {
    this.element = document.getElementById('context-menu');
    this.editContent = document.getElementById('context-menu-content-edit');
    this.removeContent = document.getElementById('context-menu-content-remove');
    this.backButton = document.getElementById('context-menu-back-button');
    this.headingIcon = document.getElementById('context-menu-heading-icon');
    this.headingCustomIcon =
      document.getElementById('context-menu-heading-custom-icon');
    this.headingText = document.getElementById('context-menu-heading-text');
    this.saveButton = document.getElementById('edit-thing-save-button');
    this.thingIcon = document.getElementById('edit-thing-icon');
    this.nameInput = document.getElementById('edit-thing-name');
    this.thingType = document.getElementById('edit-thing-type');
    this.customIcon = document.getElementById('edit-thing-custom-icon');
    this.customIconInput =
      document.getElementById('edit-thing-custom-icon-input');
    this.customIconLabel =
      document.getElementById('edit-thing-custom-icon-label');
    this.label = document.getElementById('edit-thing-label');
    this.removeButton = document.getElementById('remove-thing-button');
    this.logoutForm = document.getElementById('logout');
    this.thingId = '';

    // Add event listeners
    window.addEventListener('_contextmenu', this.show.bind(this));
    this.backButton.addEventListener('click', this.hide.bind(this));
    this.saveButton.addEventListener('click', this.handleEdit.bind(this));
    this.removeButton.addEventListener('click', this.handleRemove.bind(this));
    this.logoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      API.logout().then(() => {
        window.location.href = '/login';
      });
    });
    this.thingType.addEventListener('change', this.handleTypeChange.bind(this));
    this.customIconInput.addEventListener('change',
                                          this.handleIconUpload.bind(this));
  },

  /**
   * Show Context Menu.
   */
  show: function(e) {
    this.iconData = null;
    this.customIcon.iconHref = '';

    if (e.detail.iconHref) {
      this.headingCustomIcon.classList.remove('hidden');
      this.headingCustomIcon.iconHref = e.detail.iconHref;
      this.headingIcon.classList.add('custom-thing');
      this.headingIcon.style.backgroundImage = '';
      this.customIcon.iconHref = e.detail.iconHref;
    } else {
      this.headingCustomIcon.classList.add('hidden');
      this.headingIcon.classList.remove('custom-thing');
      this.headingIcon.style.backgroundImage = `url("${e.detail.thingIcon}")`;
      this.customIcon.iconHref = '';
    }

    this.headingText.textContent = e.detail.thingName;
    this.thingId = e.detail.thingId;
    this.element.classList.remove('hidden');

    this.editContent.classList.add('hidden');
    this.removeContent.classList.add('hidden');

    switch (e.detail.action) {
      case 'edit': {
        this.thingType.disabled = false;
        this.nameInput.disabled = false;
        this.saveButton.disabled = false;
        this.customIconInput.disabled = false;
        this.nameInput.value = e.detail.thingName;
        this.thingType.innerHTML = '';

        if (!e.detail.selectedCapability ||
            e.detail.selectedCapability === 'Custom') {
          this.thingIcon.classList.add('custom-thing');
          this.thingIcon.style.backgroundImage = '';
          this.customIconLabel.classList.remove('hidden');
          this.customIcon.classList.remove('hidden');
        } else {
          this.thingIcon.classList.remove('custom-thing');
          this.thingIcon.style.backgroundImage = `url("${e.detail.thingIcon}")`;
          this.customIconLabel.classList.add('hidden');
          this.customIcon.classList.add('hidden');
        }

        const capabilities = Utils.sortCapabilities(e.detail.capabilities);
        capabilities.push('Custom');

        for (const capability of capabilities) {
          const option = document.createElement('option');
          option.value = capability;

          if (e.detail.selectedCapability === capability ||
              (capability === 'Custom' && !e.detail.selectedCapability)) {
            option.selected = true;
          }

          switch (capability) {
            case 'OnOffSwitch':
              option.innerText = 'On/Off Switch';
              break;
            case 'MultiLevelSwitch':
              option.innerText = 'Multi Level Switch';
              break;
            case 'ColorControl':
              option.innerText = 'Color Control';
              break;
            case 'EnergyMonitor':
              option.innerText = 'Energy Monitor';
              break;
            case 'BinarySensor':
              option.innerText = 'Binary Sensor';
              break;
            case 'MultiLevelSensor':
              option.innerText = 'Multi Level Sensor';
              break;
            case 'SmartPlug':
              option.innerText = 'Smart Plug';
              break;
            case 'Light':
              option.innerText = 'Light';
              break;
            case 'DoorSensor':
              option.innerText = 'Door Sensor';
              break;
            case 'MotionSensor':
              option.innerText = 'Motion Sensor';
              break;
            case 'LeakSensor':
              option.innerText = 'Leak Sensor';
              break;
            case 'PushButton':
              option.innerText = 'Push Button';
              break;
            case 'VideoCamera':
              option.innerText = 'Video Camera';
              break;
            case 'Camera':
              option.innerText = 'Camera';
              break;
            case 'TemperatureSensor':
              option.innerText = 'Temperature Sensor';
              break;
            case 'Alarm':
              option.innerText = 'Alarm';
              break;
            case 'Custom':
              option.innerText = 'Custom Thing';
              break;
            default:
              option.innerText = capability;
              break;
          }

          this.thingType.appendChild(option);
        }

        this.editContent.classList.remove('hidden');
        break;
      }
      case 'remove':
        this.removeContent.classList.remove('hidden');
        break;
    }
  },

  /**
   * Hide Context Menu.
   */
  hide: function() {
    this.element.classList.add('hidden');
    this.headingIcon.classList.remove('hidden');
    this.headingCustomIcon.classList.add('hidden');
    this.headingText.textContent = '';
    this.thingId = '';
  },

  handleTypeChange: function() {
    const capability =
      this.thingType.options[this.thingType.selectedIndex].value;

    this.customIconLabel.classList.add('hidden');
    this.customIcon.classList.add('hidden');

    let image = '';
    if (capability === 'Custom') {
      this.customIconLabel.classList.remove('hidden');
      this.customIcon.classList.remove('hidden');
    } else if (Icons.capabilityHasIcon(capability)) {
      image = Icons.capabilityToIcon(capability);
    }

    if (image) {
      this.thingIcon.classList.remove('custom-thing');
      this.thingIcon.style.backgroundImage = `url("${image}")`;
    } else {
      this.thingIcon.classList.add('custom-thing');
      this.thingIcon.style.backgroundImage = '';
    }
  },

  handleIconUpload: function() {
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
  },

  /**
   * Handle click on edit option.
   */
  handleEdit: function() {
    this.thingType.disabled = true;
    this.nameInput.disabled = true;
    this.saveButton.disabled = true;
    this.customIconInput.disabled = true;

    const name = this.nameInput.value.trim();
    if (name.length === 0) {
      return;
    }

    let capability;
    if (this.thingType.options.length > 0) {
      capability = this.thingType.options[this.thingType.selectedIndex].value;
    }

    const body = {name, selectedCapability: capability};

    if (capability === 'Custom' && this.iconData) {
      body.iconData = this.iconData;
    }
    App.gatewayModel.updateThing(this.thingId, body).then(() => {
      this.hide();
      this.saveButton.disabled = false;
    }).catch((error) => {
      console.error(`Error updating thing: ${error}`);
      this.label.innerText = 'Failed to save.';
      this.label.classList.add('error');
      this.label.classList.remove('hidden');
      this.thingType.disabled = false;
      this.nameInput.disabled = false;
      this.saveButton.disabled = false;
      this.customIconInput.disabled = false;
    });
  },

  /**
   * Handle click on remove option.
   */
  handleRemove: function() {
    App.gatewayModel.removeThing(this.thingId).then(() => {
      page('/things');
      this.hide();
    }).catch((error) => {
      console.error(`Error removing thing: ${error}`);
      this.hide();
    });
  },
};

module.exports = ContextMenu;
