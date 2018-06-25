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

const LevelDetail = require('./property-detail/level');
const Thing = require('./thing');
const Utils = require('./utils');

class MultiLevelSensor extends Thing {
  /**
   * MultiLevelSensor Constructor (extends Thing).
   *
   * @param {Object} description Thing description object.
   * @param {String} format 'svg', 'html', or 'htmlDetail'.
   */
  constructor(description, format) {
    super(
      description,
      format,
      {
        svgBaseIcon: '/images/binary-sensor.svg',
        pngBaseIcon: '/images/binary-sensor.png',
      },
      {
        level: LevelDetail,
      }
    );
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

    const property = this.displayedProperties[name].property;
    if (property['@type'] === 'LevelProperty' || name === 'level') {
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
