/**
 * InstantaneousPowerFactorProperty
 *
 * A bubble showing an instantaneous power factor label.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const NumericLabelProperty = require('./numeric-label');

class InstantaneousPowerFactorProperty extends NumericLabelProperty {
}

window.customElements.define('webthing-instantaneous-power-factor-property',
                             InstantaneousPowerFactorProperty);
module.exports = InstantaneousPowerFactorProperty;
