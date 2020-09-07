/**
 * Barometric pressure sensor.
 *
 * UI element representing a barometric pressure sensor.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const Thing = require('./thing');
const Units = require('../../units');
const Utils = require('../../utils');

class BarometricPressureSensor extends Thing {
  /**
   * BarometricPressureSensor Constructor (extends Thing).
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
        baseIcon: '/images/thing-icons/multi_level_sensor.svg',
      }
    );
  }

  /**
   * Find any properties required for this view.
   */
  findProperties() {
    this.barometricPressureProperty = null;

    // Look for properties by type first.
    for (const name in this.displayedProperties) {
      const type = this.displayedProperties[name].property['@type'];

      if (type === 'BarometricPressureProperty') {
        this.barometricPressureProperty = name;
        break;
      }
    }

    this.precision = 0;
    this.unit = '';

    if (this.barometricPressureProperty) {
      const property =
        // eslint-disable-next-line max-len
        this.displayedProperties[this.barometricPressureProperty].convertedProperty;

      if (property.hasOwnProperty('multipleOf') &&
        `${property.multipleOf}`.includes('.')) {
        this.precision = `${property.multipleOf}`.split('.')[1].length;
      }

      if (property.hasOwnProperty('unit')) {
        this.unit = property.unit;
      }
    }
  }

  get icon() {
    // eslint-disable-next-line max-len
    return this.element.querySelector('webthing-barometric-pressure-sensor-capability');
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

    if (name === this.barometricPressureProperty) {
      value = parseFloat(value);
      this.icon.level = value;
    }
  }

  iconView() {
    const unit = Utils.escapeHtml(Units.nameToAbbreviation(this.unit));
    return `
      <webthing-barometric-pressure-sensor-capability data-unit="${unit}"
        data-precision="${this.precision}">
      </webthing-barometric-pressure-sensor-capability>`;
  }
}

module.exports = BarometricPressureSensor;
