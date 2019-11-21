/**
 * CustomCapability
 *
 * A bubble showing a generic (or custom) icon.
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

    .webthing-custom-capability-icon {
      width: 12.4rem;
      height: 12.4rem;
      border-radius: 6.4rem;
      border: 0.2rem solid white;
      background-size: 6.4rem;
      background-repeat: no-repeat;
      transform: translate(0);
      background-color: #89b6d6;
      background-position: center;
    }

    .webthing-custom-capability-label {
      font-weight: bold;
      text-transform: uppercase;
      padding-top: 5.2rem;
    }

    .webthing-custom-capability-icon.custom-icon
    .webthing-custom-capability-label {
      display: none;
    }
  </style>
  <div id="icon" class="webthing-custom-capability-icon">
    <div id="label" class="webthing-custom-capability-label"></div>
  </div>
`;

class CustomCapability extends BaseComponent {
  constructor() {
    super(template);

    this._icon = this.shadowRoot.querySelector('#icon');
    this._label = this.shadowRoot.querySelector('#label');

    this._label.innerText = fluent.getMessage('Thing');
    this._iconHref = '';
  }

  connectedCallback() {
    this.iconHref =
      typeof this.dataset.iconHref !== 'undefined' ? this.dataset.iconHref : '';
  }

  get iconHref() {
    return this._iconHref;
  }

  set iconHref(value) {
    if (!value) {
      this._iconHref = '';
      this._icon.style.backgroundImage = '';
      this._icon.classList.remove('custom-icon');
    } else {
      this._iconHref = value;
      this._icon.style.backgroundImage = `url("${this._iconHref}")`;
      this._icon.classList.add('custom-icon');
    }
  }
}

window.customElements.define('webthing-custom-capability', CustomCapability);
module.exports = CustomCapability;
