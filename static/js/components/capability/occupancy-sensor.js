/**
 * OccupancySensorCapability
 *
 * A bubble showing an occupancy sensor icon.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const BaseComponent = require('../base-component');
const fluent = require('../../fluent');

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      contain: content;
      text-align: center;
      color: white;
      font-size: 1.6rem;
      cursor: default;
    }

    .webthing-occupancy-sensor-capability-icon {
      width: 12.4rem;
      height: 12.4rem;
      border-radius: 6.4rem;
      border: 0.2rem solid white;
      background-size: 6.4rem;
      background-repeat: no-repeat;
      transform: translate(0);
      background-color: #89b6d6;
      background-image: url('/images/component-icons/occupancy-sensor-unoccupied.svg');
      background-position: center 2rem;
    }

    .webthing-occupancy-sensor-capability-icon.occupied {
      background-color: white;
      background-image: url('/images/component-icons/occupancy-sensor-occupied.svg');
    }

    .webthing-occupancy-sensor-capability-label {
      font-weight: bold;
      text-transform: uppercase;
      padding-top: 8.75rem;
      font-size: 1.2rem;
    }

    .webthing-occupancy-sensor-capability-icon.occupied
    .webthing-occupancy-sensor-capability-label {
      color: #5d9bc7;
      font-size: 1.4rem;
    }
  </style>
  <div id="icon" class="webthing-occupancy-sensor-capability-icon">
    <div id="label" class="webthing-occupancy-sensor-capability-label">--</div>
  </div>
`;

class OccupancySensorCapability extends BaseComponent {
  constructor() {
    super(template);

    this._icon = this.shadowRoot.querySelector('#icon');
    this._label = this.shadowRoot.querySelector('#label');

    this._occupied = false;
  }

  connectedCallback() {
    this.occupied = typeof this.dataset.occupied !== 'undefined' ? this.dataset.occupied : null;
  }

  get occupied() {
    return this._occupied;
  }

  set occupied(value) {
    this._occupied = Boolean(value);

    if (value === null) {
      this._icon.classList.remove('occupied');
      this._label.innerText = fluent.getMessage('ellipsis');
    } else if (this._occupied) {
      this._icon.classList.add('occupied');
      this._label.innerText = fluent.getMessage('occupied');
    } else {
      this._icon.classList.remove('occupied');
      this._label.innerText = fluent.getMessage('unoccupied');
    }
  }
}

window.customElements.define('webthing-occupancy-sensor-capability', OccupancySensorCapability);
module.exports = OccupancySensorCapability;
