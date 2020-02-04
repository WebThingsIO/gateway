/**
 * Motion Sensor.
 *
 * UI element representing a Motion Sensor.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const Thing = require('./thing');

class MotionSensor extends Thing {
  /**
   * MotionSensor Constructor (extends Thing).
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
        baseIcon: '/images/thing-icons/motion_sensor.svg',
      }
    );
  }

  /**
   * Find any properties required for this view.
   */
  findProperties() {
    this.motionProperty = null;

    // Look for properties by type first.
    for (const name in this.displayedProperties) {
      const type = this.displayedProperties[name].property['@type'];

      if (type === 'MotionProperty') {
        this.motionProperty = name;
        break;
      }
    }

    // If necessary, match on name.
    if (this.motionProperty === null && this.displayedProperties.motion) {
      this.motionProperty = 'motion';
    }
  }

  get icon() {
    return this.element.querySelector('webthing-motion-sensor-capability');
  }

  /**
   * Update the display for the provided property.
   * @param {string} name - name of the property
   * @param {*} value - value of the property
   */
  updateProperty(name, value) {
    value = super.updateProperty(name, value);

    if (!this.displayedProperties.hasOwnProperty(name)) {
      return;
    }

    if (name === this.motionProperty) {
      this.icon.motion = !!value;
    }
  }

  iconView() {
    return `
      <webthing-motion-sensor-capability>
      </webthing-motion-sensor-capability>`;
  }
}

module.exports = MotionSensor;
