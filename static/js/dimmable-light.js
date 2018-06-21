/**
 * Dimmable Light
 *
 * UI element representing a light with an independent dimming function.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const API = require('./api');
const BrightnessDetail = require('./brightness-detail');
const OnOffDetail = require('./on-off-detail');
const OnOffSwitch = require('./on-off-switch');
const Thing = require('./thing');

/**
 * DimmableLight Constructor.
 *
 * @param Object description Thing description object.
 * @param {String} format 'svg', 'html', or 'htmlDetail'.
 */
function DimmableLight(description, format) {
  this.displayedProperties = this.displayedProperties || {};
  if (description.properties) {
    this.displayedProperties.on = {
      href: description.properties.on.href,
      detail: new OnOffDetail(this, 'on'),
    };
    this.displayedProperties.level = {
      href: description.properties.level.href,
      detail: new BrightnessDetail(this, 'level'),
    };
  }

  this.base = Thing;
  this.base(description, format, {svgBaseIcon: '/images/bulb.svg',
                                  pngBaseIcon: '/images/bulb.png'});

  if (format === 'svg') {
    // For now the SVG view is just a link.
    return this;
  }

  this.switch = this.element.querySelector('webthing-light-capability');

  if (format === 'htmlDetail') {
    this.attachHtmlDetail();
  } else {
    this.switch.addEventListener('click', this.handleClick.bind(this));
  }

  this.updateStatus();

  return this;
}

DimmableLight.prototype = Object.create(OnOffSwitch.prototype);

/**
 * Update the display for the provided property.
 * @param {string} name - name of the property
 * @param {*} value - value of the property
 */
DimmableLight.prototype.updateProperty = function(name, value) {
  switch (name) {
    case 'on':
      this.updateOn(value);
      break;
    case 'level':
      this.updateBrightness(value);
      break;
  }
};

DimmableLight.prototype.updateOn = function(on) {
  this.properties.on = on;
  if (on === null) {
    return;
  }

  this.updateBrightness(this.properties.level);

  if (this.format === 'htmlDetail') {
    this.displayedProperties.on.detail.update();
  }

  if (on) {
    this.showOn();
  } else {
    this.showOff();
  }
};

/**
 * @param {number} brightness
 */
DimmableLight.prototype.updateBrightness = function(brightness) {
  brightness = parseInt(brightness, 10);
  this.properties.level = brightness;
  this.switch.brightness = brightness;

  if (this.format === 'htmlDetail') {
    this.displayedProperties.level.detail.update();
  }
};

DimmableLight.prototype.setBrightness = function(brightness) {
  brightness = parseInt(brightness, 10);

  const payload = {
    level: brightness,
  };
  fetch(this.displayedProperties.level.href, {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: Object.assign(API.headers(), {
      'Content-Type': 'application/json',
    }),
  }).then((response) => {
    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error(`Status ${response.status} trying to set level`);
    }
  }).then((json) => {
    this.updateBrightness(json.level);
  }).catch((error) => {
    console.error(`Error trying to set level: ${error}`);
  });
};

DimmableLight.prototype.iconView = function() {
  return `
    <webthing-light-capability data-have-brightness="true">
    </webthing-light-capability>`;
};

module.exports = DimmableLight;
