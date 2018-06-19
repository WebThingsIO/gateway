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

const Thing = require('./thing');

/**
 * BinarySensor Constructor (extends Thing).
 *
 * @param Object description Thing description object.
 */
const BinarySensor = function(description, format) {
  this.displayedProperties = this.displayedProperties || {};
  if (description.properties) {
    this.displayedProperties.on = {
      href: description.properties.on.href,
    };
  }

  this.base = Thing;
  this.base(description, format, {svgBaseIcon: '/images/binary-sensor.svg',
                                  pngBaseIcon: '/images/binary-sensor.png'});

  if (format === 'svg') {
    // For now the SVG view is just a link.
    return this;
  }

  this.switch = this.element.querySelector('webthing-binary-sensor-capability');

  if (format === 'htmlDetail') {
    this.attachHtmlDetail();
  }

  this.updateStatus();

  return this;
};

BinarySensor.prototype = Object.create(Thing.prototype);

/**
 * Update the display for the provided property.
 * @param {string} name - name of the property
 * @param {*} value - value of the property
 */
BinarySensor.prototype.updateProperty = function(name, value) {
  switch (name) {
    case 'on':
      this.updateOn(value);
      break;
  }
};

BinarySensor.prototype.updateOn = function(on) {
  this.properties.on = on;
  if (on === null) {
    return;
  }

  if (on) {
    this.showOn();
  } else {
    this.showOff();
  }
};

/**
 * Show on state.
 */
BinarySensor.prototype.showOn = function() {
  this.switch.on = true;
};

/**
 * Show off state.
 */
BinarySensor.prototype.showOff = function() {
  this.switch.on = false;
};

BinarySensor.prototype.iconView = function() {
  return `
    <webthing-binary-sensor-capability>
    </webthing-binary-sensor-capability>`;
};

module.exports = BinarySensor;
