/**
 * AlarmCapability
 *
 * A bubble showing an alarm icon.
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

    .webthing-alarm-capability-icon {
      width: 12.4rem;
      height: 12.4rem;
      border-radius: 6.4rem;
      border: 0.2rem solid white;
      background-size: 6.4rem;
      background-repeat: no-repeat;
      transform: translate(0);
      background-color: #89b6d6;
      background-image: url('/optimized-images/component-icons/alarm-ok.svg');
      background-position: center 2rem;
    }

    .webthing-alarm-capability-icon.alarm {
      background-color: white;
      background-image: url('/optimized-images/component-icons/alarm-alarm.svg');
    }

    .webthing-alarm-capability-label {
      font-weight: bold;
      text-transform: uppercase;
      padding-top: 8.75rem;
      font-size: 1.4rem;
    }

    .webthing-alarm-capability-icon.alarm
    .webthing-alarm-capability-label {
      color: #5d9bc7;
    }
  </style>
  <div id="icon" class="webthing-alarm-capability-icon">
    <div id="label" class="webthing-alarm-capability-label">--</div>
  </div>
`;

class AlarmCapability extends BaseComponent {
  constructor() {
    super(template);

    this._icon = this.shadowRoot.querySelector('#icon');
    this._label = this.shadowRoot.querySelector('#label');

    this._alarm = false;
  }

  connectedCallback() {
    this.alarm =
      typeof this.dataset.alarm !== 'undefined' ? this.dataset.alarm : null;
  }

  get alarm() {
    return this._alarm;
  }

  set alarm(value) {
    this._alarm = Boolean(value);

    if (value === null) {
      this._icon.classList.remove('alarm');
      this._label.innerText = fluent.getMessage('ellipses');
    } else if (this._alarm) {
      this._icon.classList.add('alarm');
      this._label.innerText = fluent.getMessage('alarm');
    } else {
      this._icon.classList.remove('alarm');
      this._label.innerText = fluent.getMessage('ok');
    }
  }
}

window.customElements.define('webthing-alarm-capability', AlarmCapability);
module.exports = AlarmCapability;
