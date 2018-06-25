/**
 * Light
 *
 * UI element representing  Light.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const API = require('./api');
const BrightnessDetail = require('./brightness-detail');
const ColorDetail = require('./color-detail');
const ColorTemperatureDetail = require('./color-temperature-detail');
const OnOffDetail = require('./on-off-detail');
const OnOffSwitch = require('./on-off-switch');
const Thing = require('./thing');

/**
 * Light Constructor (extends OnOffSwitch).
 *
 * @param Object description Thing description object.
 * @param {String} format 'svg', 'html', or 'htmlDetail'.
 */
function Light(description, format) {
  this.displayedProperties = this.displayedProperties || {};
  if (description.properties) {
    this.displayedProperties.on = {
      href: description.properties.on.href,
      detail: new OnOffDetail(this, 'on', description.properties.on.label),
    };

    if (description.properties.hasOwnProperty('level')) {
      this.displayedProperties.level = {
        href: description.properties.level.href,
        detail: new BrightnessDetail(this, 'level',
                                     description.properties.level.label),
      };
    }

    if (description.properties.hasOwnProperty('color')) {
      this.displayedProperties.color = {
        href: description.properties.color.href,
        detail: new ColorDetail(this, 'color',
                                description.properties.color.label),
      };
    } else if (description.properties.hasOwnProperty('colorTemperature')) {
      const prop = description.properties.colorTemperature;
      const min = prop.hasOwnProperty('min') ? prop.min : prop.minimum;
      const max = prop.hasOwnProperty('max') ? prop.max : prop.maximum;
      this.displayedProperties.colorTemperature = {
        href: prop.href,
        detail: new ColorTemperatureDetail(
          this, 'colorTemperature',
          description.properties.colorTemperature.label, min, max),
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

Light.prototype = Object.create(OnOffSwitch.prototype);

/**
 * Update the display for the provided property.
 * @param {string} name - name of the property
 * @param {*} value - value of the property
 */
Light.prototype.updateProperty = function(name, value) {
  switch (name) {
    case 'on':
      this.updateOn(value);
      break;
    case 'level':
      this.updateBrightness(value);
      break;
    case 'color':
      this.updateColor(value);
      break;
    case 'colorTemperature':
      this.updateColorTemperature(value);
      break;
  }
};

Light.prototype.updateOn = function(on) {
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
Light.prototype.updateBrightness = function(brightness) {
  if (!this.displayedProperties.hasOwnProperty('level')) {
    return;
  }

  brightness = parseInt(brightness, 10);
  this.properties.level = brightness;
  this.switch.brightness = brightness;

  if (this.format === 'htmlDetail') {
    this.displayedProperties.level.detail.update();
  }
};

Light.prototype.updateColor = function(color) {
  if (!this.displayedProperties.hasOwnProperty('color')) {
    return;
  }

  this.properties.color = color;
  if (!color) {
    return;
  }

  this.switch.color = color;

  if (this.format === 'htmlDetail') {
    this.displayedProperties.color.detail.update();
  }
};

Light.prototype.updateColorTemperature = function(temperature) {
  if (!this.displayedProperties.hasOwnProperty('colorTemperature')) {
    return;
  }

  temperature = parseInt(temperature, 10);
  this.properties.colorTemperature = temperature;
  this.switch.colorTemperature = temperature;

  if (this.format === 'htmlDetail') {
    this.displayedProperties.colorTemperature.detail.update();
  }
};

Light.prototype.setBrightness = function(brightness) {
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

Light.prototype.setColor = function(color) {
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

Light.prototype.setColorTemperature = function(temperature) {
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

Light.prototype.iconView = function() {
  let color = '';
  if (this.displayedProperties.hasOwnProperty('color')) {
    color = 'data-have-color="true"';
  } else if (this.displayedProperties.hasOwnProperty('colorTemperature')) {
    color = 'data-have-color-temperature="true"';
  }

  let brightness = '';
  if (this.displayedProperties.hasOwnProperty('level')) {
    brightness = 'data-have-brightness="true"';
  }

  return `
    <webthing-light-capability ${color} ${brightness}>
    </webthing-light-capability>`;
};

module.exports = Light;
