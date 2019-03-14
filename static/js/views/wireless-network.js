/**
 * WirelessNetwork.
 *
 * Represents an available wireless network.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const Utils = require('../utils');
const page = require('page');

class WirelessNetwork {
  /**
   * WirelessNetwork constructor.
   *
   * @param {Object} network - Network object
   */
  constructor(network) {
    this.ssid = network.ssid;
    this.encryption = network.encryption;
    this.quality = network.quality;
    this.configured = network.configured;
    this.connected = network.connected;
    this.container =
      document.getElementById('network-settings-wifi-network-list');

    this.render();
  }

  /**
   * HTML view for WirelessNetwork.
   */
  view() {
    let infoClass = '', connectedDiv = '';
    if (this.configured) {
      infoClass = 'configured';

      if (this.connected) {
        connectedDiv =
          `<div class="wireless-network-info-connected">Connected</div>`;
      } else {
        connectedDiv =
          `<div class="wireless-network-info-disconnected">Connected</div>`;
      }
    }

    const img =
      `/optimized-images/${this.encryption ? 'wifi-secure' : 'wifi'}.svg`;

    return `<li class="wireless-network-item">
        <div class="wireless-network-info ${infoClass}">
          <div class="wireless-network-info-ssid">
            ${Utils.escapeHtml(this.ssid)}
          </div>
          ${connectedDiv}
        </div>
        <img class="wireless-network-icon" src="${img}" alt="Wi-Fi Network">
      </li>`;
  }

  /**
   * Render WirelessNetwork view and add to DOM.
   */
  render() {
    const ul = document.createElement('ul');
    ul.innerHTML = this.view();
    const el = ul.firstChild;

    el.addEventListener('click', () => {
      document.getElementById('network-settings-wifi-ssid').value = this.ssid;
      page('/settings/network/wifi/configure');
    });

    this.container.appendChild(el);
  }
}

module.exports = WirelessNetwork;
