/**
 * DoorSensorCapability
 *
 * A bubble showing a door sensor icon.
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

    .webthing-door-sensor-capability-icon {
      width: 12.4rem;
      height: 12.4rem;
      border-radius: 6.4rem;
      border: 0.2rem solid white;
      background-size: 6.4rem;
      background-repeat: no-repeat;
      transform: translate(0);
      background-color: #89b6d6;
      background-image: url('/optimized-images/component-icons/door-sensor-closed.svg');
      background-position: center 2rem;
    }

    .webthing-door-sensor-capability-icon.open {
      background-color: white;
      background-image: url('/optimized-images/component-icons/door-sensor-open.svg');
    }

    .webthing-door-sensor-capability-label {
      font-weight: bold;
      text-transform: uppercase;
      padding-top: 8.75rem;
      font-size: 1.4rem;
    }

    .webthing-door-sensor-capability-icon.open
    .webthing-door-sensor-capability-label {
      color: #5d9bc7;
    }
  </style>
  <div id="icon" class="webthing-door-sensor-capability-icon">
    <div id="label" class="webthing-door-sensor-capability-label">--</div>
  </div>
`;

class DoorSensorCapability extends BaseComponent {
  constructor() {
    super(template);

    this._icon = this.shadowRoot.querySelector('#icon');
    this._label = this.shadowRoot.querySelector('#label');

    this._open = false;
  }

  connectedCallback() {
    this.open =
      typeof this.dataset.open !== 'undefined' ? this.dataset.open : null;
  }

  get open() {
    return this._open;
  }

  set open(value) {
    this._open = Boolean(value);

    if (value === null) {
      this._icon.classList.remove('open');
      this._label.innerText = '...';
    } else if (this._open) {
      this._icon.classList.add('open');
      this._label.innerText = 'OPEN';
    } else {
      this._icon.classList.remove('open');
      this._label.innerText = 'CLOSED';
    }
  }
}

window.customElements.define('webthing-door-sensor-capability',
                             DoorSensorCapability);
module.exports = DoorSensorCapability;
