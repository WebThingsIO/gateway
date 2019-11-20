/**
 * BinarySensorCapability
 *
 * A bubble showing a binary sensor icon.
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

    .webthing-binary-sensor-capability-icon {
      width: 12.4rem;
      height: 12.4rem;
      border-radius: 6.4rem;
      border: 0.2rem solid white;
      transform: translate(0);
      background-color: #89b6d6;
    }

    .webthing-binary-sensor-capability-icon.on {
      background-color: white;
    }

    .webthing-binary-sensor-capability-label {
      font-weight: bold;
      text-transform: uppercase;
      padding-top: 5.2rem;
    }

    .webthing-binary-sensor-capability-icon.on
    .webthing-binary-sensor-capability-label {
      color: #5d9bc7;
    }
  </style>
  <div id="icon" class="webthing-binary-sensor-capability-icon">
    <div id="label" class="webthing-binary-sensor-capability-label">--</div>
  </div>
`;

class BinarySensorCapability extends BaseComponent {
  constructor() {
    super(template);

    this._icon = this.shadowRoot.querySelector('#icon');
    this._label = this.shadowRoot.querySelector('#label');

    this._on = false;
  }

  connectedCallback() {
    this.on = typeof this.dataset.on !== 'undefined' ? this.dataset.on : null;
  }

  get on() {
    return this._icon.classList.contains('on');
  }

  set on(value) {
    this._on = Boolean(value);

    if (value === null) {
      this._icon.classList.remove('on');
      this._label.innerText = fluent.getMessage('ellipsis');
    } else if (this._on) {
      this._icon.classList.add('on');
      this._label.innerText = fluent.getMessage('active');
    } else {
      this._icon.classList.remove('on');
      this._label.innerText = fluent.getMessage('inactive');
    }
  }
}

window.customElements.define('webthing-binary-sensor-capability',
                             BinarySensorCapability);
module.exports = BinarySensorCapability;
