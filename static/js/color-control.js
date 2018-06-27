/**
 * ColorControl
 *
 * UI element representing a device which can change color.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const Thing = require('./thing');
const Utils = require('./utils');

class ColorControl extends Thing {
  /**
   * ColorControl Constructor (extends Thing).
   *
   * @param {Object} description Thing description object.
   * @param {String} format 'svg', 'html', or 'htmlDetail'.
   */
  // eslint-disable-next-line no-useless-constructor
  constructor(description, format) {
    super(description, format);
    // TODO: change icon
  }

  get icon() {
    return this.element.querySelector('webthing-color-control-capability');
  }

  /**
   * Update the display for the provided property.
   * @param {string} name - name of the property
   * @param {*} value - value of the property
   */
  updateProperty(name, value) {
    super.updateProperty(name, value);

    if (!this.displayedProperties.hasOwnProperty(name)) {
      return;
    }

    const property = this.displayedProperties[name].property;
    if (property['@type'] === 'ColorProperty' || name === 'color') {
      this.icon.color = value;
    } else if (property['@type'] === 'ColorTemperatureProperty' ||
               name === 'colorTemperature') {
      value = parseInt(value, 10);
      this.icon.color = Utils.colorTemperatureToRGB(value);
    }
  }

  iconView() {
    return `
      <webthing-color-control-capability>
      </webthing-color-control-capability>`;
  }
}

module.exports = ColorControl;
