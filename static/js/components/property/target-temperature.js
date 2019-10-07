/**
 * TargetTemperatureProperty
 *
 * A bubble showing a target temperature selector.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const NumberProperty = require('./number');

class TargetTemperatureProperty extends NumberProperty {
  constructor() {
    super();
    this._oneLine = true;
  }
}

window.customElements.define('webthing-target-temperature-property',
                             TargetTemperatureProperty);
module.exports = TargetTemperatureProperty;
