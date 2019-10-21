/**
 * Alarm.
 *
 * UI element representing an Alarm.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const Thing = require('./thing');

class Alarm extends Thing {
  /**
   * Alarm Constructor (extends Thing).
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
        baseIcon: '/optimized-images/thing-icons/alarm.svg',
      }
    );
  }

  /**
   * Find any properties required for this view.
   */
  findProperties() {
    this.alarmProperty = null;

    // Look for properties by type first.
    for (const name in this.displayedProperties) {
      const type = this.displayedProperties[name].property['@type'];

      if (type === 'AlarmProperty') {
        this.alarmProperty = name;
        break;
      }
    }

    // If necessary, match on name.
    if (this.alarmProperty === null && this.displayedProperties.alarm) {
      this.alarmProperty = 'alarm';
    }
  }

  get icon() {
    return this.element.querySelector('webthing-alarm-capability');
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

    if (name === this.alarmProperty) {
      this.icon.alarm = !!value;
    }
  }

  iconView() {
    return `
      <webthing-alarm-capability>
      </webthing-alarm-capability>`;
  }
}

module.exports = Alarm;
