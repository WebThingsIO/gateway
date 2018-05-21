/**
 * Multi level switch
 *
 * UI element representing a switch with multiple levels
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const API = require('./api');
const LevelDetail = require('./level-detail');
const OnOffDetail = require('./on-off-detail');
const OnOffSwitch = require('./on-off-switch');
const Thing = require('./thing');

const MULTI_LEVEL_SWITCH_OFF_BAR = 'white';
const MULTI_LEVEL_SWITCH_OFF_BLANK = '#89b6d6';
const MULTI_LEVEL_SWITCH_ON_BAR = '#5d9bc7';
const MULTI_LEVEL_SWITCH_ON_BLANK = 'white';

/**
 * MultiLevelSwitch Constructor (extends OnOffSwitch).
 *
 * @param Object description Thing description object.
 * @param {String} format 'svg', 'html', or 'htmlDetail'.
 */
function MultiLevelSwitch(description, format, options) {
  this.displayedProperties = this.displayedProperties || {};
  if (description.properties) {
    this.displayedProperties.on = {
      href: description.properties.on.href,
      detail: new OnOffDetail(this),
    };
    this.displayedProperties.level = {
      href: description.properties.level.href,
      detail: new LevelDetail(this),
    };
  }

  const opts = options || {svgBaseIcon: '/images/level.svg',
                           pngBaseIcon: '/images/level.svg',
                           thingCssClass: '',
                           thingDetailCssClass: '',
                           addIconToView: false};
  this.base = Thing;
  this.base(description, format, opts);

  if (format == 'svg') {
    // For now the SVG view is just a link.
    return this;
  }

  this.levelBar = this.element.querySelector('.level-bar');
  this.levelBarLabel = this.element.querySelector('.level-bar-label');

  if (format === 'htmlDetail') {
    this.attachHtmlDetail();
  } else {
    this.element.querySelector('.level-bar-container')
      .addEventListener('click', this.handleClick.bind(this));
  }

  this.updateStatus();

  return this;
}

MultiLevelSwitch.prototype = Object.create(OnOffSwitch.prototype);

MultiLevelSwitch.prototype.iconView = function() {
  return `<div class="level-bar-container">
    <div class="level-bar-info">
      <div class="level-bar"></div>
      <div class="level-bar-label"></div>
    </div>
  </div>`;
};

/**
 * Update the display for the provided property.
 * @param {string} name - name of the property
 * @param {*} value - value of the property
 */
MultiLevelSwitch.prototype.updateProperty = function(name, value) {
  if (name === 'on') {
    this.updateOn(value);
  }
  if (name === 'level') {
    this.updateLevel(value);
  }
};

MultiLevelSwitch.prototype.updateOn = function(on) {
  this.properties.on = on;
  if (on === null) {
    return;
  }

  this.updateLevel(this.properties.level);

  if (!on) {
    this.levelBarLabel.textContent = 'OFF';
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

MultiLevelSwitch.prototype.updateLevel = function(level) {
  level = parseFloat(level);
  this.properties.level = level;

  let bar = MULTI_LEVEL_SWITCH_OFF_BAR;
  let blank = MULTI_LEVEL_SWITCH_OFF_BLANK;

  if (this.properties.on) {
    bar = MULTI_LEVEL_SWITCH_ON_BAR;
    blank = MULTI_LEVEL_SWITCH_ON_BLANK;
  }

  const levelBackground =
    `linear-gradient(${blank}, ${blank} ${100 - level}%,` +
    `${bar} ${100 - level}%, ${bar})`;
  this.levelBar.style.background = levelBackground;

  if (this.properties.on) {
    this.levelBarLabel.textContent = `${Math.round(level)}%`;
  }

  if (this.format === 'htmlDetail') {
    this.displayedProperties.level.detail.update();
  }
};

MultiLevelSwitch.prototype.setLevel = function(level) {
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

module.exports = MultiLevelSwitch;
