/**
 * BrightnessProperty
 *
 * A bubble showing a brightness slider.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const SliderProperty = require('./slider');

class BrightnessProperty extends SliderProperty {
}

window.customElements.define('webthing-brightness-property',
                             BrightnessProperty);
module.exports = BrightnessProperty;
