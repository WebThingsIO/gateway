/**
 * ColorTemperatureProperty
 *
 * A bubble showing a color temperature slider and input.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const LevelProperty = require('./level-property');

class ColorTemperatureProperty extends LevelProperty {
  connectedCallback() {
    super.connectedCallback();
    this.unit = 'K';
    this.step = '1';
  }
}

window.customElements.define('webthing-color-temperature-property',
                             ColorTemperatureProperty);
module.exports = ColorTemperatureProperty;
