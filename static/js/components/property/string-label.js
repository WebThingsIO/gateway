/**
 * StringLabelProperty
 *
 * A bubble showing a string label.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const BaseComponent = require('../base-component');

class StringLabelProperty extends BaseComponent {
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

    .webthing-string-label-property-container {
      width: 10rem;
      height: 10rem;
      border-radius: 5rem;
      border: 0.2rem solid white;
      background-color: #89b6d6;
      position: relative;
    }

    .webthing-string-label-property-container.inverted {
      color: #5d9bc7;
      background-color: white;
    }

    .webthing-string-label-property-value {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-weight: bold;
      width: 100%;
      font-size: 1.4rem;
    }

    .webthing-string-label-property-name {
      text-align: center;
      max-width: 10rem;
      overflow-wrap: break-word;
      background-color: #5d9bc7;
      display: inline-block;
    }
  </style>
  <div id="container-${BaseComponent.count}" class="webthing-string-label-property-container">
    <div id="value-${BaseComponent.count}" class="webthing-string-label-property-value"></div>
  </div>
  <div id="name-${BaseComponent.count}" class="webthing-string-label-property-name"></div>
`;
    super(template);

    this._name = this.shadowRoot.querySelector(
      '.webthing-string-label-property-name');
    this._container = this.shadowRoot.querySelector(
      '.webthing-string-label-property-container');
    this._value = this.shadowRoot.querySelector(
      '.webthing-string-label-property-value');
    this._inverted = false;
  }

  connectedCallback() {
    if (!this.name) {
      this.name = this.dataset.name;
    }

    if (!this.value) {
      this.value =
        typeof this.dataset.value !== 'undefined' ? this.dataset.value : '';
    }

    this.inverted =
      typeof this.dataset.inverted !== 'undefined' ?
        this.dataset.inverted === 'true' :
        false;
  }

  get name() {
    return this._name.innerText;
  }

  set name(value) {
    this._name.innerText = value;
  }

  get value() {
    return this._value.innerText;
  }

  set value(value) {
    this._value.innerText = value;
  }

  get inverted() {
    return this._inverted;
  }

  set inverted(value) {
    this._inverted = !!value;

    if (this._inverted) {
      this._container.classList.add('inverted');
    } else {
      this._container.classList.remove('inverted');
    }
  }
}

window.customElements.define('webthing-string-label-property',
                             StringLabelProperty);
module.exports = StringLabelProperty;
