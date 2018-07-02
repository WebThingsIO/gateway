/**
 * CustomIcon
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
    }

    .webthing-custom-icon-icon {
      width: 6.4rem;
      height: 6.4rem;
      background-size: 6.4rem;
      background-repeat: no-repeat;
      transform: translate(0);
    }

    .webthing-custom-icon-icon.custom-icon {
      width: 6.2rem;
      height: 6.2rem;
      border-radius: 3.2rem;
      border: 0.1rem solid white;
      background-size: 3.2rem;
      background-position: center;
      background-color: #ffffff64;
    }
  </style>
  <div id="icon" class="webthing-custom-icon-icon"></div>
`;

class CustomIcon extends BaseComponent {
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
      this._iconHref = '/optimized-images/thing-icons/thing.svg';
      this._icon.classList.remove('custom-icon');
    } else {
      this._iconHref = value;
      this._icon.classList.add('custom-icon');
    }

    this._icon.style.backgroundImage = `url("${this._iconHref}")`;
  }
}

window.customElements.define('webthing-custom-icon', CustomIcon);
module.exports = CustomIcon;
