/**
 * SmokeSensorCapability
 *
 * A bubble showing a smoke sensor icon.
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

    .webthing-smoke-sensor-capability-icon {
      width: 12.4rem;
      height: 12.4rem;
      border-radius: 6.4rem;
      border: 0.2rem solid white;
      background-size: 6.4rem;
      background-repeat: no-repeat;
      transform: translate(0);
      background-color: #89b6d6;
      background-image: url('/images/component-icons/smoke-sensor-ok.svg');
      background-position: center 2.75rem;
    }

    .webthing-smoke-sensor-capability-icon.smoke {
      background-color: #ff5555;
      background-image: url('/images/component-icons/smoke-sensor-smoke.svg');
      border: 0.2rem solid #ff5555;
    }

    .webthing-smoke-sensor-capability-label {
      font-weight: bold;
      text-transform: uppercase;
      padding-top: 7rem;
      font-size: 1.4rem;
    }

    .webthing-smoke-sensor-capability-icon.smoke
    .webthing-smoke-sensor-capability-label {
      color: white;
      padding-top: 9.25rem;
    }
  </style>
  <div id="icon" class="webthing-smoke-sensor-capability-icon">
    <div id="label" class="webthing-smoke-sensor-capability-label">--</div>
  </div>
`;

class SmokeSensorCapability extends BaseComponent {
  constructor() {
    super(template);

    this._icon = this.shadowRoot.querySelector('#icon');
    this._label = this.shadowRoot.querySelector('#label');

    this._smoke = false;
  }

  connectedCallback() {
    this.smoke =
      typeof this.dataset.smoke !== 'undefined' ? this.dataset.smoke : null;
  }

  get smoke() {
    return this._smoke;
  }

  set smoke(value) {
    this._smoke = Boolean(value);

    if (value === null) {
      this._icon.classList.remove('smoke');
      this._label.innerText = fluent.getMessage('ellipsis');
    } else if (this._smoke) {
      this._icon.classList.add('smoke');
      this._label.innerText = fluent.getMessage('smoke');
    } else {
      this._icon.classList.remove('smoke');
      this._label.innerText = fluent.getMessage('ok');
    }
  }
}

window.customElements.define('webthing-smoke-sensor-capability',
                             SmokeSensorCapability);
module.exports = SmokeSensorCapability;
