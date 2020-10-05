/**
 * ConcentrationProperty
 *
 * A bubble showing a concentration label.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const NumericLabelProperty = require('./numeric-label');

class ConcentrationProperty extends NumericLabelProperty {
}

window.customElements.define('webthing-concentration-property',
                             ConcentrationProperty);
module.exports = ConcentrationProperty;
