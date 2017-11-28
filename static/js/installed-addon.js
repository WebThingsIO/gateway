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
 * @param Object description InstalledAddon metadata object.
 */
var InstalledAddon = function(metadata) {
  this.name = metadata.name;
  this.description = metadata.description;
  this.enabled = metadata.moziot.enabled;
  this.container = document.getElementById('installed-addons-list');
  this.render();
};

/**
 * HTML view for InstalledAddon.
 */
InstalledAddon.prototype.view = function() {
  let buttonText, buttonClass;
  if (this.enabled) {
    buttonText = 'Disable';
    buttonClass = 'addon-settings-disable';
  } else {
    buttonText = 'Enable';
    buttonClass = 'addon-settings-enable';
  }

  return `
    <li class="addon-item">
      <div class="addon-settings-header">
        <span class="addon-settings-name">${this.name}</span>
        <span class="addon-settings-description">${this.description}</span>
      </div>
      <div class="addon-settings-controls">
        <button id="addon-toggle-${this.name}"
          class="text-button ${buttonClass}">
          ${buttonText}
        </button>
      </div>
    </li>`;
};

/**
 * Render InstalledAddon view and add to DOM.
 */
InstalledAddon.prototype.render = function() {
  this.container.insertAdjacentHTML('beforeend', this.view());

  const button = document.getElementById(`addon-toggle-${this.name}`);
  button.addEventListener('click', this.handleToggle.bind(this));
}

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
