/**
 * LeakProperty
 *
 * A bubble showing a leak label.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const StringLabelProperty = require('./string-label');

class LeakProperty extends StringLabelProperty {
}

window.customElements.define('webthing-leak-property', LeakProperty);
module.exports = LeakProperty;
