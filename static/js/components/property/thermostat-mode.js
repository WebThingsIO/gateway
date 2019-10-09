/**
 * ThermostatModeProperty
 *
 * A bubble showing a thermostat mode selector.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const EnumProperty = require('./enum');

class ThermostatModeProperty extends EnumProperty {
  constructor() {
    super();
    this._upperCaseOptions = true;
  }
}

window.customElements.define('webthing-thermostat-mode-property',
                             ThermostatModeProperty);
module.exports = ThermostatModeProperty;
