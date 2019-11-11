/**
 * ColorSensor
 *
 * UI element representing a device which can detect color.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const ColorControl = require('./color-control');

class ColorSensor extends ColorControl {
  get icon() {
    return this.element.querySelector('webthing-color-sensor-capability');
  }

  iconView() {
    return `
      <webthing-color-sensor-capability>
      </webthing-color-sensor-capability>`;
  }
}

module.exports = ColorSensor;
