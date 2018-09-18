/**
 * NumberProperty
 *
 * A bubble showing a number input.
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
      display: inline-block;
      contain: content;
      text-align: center;
      color: white;
      font-size: 1.6rem;
    }

    .webthing-number-property-container {
      width: 10rem;
      height: 10rem;
      border-radius: 5rem;
      border: 0.2rem solid white;
      background-color: #89b6d6;
      position: relative;
    }

    .webthing-number-property-contents {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .webthing-number-property-input {
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

    .webthing-number-property-input.hide-spinner::-webkit-inner-spin-button,
    .webthing-number-property-input.hide-spinner::-webkit-outer-spin-button {
      -webkit-appearance: textfield;
    }

    .webthing-number-property-input.hide-spinner {
      -moz-appearance: textfield;
    }

    .webthing-number-property-unit.hidden {
      display: none;
    }

    .webthing-number-property-name {
      text-align: center;
      max-width: 10rem;
      overflow-wrap: break-word;
      background-color: #5d9bc7;
      display: inline-block;
    }
  </style>
  <div id="container" class="webthing-number-property-container">
    <div id="contents" class="webthing-number-property-contents">
      <form id="form" class="webthing-number-property-form">
        <input type="number" id="input"
          class="webthing-number-property-input hide-spinner">
      </form>
      <div id="unit" class="webthing-number-property-unit"></div>
    </div>
  </div>
  <div id="name" class="webthing-number-property-name"></div>
`;

class NumberProperty extends BaseComponent {
  constructor() {
    super(template);

    this._form = this.shadowRoot.querySelector('#form');
    this._input = this.shadowRoot.querySelector('#input');
    this._unit = this.shadowRoot.querySelector('#unit');
    this._name = this.shadowRoot.querySelector('#name');

    this._onClick = this.__onClick.bind(this);
    this._onSubmit = this.__onSubmit.bind(this);
    this._onBlur = this.__onBlur.bind(this);

    this._haveClickListener = false;
  }

  connectedCallback() {
    this.name = this.dataset.name;
    this.value =
      typeof this.dataset.value !== 'undefined' ? this.dataset.value : '';
    this.unit =
      typeof this.dataset.unit !== 'undefined' ? this.dataset.unit : '';
    this.readOnly =
      typeof this.dataset.readOnly !== 'undefined' ?
        this.dataset.readOnly === 'true' :
        false;

    this._upgradeProperty('min');
    this._upgradeProperty('max');
    this._upgradeProperty('step');
    this._upgradeProperty('value');

    this._form.addEventListener('submit', this._onSubmit);
    this._input.addEventListener('blur', this._onBlur);
  }

  disconnectedCallback() {
    if (this._haveClickListener) {
      this._input.removeEventListener('click', this._onClick);
    }

    this._form.removeEventListener('submit', this._onSubmit);
    this._input.removeEventListener('blur', this._onBlur);
  }

  get min() {
    return this._input.min;
  }

  set min(value) {
    this._input.min = value;
    this._setInputClass();
  }

  get max() {
    return this._input.max;
  }

  set max(value) {
    this._input.max = value;
    this._setInputClass();
  }

  get step() {
    return this._input.step;
  }

  set step(value) {
    this._input.step = value;
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

  get unit() {
    return this._unit.innerText;
  }

  set unit(value) {
    this._unit.innerText = value;
    this._setUnitClass();
  }

  _setInputClass() {
    const min = parseInt(this.min, 10);
    const max = parseInt(this.max, 10);

    if (isNaN(min) || min === null || isNaN(max) || max === null) {
      this._input.classList.add('hide-spinner');

      if (this._haveClickListener) {
        this._input.removeEventListener('click', this._onClick);
        this._haveClickListener = false;
      }
    } else {
      this._input.classList.remove('hide-spinner');

      if (!this._haveClickListener) {
        this._input.addEventListener('click', this._onClick);
        this._haveClickListener = true;
      }
    }
  }

  _setUnitClass() {
    if (this.unit) {
      this._unit.classList.remove('hidden');
    } else {
      this._unit.classList.add('hidden');
    }
  }

  __onClick(e) {
    this.__onBlur(e);
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

window.customElements.define('webthing-number-property', NumberProperty);
module.exports = NumberProperty;
