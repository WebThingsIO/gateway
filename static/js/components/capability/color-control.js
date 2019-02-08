/**
 * ColorControlCapability
 *
 * A bubble showing a color icon.
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

    .webthing-color-control-capability-container {
      box-sizing: border-box;
      width: 12.8rem;
      height: 12.8rem;
      border-radius: 6.4rem;
      border: 0.2rem solid white;
      transform: translate(0);
      background-color: #89b6d6;
    }

    .webthing-color-control-capability-info {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      height: 5rem;
      width: 5rem;
      border-radius: 0.5rem;
      border: 0.2rem solid white;
    }
  </style>
  <div id="container" class="webthing-color-control-capability-container">
    <div id="info" class="webthing-color-control-capability-info"></div>
  </div>
`;

class ColorControlCapability extends BaseComponent {
  constructor() {
    super(template);

    this._info = this.shadowRoot.querySelector('#info');
    this._color = '#ffffff';
  }

  connectedCallback() {
    this.color = this.dataset.color || '#ffffff';
  }

  get color() {
    return this._color;
  }

  set color(value) {
    this._color = value;
    this._info.style.backgroundColor = value;
  }
}

window.customElements.define('webthing-color-control-capability',
                             ColorControlCapability);
module.exports = ColorControlCapability;
