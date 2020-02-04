/**
 * MotionSensorCapability
 *
 * A bubble showing a motion sensor icon.
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

    .webthing-motion-sensor-capability-icon {
      width: 12.4rem;
      height: 12.4rem;
      border-radius: 6.4rem;
      border: 0.2rem solid white;
      background-size: 6.4rem;
      background-repeat: no-repeat;
      transform: translate(0);
      background-color: #89b6d6;
      background-image: url('/images/component-icons/motion-sensor-no-motion.svg');
      background-position: center 2rem;
    }

    .webthing-motion-sensor-capability-icon.motion {
      background-color: white;
      background-image: url('/images/component-icons/motion-sensor-motion.svg');
    }

    .webthing-motion-sensor-capability-label {
      font-weight: bold;
      text-transform: uppercase;
      padding-top: 8.75rem;
      font-size: 1.2rem;
    }

    .webthing-motion-sensor-capability-icon.motion
    .webthing-motion-sensor-capability-label {
      color: #5d9bc7;
      font-size: 1.4rem;
    }
  </style>
  <div id="icon" class="webthing-motion-sensor-capability-icon">
    <div id="label" class="webthing-motion-sensor-capability-label">--</div>
  </div>
`;

class MotionSensorCapability extends BaseComponent {
  constructor() {
    super(template);

    this._icon = this.shadowRoot.querySelector('#icon');
    this._label = this.shadowRoot.querySelector('#label');

    this._motion = false;
  }

  connectedCallback() {
    this.motion =
      typeof this.dataset.motion !== 'undefined' ? this.dataset.motion : null;
  }

  get motion() {
    return this._motion;
  }

  set motion(value) {
    this._motion = Boolean(value);

    if (value === null) {
      this._icon.classList.remove('motion');
      this._label.innerText = fluent.getMessage('ellipsis');
    } else if (this._motion) {
      this._icon.classList.add('motion');
      this._label.innerText = fluent.getMessage('motion');
    } else {
      this._icon.classList.remove('motion');
      this._label.innerText = fluent.getMessage('no-motion');
    }
  }
}

window.customElements.define('webthing-motion-sensor-capability',
                             MotionSensorCapability);
module.exports = MotionSensorCapability;
