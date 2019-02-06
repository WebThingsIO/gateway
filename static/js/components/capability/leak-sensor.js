/**
 * LeakSensorCapability
 *
 * A bubble showing a leak sensor icon.
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

    .webthing-leak-sensor-capability-icon {
      width: 12.4rem;
      height: 12.4rem;
      border-radius: 6.4rem;
      border: 0.2rem solid white;
      background-size: 6.4rem;
      background-repeat: no-repeat;
      transform: translate(0);
      background-color: #89b6d6;
      background-image: url('/optimized-images/component-icons/leak-sensor-dry.svg');
      background-position: center 2rem;
    }

    .webthing-leak-sensor-capability-icon.leak {
      background-color: white;
      background-image: url('/optimized-images/component-icons/leak-sensor-leak.svg');
    }

    .webthing-leak-sensor-capability-label {
      font-weight: bold;
      text-transform: uppercase;
      padding-top: 8.75rem;
      font-size: 1.2rem;
    }

    .webthing-leak-sensor-capability-icon.leak
    .webthing-leak-sensor-capability-label {
      color: #5d9bc7;
      font-size: 1.4rem;
    }
  </style>
  <div id="icon" class="webthing-leak-sensor-capability-icon">
    <div id="label" class="webthing-leak-sensor-capability-label">--</div>
  </div>
`;

class LeakSensorCapability extends BaseComponent {
  constructor() {
    super(template);

    this._icon = this.shadowRoot.querySelector('#icon');
    this._label = this.shadowRoot.querySelector('#label');

    this._leak = false;
  }

  connectedCallback() {
    this.leak =
      typeof this.dataset.leak !== 'undefined' ? this.dataset.leak : null;
  }

  get leak() {
    return this._leak;
  }

  set leak(value) {
    this._leak = Boolean(value);

    if (value === null) {
      this._icon.classList.remove('leak');
      this._label.innerText = '...';
    } else if (this._leak) {
      this._icon.classList.add('leak');
      this._label.innerText = 'LEAK';
    } else {
      this._icon.classList.remove('leak');
      this._label.innerText = 'DRY';
    }
  }
}

window.customElements.define('webthing-leak-sensor-capability',
                             LeakSensorCapability);
module.exports = LeakSensorCapability;
