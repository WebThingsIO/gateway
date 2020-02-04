/**
 * LockCapability
 *
 * A bubble showing a lock icon.
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

    .webthing-lock-capability-icon {
      width: 12.4rem;
      height: 12.4rem;
      border-radius: 6.4rem;
      border: 0.2rem solid white;
      background-size: 6.4rem;
      background-repeat: no-repeat;
      transform: translate(0);
      background-position: center 2rem;
    }

    .webthing-lock-capability-icon.locked {
      background-color: #89b6d6;
      background-image: url('/images/component-icons/lock-locked.svg');
    }

    .webthing-lock-capability-icon.unlocked {
      background-color: white;
      background-image: url('/images/component-icons/lock-unlocked.svg');
    }

    .webthing-lock-capability-icon.unknown {
      background-color: white;
      background-image: url('/images/component-icons/lock-unknown.svg');
    }

    .webthing-lock-capability-icon.jammed {
      background-color: white;
      background-image: url('/images/component-icons/lock-jammed.svg');
    }

    .webthing-lock-capability-label {
      font-weight: bold;
      text-transform: uppercase;
      padding-top: 8.75rem;
      font-size: 1.4rem;
    }

    .webthing-lock-capability-icon.unlocked .webthing-lock-capability-label,
    .webthing-lock-capability-icon.unknown .webthing-lock-capability-label,
    .webthing-lock-capability-icon.jammed .webthing-lock-capability-label {
      color: #5d9bc7;
    }
  </style>
  <div id="icon" class="webthing-lock-capability-icon">
    <div id="label" class="webthing-lock-capability-label">...</div>
  </div>
`;

class LockCapability extends BaseComponent {
  constructor() {
    super(template);

    this._icon = this.shadowRoot.querySelector('#icon');
    this._label = this.shadowRoot.querySelector('#label');

    this._state = 'unknown';
  }

  connectedCallback() {
    this.state =
      typeof this.dataset.state !== 'undefined' ?
        this.dataset.state :
        'unknown';
  }

  get state() {
    return this._state;
  }

  set state(value) {
    if (!['locked', 'unlocked', 'unknown', 'jammed'].includes(value)) {
      value = 'unknown';
    }

    this._state = value;

    this._icon.classList.remove('locked', 'unlocked', 'unknown', 'jammed');
    this._icon.classList.add(value);

    if (value === 'unknown') {
      value = 'ellipsis';
    }

    this._label.innerText = fluent.getMessage(value);
  }
}

window.customElements.define('webthing-lock-capability', LockCapability);
module.exports = LockCapability;
