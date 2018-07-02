/**
 * MultiLevelSensorCapability
 *
 * A bubble showing a multi-level sensor icon.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const LabelCapability = require('./label');

class MultiLevelSensorCapability extends LabelCapability {
}

window.customElements.define('webthing-multi-level-sensor-capability',
                             MultiLevelSensorCapability);
module.exports = MultiLevelSensorCapability;
