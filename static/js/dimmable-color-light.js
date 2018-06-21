/**
 * Dimmable Color Light
 *
 * UI element representing a light with control over its color and an
 * independent dimming function
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const ColorLight = require('./color-light');
const DimmableLight = require('./dimmable-light');
const BrightnessDetail = require('./brightness-detail');

/**
 * DimmableColorLight Constructor (extends ColorLight).
 *
 * @param Object description Thing description object.
 * @param {String} format 'svg', 'html', or 'htmlDetail'.
 */
function DimmableColorLight(description, format) {
  this.displayedProperties = this.displayedProperties || {};
  if (description.properties) {
    this.displayedProperties.level = {
      href: description.properties.level.href,
      detail: new BrightnessDetail(this, 'level'),
    };
  }

  this.base = ColorLight;
  this.base(description, format);

  return this;
}

DimmableColorLight.prototype = Object.create(ColorLight.prototype);

/**
 * Update the display for the provided property.
 * @param {string} name - name of the property
 * @param {*} value - value of the property
 */
DimmableColorLight.prototype.updateProperty = function(name, value) {
  switch (name) {
    case 'on':
      this.updateOn(value);
      break;
    case 'level':
      this.updateBrightness(value);
      break;
    case 'color':
      this.updateColor(value);
      break;
    case 'colorTemperature':
      this.updateColorTemperature(value);
      break;
  }
};

/**
 * @param {number} brightness
 */
DimmableColorLight.prototype.updateBrightness = function(brightness) {
  DimmableLight.prototype.updateBrightness.call(this, brightness);
};

/**
 * @param {number} brightness
 */
DimmableColorLight.prototype.setBrightness = function(brightness) {
  DimmableLight.prototype.setBrightness.call(this, brightness);
};

DimmableColorLight.prototype.iconView = function() {
  if (this.displayedProperties.hasOwnProperty('color')) {
    return `
      <webthing-light-capability data-have-brightness="true"
        data-have-color="true">
      </webthing-light-capability>`;
  } else if (this.displayedProperties.hasOwnProperty('colorTemperature')) {
    return `
      <webthing-light-capability data-have-brightness="true"
        data-have-color-temperature="true">
      </webthing-light-capability>`;
  }
};

module.exports = DimmableColorLight;
