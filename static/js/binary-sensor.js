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
var BinarySensor = function(description) {
  this.base = Thing;
  this.base(description);
  // Parse on property URL
  if (this.propertyDescriptions.triggered.href) {
    this.triggeredPropertyUrl =
      new URL(this.propertyDescriptions.triggered.href, this.href);
  }
  this.updateStatus();
};

BinarySensor.prototype = Object.create(Thing.prototype);

/**
 * HTML view for Thing.
 */
BinarySensor.prototype.view = function() {
  return '<div class="thing binary-sensor">' +
         '  <div class="thing-icon"></div>' +
         '  <span class="thing-name">' + this.name + '</span>' +
         '</div>';
};

/**
 * Update the on/off status of the binary sensor.
 */
BinarySensor.prototype.updateStatus = function() {
  if (!this.triggeredPropertyUrl) {
    return;
  }
  var opts = {
    headers: {
      'Authorization': `Bearer ${window.API.jwt}`
    }
  };
  fetch(this.triggeredPropertyUrl, opts).then((function(response) {
    return response.json();
  }).bind(this)).then((function(response) {
    this.properties.triggered = response.triggered;
    if (response.triggered === null) {
      return;
    } else if(response.triggered) {
      this.showTriggered();
    } else {
      this.showUntriggered();
    }
  }).bind(this)).catch(function(error) {
    console.error('Error fetching triggered/untriggered switch status ' +
      error);
  });
};

/**
 * Show on state.
 */
BinarySensor.prototype.showTriggered = function() {
  this.element.classList.remove('untriggered');
  this.element.classList.add('triggered');
};

/**
 * Show off state.
 */
BinarySensor.prototype.showUntriggered = function() {
  this.element.classList.remove('triggered');
  this.element.classList.add('untriggered');
};
