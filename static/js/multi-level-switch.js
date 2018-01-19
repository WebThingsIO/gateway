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

/* globals LevelDetail, OnOffDetail, OnOffSwitch, Thing, ThingDetailLayout */

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
function MultiLevelSwitch(description, format) {
  if (format === 'htmlDetail') {
    this.details = this.details || {};
    this.details.on = new OnOffDetail(this);
    this.details.level  = new LevelDetail(this);
  }

  this.base = Thing;
  this.base(description, format, {svgBaseIcon: '/images/level.svg',
                                  pngBaseIcon: '/images/level.svg',
                                  thingCssClass: '',
                                  addIconToView: false});
  if (format == 'svg') {
    // For now the SVG view is just a link.
    return this;
  }
  this.onPropertyUrl = new URL(this.propertyDescriptions.on.href, this.href);
  this.levelPropertyUrl = new URL(this.propertyDescriptions.level.href,
                                  this.href);

  this.updateStatus();

  this.levelBar = this.element.querySelector('.level-bar');
  this.levelBarLabel = this.element.querySelector('.level-bar-label');

  if (format === 'htmlDetail') {
    this.details.on.attach();
    this.details.level.attach();

    this.layout = new ThingDetailLayout(
      this.element.querySelectorAll('.thing-detail-container'));
  }
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
 * HTML view for multi level switch
 */
MultiLevelSwitch.prototype.htmlView = function() {
  return `<a href="${this.href}" class="thing ${this.thingCssClass}">
    ${this.iconView()}
    <span class="thing-name">${this.name}</span>
  </a>`;
}

/**
 * HTML detail view for multi level switch
 */
MultiLevelSwitch.prototype.htmlDetailView = function() {
  let details = '';
  if (this.details) {
    details = this.details.on.view() + this.details.level.view();
  }

  return `<div>
    <div class="thing ${this.thingCssClass}">
      ${this.iconView()}
      ${details}
    </div>
  </div>`;
};

/**
 * Update the status of the switch.
 */
MultiLevelSwitch.prototype.updateStatus = function() {
  var opts = {
    headers: {
      'Authorization': `Bearer ${window.API.jwt}`,
      'Accept': 'application/json'
    }
  };

  fetch(this.onPropertyUrl, opts).then(response => {
    return response.json();
  }).then(response => {
    this.onPropertyStatus(response);
    return fetch(this.levelPropertyUrl, opts);
  }).then(response => {
    return response.json();
  }).then(response => {
    this.onPropertyStatus(response);
  }).catch(error => {
    console.error('Error fetching multi level switch status ' + error);
  });
};

/**
 * Handle a 'propertyStatus' message
 * @param {Object} properties - property data
 */
MultiLevelSwitch.prototype.onPropertyStatus = function(data) {
  if (data.hasOwnProperty('on')) {
    this.updateOn(data.on);
  }
  if (data.hasOwnProperty('level')) {
    this.updateLevel(data.level);
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

  if (this.details) {
    this.details.on.update();
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

  let levelBackground = `linear-gradient(${blank}, ${blank} ${100 - level}%,` +
                              `${bar} ${100 - level}%, ${bar})`;
  this.levelBar.style.background = levelBackground;

  if (this.properties.on) {
    this.levelBarLabel.textContent = level + '%';
  }

  if (this.details) {
    this.details.level.update();
  }
};

MultiLevelSwitch.prototype.setLevel = function(level) {
  if (typeof(level) === 'string') {
    level = parseInt(level, 10);
  }

  const payload = {
   level: level
  };
  fetch(this.levelPropertyUrl, {
   method: 'PUT',
   body: JSON.stringify(payload),
   headers: Object.assign(window.API.headers(), {
     'Content-Type': 'application/json'
   })
  }).then(response => {
   if (response.status === 200) {
     this.updateLevel(level);
   } else {
     console.error('Status ' + response.status + ' trying to set level');
   }
  }).catch(function(error) {
   console.error('Error trying to set level: ' + error);
  });

};

