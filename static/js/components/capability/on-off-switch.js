/**
 * OnOffSwitchCapability
 *
 * A bubble showing an on/off switch icon.
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
      cursor: default;
    }

    .webthing-on-off-switch-capability-icon {
      width: 12.8rem;
      height: 12.8rem;
      border-radius: 6.4rem;
      background-size: 12.8rem;
      background-repeat: no-repeat;
      transform: translate(0);
      background-color: #5d9bc7;
      background-image: url('/optimized-images/component-icons/on-off-switch.png');
    }

    .webthing-on-off-switch-capability-icon.on {
      background-image: url('/optimized-images/component-icons/on-off-switch-on.png');
    }

    .webthing-on-off-switch-capability-icon.off {
      background-image: url('/optimized-images/component-icons/on-off-switch-off.png');
    }
  </style>
  <div id="icon" class="webthing-on-off-switch-capability-icon"></div>
`;

class OnOffSwitchCapability extends BaseComponent {
  constructor() {
    super(template);

    this._icon = this.shadowRoot.querySelector('#icon');
    this._on = false;
    this._onClick = this.__onClick.bind(this);
  }

  connectedCallback() {
    this.on = typeof this.dataset.on !== 'undefined' ? this.dataset.on : null;
    this._icon.addEventListener('click', this._onClick);
  }

  disconnectedCallback() {
    this._icon.removeEventListener('click', this._onClick);
  }

  get on() {
    return this._on;
  }

  set on(value) {
    this._on = Boolean(value);

    if (value === true) {
      this._icon.classList.remove('off');
      this._icon.classList.add('on');
    } else if (value === false) {
      this._icon.classList.remove('on');
      this._icon.classList.add('off');
    } else {
      this._icon.classList.remove('on');
      this._icon.classList.remove('off');
    }
  }

  __onClick(e) {
    e.preventDefault();
    e.stopPropagation();

    this.dispatchEvent(new CustomEvent('click', {
      bubbles: true,
    }));
  }
}

window.customElements.define('webthing-on-off-switch-capability',
                             OnOffSwitchCapability);
module.exports = OnOffSwitchCapability;
