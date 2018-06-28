/**
 * EnergyMonitor
 *
 * UI element representing a device which can monitor power usage.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const CurrentDetail = require('./property-detail/current');
const FrequencyDetail = require('./property-detail/frequency');
const InstantaneousPowerDetail =
  require('./property-detail/instantaneous-power');
const LevelDetail = require('./property-detail/level');
const OnOffDetail = require('./property-detail/on-off');
const Thing = require('./thing');
const VoltageDetail = require('./property-detail/voltage');

class EnergyMonitor extends Thing {
  /**
   * EnergyMonitor Constructor (extends Thing).
   *
   * @param {Object} description Thing description object.
   * @param {String} format 'svg', 'html', or 'htmlDetail'.
   */
  constructor(description, format) {
    super(
      description,
      format,
      {
        // TODO: change icon
      },
      {
        on: OnOffDetail,
        level: LevelDetail,
        instantaneousPower: InstantaneousPowerDetail,
        voltage: VoltageDetail,
        current: CurrentDetail,
        frequency: FrequencyDetail,
      }
    );
  }

  get icon() {
    return this.element.querySelector('webthing-energy-monitor-capability');
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
    if (property['@type'] === 'InstantaneousPowerProperty' ||
        name === 'instantaneousPower') {
      value = parseFloat(value);
      this.icon.power = value;
    }
  }

  iconView() {
    return `
      <webthing-energy-monitor-capability>
      </webthing-energy-monitor-capability>`;
  }
}

module.exports = EnergyMonitor;
