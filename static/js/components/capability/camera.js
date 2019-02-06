/**
 * CameraCapability
 *
 * A bubble showing a camera icon.
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

    .webthing-camera-capability-icon {
      box-sizing: border-box;
      width: 12.8rem;
      height: 12.8rem;
      border-radius: 6.4rem;
      border: 0.2rem solid white;
      background-size: 6.4rem;
      background-repeat: no-repeat;
      transform: translate(0);
      background-color: #89b6d6;
      background-image: url('/optimized-images/component-icons/camera.svg');
      background-position: center;
    }
  </style>
  <div id="icon" class="webthing-camera-capability-icon"></div>
`;

class CameraCapability extends BaseComponent {
  constructor() {
    super(template);
  }
}

window.customElements.define('webthing-camera-capability', CameraCapability);
module.exports = CameraCapability;
