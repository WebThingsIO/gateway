/**
 * InstalledAddon.
 *
 * Represents an existing, installed add-on.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

/**
 * InstalledAddon constructor.
 *
 * @param {Object} metadata InstalledAddon metadata object.
 * @param {Object} addonsMap Handle to the installedAddons map from
 *                 SettingsScreen.
 * @param {String} updateUrl URL for updated add-on package
 * @param {String} updateVersion Version of updated add-on package
 */
var InstalledAddon = function(metadata, addonsMap, updateUrl, updateVersion) {
  this.name = metadata.name;
  this.description = metadata.description;
  this.version = metadata.version;
  this.enabled = metadata.moziot.enabled;
  this.updateUrl = updateUrl;
  this.updateVersion = updateVersion;
  this.container = document.getElementById('installed-addons-list');
  this.addonsMap = addonsMap;
  this.render();
};

/**
 * HTML view for InstalledAddon.
 */
InstalledAddon.prototype.view = function() {
  let toggleButtonText, toggleButtonClass;
  if (this.enabled) {
    toggleButtonText = 'Disable';
    toggleButtonClass = 'addon-settings-disable';
  } else {
    toggleButtonText = 'Enable';
    toggleButtonClass = 'addon-settings-enable';
  }

  const updateButtonClass = this.updateUrl ? '' : 'hidden';

  return `
    <li id="addon-item-${this.name}" class="addon-item">
      <div class="addon-settings-header">
        <span class="addon-settings-name">${this.name}</span>
        <span class="addon-settings-version">${this.version}</span>
        <span class="addon-settings-description">${this.description}</span>
      </div>
      <div class="addon-settings-controls">
        <button id="addon-update-${this.name}"
          class="text-button addon-settings-update ${updateButtonClass}">
          Update
        </button>
        <button id="addon-remove-${this.name}"
          class="text-button addon-settings-remove">
          Remove
        </button>
        <button id="addon-toggle-${this.name}"
          class="text-button ${toggleButtonClass}">
          ${toggleButtonText}
        </button>
      </div>
    </li>`;
};

/**
 * Render InstalledAddon view and add to DOM.
 */
InstalledAddon.prototype.render = function() {
  this.container.insertAdjacentHTML('beforeend', this.view());

  const updateButton = document.getElementById(`addon-update-${this.name}`);
  updateButton.addEventListener('click', this.handleUpdate.bind(this));

  const removeButton = document.getElementById(`addon-remove-${this.name}`);
  removeButton.addEventListener('click', this.handleRemove.bind(this));

  const toggleButton = document.getElementById(`addon-toggle-${this.name}`);
  toggleButton.addEventListener('click', this.handleToggle.bind(this));
};

/**
 * Handle a click on the update button.
 */
InstalledAddon.prototype.handleUpdate = function(e) {
  const controlDiv = e.target.parentNode;
  const versionDiv =
    document.querySelector(`#addon-item-${this.name} .addon-settings-version`);
  const updating = document.createElement('span');
  updating.classList.add('addon-updating');
  updating.innerText = 'Updating...';
  controlDiv.replaceChild(updating, e.target);

  window.API.updateAddon(this.name, this.updateUrl)
    .then(() => {
      versionDiv.innerText = this.updateVersion;
      updating.innerText = 'Updated';
    })
    .catch((err) => {
      console.error(`Failed to update add-on: ${this.name}\n${err}`);
      updating.innerText = 'Failed';
    });
};

/**
 * Handle a click on the remove button.
 */
InstalledAddon.prototype.handleRemove = function() {
  window.API.uninstallAddon(this.name)
    .then(() => {
      const el = document.getElementById(`addon-item-${this.name}`);
      el.parentNode.removeChild(el);
      this.addonsMap.delete(this.name);
    })
    .catch((e) => {
      console.error(`Failed to uninstall add-on: ${this.name}\n${e}`);
    });
};

/**
 * Handle a click on the enable/disable button.
 */
InstalledAddon.prototype.handleToggle = function(e) {
  const button = e.target;
  this.enabled = !this.enabled;
  window.API.setAddonSetting(this.name, this.enabled)
    .then(() => {
      if (this.enabled) {
        button.innerText = 'Disable';
        button.classList.remove('addon-settings-enable');
        button.classList.add('addon-settings-disable');
      } else {
        button.innerText = 'Enable';
        button.classList.remove('addon-settings-disable');
        button.classList.add('addon-settings-enable');
      }
    })
    .catch((err) => {
      console.error(`Failed to toggle add-on: ${this.name}\n${err}`);
    });
};
