/**
 * BarometricPressureCapability
 *
 * A bubble showing a barometric pressure sensor icon.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const LabelCapability = require('./label');

class BarometricPressureCapability extends LabelCapability {
}

window.customElements.define('webthing-barometric-pressure-sensor-capability',
                             BarometricPressureCapability);
module.exports = BarometricPressureCapability;
