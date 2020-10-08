/**
 * DensityProperty
 *
 * A bubble showing a density label.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const NumericLabelProperty = require('./numeric-label');

class DensityProperty extends NumericLabelProperty {
}

window.customElements.define('webthing-density-property',
                             DensityProperty);
module.exports = DensityProperty;
