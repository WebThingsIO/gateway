/**
 * Multi level sensor.
 *
 * UI element representing a sensor with multiple levels.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const Thing = require('./thing');

/**
 * MultiLevelSensor Constructor (extends Thing).
 *
 * @param Object description Thing description object.
 */
const MultiLevelSensor = function(description, format) {
  this.displayedProperties = this.displayedProperties || {};
  if (description.properties) {
    this.displayedProperties.level = {
      href: description.properties.level.href,
    };
  }

  this.base = Thing;
  this.base(description, format, {svgBaseIcon: '/images/binary-sensor.svg',
                                  pngBaseIcon: '/images/binary-sensor.png',
                                  thingCssClass: 'multi-level-sensor',
                                  thingDetailCssClass: 'multi-level-sensor',
                                  addIconToView: false});

  if (format == 'svg') {
    // For now the SVG view is just a link.
    return this;
  }

  this.levelText = this.element.querySelector('.multi-level-sensor-text');
  if (format === 'htmlDetail') {
    this.attachHtmlDetail();
  }

  this.updateStatus();

  return this;
};

MultiLevelSensor.prototype = Object.create(Thing.prototype);

/**
 * Update the display for the provided property.
 * @param {string} name - name of the property
 * @param {*} value - value of the property
 */
MultiLevelSensor.prototype.updateProperty = function(name, value) {
  if (name !== 'level') {
    return;
  }
  this.properties.level = value;
  if (value === null) {
    return;
  }
  this.showLevel(value);
};

/**
 * Show level.
 */
MultiLevelSensor.prototype.showLevel = function(level) {
  this.levelText.innerText = `${Math.round(level)}%`;
};

MultiLevelSensor.prototype.iconView = function() {
  let level = 0;
  if (typeof this.properties.level !== 'undefined') {
    level = this.properties.level;
  }

  return `<div class="multi-level-sensor-text">${Math.round(level)}%</div>`;
};

module.exports = MultiLevelSensor;
