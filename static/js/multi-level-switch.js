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

/**
 * MultiLevelSwitch Constructor (extends OnOffSwitch).
 *
 * @param Object description Thing description object.
 * @param {String} format 'svg', 'html', or 'htmlDetail'.
 */
function MultiLevelSwitch(description, format) {
  this.displayedProperties = this.displayedProperties || {};
  if (description.properties) {
    this.displayedProperties.on = {
      href: description.properties.on.href,
      detail: new OnOffDetail(this, 'on', description.properties.on.label),
    };
    this.displayedProperties.level = {
      href: description.properties.level.href,
      detail: new LevelDetail(this, 'level',
                              description.properties.level.label),
    };
  }

  this.base = Thing;
  this.base(description, format, {svgBaseIcon: '/images/level.svg',
                                  pngBaseIcon: '/images/level.svg'});

  if (format === 'svg') {
    // For now the SVG view is just a link.
    return this;
  }

  this.switch =
    this.element.querySelector('webthing-multi-level-switch-capability');

  if (format === 'htmlDetail') {
    this.attachHtmlDetail();
  } else {
    this.switch.addEventListener('click', this.handleClick.bind(this));
  }

  this.updateStatus();

  return this;
}

MultiLevelSwitch.prototype = Object.create(OnOffSwitch.prototype);

/**
 * Update the display for the provided property.
 * @param {string} name - name of the property
 * @param {*} value - value of the property
 */
MultiLevelSwitch.prototype.updateProperty = function(name, value) {
  switch (name) {
    case 'on':
      this.updateOn(value);
      break;
    case 'level':
      this.updateLevel(value);
      break;
  }
};

MultiLevelSwitch.prototype.updateOn = function(on) {
  this.properties.on = on;
  if (on === null) {
    return;
  }

  this.updateLevel(this.properties.level);

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
  level = parseInt(level, 10);
  this.properties.level = level;
  this.switch.level = level;

  if (this.format === 'htmlDetail') {
    this.displayedProperties.level.detail.update();
  }
};

MultiLevelSwitch.prototype.setLevel = function(level) {
  level = parseInt(level, 10);

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

MultiLevelSwitch.prototype.iconView = function() {
  return `
    <webthing-multi-level-switch-capability>
    </webthing-multi-level-switch-capability>`;
};

module.exports = MultiLevelSwitch;
