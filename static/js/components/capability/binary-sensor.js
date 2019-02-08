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
      width: 12.8rem;
      height: 12.8rem;
      border-radius: 6.4rem;
      background-size: 12.8rem;
      background-repeat: no-repeat;
      transform: translate(0);
      background-color: #5d9bc7;
      background-image: url('/optimized-images/component-icons/binary-sensor.png');
    }

    .webthing-binary-sensor-capability-icon.on {
      background-image: url('/optimized-images/component-icons/binary-sensor-on.png');
    }

    .webthing-binary-sensor-capability-icon.off {
      background-image: url('/optimized-images/component-icons/binary-sensor-off.png');
    }
  </style>
  <div id="icon" class="webthing-binary-sensor-capability-icon"></div>
`;

class BinarySensorCapability extends BaseComponent {
  constructor() {
    super(template);

    this._icon = this.shadowRoot.querySelector('#icon');
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
      this._icon.classList.remove('off');
    } else if (this._on) {
      this._icon.classList.remove('off');
      this._icon.classList.add('on');
    } else {
      this._icon.classList.remove('on');
      this._icon.classList.add('off');
    }
  }
}

window.customElements.define('webthing-binary-sensor-capability',
                             BinarySensorCapability);
module.exports = BinarySensorCapability;
