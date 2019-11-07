/**
 * ColorSensorCapability
 *
 * A bubble showing a color icon.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const ColorControlCapability = require('./color-control');

class ColorSensorCapability extends ColorControlCapability {
}

window.customElements.define('webthing-color-sensor-capability',
                             ColorSensorCapability);
module.exports = ColorSensorCapability;
