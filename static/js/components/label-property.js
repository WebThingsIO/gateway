/**
 * LabelProperty
 *
 * A bubble showing a label.
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
      display: inline-block;
      contain: content;
      text-align: center;
      color: white;
      font-size: 1.6rem;
    }

    .webthing-label-property-container {
      width: 10rem;
      height: 10rem;
      border-radius: 5rem;
      border: 0.2rem solid white;
      background-color: #89b6d6;
      position: relative;
    }

    .webthing-label-property-contents {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .webthing-label-property-value,
    .webthing-label-property-unit {
      font-weight: bold;
    }

    .webthing-label-property-name {
      text-align: center;
      max-width: 10rem;
      overflow-wrap: break-word;
      background-color: #5d9bc7;
      display: inline-block;
    }
  </style>
  <div id="container" class="webthing-label-property-container">
    <div id="contents" class="webthing-label-property-contents">
      <span id="value" class="webthing-label-property-value">
      </span><span id="unit" class="webthing-label-property-unit"></span>
    </div>
  </div>
  <div id="name" class="webthing-label-property-name"></div>
`;

class LabelProperty extends BaseComponent {
  constructor() {
    super(template);

    this._name = this.shadowRoot.querySelector('#name');
    this._value = this.shadowRoot.querySelector('#value');
    this._unit = this.shadowRoot.querySelector('#unit');
    this._precision = 0;
  }

  connectedCallback() {
    this.name = this.dataset.name;
    this.value =
      typeof this.dataset.value !== 'undefined' ? this.dataset.value : '';
    this.unit =
      typeof this.dataset.unit !== 'undefined' ? this.dataset.unit : '';
    this.precision = typeof this.dataset.precision !== 'undefined' ?
      this.dataset.precision :
      0;
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
    value = Number(value);
    this._value.innerText = value.toFixed(this.precision);
  }

  get unit() {
    return this._unit.innerText;
  }

  set unit(value) {
    this._unit.innerText = value;
  }

  get precision() {
    return this._precision;
  }

  set precision(value) {
    this._precision = parseInt(value, 10);
  }
}

window.customElements.define('webthing-label-property', LabelProperty);
module.exports = LabelProperty;
