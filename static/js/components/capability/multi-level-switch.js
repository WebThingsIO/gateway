/**
 * MultiLevelSwitchCapability
 *
 * A bubble showing a multi-level switch icon.
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

    .webthing-multi-level-switch-capability-container {
      box-sizing: border-box;
      width: 12.8rem;
      height: 12.8rem;
      border-radius: 6.4rem;
      border: 0.2rem solid white;
      transform: translate(0);
      background-color: #89b6d6;
    }

    .webthing-multi-level-switch-capability-container.on {
      background-color: white;
      color: #5d9bc7;
    }

    .webthing-multi-level-switch-capability-container.on
    .webthing-multi-level-switch-capability-bar {
      border-color: #5d9bc7;
    }

    .webthing-multi-level-switch-capability-info {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .webthing-multi-level-switch-capability-bar {
      width: 1rem;
      height: 8rem;
      border-radius: 0.5rem;
      border: 0.2rem solid white;
      margin: 0 auto;
    }

    .webthing-multi-level-switch-capability-label {
      padding-top: 0.2rem;
      font-weight: bold;
    }
  </style>
  <div id="container" class="webthing-multi-level-switch-capability-container">
    <div id="info" class="webthing-multi-level-switch-capability-info">
      <div id="bar" class="webthing-multi-level-switch-capability-bar"></div>
      <div id="label" class="webthing-multi-level-switch-capability-label">
      </div>
    </div>
  </div>
`;

const OFF_BAR = 'white';
const OFF_BLANK = '#89b6d6';
const ON_BAR = '#5d9bc7';
const ON_BLANK = 'white';

class MultiLevelSwitchCapability extends BaseComponent {
  constructor() {
    super(template);
    this._container = this.shadowRoot.querySelector(
      '.webthing-multi-level-switch-capability-container');
    this._bar = this.shadowRoot.querySelector(
      '.webthing-multi-level-switch-capability-bar');
    this._label = this.shadowRoot.querySelector(
      '.webthing-multi-level-switch-capability-label');
    this._on = false;
    this._level = 0;
    this._onClick = this.__onClick.bind(this);
  }

  connectedCallback() {
    // Default to on=true to display level
    this.on = typeof this.dataset.on !== 'undefined' ? this.dataset.on : true;
    this.level =
      typeof this.dataset.level !== 'undefined' ? this.dataset.level : false;
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
      this._label.innerText = 'OFF';
      this._container.classList.remove('on');
    }

    this.level = this._level;
  }

  get level() {
    return this._level;
  }

  set level(value) {
    this._level = Number(value);

    let bar, blank;

    if (this._on) {
      bar = ON_BAR;
      blank = ON_BLANK;
      this._label.innerText = `${Math.round(this._level)}%`;
    } else {
      bar = OFF_BAR;
      blank = OFF_BLANK;
    }

    this._bar.style.background =
      `linear-gradient(${blank}, ${blank} ${100 - this._level}%, ` +
      `${bar} ${100 - this._level}%, ${bar})`;
  }

  __onClick(e) {
    e.preventDefault();
    e.stopPropagation();

    this.dispatchEvent(new CustomEvent('click', {
      bubbles: true,
    }));
  }
}

window.customElements.define('webthing-multi-level-switch-capability',
                             MultiLevelSwitchCapability);
module.exports = MultiLevelSwitchCapability;
