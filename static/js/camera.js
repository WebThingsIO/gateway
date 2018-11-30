/**
 * Camera.
 *
 * UI element representing a Camera.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const Thing = require('./thing');

class Camera extends Thing {
  /**
   * Camera Constructor (extends Thing).
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
        baseIcon: '/optimized-images/thing-icons/camera.svg',
      }
    );
  }

  /**
   * Find any properties required for this view.
   */
  findProperties() {
    this.imageProperty = null;

    // Look for properties by type first.
    for (const name in this.displayedProperties) {
      const type = this.displayedProperties[name].property['@type'];

      if (type === 'ImageProperty') {
        this.imageProperty = name;
        break;
      }
    }
  }

  get icon() {
    return this.element.querySelector('webthing-camera-capability');
  }

  iconView() {
    return `
      <webthing-camera-capability>
      </webthing-camera-capability>`;
  }
}

module.exports = Camera;
