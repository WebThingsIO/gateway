/**
 * ColorModeProperty
 *
 * A bubble showing a color mode selector.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const EnumProperty = require('./enum');

class ColorModeProperty extends EnumProperty {
  constructor() {
    super();
    this._upperCaseOptions = true;
  }
}

window.customElements.define('webthing-color-mode-property', ColorModeProperty);
module.exports = ColorModeProperty;
