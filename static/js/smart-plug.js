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
      detail: new OnOffDetail(this, 'on'),
    };

    this.displayedProperties.instantaneousPower = {
      href: description.properties.instantaneousPower.href,
      detail: new InstantaneousPowerDetail(this, 'instantaneousPower', 'Power'),
    };

    if (description.properties.hasOwnProperty('voltage')) {
      this.displayedProperties.voltage = {
        href: description.properties.voltage.href,
        detail: new VoltageDetail(this, 'voltage', 'Voltage'),
      };
    }

    if (description.properties.hasOwnProperty('current')) {
      this.displayedProperties.current = {
        href: description.properties.current.href,
        detail: new CurrentDetail(this, 'current', 'Current'),
      };
    }

    if (description.properties.hasOwnProperty('frequency')) {
      this.displayedProperties.frequency = {
        href: description.properties.frequency.href,
        detail: new FrequencyDetail(this, 'frequency', 'Frequency'),
      };
    }

    if (description.properties.hasOwnProperty('level')) {
      this.displayedProperties.level = {
        href: description.properties.level.href,
        detail: new LevelDetail(this, 'level'),
      };
    }
  }

  this.base = Thing;
  this.base(description, format, {svgBaseIcon: '/images/smart-plug-off.svg',
                                  pngBaseIcon: '/images/smart-plug.svg',
                                  thingCssClass: 'smart-plug',
                                  thingDetailCssClass: 'smart-plug-container',
                                  addIconToView: false});

  if (format == 'svg') {
    // For now the SVG view is just a link.
    return this;
  }

  this.smartPlug = this.element.querySelector('.smart-plug');
  this.smartPlugLabel =
    this.element.querySelector('.smart-plug-label');

  if (format === 'htmlDetail') {
    this.attachHtmlDetail();
  } else {
    this.element.querySelector('.thing-icon')
      .addEventListener('click', this.handleClick.bind(this));
  }

  this.updateStatus();

  return this;
}

SmartPlug.prototype = Object.create(OnOffSwitch.prototype);

SmartPlug.prototype.iconView = function() {
  return `<div class="thing-icon">
    <span class="smart-plug-label">--</span>
    </div>`;
};

/**
 * Update the display for the provided property.
 * @param {string} name - name of the property
 * @param {*} value - value of the property
 */
SmartPlug.prototype.updateProperty = function(name, value) {
  if (!this.displayedProperties.hasOwnProperty(name)) {
    return;
  }

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
      this.displayedProperties[name].detail.update();
      break;
    case 'level':
      this.updateLevel(value);
      break;
  }
};

SmartPlug.prototype.updateOn = function(on) {
  this.properties.on = on;

  if (this.format === 'htmlDetail') {
    this.displayedProperties.on.detail.update();
  }

  if (this.displayedProperties.level) {
    this.updateLevel(this.properties.level);
  }

  if (on) {
    this.showOn();
    this.updatePower(this.properties.power);
  } else {
    this.showOff();
    if (this.smartPlugLabel) {
      this.smartPlugLabel.innerText = 'off';
    }
  }
};

/**
 * Show updated power consumption value.
 */
SmartPlug.prototype.updatePower = function(power) {
  power = parseFloat(power);
  this.properties.power = power;

  if (this.smartPlugLabel) {
    if (!this.properties.on) {
      this.smartPlugLabel.innerText = 'off';
    } else if (power) {
      this.smartPlugLabel.innerText = `${power.toFixed(2)}W`;
    } else {
      this.smartPlugLabel.innerText = '0W';
    }
  }

  this.displayedProperties.instantaneousPower.detail.update();
};

/**
 * Show updated level.
 */
SmartPlug.prototype.updateLevel = function(level) {
  if (this.displayedProperties.hasOwnProperty('level')) {
    this.properties.level = level;
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
  }).catch(function(error) {
    console.error(`Error trying to set level: ${error}`);
  });
};

module.exports = SmartPlug;
