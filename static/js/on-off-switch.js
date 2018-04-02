/**
 * On/Off Switch.
 *
 * UI element representing an On/Off Switch.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

/* globals Thing */

/**
 * OnOffSwitch Constructor (extends Thing).
 *
 * @param Object description Thing description object.
 * @param {String} format 'svg' or 'html'.
 */
var OnOffSwitch = function(description, format) {
  this.base = Thing;
  this.base(description, format, {svgBaseIcon: '/images/on-off-switch.svg',
                                  pngBaseIcon: '/images/on-off-switch.png',
                                  thingCssClass: 'on-off-switch',
                                  addIconToView: false});
  if (format == 'svg') {
    // For now the SVG view is just a link.
    return this;
  }
  // Parse on property URL
  if (this.propertyDescriptions.on.href) {
    this.onPropertyUrl = new URL(this.propertyDescriptions.on.href, this.href);
  }
  this.updateStatus();
  this.element.addEventListener('click', this.handleClick.bind(this));
  return this;
};

OnOffSwitch.prototype = Object.create(Thing.prototype);

/**
 * Update the on/off status of the on/off switch.
 */
OnOffSwitch.prototype.updateStatus = function() {
  if (!this.onPropertyUrl) {
    return;
  }
  var opts = {
    headers: {
      'Authorization': `Bearer ${window.API.jwt}`,
      'Accept': 'application/json',
    },
  };

  fetch(this.onPropertyUrl, opts).then(function(response) {
    return response.json();
  }).then((function(response) {
    this.onPropertyStatus(response);
  }).bind(this)).catch(function(error) {
    console.error('Error fetching on/off switch status ' + error);
  });
};

/**
 * Handle a 'propertyStatus' message
 * @param {Object} properties - property data
 */
OnOffSwitch.prototype.onPropertyStatus = function(data) {
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
OnOffSwitch.prototype.showOn = function() {
  this.element.classList.remove('off');
  this.element.classList.add('on');
};

/**
 * Show off state.
 */
OnOffSwitch.prototype.showOff = function() {
  this.element.classList.remove('on');
  this.element.classList.add('off');
};

/**
 * Show transition state.
 */
OnOffSwitch.prototype.showTransition = function() {
  this.element.classList.remove('on');
  this.element.classList.remove('off');
};

/**
 * Handle a click on the on/off switch.
 */
OnOffSwitch.prototype.handleClick = function() {
  if (this.properties.on === true) {
    this.turnOff();
  } else if (this.properties.on === false) {
    this.turnOn();
  }
};

/**
 * Send a request to turn on and update state.
 *
 */
OnOffSwitch.prototype.turnOn = function() {
  this.showTransition();
  this.properties.on = null;
  var payload = {
   'on': true,
  };
  fetch(this.onPropertyUrl, {
   method: 'PUT',
   body: JSON.stringify(payload),
   headers: {
     'Authorization': `Bearer ${window.API.jwt}`,
     'Accept': 'application/json',
     'Content-Type': 'application/json',
   },
  })
  .then((function(response) {
   if (response.status == 200) {
     this.onPropertyStatus({on: true});
   } else {
     console.error('Status ' + response.status + ' trying to turn on switch');
   }
  }).bind(this))
  .catch(function(error) {
   console.error('Error trying to turn on switch: ' + error);
  });
};

/**
 * Send a request to turn off and update state.
 */
OnOffSwitch.prototype.turnOff = function() {
  this.showTransition();
  this.properties.on = null;
  var payload = {
    'on': false,
  };
  fetch(this.onPropertyUrl, {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: {
      'Authorization': `Bearer ${window.API.jwt}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  })
  .then((function(response) {
    if (response.status == 200) {
      this.onPropertyStatus({on: false});
    } else {
      console.error('Status ' + response.status + ' trying to turn off switch');
    }
  }).bind(this))
  .catch(function(error) {
    console.error('Error trying to turn off switch: ' + error);
  });
};
