/**
 * HumidityProperty
 *
 * A bubble showing a humidity label.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const NumericLabelProperty = require('./numeric-label');

class HumidityProperty extends NumericLabelProperty {
}

window.customElements.define('webthing-humidity-property',
                             HumidityProperty);
module.exports = HumidityProperty;
