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
   * @param {String} format 'svg', 'html', or 'htmlDetail'.
   */
  constructor(description, format) {
    super(
      description,
      format,
      {
        baseIcon: '/optimized-images/thing-icons/light.svg',
      }
    );
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
    super.updateProperty(name, value);

    if (!this.displayedProperties.hasOwnProperty(name)) {
      return;
    }

    const property = this.displayedProperties[name].property;
    if (property['@type'] === 'OnOffProperty' || name === 'on') {
      this.icon.on = !!value;
    } else if (property['@type'] === 'BrightnessProperty' ||
               name === 'brightness') {
      value = parseInt(value, 10);
      this.icon.brightness = value;
    } else if (property['@type'] === 'ColorProperty' || name === 'color') {
      this.icon.color = value;
    } else if (property['@type'] === 'ColorTemperatureProperty' ||
               name === 'colorTemperature') {
      value = parseInt(value, 10);
      this.icon.colorTemperature = value;
    }
  }

  iconView() {
    let color = '';
    if (this.displayedProperties.hasOwnProperty('color')) {
      color = 'data-have-color="true"';
    } else if (this.displayedProperties.hasOwnProperty('colorTemperature')) {
      color = 'data-have-color-temperature="true"';
    }

    let brightness = '';
    if (this.displayedProperties.hasOwnProperty('level')) {
      brightness = 'data-have-brightness="true"';
    }

    return `
      <webthing-light-capability ${color} ${brightness}>
      </webthing-light-capability>`;
  }
}

module.exports = Light;
