/**
 * LightCapability
 *
 * A bubble showing a light bulb icon.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const BaseComponent = require('../base-component');
const Utils = require('../../utils');

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

    .webthing-light-capability-container {
      box-sizing: border-box;
      width: 12.8rem;
      height: 12.8rem;
      border-radius: 6.4rem;
      border: 0.2rem solid white;
      transform: translate(0);
      background-color: #89b6d6;
    }

    .webthing-light-capability-container.on {
      background-color: white;
      color: #5d9bc7;
    }

    .webthing-light-capability-info {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .webthing-light-capability-icon {
      fill: white;
    }

    .webthing-light-capability-icon.bright {
      stroke: #666;
    }

    .webthing-light-capability-label {
      padding-top: 0.2rem;
      font-weight: bold;
    }
  </style>
  <div id="container" class="webthing-light-capability-container">
    <div id="info" class="webthing-light-capability-info">
      <svg id="icon" class="webthing-light-capability-icon"
        xmlns="http://www.w3.org/2000/svg" height="68" width="64">
        <g transform="translate(0,-987.36216)">
          <path
             d="m 41.6997,1041.6985 c 0,1.0723 -0.8727,1.9367 -1.9366,1.9367 l
             -15.5179,0 c -1.0722,0 -1.9366,-0.8727 -1.9366,-1.9367 0,-1.0722
             0.8727,-1.9366 1.9366,-1.9366 l 15.5179,0 c 1.0639,-0.01
             1.9366,0.8644 1.9366,1.9366 z m -1.9449,2.9091 -15.5096,0 c
             -1.28,0 -2.2608,1.2302 -1.8369,2.5683 0.2577,0.8063 1.0722,1.305
             1.92,1.305 l 0.033,0 c 1.1221,0 2.1444,0.6317 2.6431,1.6374 l
             0.017,0.041 c 0.6732,1.3465 2.053,2.2026 3.5657,2.2026 l 2.826,0 c
             1.5127,0 2.8925,-0.8561 3.5657,-2.2026 l 0.017,-0.041 c
             0.4987,-1.0057 1.5294,-1.6374 2.6432,-1.6374 l 0.033,0 c 0.8478,0
             1.6623,-0.4987 1.92,-1.305 0.4322,-1.3381 -0.5569,-2.5683
             -1.8369,-2.5683 z m 1.9449,-7.7631 c 0,1.0722 -0.8727,1.9366
             -1.9366,1.9366 l -15.5179,0 c -1.0722,0 -1.9366,-0.8727
             -1.9366,-1.9366 0,-1.0306 0.8062,-1.8701 1.8285,-1.9283
             -1.2135,-10.9132 -12.5008,-13.3403 -12.5008,-26.19 0,-11.24577
             9.118,-20.36377 20.3637,-20.36377 11.2457,0 20.3637,9.118
             20.3637,20.36377 0,12.8497 -11.2873,15.2768 -12.4925,26.19
             1.014,0.058 1.8285,0.8977 1.8285,1.9283 z" />
        </g>
      </svg>
      <div id="label" class="webthing-light-capability-label">OFF</div>
    </div>
  </div>
`;

const OFF_FILL = '#ffffff';
const ON_FILL = '#5d9bc7';

class LightCapability extends BaseComponent {
  constructor() {
    super(template);

    this._container = this.shadowRoot.querySelector('#container');
    this._icon = this.shadowRoot.querySelector('#icon');
    this._label = this.shadowRoot.querySelector('#label');

    this._haveBrightness = false;
    this._haveColor = false;
    this._haveColorTemperature = false;
    this._on = false;
    this._brightness = 0;
    this._color = OFF_FILL;
    this._colorTemperature = 2700;

    this._onClick = this.__onClick.bind(this);
  }

  connectedCallback() {
    this._haveBrightness =
      typeof this.dataset.haveBrightness !== 'undefined' ?
        this.dataset.haveBrightness === 'true' :
        false;
    this._haveColor =
      typeof this.dataset.haveColor !== 'undefined' ?
        this.dataset.haveColor === 'true' :
        false;
    this._haveColorTemperature =
      typeof this.dataset.haveColorTemperature !== 'undefined' ?
        this.dataset.haveColorTemperature === 'true' :
        false;
    this.on = typeof this.dataset.on !== 'undefined' ? this.dataset.on : false;
    this.brightness =
      typeof this.dataset.brightness !== 'undefined' ?
        this.dataset.brightness :
        false;
    this.color = this.dataset.color || OFF_FILL;
    this.colorTemperature =
      typeof this.dataset.colorTemperature !== 'undefined' ?
        this.dataset.colorTemperature :
        2700;
    this._container.addEventListener('click', this._onClick);
  }

  disconnectedCallback() {
    this._container.removeEventListener('click', this._onClick);
  }

  get on() {
    return this._on;
  }

  set on(value) {
    this._on = Boolean(value);

    if (this._on) {
      this._container.classList.add('on');
    } else {
      this._container.classList.remove('on');
    }

    if (this._haveBrightness) {
      this.brightness = this._brightness;
    } else if (this._on) {
      this._label.innerText = 'ON';
    } else {
      this._label.innerText = 'OFF';
    }

    if (this._haveColor) {
      this.color = this._color;
    } else if (this._haveColorTemperature) {
      this.colorTemperature = this._colorTemperature;
    } else if (this._on) {
      this._icon.style.fill = ON_FILL;
    } else {
      this._icon.style.fill = OFF_FILL;
    }
  }

  get brightness() {
    return this._brightness;
  }

  set brightness(value) {
    if (!this._haveBrightness) {
      return;
    }

    this._brightness = Number(value);

    if (this._on) {
      this._label.innerText = `${Math.round(this._brightness)}%`;
    } else {
      this._label.innerText = 'OFF';
    }
  }

  get color() {
    return this._color;
  }

  set color(value) {
    if (!this._haveColor) {
      return;
    }

    this._color = value;
    this._updateIconColor(value);
  }

  get colorTemperature() {
    return this._colorTemperature;
  }

  set colorTemperature(value) {
    if (!this._haveColorTemperature) {
      return;
    }

    this._colorTemperature = Number(value);
    this._updateIconColor(Utils.colorTemperatureToRGB(this._colorTemperature));
  }

  _updateIconColor(value) {
    this._icon.style.fill = value;

    const r = parseInt(value.substr(1, 2), 16);
    const g = parseInt(value.substr(3, 2), 16);
    const b = parseInt(value.substr(5, 2), 16);

    // From https://stackoverflow.com/questions/3942878
    if (r * 0.299 + g * 0.587 + b * 0.114 > 186) {
      this._icon.classList.add('bright');
    } else {
      this._icon.classList.remove('bright');
    }
  }

  __onClick(e) {
    e.preventDefault();
    e.stopPropagation();

    this.dispatchEvent(new CustomEvent('click', {
      bubbles: true,
    }));
  }
}

window.customElements.define('webthing-light-capability', LightCapability);
module.exports = LightCapability;
