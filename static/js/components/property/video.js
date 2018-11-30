/**
 * VideoProperty
 *
 * A bubble showing a video icon.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const BaseComponent = require('../base-component');

class VideoProperty extends BaseComponent {
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

    .webthing-video-property-container {
      box-sizing: border-box;
      width: 10rem;
      height: 10rem;
      border-radius: 5rem;
      border: 0.2rem solid white;
      background-size: 3.2rem;
      background-repeat: no-repeat;
      transform: translate(0);
      background-color: #89b6d6;
      background-image: url('/optimized-images/component-icons/video.svg');
      background-position: center;
      position: relative;
      cursor: pointer;
    }

    .webthing-video-property-name {
      text-align: center;
      max-width: 10rem;
      overflow-wrap: break-word;
      background-color: #5d9bc7;
      display: inline-block;
    }
  </style>
  <div id="container-${BaseComponent.count}" class="webthing-video-property-container"></div>
  <div id="name-${BaseComponent.count}" class="webthing-video-property-name"></div>
`;
    super(template);

    this._name = this.shadowRoot.querySelector('.webthing-video-property-name');
  }

  connectedCallback() {
    if (!this.name) {
      this.name = this.dataset.name;
    }
  }

  get name() {
    return this._name.innerText;
  }

  set name(value) {
    this._name.innerText = value;
  }
}

window.customElements.define('webthing-video-property', VideoProperty);
module.exports = VideoProperty;
