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

  if (format == 'svg') {
    // For now the SVG view is just a link.
    return this;
  }

  this.colorLightLabel.classList.add('level-bar-label');

  if (format === 'htmlDetail') {
    this.attachHtmlDetail();
  }

  return this;
}

DimmableColorLight.prototype = Object.create(ColorLight.prototype);

/**
 * Update the display for the provided property.
 * @param {string} name - name of the property
 * @param {*} value - value of the property
 */
DimmableColorLight.prototype.updateProperty = function(name, value) {
  if (name === 'on') {
    this.updateOn(value);
    if (this.properties.on) {
      this.colorLightLabel.textContent =
        `${Math.round(this.properties.level)}%`;
    }
  }
  if (name === 'color') {
    this.updateColor(value);
  }
  if (name === 'colorTemperature') {
    this.updateColorTemperature(value);
  }
  if (name === 'level') {
    this.updateLevel(value);
  }
};

/**
 * @param {number} level
 */
DimmableColorLight.prototype.updateLevel = function(level) {
  this.properties.level = level;
  if (this.properties.on) {
    this.colorLightLabel.textContent = `${Math.round(level)}%`;
  }

  if (this.format === 'htmlDetail') {
    this.displayedProperties.level.detail.update();
  }
};

/**
 * @param {number} level
 */
DimmableColorLight.prototype.setBrightness = function(level) {
  DimmableLight.prototype.setBrightness.call(this, level);
};

module.exports = DimmableColorLight;
