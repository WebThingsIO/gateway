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

/* globals Thing */

/**
 * MultiLevelSensor Constructor (extends Thing).
 *
 * @param Object description Thing description object.
 */
var MultiLevelSensor = function(description, format) {
  this.base = Thing;
  this.base(description, format, {svgBaseIcon: '/images/binary-sensor.svg',
                                  pngBaseIcon: '/images/binary-sensor.png',
                                  thingCssClass: 'multi-level-sensor',
                                  addIconToView: false});
  if (format == 'svg') {
    // For now the SVG view is just a link.
    return this;
  }
  // Parse level property URL
  if (this.propertyDescriptions.level &&
    this.propertyDescriptions.level.href) {
    this.levelPropertyUrl =
      new URL(this.propertyDescriptions.level.href, this.href);
  }
  this.levelText = this.element.querySelector('.multi-level-sensor-text');
  this.updateStatus();
  return this;
};

MultiLevelSensor.prototype = Object.create(Thing.prototype);

/**
 * Update the level status of the multi level sensor.
 */
MultiLevelSensor.prototype.updateStatus = function() {
  if (!this.levelPropertyUrl) {
    return;
  }
  var opts = {
    headers: {
      'Authorization': `Bearer ${window.API.jwt}`,
      'Accept': 'application/json'
    }
  };
  fetch(this.levelPropertyUrl, opts).then((function(response) {
    return response.json();
  }).bind(this)).then((function(response) {
    this.properties.level = response.level;
    if (response.level === null) {
      return;
    } else {
      this.showLevel(response.level);
    }
  }).bind(this)).catch(function(error) {
    console.error('Error fetching sensor level status ' + error);
  });
};

/**
 * Handle a 'propertyStatus' message
 * @param {Object} properties - property data
 */
MultiLevelSensor.prototype.onPropertyStatus = function(data) {
  if (!data.hasOwnProperty('level')) {
    return;
  }
  this.properties.level = data.level;
  if (data.level === null) {
    return;
  }
  this.showLevel(data.level);
};

/**
 * Show level.
 */
MultiLevelSensor.prototype.showLevel = function(level) {
  this.levelText.innerText = `${level}%`;
};

MultiLevelSensor.prototype.iconView = function() {
  let level = 0;
  if (typeof(this.properties.level) !== 'undefined') {
    level = this.properties.level;
  }

  return `<div class="multi-level-sensor-text">${level}%</div>`;
};

/**
 * HTML view for Multi level sensor
 */
MultiLevelSensor.prototype.htmlView = function() {
  return `<div class="thing multi-level-sensor">
    ${this.iconView()}
    <span class="thing-name">${this.name}</span>
  </div>`;
};

/**
 * HTML detail view for Multi level sensor
 */
MultiLevelSensor.prototype.htmlDetailView = function() {
  return `<div class="thing multi-level-sensor">
    ${this.iconView()}
  </div>`;
};
