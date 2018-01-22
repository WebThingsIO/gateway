/**
 * Dimmable Color Light
 *
 * UI element representing a light with control over its color and an
 * independent dimming function
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

/* globals API, ColorLight, LevelDetail, MultiLevelSwitch */

/**
 * DimmableColorLight Constructor (extends ColorLight).
 *
 * @param Object description Thing description object.
 * @param {String} format 'svg', 'html', or 'htmlDetail'.
 */
function DimmableColorLight(description, format) {
  if (format === 'htmlDetail') {
    this.details = this.details || {};
    this.details.level = new LevelDetail(this);
  }
  ColorLight.call(this, description, format);
  if (format == 'svg') {
    // For now the SVG view is just a link.
    return this;
  }

  this.levelPropertyUrl = new URL(this.propertyDescriptions.level.href,
                                  this.href);

  this.colorLightLabel.classList.add('level-bar-label');

  this.updateStatus();

  return this;
}

DimmableColorLight.prototype = Object.create(ColorLight.prototype);

/**
 * Update the status of the light.
 */
DimmableColorLight.prototype.updateStatus = function() {
  if (!this.levelPropertyUrl) {
    return;
  }

  const opts = {
    headers: API.headers()
  };

  let onFetch = fetch(this.onPropertyUrl, opts);
  let colorFetch = fetch(this.colorPropertyUrl, opts);
  let levelFetch = fetch(this.levelPropertyUrl, opts);

  Promise.all([onFetch, colorFetch, levelFetch]).then(responses => {
    return Promise.all(responses.map(response => {
      return response.json();
    }));
  }).then(responses => {
    responses.forEach(response => {
      this.onPropertyStatus(response);
    });
  }).catch(error => {
    console.error('Error fetching on/off switch status ' + error);
  });
};

/**
 * Handle a 'propertyStatus' message
 * @param {Object} properties - property data
 */
DimmableColorLight.prototype.onPropertyStatus = function(data) {
  if (data.hasOwnProperty('on')) {
    this.updateOn(data.on);
    if (this.properties.on) {
      this.colorLightLabel.textContent = this.properties.level + '%';
    }
  }
  if (data.hasOwnProperty('color')) {
    this.updateColor(data.color);
  }
  if (data.hasOwnProperty('level')) {
    this.updateLevel(data.level);
  }
};

/**
 * @param {number} level
 */
DimmableColorLight.prototype.updateLevel = function(level) {
  this.properties.level = level;
  if (this.properties.on) {
    this.colorLightLabel.textContent = level + '%';
  }

  if (this.details) {
    this.details.level.update();
  }
};

/**
 * @param {number} level
 */
DimmableColorLight.prototype.setLevel = function(level) {
  MultiLevelSwitch.prototype.setLevel.call(this, level);
};

