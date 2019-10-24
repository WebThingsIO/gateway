/**
 * Light
 *
 * UI element representing  Light.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const OnOffSwitch = require('./on-off-switch');

class Light extends OnOffSwitch {
  /**
   * Light Constructor (extends OnOffSwitch).
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
        baseIcon: '/optimized-images/thing-icons/light.svg',
      }
    );
  }

  /**
   * Find any properties required for this view.
   */
  findProperties() {
    super.findProperties();

    this.brightnessProperty = null;
    this.colorProperty = null;
    this.colorTemperatureProperty = null;

    // Look for properties by type first.
    for (const name in this.displayedProperties) {
      const type = this.displayedProperties[name].property['@type'];

      if (this.brightnessProperty === null && type === 'BrightnessProperty') {
        this.brightnessProperty = name;
      } else if (this.colorProperty === null && type === 'ColorProperty') {
        this.colorProperty = name;
      } else if (this.colorTemperatureProperty === null &&
                 type === 'ColorTemperatureProperty') {
        this.colorTemperatureProperty = name;
      }
    }

    // If necessary, match on name.
    if (this.brightnessProperty === null &&
        this.displayedProperties.hasOwnProperty('level')) {
      this.brightnessProperty = 'level';
    }

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
    return this.element.querySelector('webthing-light-capability');
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

    if (name === this.brightnessProperty) {
      value = parseInt(value, 10);
      this.icon.brightness = value;
    } else if (name === this.colorProperty) {
      this.icon.color = value;
    } else if (name === this.colorTemperatureProperty) {
      value = parseInt(value, 10);
      this.icon.colorTemperature = value;
    }
  }

  iconView() {
    let color = '';
    if (this.colorProperty !== null) {
      color = 'data-have-color="true"';
    } else if (this.colorTemperatureProperty !== null) {
      color = 'data-have-color-temperature="true"';
    }

    let brightness = '';
    if (this.brightnessProperty !== null) {
      brightness = 'data-have-brightness="true"';
    }

    return `
      <webthing-light-capability ${color} ${brightness}>
      </webthing-light-capability>`;
  }
}

module.exports = Light;
