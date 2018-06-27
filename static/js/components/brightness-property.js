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

const SliderProperty = require('./slider-property');

class BrightnessProperty extends SliderProperty {
  connectedCallback() {
    this.min = '0';
    this.max = '100';
    this.step = '1';
    super.connectedCallback();
  }
}

window.customElements.define('webthing-brightness-property',
                             BrightnessProperty);
module.exports = BrightnessProperty;
