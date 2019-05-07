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

const API = require('../api');
const Utils = require('../utils');
const page = require('page');

class InstalledAddon {
  /**
   * InstalledAddon constructor.
   *
   * @param {Object} metadata InstalledAddon metadata object.
   * @param {Object} installedAddonsMap Handle to the installedAddons map from
   *                 SettingsScreen.
   * @param {Object} availableAddonsMap Handle to the availableAddons map from
   *                 SettingsScreen.
   */
  constructor(metadata, installedAddonsMap, availableAddonsMap) {
    this.name = metadata.name;
    this.displayName = metadata.display_name;
    this.description = metadata.description;
    if (typeof metadata.author === 'object') {
      this.author = metadata.author.name;
    } else if (typeof metadata.author === 'string') {
      this.author = metadata.author.split('<')[0].trim();
    } else {
      this.author = 'Unknown';
    }
    this.homepage = metadata.homepage;
    this.license =
      `/addons/${encodeURIComponent(this.name)}/license?jwt=${API.jwt}`;
    this.version = metadata.version;
    this.enabled = metadata.moziot.enabled;
    this.config = metadata.moziot.config;
    this.schema = metadata.moziot.schema;
    this.updateUrl = null;
    this.updateVersion = null;
    this.updateChecksum = null;
    this.container = document.getElementById('installed-addons-list');
    this.installedAddonsMap = installedAddonsMap;
    this.availableAddonsMap = availableAddonsMap;
    this.render();
  }

  /**
   * HTML view for InstalledAddon.
   */
  view() {
    let toggleButtonText, toggleButtonClass;
    if (this.enabled) {
      toggleButtonText = 'Disable';
      toggleButtonClass = 'addon-settings-disable';
    } else {
      toggleButtonText = 'Enable';
      toggleButtonClass = 'addon-settings-enable';
    }

    const configButtonClass = this.schema ? '' : 'hidden';

    const name = this.displayName || this.name;

    return `
      <li id="addon-item-${Utils.escapeHtmlForIdClass(this.name)}"
        class="addon-item">
        <div class="addon-settings-header">
          <span class="addon-settings-name">
            ${Utils.escapeHtml(name)}
          </span>
          <span class="addon-settings-version">
            ${Utils.escapeHtml(this.version)}
          </span>
          <span class="addon-settings-description">
            ${Utils.escapeHtml(this.description)}
          </span>
          <span class="addon-settings-author">
            by <a href="${this.homepage}" target="_blank" rel="noopener">${Utils.escapeHtml(this.author)}</a>
          </span>
          <span class="addon-settings-license">
            (<a href="${this.license}" target="_blank" rel="noopener">license</a>)
          </span>
        </div>
        <div class="addon-settings-controls">
          <button id="addon-config-${Utils.escapeHtmlForIdClass(this.name)}"
            class="text-button addon-settings-config ${configButtonClass}">
            Configure
          </button>
          <button id="addon-update-${Utils.escapeHtmlForIdClass(this.name)}"
            class="text-button addon-settings-update hidden">
            Update
          </button>
          <span class="addon-settings-spacer"></span>
          <button id="addon-remove-${Utils.escapeHtmlForIdClass(this.name)}"
            class="text-button addon-settings-remove">
            Remove
          </button>
          <button id="addon-toggle-${Utils.escapeHtmlForIdClass(this.name)}"
            class="text-button ${toggleButtonClass}">
            ${toggleButtonText}
          </button>
        </div>
      </li>`;
  }

  /**
   * Render InstalledAddon view and add to DOM.
   */
  render() {
    this.container.insertAdjacentHTML('beforeend', this.view());

    const configButton = document.getElementById(
      `addon-config-${Utils.escapeHtmlForIdClass(this.name)}`);
    configButton.addEventListener('click', this.handleConfig.bind(this));

    const updateButton = document.getElementById(
      `addon-update-${Utils.escapeHtmlForIdClass(this.name)}`);
    updateButton.addEventListener('click', this.handleUpdate.bind(this));

    const removeButton = document.getElementById(
      `addon-remove-${Utils.escapeHtmlForIdClass(this.name)}`);
    removeButton.addEventListener('click', this.handleRemove.bind(this));

    const toggleButton = document.getElementById(
      `addon-toggle-${Utils.escapeHtmlForIdClass(this.name)}`);
    toggleButton.addEventListener('click', this.handleToggle.bind(this));
  }

  /**
   * Update the view to indicate that an update is available.
   *
   * @param {string} url - URL for updated add-on package
   * @param {string} version - Version of updated add-on package
   * @param {string} checksum - Checksum of the updated add-on package
   */
  setUpdateAvailable(url, version, checksum) {
    this.updateUrl = url;
    this.updateVersion = version;
    this.updateChecksum = checksum;

    const button = document.getElementById(
      `addon-update-${Utils.escapeHtmlForIdClass(this.name)}`);
    button.classList.remove('hidden');
  }

  /**
   * Handle a click on the config button.
   */
  handleConfig() {
    page(`/settings/addons/config/${this.name}`);
  }

  /**
   * Handle a click on the update button.
   */
  handleUpdate(e) {
    const controlDiv = e.target.parentNode;
    const versionDiv = document.querySelector(
      `#addon-item-${Utils.escapeHtmlForIdClass(this.name)} ` +
      '.addon-settings-version');
    const updating = document.createElement('span');
    updating.classList.add('addon-updating');
    updating.innerText = 'Updating...';
    controlDiv.replaceChild(updating, e.target);

    API.updateAddon(this.name, this.updateUrl, this.updateChecksum)
      .then(() => {
        this.version = this.updateVersion;
        const addon = this.installedAddonsMap.get(this.name);
        addon.version = this.version;
        versionDiv.innerText = this.version;
        updating.innerText = 'Updated';
      })
      .catch((err) => {
        console.error(`Failed to update add-on: ${this.name}\n${err}`);
        updating.innerText = 'Failed';
      });
  }

  /**
   * Handle a click on the remove button.
   */
  handleRemove() {
    API.uninstallAddon(this.name)
      .then(() => {
        const el = document.getElementById(
          `addon-item-${Utils.escapeHtmlForIdClass(this.name)}`);
        el.parentNode.removeChild(el);
        this.installedAddonsMap.delete(this.name);
        const addon = this.availableAddonsMap.get(this.name);
        if (addon) {
          addon.installed = false;
        }
      })
      .catch((e) => {
        console.error(`Failed to uninstall add-on: ${this.name}\n${e}`);
      });
  }

  /**
   * Handle a click on the enable/disable button.
   */
  handleToggle(e) {
    const button = e.target;
    const enabled = !this.enabled;
    API.setAddonSetting(this.name, enabled)
      .then(() => {
        this.enabled = enabled;
        const addon = this.installedAddonsMap.get(this.name);
        addon.moziot.enabled = enabled;
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
  }
}

module.exports = InstalledAddon;
