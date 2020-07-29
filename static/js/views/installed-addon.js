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
const fluent = require('../fluent');
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
    this.id = metadata.id;
    this.name = metadata.name;
    this.description = metadata.description;
    this.author = metadata.author;
    this.homepageUrl = metadata.homepage_url;
    this.licenseUrl =
      `/addons/${encodeURIComponent(this.id)}/license?jwt=${API.jwt}`;
    this.version = metadata.version;
    this.primaryType = metadata.primary_type;
    this.enabled = metadata.enabled;
    this.schema = metadata.schema;
    this.metadata = metadata;
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
      toggleButtonText = fluent.getMessage('disable');
      toggleButtonClass = 'addon-settings-disable';
    } else {
      toggleButtonText = fluent.getMessage('enable');
      toggleButtonClass = 'addon-settings-enable';
    }

    const configButtonClass = this.schema ? '' : 'hidden';

    const name = this.name || this.id;

    return `
      <li id="addon-item-${Utils.escapeHtmlForIdClass(this.id)}"
        class="addon-item">
        <div class="addon-settings-header ${Utils.escapeHtmlForIdClass(this.primaryType)}">
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
            ${fluent.getMessage('by')} <a href="${this.homepageUrl}" target="_blank" rel="noopener">${Utils.escapeHtml(this.author)}</a>
          </span>
          <span id="addon-license-${Utils.escapeHtmlForIdClass(this.id)}" class="addon-settings-license" 
            data-license-href="${this.licenseUrl}" data-id="${Utils.escapeHtmlForIdClass(this.id)}">
            (${fluent.getMessage('license')})
          </span>
        </div>
        <div class="addon-settings-controls">
          <button id="addon-config-${Utils.escapeHtmlForIdClass(this.id)}"
            class="text-button addon-settings-config ${configButtonClass}"
            data-l10n-id="addon-configure">
          </button>
          <button id="addon-update-${Utils.escapeHtmlForIdClass(this.id)}"
            class="text-button addon-settings-update hidden"
            data-l10n-id="addon-update">
          </button>
          <span class="addon-settings-spacer"></span>
          <button id="addon-remove-${Utils.escapeHtmlForIdClass(this.id)}"
            class="text-button addon-settings-remove"
            data-l10n-id="addon-remove">
          </button>
          <button id="addon-toggle-${Utils.escapeHtmlForIdClass(this.id)}"
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
      `addon-config-${Utils.escapeHtmlForIdClass(this.id)}`);
    configButton.addEventListener('click', this.handleConfig.bind(this));

    const updateButton = document.getElementById(
      `addon-update-${Utils.escapeHtmlForIdClass(this.id)}`);
    updateButton.addEventListener('click', this.handleUpdate.bind(this));

    const removeButton = document.getElementById(
      `addon-remove-${Utils.escapeHtmlForIdClass(this.id)}`);
    removeButton.addEventListener('click', this.handleRemove.bind(this));

    const toggleButton = document.getElementById(
      `addon-toggle-${Utils.escapeHtmlForIdClass(this.id)}`);
    toggleButton.addEventListener('click', this.handleToggle.bind(this));

    const licenseButton = document.getElementById(
      `addon-license-${Utils.escapeHtmlForIdClass(this.id)}`);
    licenseButton.addEventListener('click', this.handleLicense.bind(this));
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
      `addon-update-${Utils.escapeHtmlForIdClass(this.id)}`);
    button.classList.remove('hidden');
  }

  /**
   * Handle a click on the config button.
   */
  handleConfig() {
    page(`/settings/addons/config/${this.id}`);
  }

  /**
   * Handle a click on the update button.
   */
  handleUpdate(e) {
    const controlDiv = e.target.parentNode;
    const versionDiv = document.querySelector(
      `#addon-item-${Utils.escapeHtmlForIdClass(this.id)} ` +
      '.addon-settings-version');
    const updating = document.createElement('span');
    updating.classList.add('addon-updating');
    updating.innerText = fluent.getMessage('addon-updating');
    controlDiv.replaceChild(updating, e.target);

    API.updateAddon(this.id, this.updateUrl, this.updateChecksum)
      .then((settings) => {
        this.version = this.updateVersion;
        const addon = this.installedAddonsMap.get(this.id);
        addon.version = this.version;
        versionDiv.innerText = this.version;
        updating.innerText = fluent.getMessage('addon-updated');

        // If this add-on is a UI extension, reload the page to pick up the
        // changes
        if (settings.content_scripts && settings.content_scripts.length > 0 &&
            settings.enabled) {
          window.location.reload();
        }
      })
      .catch((err) => {
        console.error(`Failed to update add-on: ${this.id}\n${err}`);
        updating.innerText = fluent.getMessage('addon-update-failed');
      });
  }

  /**
   * Handle a click on the remove button.
   */
  handleRemove(e) {
    const button = e.target;
    button.disabled = true;

    API.uninstallAddon(this.id)
      .then(() => {
        const el = document.getElementById(
          `addon-item-${Utils.escapeHtmlForIdClass(this.id)}`);
        el.parentNode.removeChild(el);
        this.installedAddonsMap.delete(this.id);
        const addon = this.availableAddonsMap.get(this.id);
        if (addon) {
          addon.installed = false;
        }

        // If this add-on is a UI extension, reload the page to pick up the
        // changes
        if (this.metadata.content_scripts &&
            this.metadata.content_scripts.length > 0 &&
            this.enabled) {
          window.location.reload();
        }
      })
      .catch((e) => {
        console.error(`Failed to uninstall add-on: ${this.id}\n${e}`);
        button.disabled = false;
      });
  }

  /**
   * Handle a click on the enable/disable button.
   */
  handleToggle(e) {
    const button = e.target;
    const enabled = !this.enabled;
    button.disabled = true;

    API.setAddonSetting(this.id, enabled)
      .then(() => {
        this.enabled = enabled;
        const addon = this.installedAddonsMap.get(this.id);
        addon.enabled = enabled;

        if (this.enabled) {
          button.innerText = fluent.getMessage('disable');
          button.classList.remove('addon-settings-enable');
          button.classList.add('addon-settings-disable');
        } else {
          button.innerText = fluent.getMessage('enable');
          button.classList.remove('addon-settings-disable');
          button.classList.add('addon-settings-enable');
        }

        button.disabled = false;
      })
      .catch((err) => {
        console.error(`Failed to toggle add-on: ${this.id}\n${err}`);
        button.disabled = false;
      });
  }

  /**
   * Handle a click on the license button.
   */
  handleLicense(e) {
    if (e.target.dataset.id) {
      API.getAddonsInfo().then((data) => {
        const licenseUrl = `${data.urls[0]}/license/${e.target.dataset.id}`;
        let modal = document.getElementById('media-modal');
        if (modal == null) {
          const modalContainer = document.createElement('div');
          modalContainer.className = 'media-modal';
          modalContainer.id = 'media-modal';
          const modalFrame = document.createElement('div');
          modalFrame.className = 'media-modal-frame';
          const content = `<div class="media-modal-close" 
            id="modal-close-button"></div>
            <div class="media-modal-content">
            <p id="media-modal-text"></p></div>`;
          modalFrame.innerHTML = content;
          modalContainer.appendChild(modalFrame);
          document.body.appendChild(modalContainer);
          const modalCloseBtn = document.getElementById('modal-close-button');
          modalCloseBtn.addEventListener(
            'click',
            () => {
              modal = document.getElementById('media-modal');
              modal.parentNode.removeChild(modal);
            }
          );
          fetch(licenseUrl)
            .then((response) => {
              return response.text();
            })
            .then((data) => {
              document.getElementById('media-modal-text').innerText = data;
            })
            .catch(() => {
              document.getElementById('media-modal-text').innerText =
                fluent.getMessage('failed-read-file');
            });
        }
      });
    }
  }

}

module.exports = InstalledAddon;
