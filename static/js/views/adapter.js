/**
 * Adapter.
 *
 * Represents an individual adapter (e.g. Zigbee, Z-Wave, or Philips Hue).
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const Utils = require('../utils');

class Adapter {
  /**
   * Adapter constructor.
   *
   * @param Object description Adapter metadata object.
   */
  constructor(metadata) {
    this.name = metadata.name;
    this.id = metadata.id;
    this.ready = metadata.ready;
    this.container = document.getElementById('adapters-list');
    this.render();
  }

  /**
   * HTML view for Adapter.
   */
  view() {
    let buttonText, buttonClass;
    if (this.ready) {
      buttonText = 'Disable';
      buttonClass = 'adapter-settings-disable';
    } else {
      buttonText = 'Enable';
      buttonClass = 'adapter-settings-enable';
    }

    return `
      <li class="adapter-item">
        <div class="adapter-settings-header">
          <span class="adapter-settings-name">${Utils.escapeHtml(this.name)}
          </span>
          <span class="adapter-settings-description">${Utils.escapeHtml(this.id)}
          </span>
        </div>
        <div class="adapter-settings-controls">
          <!--button id="adapter-toggle-${Utils.escapeHtml(this.id)}"
            class="text-button ${buttonClass}"
            adapterEnabled="${Utils.escapeHtml(this.ready)}">
            ${buttonText}
          </button-->
        </div>
      </li>`;
  }

  /**
   * Render Adapter view and add to DOM.
   */
  render() {
    this.container.insertAdjacentHTML('beforeend', this.view());

    /*
    const button = document.getElementById(
      `adapter-toggle-${Utils.escapeHtml(this.id)}`);
    button.addEventListener('click', this.handleToggle.bind(this));
    */
  }

  /**
   * Handle a click on the enable/disable button.
   */
  handleToggle() {
  }
}

module.exports = Adapter;
