/**
 * Smart Plug.
 *
 * UI element representing a smart plug with an on/off switch and
 * energy monitoring functionality.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const API = require('./api');
const CurrentDetail = require('./current-detail');
const FrequencyDetail = require('./frequency-detail');
const InstantaneousPowerDetail = require('./instantaneous-power-detail');
const LevelDetail = require('./level-detail');
const OnOffDetail = require('./on-off-detail');
const OnOffSwitch = require('./on-off-switch');
const Thing = require('./thing');
const VoltageDetail = require('./voltage-detail');

/**
 * SmartPlug Constructor (extends OnOffSwitch).
 *
 * @param Object description Thing description object.
 * @param {String} format 'svg', 'html', or 'htmlDetail'.
 */
function SmartPlug(description, format) {
  this.displayedProperties = this.displayedProperties || {};
  if (description.properties) {
    this.displayedProperties.on = {
      href: description.properties.on.href,
      detail: new OnOffDetail(this, 'on', description.properties.on.label),
    };

    this.displayedProperties.instantaneousPower = {
      href: description.properties.instantaneousPower.href,
      detail: new InstantaneousPowerDetail(
        this, 'instantaneousPower',
        description.properties.instantaneousPower.label),
    };

    if (description.properties.hasOwnProperty('voltage')) {
      this.displayedProperties.voltage = {
        href: description.properties.voltage.href,
        detail: new VoltageDetail(this, 'voltage',
                                  description.properties.voltage.label),
      };
    }

    if (description.properties.hasOwnProperty('current')) {
      this.displayedProperties.current = {
        href: description.properties.current.href,
        detail: new CurrentDetail(this, 'current',
                                  description.properties.current.label),
      };
    }

    if (description.properties.hasOwnProperty('frequency')) {
      this.displayedProperties.frequency = {
        href: description.properties.frequency.href,
        detail: new FrequencyDetail(this, 'frequency',
                                    description.properties.frequency.label),
      };
    }

    if (description.properties.hasOwnProperty('level')) {
      this.displayedProperties.level = {
        href: description.properties.level.href,
        detail: new LevelDetail(this, 'level',
                                description.properties.level.label),
      };
    }
  }

  this.base = Thing;
  this.base(description, format, {svgBaseIcon: '/images/smart-plug-off.svg',
                                  pngBaseIcon: '/images/smart-plug.svg'});

  if (format === 'svg') {
    // For now the SVG view is just a link.
    return this;
  }

  this.switch = this.element.querySelector('webthing-smart-plug-capability');

  if (format === 'htmlDetail') {
    this.attachHtmlDetail();
  } else {
    this.switch.addEventListener('click', this.handleClick.bind(this));
  }

  this.updateStatus();

  return this;
}

SmartPlug.prototype = Object.create(OnOffSwitch.prototype);

/**
 * Update the display for the provided property.
 * @param {string} name - name of the property
 * @param {*} value - value of the property
 */
SmartPlug.prototype.updateProperty = function(name, value) {
  switch (name) {
    case 'on':
      this.updateOn(value);
      break;
    case 'instantaneousPower':
      this.updatePower(value);
      break;
    case 'voltage':
    case 'current':
    case 'frequency':
      this.properties[name] = value;
      if (this.format === 'htmlDetail') {
        this.displayedProperties[name].detail.update();
      }
      break;
    case 'level':
      this.updateLevel(value);
      break;
  }
};

SmartPlug.prototype.updateOn = function(on) {
  this.properties.on = on;
  if (on === null) {
    return;
  }

  if (this.format === 'htmlDetail') {
    this.displayedProperties.on.detail.update();
  }

  if (this.displayedProperties.hasOwnProperty('level')) {
    this.updateLevel(this.properties.level);
  }

  if (on) {
    this.showOn();
  } else {
    this.showOff();
  }
};

/**
 * Show updated power consumption value.
 */
SmartPlug.prototype.updatePower = function(power) {
  power = parseFloat(power);
  this.properties.instantaneousPower = power;
  this.switch.power = power;

  if (this.format === 'htmlDetail') {
    this.displayedProperties.instantaneousPower.detail.update();
  }
};

/**
 * Show updated level.
 */
SmartPlug.prototype.updateLevel = function(level) {
  level = parseInt(level, 10);
  this.properties.level = level;

  if (this.format === 'htmlDetail' &&
      this.displayedProperties.hasOwnProperty('level')) {
    this.displayedProperties.level.detail.update();
  }
};

/**
 * Set the level.
 */
SmartPlug.prototype.setLevel = function(level) {
  if (typeof level === 'string') {
    level = parseInt(level, 10);
  }

  const payload = {
    level: level,
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
    this.updateLevel(json.level);
  }).catch((error) => {
    console.error(`Error trying to set level: ${error}`);
  });
};

SmartPlug.prototype.iconView = function() {
  return `
    <webthing-smart-plug-capability>
    </webthing-smart-plug-capability>`;
};

module.exports = SmartPlug;
