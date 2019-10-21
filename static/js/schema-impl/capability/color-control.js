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
const Utils = require('../../utils');

class ColorControl extends Thing {
  /**
   * ColorControl Constructor (extends Thing).
   *
   * @param {Object} description Thing description object.
   * @param {Number} format See Constants.ThingFormat
   */
  constructor(model, description, format) {
    super(
      model,
      description,
      format,
      {
        baseIcon: '/optimized-images/thing-icons/color_control.svg',
      }
    );
  }

  /**
   * Find any properties required for this view.
   */
  findProperties() {
    this.colorProperty = null;
    this.colorTemperatureProperty = null;

    // Look for properties by type first.
    for (const name in this.displayedProperties) {
      const type = this.displayedProperties[name].property['@type'];

      if (this.colorProperty === null && type === 'ColorProperty') {
        this.colorProperty = name;
      } else if (this.colorTemperatureProperty === null &&
                 type === 'ColorTemperatureProperty') {
        this.colorTemperatureProperty = name;
      }
    }

    // If necessary, match on name.
    if (this.colorProperty === null &&
        this.displayedProperties.hasOwnProperty('color')) {
      this.colorProperty = 'color';
    }

    if (this.colorTemperatureProperty === null &&
        this.displayedProperties.hasOwnProperty('colorTemperature')) {
      this.colorTemperatureProperty = 'colorTemperature';
    }
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
    value = super.updateProperty(name, value);

    if (!this.displayedProperties.hasOwnProperty(name)) {
      return;
    }

    if (name === this.colorProperty) {
      this.icon.color = value;
    } else if (name === this.colorTemperatureProperty) {
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
