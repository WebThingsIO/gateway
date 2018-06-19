/**
 * CustomCapability
 *
 * A bubble showing an on/off switch icon.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const BaseComponent = require('./base-component');

const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      contain: content;
      text-align: center;
      color: white;
      font-size: 1.6rem;
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
      this._iconHref = '/optimized-images/unknown-thing.png';
    } else {
      this._iconHref = value;
    }

    this._icon.style.backgroundImage = `url("${this._iconHref}")`;
  }
}

window.customElements.define('webthing-custom-capability', CustomCapability);
module.exports = CustomCapability;
