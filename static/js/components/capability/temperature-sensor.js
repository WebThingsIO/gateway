/**
 * TemperatureSensorCapability
 *
 * A bubble showing a temperature sensor icon.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const BaseComponent = require('../base-component');
const Units = require('../../units');

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

    .webthing-temperature-sensor-capability-icon {
      width: 12.4rem;
      height: 12.4rem;
      border-radius: 6.4rem;
      border: 0.2rem solid white;
      background-size: 6.4rem;
      background-repeat: no-repeat;
      transform: translate(0);
      background-color: #89b6d6;
      background-image: url('/optimized-images/component-icons/temperature-sensor.svg');
      background-position: center 2rem;
    }

    .webthing-temperature-sensor-capability-label {
      font-weight: bold;
      text-transform: uppercase;
      padding-top: 8.75rem;
    }
  </style>
  <div id="icon" class="webthing-temperature-sensor-capability-icon">
    <div id="label" class="webthing-temperature-sensor-capability-label">--</div>
  </div>
`;

class TemperatureSensorCapability extends BaseComponent {
  constructor() {
    super(template);

    this._icon = this.shadowRoot.querySelector('#icon');
    this._label = this.shadowRoot.querySelector('#label');

    this._temperature = 0;
    this._precision = 0;
    this._unit = '';
  }

  connectedCallback() {
    this.unit =
      typeof this.dataset.unit !== 'undefined' ?
        this.dataset.unit :
        Units.nameToAbbreviation('degree celsius');

    this.precision =
      typeof this.dataset.precision !== 'undefined' ?
        this.dataset.precision :
        0;

    this.temperature =
      typeof this.dataset.temperature !== 'undefined' ?
        this.dataset.temperature :
        0;
  }

  get unit() {
    return this._unit;
  }

  set unit(value) {
    this._unit = value;
  }

  get precision() {
    return this._precision;
  }

  set precision(value) {
    this._precision = parseInt(value, 10);
  }

  get temperature() {
    return this._temperature;
  }

  set temperature(value) {
    this._temperature = Number(value);
    this._label.innerHTML =
      `${this._temperature.toFixed(this.precision)}${this.unit}`;
  }
}

window.customElements.define('webthing-temperature-sensor-capability',
                             TemperatureSensorCapability);
module.exports = TemperatureSensorCapability;
