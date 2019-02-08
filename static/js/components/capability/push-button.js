/**
 * PushButtonCapability
 *
 * A bubble showing a push button icon.
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

    .webthing-push-button-capability-icon {
      width: 12.4rem;
      height: 12.4rem;
      border-radius: 6.4rem;
      border: 0.2rem solid white;
      background-size: 6.4rem;
      background-repeat: no-repeat;
      transform: translate(0);
      background-color: #89b6d6;
      background-image: url('/optimized-images/component-icons/push-button-not-pushed.svg');
      background-position: center 2rem;
    }

    .webthing-push-button-capability-icon.pushed {
      background-color: white;
      background-image: url('/optimized-images/component-icons/push-button-pushed.svg');
    }

    .webthing-push-button-capability-label {
      font-weight: bold;
      text-transform: uppercase;
      padding-top: 8.75rem;
      font-size: 1.2rem;
    }

    .webthing-push-button-capability-icon.pushed
    .webthing-push-button-capability-label {
      color: #5d9bc7;
      font-size: 1.4rem;
    }
  </style>
  <div id="icon" class="webthing-push-button-capability-icon">
    <div id="label" class="webthing-push-button-capability-label">--</div>
  </div>
`;

class PushButtonCapability extends BaseComponent {
  constructor() {
    super(template);

    this._icon = this.shadowRoot.querySelector('#icon');
    this._label = this.shadowRoot.querySelector('#label');

    this._pushed = false;
    this._pressTimeout = null;
    this.addEventListener('press', this._onPress.bind(this));
  }

  connectedCallback() {
    this.pushed =
      typeof this.dataset.pushed !== 'undefined' ? this.dataset.pushed : null;
  }

  get pushed() {
    return this._pushed;
  }

  set pushed(value) {
    this._pushed = Boolean(value);

    if (value === null) {
      this._icon.classList.remove('pushed');
      this._label.innerText = '...';
    } else if (this._pushed) {
      this._icon.classList.add('pushed');
      this._label.innerText = 'PUSHED';
    } else {
      this._icon.classList.remove('pushed');
      this._label.innerText = 'NOT PUSHED';
    }
  }

  _onPress(e) {
    switch (e.detail) {
      case 'single':
        this._fireSinglePress();
        break;
      case 'double':
        this._fireDoublePress();
        break;
      case 'long':
        this._fireLongPress();
        break;
    }
  }

  _fireSinglePress() {
    if (this._pressTimeout !== null) {
      clearTimeout(this._pressTimeout);
      this._pressTimeout = null;
    }

    this.pushed = true;
    this._pressTimeout = setTimeout(() => {
      this.pushed = false;
      this._pressTimeout = null;
    }, 300);
  }

  _fireDoublePress() {
    if (this._pressTimeout !== null) {
      clearTimeout(this._pressTimeout);
      this._pressTimeout = null;
    }

    this.pushed = true;
    this._pressTimeout = setTimeout(() => {
      this.pushed = false;
      this._pressTimeout = setTimeout(() => {
        this.pushed = true;
        this._pressTimeout = setTimeout(() => {
          this.pushed = false;
          this._pressTimeout = null;
        }, 300);
      }, 300);
    }, 300);
  }

  _fireLongPress() {
    if (this._pressTimeout !== null) {
      clearTimeout(this._pressTimeout);
      this._pressTimeout = null;
    }

    this.pushed = true;
    this._pressTimeout = setTimeout(() => {
      this.pushed = false;
      this._pressTimeout = null;
    }, 1500);
  }
}

window.customElements.define('webthing-push-button-capability',
                             PushButtonCapability);
module.exports = PushButtonCapability;
