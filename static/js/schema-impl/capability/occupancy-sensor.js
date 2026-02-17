/**
 * Occupancy Sensor.
 *
 * UI element representing an Occupancy Sensor.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const Thing = require('./thing');

class OccupancySensor extends Thing {
  /**
   * OccupancySensor Constructor (extends Thing).
   *
   * @param {Object} description Thing description object.
   * @param {Number} format See Constants.ThingFormat
   */
  constructor(model, description, format) {
    super(model, description, format, {
      baseIcon: '/images/thing-icons/occupancy_sensor.svg',
    });
  }

  /**
   * Find any properties required for this view.
   */
  findProperties() {
    this.occupiedProperty = null;

    // Look for properties by type first.
    for (const name in this.displayedProperties) {
      const type = this.displayedProperties[name].property['@type'];

      if (type === 'OccupiedProperty') {
        this.occupiedProperty = name;
        break;
      }
    }

    // If necessary, match on name.
    if (this.occupiedProperty === null && this.displayedProperties.occupied) {
      this.occupiedProperty = 'occupied';
    }
  }

  get icon() {
    return this.element.querySelector('webthing-occupancy-sensor-capability');
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

    if (name === this.occupiedProperty) {
      this.icon.occupied = !!value;
    }
  }

  iconView() {
    return `
      <webthing-occupancy-sensor-capability>
      </webthing-occupancy-sensor-capability>`;
  }
}

module.exports = OccupancySensor;
