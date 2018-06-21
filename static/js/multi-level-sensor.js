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
const Utils = require('./utils');

/**
 * MultiLevelSensor Constructor (extends Thing).
 *
 * @param Object description Thing description object.
 */
const MultiLevelSensor = function(description, format) {
  this.displayedProperties = this.displayedProperties || {};
  if (description.properties) {
    const unit =
      Utils.unitNameToAbbreviation(description.properties.level.unit || '');
    this.displayedProperties.level = {
      href: description.properties.level.href,
      unit: unit,
    };
  }

  this.base = Thing;
  this.base(description, format, {svgBaseIcon: '/images/binary-sensor.svg',
                                  pngBaseIcon: '/images/binary-sensor.png'});

  if (format === 'svg') {
    // For now the SVG view is just a link.
    return this;
  }

  this.switch =
    this.element.querySelector('webthing-multi-level-sensor-capability');

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
  switch (name) {
    case 'level':
      this.updateLevel(value);
      break;
  }
};

MultiLevelSensor.prototype.updateLevel = function(level) {
  level = parseFloat(level);
  this.properties.level = level;
  this.switch.level = level;
};

MultiLevelSensor.prototype.iconView = function() {
  const unit = Utils.escapeHtml(this.displayedProperties.level.unit);
  return `
    <webthing-multi-level-sensor-capability data-unit="${unit}">
    </webthing-multi-level-sensor-capability>`;
};

module.exports = MultiLevelSensor;
