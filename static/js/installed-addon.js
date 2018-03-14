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

/* globals Utils */

/**
 * InstalledAddon constructor.
 *
 * @param {Object} metadata InstalledAddon metadata object.
 * @param {Object} addonsMap Handle to the installedAddons map from
 *                 SettingsScreen.
 * @param {String} updateUrl URL for updated add-on package
 * @param {String} updateVersion Version of updated add-on package
 * @param {String} updateChecksum Checksum of the updated add-on package
 */
var InstalledAddon = function(metadata, addonsMap, updateUrl, updateVersion,
                              updateChecksum) {
  this.name = metadata.name;
  this.description = metadata.description;
  this.author = metadata.author;
  this.homepage = metadata.homepage;
  this.version = metadata.version;
  this.enabled = metadata.moziot.enabled;
  this.updateUrl = updateUrl;
  this.updateVersion = updateVersion;
  this.updateChecksum = updateChecksum;
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
    <li id="addon-item-${Utils.escapeHtml(this.name)}" class="addon-item">
      <div class="addon-settings-header">
        <span class="addon-settings-name">
          ${Utils.escapeHtml(this.name)}
        </span>
        <span class="addon-settings-version">
          ${Utils.escapeHtml(this.version)}
        </span>
        <span class="addon-settings-description">
          ${Utils.escapeHtml(this.description)}
        </span>
        <span class="addon-settings-author">
          by <a href="${this.homepage}" target="_blank" rel="noopener">
            ${Utils.escapeHtml(this.author)}
          </a>
        </span>
      </div>
      <div class="addon-settings-controls">
        <button id="addon-update-${Utils.escapeHtml(this.name)}"
          class="text-button addon-settings-update ${updateButtonClass}">
          Update
        </button>
        <button id="addon-remove-${Utils.escapeHtml(this.name)}"
          class="text-button addon-settings-remove">
          Remove
        </button>
        <button id="addon-toggle-${Utils.escapeHtml(this.name)}"
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

  const updateButton = document.getElementById(
    `addon-update-${Utils.escapeHtml(this.name)}`);
  updateButton.addEventListener('click', this.handleUpdate.bind(this));

  const removeButton = document.getElementById(
    `addon-remove-${Utils.escapeHtml(this.name)}`);
  removeButton.addEventListener('click', this.handleRemove.bind(this));

  const toggleButton = document.getElementById(
    `addon-toggle-${Utils.escapeHtml(this.name)}`);
  toggleButton.addEventListener('click', this.handleToggle.bind(this));
};

/**
 * Handle a click on the update button.
 */
InstalledAddon.prototype.handleUpdate = function(e) {
  const controlDiv = e.target.parentNode;
  const versionDiv = document.querySelector(
    `#addon-item-${Utils.escapeHtml(this.name)} .addon-settings-version`);
  const updating = document.createElement('span');
  updating.classList.add('addon-updating');
  updating.innerText = 'Updating...';
  controlDiv.replaceChild(updating, e.target);

  window.API.updateAddon(this.name, this.updateUrl, this.updateChecksum)
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
      const el = document.getElementById(
        `addon-item-${Utils.escapeHtml(this.name)}`);
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
