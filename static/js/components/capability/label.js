/**
 * LabelCapability
 *
 * A bubble showing an icon with a label.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const BaseComponent = require('../base-component');

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

    .webthing-label-capability-container {
      box-sizing: border-box;
      width: 12.8rem;
      height: 12.8rem;
      border-radius: 6.4rem;
      border: 0.2rem solid white;
      transform: translate(0);
      background-color: #89b6d6;
    }

    .webthing-label-capability-contents {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 2.8rem;
      font-weight: bold;
      width: 12.8rem;
    }
  </style>
  <div id="container" class="webthing-label-capability-container">
    <div id="contents" class="webthing-label-capability-contents">
      <span id="value" class="webthing-label-capability-value">
      </span><span id="unit" class="webthing-label-capability-unit"></span>
    </div>
  </div>
`;

class LabelCapability extends BaseComponent {
  constructor() {
    super(template);

    this._value = this.shadowRoot.querySelector(
      '.webthing-label-capability-value');
    this._unit = this.shadowRoot.querySelector(
      '.webthing-label-capability-unit');
    this._precision = 0;
    this._level = 0;
  }

  connectedCallback() {
    if (!this.level) {
      this.level =
        typeof this.dataset.level !== 'undefined' ? this.dataset.level : 0;
    }

    if (!this.unit) {
      this.unit =
        typeof this.dataset.unit !== 'undefined' ? this.dataset.unit : '';
    }

    if (!this.precision) {
      this.precision =
        typeof this.dataset.precision !== 'undefined' ?
          this.dataset.precision :
          0;
    }
  }

  get level() {
    return this._level;
  }

  set level(value) {
    this._level = Number(value);
    this._value.innerText = this._level.toFixed(this.precision);
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
}

window.customElements.define('webthing-label-capability', LabelCapability);
module.exports = LabelCapability;
