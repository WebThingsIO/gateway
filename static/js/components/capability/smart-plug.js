/**
 * SmartPlugCapability
 *
 * A bubble showing a smart plug icon.
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

    .webthing-smart-plug-capability-icon {
      width: 12.4rem;
      height: 12.4rem;
      border-radius: 6.4rem;
      border: 0.2rem solid white;
      background-size: 6.4rem;
      background-repeat: no-repeat;
      transform: translate(0);
      background-color: #89b6d6;
      background-image: url('/optimized-images/component-icons/smart-plug-off.svg');
      background-position: center 2rem;
    }

    .webthing-smart-plug-capability-icon.on {
      background-color: white;
      background-image: url('/optimized-images/component-icons/smart-plug-on.svg');
    }

    .webthing-smart-plug-capability-label {
      font-weight: bold;
      text-transform: uppercase;
      padding-top: 8.75rem;
    }

    .webthing-smart-plug-capability-icon.on
    .webthing-smart-plug-capability-label {
      color: #5d9bc7;
    }
  </style>
  <div id="icon" class="webthing-smart-plug-capability-icon">
    <div id="label" class="webthing-smart-plug-capability-label">--</div>
  </div>
`;

class SmartPlugCapability extends BaseComponent {
  constructor() {
    super(template);

    this._icon = this.shadowRoot.querySelector('#icon');
    this._label = this.shadowRoot.querySelector('#label');

    this._havePower = false;
    this._on = false;
    this._power = 0;

    this._onClick = this.__onClick.bind(this);
  }

  connectedCallback() {
    this._havePower =
      typeof this.dataset.havePower !== 'undefined' ?
        this.dataset.havePower === 'true' :
        false;
    this.on = typeof this.dataset.on !== 'undefined' ? this.dataset.on : null;
    this.power =
      typeof this.dataset.power !== 'undefined' ? this.dataset.power : false;
    this._icon.addEventListener('click', this._onClick);
  }

  disconnectedCallback() {
    this._icon.removeEventListener('click', this._onClick);
  }

  get on() {
    return this._on;
  }

  set on(value) {
    this._on = Boolean(value);

    if (value === null) {
      this._icon.classList.remove('on');
      this._label.innerText = '...';
    } else if (this._on) {
      this._icon.classList.add('on');
      if (this._havePower) {
        this.power = this._power;
      } else {
        this._label.innerText = 'ON';
      }
    } else {
      this._icon.classList.remove('on');
      this._label.innerText = 'OFF';
    }
  }

  get power() {
    return this._power;
  }

  set power(value) {
    this._power = Number(value);

    if (this._on) {
      this._label.innerText = `${Math.round(this._power)} W`;
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

window.customElements.define('webthing-smart-plug-capability',
                             SmartPlugCapability);
module.exports = SmartPlugCapability;
