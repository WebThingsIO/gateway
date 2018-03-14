/**
 * DiscoveredAddon.
 *
 * Represents an add-on available to be installed.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

/* globals Utils */

/**
 * DiscoveredAddon constructor.
 *
 * @param Object description DiscoveredAddon metadata object.
 */
var DiscoveredAddon = function(metadata) {
  this.name = metadata.name;
  this.displayName = metadata.displayName;
  this.description = metadata.description;
  this.author = metadata.author;
  this.homepage = metadata.homepage;
  this.version = metadata.version;
  this.url = metadata.url;
  this.checksum = metadata.checksum;
  this.installed = metadata.installed;
  this.container = document.getElementById('discovered-addons-list');
  this.render();
};

/**
 * HTML view for DiscoveredAddon.
 */
DiscoveredAddon.prototype.view = function() {
  let el;
  if (this.installed) {
    el = '<span class="addon-discovery-settings-added">Added</span>';
  } else {
    el = `
      <button id="addon-install-${Utils.escapeHtml(this.name)}"
        class="text-button addon-discovery-settings-add">
        Add
      </button>`;
  }

  return `
    <li class="discovered-addon-item">
      <div class="addon-settings-header">
        <span class="addon-settings-name">
          ${Utils.escapeHtml(this.displayName)}
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
        ${el}
      </div>
    </li>`;
};

/**
 * Render DiscoveredAddon view and add to DOM.
 */
DiscoveredAddon.prototype.render = function() {
  this.container.insertAdjacentHTML('beforeend', this.view());

  if (!this.installed) {
    const button = document.getElementById(
      `addon-install-${Utils.escapeHtml(this.name)}`);
    button.addEventListener('click', this.handleInstall.bind(this));
  }
};

/**
 * Handle a click on the install button.
 */
DiscoveredAddon.prototype.handleInstall = function(e) {
  const controlDiv = e.target.parentNode;
  const installing =
    '<span class="addon-discovery-settings-installing">Installing...</span>';
  controlDiv.innerHTML = installing;

  window.API.installAddon(this.name, this.url, this.checksum)
    .then(() => {
      const el = '<span class="addon-discovery-settings-added">Added</span>';
      controlDiv.innerHTML = el;
    })
    .catch((err) => {
      console.error(`Failed to install add-on: ${this.name}\n${err}`);
      const el =
        '<span class="addon-discovery-settings-install-failed">Failed</span>';
      controlDiv.innerHTML = el;
    });
};
