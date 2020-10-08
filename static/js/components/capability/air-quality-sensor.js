/**
 * AirQualityCapability
 *
 * A bubble showing an air quality sensor icon.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const LabelCapability = require('./label');

class AirQualityCapability extends LabelCapability {
}

window.customElements.define('webthing-air-quality-sensor-capability',
                             AirQualityCapability);
module.exports = AirQualityCapability;
