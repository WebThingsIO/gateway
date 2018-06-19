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

const API = require('./api');
const Thing = require('./thing');
const OnOffDetail = require('./on-off-detail');

/**
 * OnOffSwitch Constructor (extends Thing).
 *
 * @param Object description Thing description object.
 * @param {String} format 'svg' or 'html'.
 */
const OnOffSwitch = function(description, format) {
  this.displayedProperties = this.displayedProperties || {};
  if (description.properties) {
    this.displayedProperties.on = {
      href: description.properties.on.href,
      detail: new OnOffDetail(this, 'on'),
    };
  }

  this.base = Thing;
  this.base(description, format, {svgBaseIcon: '/images/on-off-switch.svg',
                                  pngBaseIcon: '/images/on-off-switch.png',
                                  thingCssClass: 'on-off-switch',
                                  thingDetailCssClass: 'on-off-switch',
                                  addIconToView: false});

  if (format == 'svg') {
    // For now the SVG view is just a link.
    return this;
  }

  this.switch = this.element.querySelector('.thing-icon');

  if (format === 'htmlDetail') {
    this.attachHtmlDetail();
  } else {
    this.switch.addEventListener('click', this.handleClick.bind(this));
  }

  this.updateStatus();

  return this;
};

OnOffSwitch.prototype = Object.create(Thing.prototype);

/**
 * Update the display for the provided property.
 * @param {string} name - name of the property
 * @param {*} value - value of the property
 */
OnOffSwitch.prototype.updateProperty = function(name, value) {
  if (name !== 'on') {
    return;
  }
  this.properties.on = value;
  if (value === null) {
    return;
  }
  if (value) {
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
  const payload = {
    on: true,
  };
  fetch(this.displayedProperties.on.href, {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: {
      Authorization: `Bearer ${API.jwt}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    if (response.status == 200) {
      return response.json();
    } else {
      throw new Error(`Status ${response.status} trying to turn on switch`);
    }
  }).then((json) => {
    this.onPropertyStatus(json);
  }).catch((error) => {
    console.error(`Error trying to turn on switch: ${error}`);
  });
};

/**
 * Send a request to turn off and update state.
 */
OnOffSwitch.prototype.turnOff = function() {
  this.showTransition();
  this.properties.on = null;
  const payload = {
    on: false,
  };
  fetch(this.displayedProperties.on.href, {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: {
      Authorization: `Bearer ${API.jwt}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    if (response.status == 200) {
      return response.json();
    } else {
      throw new Error(`Status ${response.status} trying to turn off switch`);
    }
  }).then((json) => {
    this.onPropertyStatus(json);
  }).catch((error) => {
    console.error(`Error trying to turn off switch: ${error}`);
  });
};

module.exports = OnOffSwitch;
