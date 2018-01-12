/**
 * Binary Sensor.
 *
 * UI element representing a Binary Sensor.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

/* globals Thing */

/**
 * BinarySensor Constructor (extends Thing).
 *
 * @param Object description Thing description object.
 */
var BinarySensor = function(description, format) {
  this.base = Thing;
  this.base(description, format);
  if (format == 'svg') {
    // For now the SVG view is just a link.
    return this;
  }
  // Parse on property URL
  if (this.propertyDescriptions.on &&
    this.propertyDescriptions.on.href) {
    this.onPropertyUrl =
      new URL(this.propertyDescriptions.on.href, this.href);
  }
  this.updateStatus();
  return this;
};

BinarySensor.prototype = Object.create(Thing.prototype);

/**
 * HTML view for Thing.
 */
BinarySensor.prototype.htmlView = function() {
  return '<div class="thing binary-sensor">' +
         '  <div class="thing-icon"></div>' +
         '  <span class="thing-name">' + this.name + '</span>' +
         '</div>';
};

/**
 * SVG view for binary sensor.
 */
BinarySensor.prototype.svgView = function() {
  return '<g transform="translate(' + this.x + ',' + this.y + ')"' +
         '  dragx="' + this.x + '" dragy="' + this.y + '"' +
         '  class="floorplan-thing">' +
         '  <a href="' + this.href +'" class="svg-thing-link">' +
         '    <circle cx="0" cy="0" r="5" class="svg-thing-icon" />' +
         '    <text x="0" y="8" text-anchor="middle" class="svg-thing-text">' +
                this.name.substring(0, 7) +
         '    </text>' +
         '  </a>' +
         '</g>';
};

/**
 * Update the on/off status of the binary sensor.
 */
BinarySensor.prototype.updateStatus = function() {
  if (!this.onPropertyUrl) {
    return;
  }
  var opts = {
    headers: {
      'Authorization': `Bearer ${window.API.jwt}`,
      'Accept': 'application/json'
    }
  };
  fetch(this.onPropertyUrl, opts).then((function(response) {
    return response.json();
  }).bind(this)).then((function(response) {
    this.properties.on = response.on;
    if (response.on === null) {
      return;
    } else if(response.on) {
      this.showOn();
    } else {
      this.showOff();
    }
  }).bind(this)).catch(function(error) {
    console.error('Error fetching on/off sensor status ' + error);
  });
};

/**
 * Handle a 'propertyStatus' message
 * @param {Object} properties - property data
 */
BinarySensor.prototype.onPropertyStatus = function(data) {
  if (!data.hasOwnProperty('on')) {
    return;
  }
  this.properties.on = data.on;
  if (data.on === null) {
    return;
  }
  if (data.on) {
    this.showOn();
  } else {
    this.showOff();
  }
};

/**
 * Show on state.
 */
BinarySensor.prototype.showOn = function() {
  this.element.classList.remove('off');
  this.element.classList.add('on');
};

/**
 * Show off state.
 */
BinarySensor.prototype.showOff = function() {
  this.element.classList.remove('on');
  this.element.classList.add('off');
};
