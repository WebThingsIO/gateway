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

  this.base = ColorLight;
  this.base(description, format);

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
    headers: API.headers(),
  };

  const promises = [];
  promises.push(fetch(this.onPropertyUrl, opts));
  promises.push(fetch(this.levelPropertyUrl, opts));

  if (this.hasOwnProperty('colorPropertyUrl')) {
    promises.push(fetch(this.colorPropertyUrl, opts));
  } else if (this.hasOwnProperty('colorTemperaturePropertyUrl')) {
    promises.push(fetch(this.colorTemperaturePropertyUrl, opts));
  }

  Promise.all(promises).then((responses) => {
    return Promise.all(responses.map((response) => {
      return response.json();
    }));
  }).then((responses) => {
    responses.forEach((response) => {
      this.onPropertyStatus(response);
    });
  }).catch((error) => {
    console.error(`Error fetching on/off switch status ${error}`);
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
      this.colorLightLabel.textContent =
        `${Math.round(this.properties.level)}%`;
    }
  }
  if (data.hasOwnProperty('color')) {
    this.updateColor(data.color);
  }
  if (data.hasOwnProperty('colorTemperature')) {
    this.updateColorTemperature(data.colorTemperature);
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
    this.colorLightLabel.textContent = `${Math.round(level)}%`;
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

