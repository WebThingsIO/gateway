/**
 * Color Bulb.
 *
 * UI element representing a bulb with control over its color
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const API = require('./api');
const ColorDetail = require('./color-detail');
const OnOffDetail = require('./on-off-detail');
const OnOffSwitch = require('./on-off-switch');
const Thing = require('./thing');
const ColorTemperatureDetail = require('./color-temperature-detail');

/**
 * ColorLight Constructor (extends OnOffSwitch).
 *
 * @param Object description Thing description object.
 * @param {String} format 'svg', 'html', or 'htmlDetail'.
 */
function ColorLight(description, format) {
  this.displayedProperties = this.displayedProperties || {};
  if (description.properties) {
    this.displayedProperties.on = {
      href: description.properties.on.href,
      detail: new OnOffDetail(this, 'on'),
    };

    if (description.properties.hasOwnProperty('color')) {
      this.displayedProperties.color = {
        href: description.properties.color.href,
        detail: new ColorDetail(this, 'color'),
      };
    } else if (description.properties.hasOwnProperty('colorTemperature')) {
      const prop = description.properties.colorTemperature;
      const min = prop.hasOwnProperty('min') ? prop.min : prop.minimum;
      const max = prop.hasOwnProperty('max') ? prop.max : prop.maximum;
      this.displayedProperties.colorTemperature = {
        href: prop.href,
        detail: new ColorTemperatureDetail(this, 'colorTemperature', min, max),
      };
    }
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

ColorLight.prototype = Object.create(OnOffSwitch.prototype);

/**
 * Update the display for the provided property.
 * @param {string} name - name of the property
 * @param {*} value - value of the property
 */
ColorLight.prototype.updateProperty = function(name, value) {
  switch (name) {
    case 'on':
      this.updateOn(value);
      break;
    case 'color':
      this.updateColor(value);
      break;
    case 'colorTemperature':
      this.updateColorTemperature(value);
      break;
  }
};

ColorLight.prototype.updateOn = function(on) {
  this.properties.on = on;
  if (on === null) {
    return;
  }

  if (this.format === 'htmlDetail') {
    this.displayedProperties.on.detail.update();
  }

  if (on) {
    this.showOn();
  } else {
    this.showOff();
  }
};

ColorLight.prototype.updateColor = function(color) {
  this.properties.color = color;
  if (!color) {
    return;
  }

  this.switch.color = color;

  if (this.format === 'htmlDetail') {
    this.displayedProperties.color.detail.update();
  }
};

ColorLight.prototype.setColor = function(color) {
  const payload = {
    color: color,
  };
  fetch(this.displayedProperties.color.href, {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: Object.assign(API.headers(), {
      'Content-Type': 'application/json',
    }),
  }).then((response) => {
    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error(`Status ${response.status} trying to set color`);
    }
  }).then((json) => {
    this.updateColor(json.color);
  }).catch((error) => {
    console.error(`Error trying to set color: ${error}`);
  });
};

ColorLight.prototype.updateColorTemperature = function(temperature) {
  temperature = parseInt(temperature, 10);
  this.properties.colorTemperature = temperature;
  this.switch.colorTemperature = temperature;

  if (this.format === 'htmlDetail') {
    this.displayedProperties.colorTemperature.detail.update();
  }
};

ColorLight.prototype.setColorTemperature = function(temperature) {
  temperature = parseInt(temperature, 10);

  const payload = {
    colorTemperature: temperature,
  };
  fetch(this.displayedProperties.colorTemperature.href, {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: Object.assign(API.headers(), {
      'Content-Type': 'application/json',
    }),
  }).then((response) => {
    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error(
        `Status ${response.status} trying to set color temperature`);
    }
  }).then((json) => {
    this.updateColorTemperature(json.colorTemperature);
  }).catch((error) => {
    console.error(`Error trying to set color temperature: ${error}`);
  });
};

ColorLight.prototype.iconView = function() {
  if (this.displayedProperties.hasOwnProperty('color')) {
    return `
      <webthing-light-capability data-have-color="true">
      </webthing-light-capability>`;
  } else if (this.displayedProperties.hasOwnProperty('colorTemperature')) {
    return `
      <webthing-light-capability data-have-color-temperature="true">
      </webthing-light-capability>`;
  }
};

module.exports = ColorLight;
