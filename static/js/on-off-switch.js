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
  this.base(description, format);
  if (format == 'svg') {
    // For now the SVG view is just a link.
    return;
  }
  // Parse on property URL
  if (this.propertyDescriptions.on.href) {
    this.onPropertyUrl = new URL(this.propertyDescriptions.on.href, this.href);
  }
  this.updateStatus();
  this.element.addEventListener('click', this.handleClick.bind(this));
};

OnOffSwitch.prototype = Object.create(Thing.prototype);

/**
 * HTML view for on/off switch.
 */
OnOffSwitch.prototype.htmlView = function() {
  return '<div class="thing on-off-switch">' +
         '  <div class="thing-icon"></div>' +
         '  <span class="thing-name">' + this.name + '</span>' +
         '</div>';
};

/**
 * SVG view for on/off switch.
 */
Thing.prototype.svgView = function() {
  return '<a href="' + this.href +'" class="svg-thing-link">' +
         '  <circle cx="' + this.x + '" cy="' + this.y + '" r="5"' +
         '    class="svg-thing-icon">' +
         '  </circle>' +
         '  <image x="' + (this.x - 2.5) + '" y="' + (this.y - 2.5) + '" ' +
         '    width="5" height="5" ' +
         '    xlink:href="/images/on-off-switch.svg"></image>' +
         '</a>';
};

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
    console.error('Error fetching on/off switch status ' + error);
  });
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
   'on': true
  };
  fetch(this.onPropertyUrl, {
   method: 'PUT',
   body: JSON.stringify(payload),
   headers: {
     'Authorization': `Bearer ${window.API.jwt}`,
     'Accept': 'application/json',
     'Content-Type': 'application/json'
   }
  })
  .then((function(response) {
   if (response.status == 200) {
     this.showOn();
     this.properties.on = true;
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
    'on': false
  };
  fetch(this.onPropertyUrl, {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: {
      'Authorization': `Bearer ${window.API.jwt}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then((function(response) {
    if (response.status == 200) {
      this.showOff();
      this.properties.on = false;
    } else {
      console.error('Status ' + response.status + ' trying to turn off switch');
    }
  }).bind(this))
  .catch(function(error) {
    console.error('Error trying to turn off switch: ' + error);
  });
};
