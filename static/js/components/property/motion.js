/**
 * MotionProperty
 *
 * A bubble showing a motion label.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const StringLabelProperty = require('./string-label');

class MotionProperty extends StringLabelProperty {
}

window.customElements.define('webthing-motion-property', MotionProperty);
module.exports = MotionProperty;
