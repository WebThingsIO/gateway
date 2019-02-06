/**
 * VideoCameraCapability
 *
 * A bubble showing a video camera icon.
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

    .webthing-video-camera-capability-icon {
      box-sizing: border-box;
      width: 12.8rem;
      height: 12.8rem;
      border-radius: 6.4rem;
      border: 0.2rem solid white;
      background-size: 6.4rem;
      background-repeat: no-repeat;
      transform: translate(0);
      background-color: #89b6d6;
      background-image: url('/optimized-images/component-icons/video-camera.svg');
      background-position: center;
    }
  </style>
  <div id="icon" class="webthing-video-camera-capability-icon"></div>
`;

class VideoCameraCapability extends BaseComponent {
  constructor() {
    super(template);
  }
}

window.customElements.define('webthing-video-camera-capability',
                             VideoCameraCapability);
module.exports = VideoCameraCapability;
