/**
 * Thermostat
 *
 * A bubble showing a thermostat temperature and mode.
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

    .webthing-thermostat-capability-container {
      box-sizing: border-box;
      width: 12.8rem;
      height: 12.8rem;
      border-radius: 6.4rem;
      border: 0.2rem solid white;
      transform: translate(0);
      background-color: #89b6d6;
    }

    .webthing-thermostat-capability-state-icon {
      position: absolute;
      top: 1rem;
      left: 50%;
      transform: translateX(-50%);
      width: 3rem;
      height: 3rem;
      background-size: 3rem;
      background-repeat: no-repeat;
      background-position: center;
    }

    .webthing-thermostat-capability-state-icon.off {
      /* no icon */
    }

    .webthing-thermostat-capability-state-icon.heating {
      background-image: url('/optimized-images/component-icons/thermostat-heating.svg');
    }

    .webthing-thermostat-capability-state-icon.cooling {
      background-image: url('/optimized-images/component-icons/thermostat-cooling.svg');
    }

    .webthing-thermostat-capability-contents {
      position: absolute;
      top: calc(50% + 1rem);
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 4rem;
      font-weight: bold;
      width: 12.8rem;
    }

    .webthing-thermostat-capability-unit {
      font-size: 1.6rem;
      font-weight: normal;
      position: relative;
      top: -1.6rem;
    }
  </style>
  <div id="container" class="webthing-thermostat-capability-container">
    <div id="state-icon" class="webthing-thermostat-capability-state-icon off"></div>
    <div id="contents" class="webthing-thermostat-capability-contents">
      <span id="value" class="webthing-thermostat-capability-value">
      </span><span id="unit" class="webthing-thermostat-capability-unit"></span>
    </div>
  </div>
`;

class ThermostatCapability extends BaseComponent {
  constructor() {
    super(template);

    this._value = this.shadowRoot.querySelector('#value');
    this._unit = this.shadowRoot.querySelector('#unit');
    this._stateIcon = this.shadowRoot.querySelector('#state-icon');

    this._temperature = 0;
    this._precision = 0;
    this._state = 'off';
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

    this.state =
      typeof this.dataset.state !== 'undefined' ? this.dataset.state : 'off';
  }

  get unit() {
    return this._unit.innerText;
  }

  set unit(value) {
    this._unit.innerText = value;
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
    this._value.innerHTML = `${this._temperature.toFixed(this.precision)}`;
  }

  get state() {
    return this._state;
  }

  set state(value) {
    if (!['off', 'heating', 'cooling'].includes(value)) {
      value = 'off';
    }

    this._state = value;

    this._stateIcon.classList.remove('off', 'heating', 'cooling');
    this._stateIcon.classList.add(value);
  }
}

window.customElements.define('webthing-thermostat-capability',
                             ThermostatCapability);
module.exports = ThermostatCapability;
