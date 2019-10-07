/**
 * HeatingCoolingProperty
 *
 * A bubble showing a heating/cooling label.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const StringLabelProperty = require('./string-label');

class HeatingCoolingProperty extends StringLabelProperty {
}

window.customElements.define('webthing-heating-cooling-property',
                             HeatingCoolingProperty);
module.exports = HeatingCoolingProperty;
