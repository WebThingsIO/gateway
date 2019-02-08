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
      width: 12.8rem;
      height: 12.8rem;
      border-radius: 6.4rem;
      background-size: 12.8rem;
      background-repeat: no-repeat;
      transform: translate(0);
      background-color: #5d9bc7;
    }

    .webthing-custom-capability-icon.custom-icon {
      width: 12.4rem;
      height: 12.4rem;
      border: 0.2rem solid white;
      background-size: 6.4rem;
      background-position: center;
      background-color: #89b6d6;
    }
  </style>
  <div id="icon" class="webthing-custom-capability-icon"></div>
`;

class CustomCapability extends BaseComponent {
  constructor() {
    super(template);

    this._icon = this.shadowRoot.querySelector('#icon');
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
      this._iconHref = '/optimized-images/component-icons/custom.png';
      this._icon.classList.remove('custom-icon');
    } else {
      this._iconHref = value;
      this._icon.classList.add('custom-icon');
    }

    this._icon.style.backgroundImage = `url("${this._iconHref}")`;
  }
}

window.customElements.define('webthing-custom-capability', CustomCapability);
module.exports = CustomCapability;
