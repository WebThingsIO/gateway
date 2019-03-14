/**
 * Video Camera.
 *
 * UI element representing a Video Camera.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const Thing = require('./thing');

class VideoCamera extends Thing {
  /**
   * VideoCamera Constructor (extends Thing).
   *
   * @param {Object} description Thing description object.
   * @param {Number} format See Constants.ThingFormat
   */
  constructor(model, description, format) {
    super(
      model,
      description,
      format,
      {
        baseIcon: '/optimized-images/thing-icons/video_camera.svg',
      }
    );
  }

  /**
   * Find any properties required for this view.
   */
  findProperties() {
    this.imageProperty = null;
    this.videoProperty = null;

    // Look for properties by type first.
    for (const name in this.displayedProperties) {
      const type = this.displayedProperties[name].property['@type'];

      if (this.imageProperty === null && type === 'ImageProperty') {
        this.imageProperty = name;
      } else if (this.videoProperty === null && type === 'VideoProperty') {
        this.videoProperty = name;
      }
    }
  }

  get icon() {
    return this.element.querySelector('webthing-video-camera-capability');
  }

  iconView() {
    return `
      <webthing-video-camera-capability>
      </webthing-video-camera-capability>`;
  }
}

module.exports = VideoCamera;
