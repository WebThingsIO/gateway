/**
 * EnumProperty
 *
 * A bubble showing an enum selector.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const BaseComponent = require('../base-component');

class EnumProperty extends BaseComponent {
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

    .webthing-enum-property-container {
      width: 10rem;
      height: 10rem;
      border-radius: 5rem;
      border: 0.2rem solid white;
      background-color: #89b6d6;
      position: relative;
    }

    .webthing-enum-property-contents {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .webthing-enum-property-select {
      height: 3rem;
      width: 7rem;
      text-align: center;
      text-align-last: center;
      background-color: #d2d9de;
      color: #333;
      border: none;
      border-radius: 0.5rem;
      padding: 0.5rem;
      margin: 0.5rem 0;
      font-size: 1.6rem;
    }

    .webthing-enum-property-unit.hidden {
      display: none;
    }

    .webthing-enum-property-name {
      text-align: center;
      max-width: 10rem;
      overflow-wrap: break-word;
      background-color: #5d9bc7;
      display: inline-block;
    }
  </style>
  <div id="container-${BaseComponent.count}" class="webthing-enum-property-container">
    <div id="contents-${BaseComponent.count}" class="webthing-enum-property-contents">
      <select id="select-${BaseComponent.count}" class="webthing-enum-property-select"></select>
      <div id="unit-${BaseComponent.count}" class="webthing-enum-property-unit"></div>
    </div>
  </div>
  <div id="name-${BaseComponent.count}" class="webthing-enum-property-name"></div>
`;
    super(template);

    this._select = this.shadowRoot.querySelector(
      '.webthing-enum-property-select');
    this._unit = this.shadowRoot.querySelector(
      '.webthing-enum-property-unit');
    this._name = this.shadowRoot.querySelector(
      '.webthing-enum-property-name');

    this._type = 'string';

    this._onChange = this.__onChange.bind(this);
  }

  connectedCallback() {
    this.name = this.dataset.name;
    this.value =
      typeof this.dataset.value !== 'undefined' ? this.dataset.value : '';
    this.unit =
      typeof this.dataset.unit !== 'undefined' ? this.dataset.unit : '';
    this.type =
      typeof this.dataset.type !== 'undefined' ? this.dataset.type : 'string';
    this.choices =
      typeof this.dataset.choices !== 'undefined' ?
        JSON.parse(atob(this.dataset.choices)) :
        [];
    this.readOnly =
      typeof this.dataset.readOnly !== 'undefined' ?
        this.dataset.readOnly === 'true' :
        false;

    this._upgradeProperty('value');

    this._select.addEventListener('change', this._onChange);
  }

  disconnectedCallback() {
    this._select.removeEventListener('change', this._onChange);
  }

  get value() {
    if (this._select.options.length === 0) {
      return '';
    }

    const val = this._select.options[this._select.selectedIndex].value;

    switch (this.type) {
      case 'integer':
        return parseInt(val, 10);
      case 'number':
        return parseFloat(val);
      case 'string':
      default:
        return val;
    }
  }

  set value(value) {
    value = `${value}`;
    this._select.value = value;
  }

  get readOnly() {
    return this._select.hasAttribute('disabled');
  }

  set readOnly(value) {
    const isDisabled = Boolean(value);
    if (isDisabled) {
      this._select.setAttribute('disabled', '');
    } else {
      this._select.removeAttribute('disabled');
    }

    this._select.disabled = isDisabled;
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

  get type() {
    return this._type;
  }

  set type(value) {
    this._type = value;
  }

  get choices() {
    return this._select.options;
  }

  set choices(value) {
    this._select.innerHTML = '';

    for (const choice of value) {
      const option = document.createElement('option');
      option.value = choice;
      option.innerText = choice;
      this._select.appendChild(option);
    }
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
    this.value = e.target.options[e.target.selectedIndex].value;

    this.dispatchEvent(new CustomEvent('change', {
      detail: {
        value: this.value,
      },
      bubbles: true,
    }));
  }
}

window.customElements.define('webthing-enum-property', EnumProperty);
module.exports = EnumProperty;
