/**
 * SmokeProperty
 *
 * A bubble showing a smoke label.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const BaseComponent = require('../base-component');
const fluent = require('../../fluent');

class SmokeProperty extends BaseComponent {
  constructor() {
    const template = document.createElement('template');
    template.innerHTML = `
  <style>
    :host {
      display: inline-block;
      contain: content;
      text-align: center;
      color: white;
      font-size: 1.6rem;
    }

    .webthing-smoke-property-container {
      width: 10rem;
      height: 10rem;
      border-radius: 5rem;
      border: 0.2rem solid white;
      background-color: #89b6d6;
      position: relative;
    }

    .webthing-smoke-property-container.inverted {
      color: white;
      background-color: #ff5555;
      border: 0.2rem solid #ff5555;
    }

    .webthing-smoke-property-value {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-weight: bold;
      width: 100%;
      font-size: 1.4rem;
      text-transform: uppercase;
    }

    .webthing-smoke-property-container.inverted
    .webthing-smoke-property-value {
      top: calc(50% + 1.7rem);
    }

    .webthing-smoke-property-image {
      display: none;
    }

    .webthing-smoke-property-container.inverted
    .webthing-smoke-property-image {
      display: block;
      width: 3.2rem;
      position: absolute;
      left: calc(50% - 1.6rem);
      top: 2.6rem;
    }

    .webthing-smoke-property-name {
      text-align: center;
      max-width: 10rem;
      overflow-wrap: break-word;
      background-color: #5d9bc7;
      display: inline-block;
    }
  </style>
  <div id="container-${BaseComponent.count}" class="webthing-smoke-property-container">
    <img src="/images/component-icons/smoke.svg" id="image-${BaseComponent.count}"
         class="webthing-smoke-property-image" />
    <div id="value-${BaseComponent.count}" class="webthing-smoke-property-value"></div>
  </div>
  <div id="name-${BaseComponent.count}" class="webthing-smoke-property-name"></div>
`;
    super(template);

    this._name = this.shadowRoot.querySelector(
      '.webthing-smoke-property-name');
    this._container = this.shadowRoot.querySelector(
      '.webthing-smoke-property-container');
    this._value = this.shadowRoot.querySelector(
      '.webthing-smoke-property-value');
    this._image = this.shadowRoot.querySelector(
      '.webthing-smoke-property-image');

    this._smoke = false;
  }

  connectedCallback() {
    if (!this.name) {
      this.name = this.dataset.name;
    }

    if (!this.value) {
      this.value =
        typeof this.dataset.value !== 'undefined' ? this.dataset.value : null;
    }
  }

  get name() {
    return this._name.innerText;
  }

  set name(value) {
    this._name.innerText = value;
  }

  get value() {
    return this._smoke;
  }

  set value(value) {
    this._smoke = Boolean(value);

    if (value === null) {
      this._value.innerText = fluent.getMessage('ellipsis');
      this._container.classList.remove('inverted');
    } else if (this._smoke) {
      this._value.innerText = fluent.getMessage('smoke');
      this._container.classList.add('inverted');
    } else {
      this._value.innerText = fluent.getMessage('ok');
      this._container.classList.remove('inverted');
    }
  }
}

window.customElements.define('webthing-smoke-property', SmokeProperty);
module.exports = SmokeProperty;
