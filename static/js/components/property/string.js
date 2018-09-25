/**
 * StringProperty
 *
 * A bubble showing a text input.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const BaseComponent = require('../base-component');

class StringProperty extends BaseComponent {
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

    .webthing-string-property-container {
      width: 10rem;
      height: 10rem;
      border-radius: 5rem;
      border: 0.2rem solid white;
      background-color: #89b6d6;
      position: relative;
    }

    .webthing-string-property-contents {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .webthing-string-property-input {
      height: 1.75rem;
      width: 6rem;
      text-align: center;
      background-color: #d2d9de;
      color: #333;
      border: none;
      border-radius: 0.5rem;
      padding: 0.5rem;
      margin: 0.5rem 0;
      font-size: 1.6rem;
    }

    .webthing-string-property-name {
      text-align: center;
      max-width: 10rem;
      overflow-wrap: break-word;
      background-color: #5d9bc7;
      display: inline-block;
    }
  </style>
  <div id="container-${BaseComponent.count}" class="webthing-string-property-container">
    <div id="contents-${BaseComponent.count}" class="webthing-string-property-contents">
      <form id="form-${BaseComponent.count}" class="webthing-string-property-form">
        <input type="text" id="input-${BaseComponent.count}" class="webthing-string-property-input">
      </form>
    </div>
  </div>
  <div id="name-${BaseComponent.count}" class="webthing-string-property-name"></div>
`;
    super(template);

    this._form = this.shadowRoot.querySelector(
      '.webthing-string-property-form');
    this._input = this.shadowRoot.querySelector(
      '.webthing-string-property-input');
    this._name = this.shadowRoot.querySelector(
      '.webthing-string-property-name');

    this._onSubmit = this.__onSubmit.bind(this);
    this._onBlur = this.__onBlur.bind(this);
  }

  connectedCallback() {
    this.name = this.dataset.name;

    this.readOnly =
      typeof this.dataset.readOnly !== 'undefined' ?
        this.dataset.readOnly === 'true' :
        false;

    this._upgradeProperty('value');

    this._form.addEventListener('submit', this._onSubmit);
    this._input.addEventListener('blur', this._onBlur);
  }

  disconnectedCallback() {
    this._form.removeEventListener('submit', this._onSubmit);
    this._input.removeEventListener('blur', this._onBlur);
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

  __onSubmit(e) {
    e.preventDefault();
    this._input.blur();
    return false;
  }

  __onBlur(e) {
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

window.customElements.define('webthing-string-property', StringProperty);
module.exports = StringProperty;
