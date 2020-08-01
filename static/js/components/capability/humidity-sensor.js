/**
 * HumiditySensorCapability
 *
 * A bubble showing a humidity sensor icon.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const LabelCapability = require('./label');

class HumiditySensorCapability extends LabelCapability {
}

window.customElements.define('webthing-humidity-sensor-capability',
                             HumiditySensorCapability);
module.exports = HumiditySensorCapability;
