/**
 * AirQuality sensor.
 *
 * UI element representing an air quality sensor.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const Thing = require('./thing');
const Units = require('../../units');
const Utils = require('../../utils');

class AirQualitySensor extends Thing {
  /**
   * AirQualitySensor Constructor (extends Thing).
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
    this.airQualityProperty = null;

    // Look for properties by type first.
    for (const name in this.displayedProperties) {
      const type = this.displayedProperties[name].property['@type'];

      if (type === 'ConcentrationProperty') {
        this.airQualityProperty = name;
        break;
      }

      if (type === 'DensityProperty') {
        this.airQualityProperty = name;
        break;
      }
    }

    this.precision = 0;
    this.unit = '';

    if (this.airQualityProperty) {
      const property =
        this.displayedProperties[this.airQualityProperty].convertedProperty;

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
    return this.element.querySelector('webthing-air-quality-sensor-capability');
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

    if (name === this.airQualityProperty) {
      value = parseFloat(value);
      this.icon.level = value;
    }
  }

  iconView() {
    const unit = Utils.escapeHtml(Units.nameToAbbreviation(this.unit));
    return `
      <webthing-air-quality-sensor-capability data-unit="${unit}"
        data-precision="${this.precision}">
      </webthing-air-quality-sensor-capability>`;
  }
}

module.exports = AirQualitySensor;
