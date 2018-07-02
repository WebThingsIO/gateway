/**
 * EnergyMonitorCapability
 *
 * A bubble showing an energy monitor icon.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const LabelCapability = require('./label');

class EnergyMonitorCapability extends LabelCapability {
  connectedCallback() {
    this.unit = 'W';
    this.precision = 0;
    super.connectedCallback();
  }

  get power() {
    return this.level;
  }

  set power(value) {
    this.level = value;
  }
}

window.customElements.define('webthing-energy-monitor-capability',
                             EnergyMonitorCapability);
module.exports = EnergyMonitorCapability;
