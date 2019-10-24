/**
 * Multi level sensor.
 *
 * UI element representing a sensor with multiple levels.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const Thing = require('./thing');
const Units = require('../../units');
const Utils = require('../../utils');

class MultiLevelSensor extends Thing {
  /**
   * MultiLevelSensor Constructor (extends Thing).
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
        baseIcon: '/optimized-images/thing-icons/multi_level_sensor.svg',
      }
    );
  }

  /**
   * Find any properties required for this view.
   */
  findProperties() {
    this.levelProperty = null;

    // Look for properties by type first.
    for (const name in this.displayedProperties) {
      const type = this.displayedProperties[name].property['@type'];

      if (type === 'LevelProperty') {
        this.levelProperty = name;
        break;
      }
    }

    // If necessary, match on name.
    if (this.levelProperty === null &&
        this.displayedProperties.hasOwnProperty('level')) {
      this.levelProperty = 'level';
    }

    this.precision = 0;
    this.unit = '';

    if (this.levelProperty) {
      const property =
        this.displayedProperties[this.levelProperty].convertedProperty;

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
    return this.element.querySelector('webthing-multi-level-sensor-capability');
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

    if (name === this.levelProperty) {
      value = parseFloat(value);
      this.icon.level = value;
    }
  }

  iconView() {
    const unit = Utils.escapeHtml(Units.nameToAbbreviation(this.unit));
    return `
      <webthing-multi-level-sensor-capability data-unit="${unit}"
        data-precision="${this.precision}">
      </webthing-multi-level-sensor-capability>`;
  }
}

module.exports = MultiLevelSensor;
