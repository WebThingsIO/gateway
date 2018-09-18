/**
 * Action
 *
 * A bubble showing an action button.
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

    .webthing-action-container {
      width: 10rem;
      height: 10rem;
      border-radius: 5rem;
      border: 0.2rem solid white;
      background-color: #89b6d6;
      position: relative;
    }

    .webthing-action-contents {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .webthing-action-button {
      background-color: #698ba4;
      text-transform: uppercase;
      height: 4rem;
      width: 8rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      border: none;
      border-radius: 0.5rem;
      padding: 1rem;
      color: #fff;
      z-index: 10;
    }

    .webthing-action-button:hover {
      background-color: #59768a;
    }

    .webthing-action-button:active {
      background-color: #496071;
    }

    .webthing-action-button:disabled {
      background-color: #79a1bd;
    }

    .webthing-action-button::-moz-focus-inner {
      border: 0;
    }

    .webthing-action-name {
      text-align: center;
      max-width: 10rem;
      overflow-wrap: break-word;
      background-color: #5d9bc7;
      display: inline-block;
    }
  </style>
  <div id="container" class="webthing-action-container">
    <div id="contents" class="webthing-action-contents">
      <button id="button" type="button" class="webthing-action-button"></button>
    </div>
  </div>
  <div id="name" class="webthing-action-name"></div>
`;

class Action extends BaseComponent {
  constructor() {
    super(template);

    this._button = this.shadowRoot.querySelector('#button');
    this._name = this.shadowRoot.querySelector('#name');
    this._href = null;

    this._onClick = this.__onClick.bind(this);
  }

  connectedCallback() {
    this.name = this.dataset.name;

    this._upgradeProperty('href');

    this._button.addEventListener('click', this._onClick);
  }

  disconnectedCallback() {
    this._button.removeEventListener('click', this._onClick);
  }

  get href() {
    return this._href;
  }

  set href(value) {
    this._href = value;
  }

  get name() {
    return this._name.innerText;
  }

  set name(value) {
    this._button.innerText = value;
    this._name.innerText = value;
  }

  __onClick(e) {
    e.preventDefault();
    e.stopPropagation();

    if (this._href) {
      window.location.href = this._href;
    } else {
      this.value = e.target.value;

      this.dispatchEvent(new CustomEvent('click', {
        bubbles: true,
      }));
    }
  }
}

window.customElements.define('webthing-action', Action);
module.exports = Action;
