/**
 * LevelProperty
 *
 * A bubble showing a level slider and input.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const BaseComponent = require('../base-component');

class LevelProperty extends BaseComponent {
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

    .webthing-level-property-container {
      width: 10rem;
      height: 10rem;
      border-radius: 5rem;
      border: 0.2rem solid white;
      background-color: #89b6d6;
      position: relative;
    }

    .webthing-level-property-contents {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .webthing-level-property-bar-container {
      width: 8rem;
      height: 1rem;
      border-radius: 0.6rem;
      border: 0.2rem solid white;
      margin: 0 auto;
    }

    .webthing-level-property-text,
    .webthing-level-property-unit {
      max-width: 8rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .webthing-level-property-bar {
      height: 1rem;
      background-color: white;
      position: absolute;
      left: 0.2rem;
      max-width: calc(100% - 0.4rem);
    }

    .webthing-level-property-form {
      width: 8rem;
    }

    .webthing-level-property-number {
      height: 1.75rem;
      width: 5.6rem;
      text-align: center;
      background-color: #d2d9de;
      color: #333;
      border: none;
      border-radius: 0.5rem;
      margin: 0.5rem 0;
      font-size: 1.6rem;
    }

    .webthing-level-property-slider {
      width: 8rem;
      margin: 0;
    }

    .webthing-level-property-text.hidden,
    .webthing-level-property-bar-container.hidden,
    .webthing-level-property-form.hidden {
      display: none;
    }

    .webthing-level-property-unit.hidden {
      visibility: hidden;
    }

    .webthing-level-property-name {
      text-align: center;
      max-width: 10rem;
      overflow-wrap: break-word;
      background-color: #5d9bc7;
      display: inline-block;
    }
  </style>
  <div id="container-${BaseComponent.count}" class="webthing-level-property-container">
    <div id="contents-${BaseComponent.count}" class="webthing-level-property-contents">
      <div id="text-${BaseComponent.count}" class="webthing-level-property-text hidden"></div>
      <div id="bar-container-${BaseComponent.count}"
        class="webthing-level-property-bar-container hidden">
        <span id="bar-${BaseComponent.count}" class="webthing-level-property-bar"></span>
      </div>
      <form id="form-${BaseComponent.count}" class="webthing-level-property-form">
        <input type="number" id="number-${BaseComponent.count}" class="webthing-level-property-number">
        <input type="range" id="slider-level-${BaseComponent.count}" class="webthing-level-property-slider">
      </form>
      <div id="unit-${BaseComponent.count}" class="webthing-level-property-unit"></div>
    </div>
  </div>
  <div id="name-${BaseComponent.count}" class="webthing-level-property-name"></div>
`;
    super(template);

    this._text = this.shadowRoot.querySelector(
      '.webthing-level-property-text');
    this._barContainer = this.shadowRoot.querySelector(
      '.webthing-level-property-bar-container');
    this._bar = this.shadowRoot.querySelector(
      '.webthing-level-property-bar');
    this._form = this.shadowRoot.querySelector(
      '.webthing-level-property-form');
    this._number = this.shadowRoot.querySelector(
      '.webthing-level-property-number');
    this._slider = this.shadowRoot.querySelector(
      '.webthing-level-property-slider');
    this._unit = this.shadowRoot.querySelector(
      '.webthing-level-property-unit');
    this._name = this.shadowRoot.querySelector(
      '.webthing-level-property-name');

    this._onChange = this.__onChange.bind(this);
    this._onClick = this.__onClick.bind(this);
    this._onBlur = this.__onBlur.bind(this);
    this._onSubmit = this.__onSubmit.bind(this);
  }

  connectedCallback() {
    if (!this.name) {
      this.name = this.dataset.name;
    }

    if (!this.unit) {
      this.unit =
        typeof this.dataset.unit !== 'undefined' ? this.dataset.unit : '';
    }

    this.readOnly =
      typeof this.dataset.readOnly !== 'undefined' ?
        this.dataset.readOnly === 'true' :
        false;

    this._upgradeProperty('min');
    this._upgradeProperty('max');
    this._upgradeProperty('step');
    this._upgradeProperty('value');

    // Set the initial number input value so that both inputs are set properly.
    this._number.value = this.value;

    this._slider.addEventListener('change', this._onChange);
    this._form.addEventListener('submit', this._onSubmit);
    this._number.addEventListener('blur', this._onBlur);
    this._number.addEventListener('click', this._onClick);
  }

  disconnectedCallback() {
    this._slider.removeEventListener('change', this._onChange);
    this._form.removeEventListener('submit', this._onSubmit);
    this._number.removeEventListener('blur', this._onBlur);
    this._number.removeEventListener('click', this._onClick);
  }

  get min() {
    return this._slider.min;
  }

  set min(value) {
    this._slider.min = value;
    this._number.min = value;
  }

  get max() {
    return this._slider.max;
  }

  set max(value) {
    this._slider.max = value;
    this._number.max = value;
  }

  get step() {
    return this._slider.step;
  }

  set step(value) {
    this._slider.step = value;
    this._number.step = value;
  }

  get value() {
    return this._slider.value;
  }

  set value(value) {
    const min = parseInt(this.min, 10);
    const max = parseInt(this.max, 10) - min;
    const percent = Math.max(0, value - min) / max * 100;

    this._bar.style.width = `calc(${percent}% - 0.2rem)`;
    this._text.innerText = value;
    this._text.title = value;
    this._slider.value = value;
    this._number.value = value;
  }

  get readOnly() {
    return this._slider.hasAttribute('disabled');
  }

  set readOnly(value) {
    const isDisabled = Boolean(value);
    if (isDisabled) {
      this._form.classList.add('hidden');
      this._barContainer.classList.remove('hidden');
      this._text.classList.remove('hidden');
      this._slider.setAttribute('disabled', '');
      this._number.setAttribute('disabled', '');
    } else {
      this._slider.removeAttribute('disabled');
      this._number.removeAttribute('disabled');
      this._form.classList.remove('hidden');
      this._barContainer.classList.add('hidden');
      this._text.classList.add('hidden');
    }

    this._slider.disabled = isDisabled;
    this._number.disabled = isDisabled;
  }

  get name() {
    return this._name.innerText;
  }

  set name(value) {
    this._name.innerText = value;
  }

  get unit() {
    return this._unit.dataset.actual;
  }

  set unit(value) {
    this._unit.dataset.actual = value;
    if (value) {
      this._unit.innerText = value;
      this._unit.title = value;
    } else {
      this._unit.innerHTML = '&nbsp;';
    }
    this._setUnitClass();
  }

  _setUnitClass() {
    if (this.unit) {
      this._unit.classList.remove('hidden');
    } else {
      this._unit.classList.add('hidden');
    }
  }

  __onChange(e) {
    e.preventDefault();

    let value = e.target.value;

    let step = this.step;
    if (step !== '' && step !== 'any') {
      step = parseFloat(step);
      value = Math.round(value / step) * step;
    }

    let min = this.min;
    if (min !== '') {
      min = parseFloat(min);
      value = Math.max(min, value);
    }

    let max = this.max;
    if (max !== '') {
      max = parseFloat(max);
      value = Math.min(max, value);
    }

    this.value = value;

    this.dispatchEvent(new CustomEvent('change', {
      detail: {
        value: this.value,
      },
      bubbles: true,
    }));
  }

  __onBlur(e) {
    this.__onChange(e);
  }

  __onClick(e) {
    this.__onChange(e);
  }

  __onSubmit(e) {
    e.preventDefault();
    this._form.blur();
    return false;
  }
}

window.customElements.define('webthing-level-property', LevelProperty);
module.exports = LevelProperty;
