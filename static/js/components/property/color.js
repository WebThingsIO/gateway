/**
 * ColorProperty
 *
 * A bubble showing a color input.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const BaseComponent = require('../base-component');

class ColorProperty extends BaseComponent {
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

    .webthing-color-property-container {
      width: 10rem;
      height: 10rem;
      border-radius: 5rem;
      border: 0.2rem solid white;
      background-color: #89b6d6;
      position: relative;
    }

    .webthing-color-property-contents {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .webthing-color-property-name {
      text-align: center;
      max-width: 10rem;
      overflow-wrap: break-word;
      background-color: #5d9bc7;
      display: inline-block;
    }
  </style>
  <div id="container-${BaseComponent.count}" class="webthing-color-property-container">
    <div id="contents-${BaseComponent.count}" class="webthing-color-property-contents">
      <input type="color" id="color-${BaseComponent.count}" class="webthing-color-property-color">
    </div>
  </div>
  <div id="name-${BaseComponent.count}" class="webthing-color-property-name"></div>
`;
    super(template);

    this._input = this.shadowRoot.querySelector(
      '.webthing-color-property-color');
    this._name = this.shadowRoot.querySelector(
      '.webthing-color-property-name');

    this._onChange = this.__onChange.bind(this);
  }

  connectedCallback() {
    this.name = this.dataset.name;

    this.readOnly =
      typeof this.dataset.readOnly !== 'undefined' ?
        this.dataset.readOnly === 'true' :
        false;

    this._upgradeProperty('value');

    this._input.addEventListener('change', this._onChange);
  }

  disconnectedCallback() {
    this._input.removeEventListener('change', this._onChange);
  }

  get value() {
    return this._input.value;
  }

  set value(value) {
    this._input.value = value;
  }

  get readOnly() {
    return this._input.hasAttribute('disabled');
  }

  set readOnly(value) {
    const isDisabled = Boolean(value);
    if (isDisabled) {
      this._input.setAttribute('disabled', '');
    } else {
      this._input.removeAttribute('disabled');
    }

    this._input.disabled = isDisabled;
  }

  get name() {
    return this._name.innerText;
  }

  set name(value) {
    this._name.innerText = value;
  }

  __onChange(e) {
    e.preventDefault();
    this.value = e.target.value;

    this.dispatchEvent(new CustomEvent('change', {
      detail: {
        value: this.value,
      },
      bubbles: true,
    }));
  }
}

window.customElements.define('webthing-color-property', ColorProperty);
module.exports = ColorProperty;
