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
    super.updateProperty(name, value);

    if (!this.displayedProperties.hasOwnProperty(name)) {
      return;
    }

    if (name === this.levelProperty) {
      value = parseFloat(value);
      this.icon.level = value;
    }
  }

  iconView() {
    let unit = '';
    for (const name in this.displayedProperties) {
      const property = this.displayedProperties[name].property;
      if (name === 'level' || property['@type'] === 'LevelProperty') {
        unit = property.unit || '';
        break;
      }
    }

    unit = Utils.escapeHtml(Utils.unitNameToAbbreviation(unit));
    return `
      <webthing-multi-level-sensor-capability data-unit="${unit}">
      </webthing-multi-level-sensor-capability>`;
  }
}

module.exports = MultiLevelSensor;
