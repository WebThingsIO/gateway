/**
 * ColorTemperatureDetail
 *
 * A bubble showing the color temperature of a thing
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const Utils = require('./utils');

function ColorTemperatureDetail(thing, min, max) {
  this.thing = thing;
  this.min = min;
  this.max = max;
}

ColorTemperatureDetail.prototype.attach = function() {
  this.temperature =
    this.thing.element.querySelector('.color-temperature-input');
  if (typeof this.thing.updateColorTemperature === 'function') {
    this.temperature.addEventListener('input', () => {
      this.thing.updateColorTemperature(this.temperature.value);
    });
  }
  this.temperature.addEventListener('change', this.set.bind(this));
};

ColorTemperatureDetail.prototype.view = function() {
  const temperature = this.thing.properties.colorTemperature;

  return `<div class="thing-detail-container">
    <div class="thing-detail">
      <div class="thing-detail-contents">
        <form class="color-temperature">
          <input type="range" min="${this.min}" max="${this.max}"
            value="${Utils.escapeHtml(temperature)}"
            class="color-temperature-input"/>
        </form>
      </div>
    </div>
    <div class="thing-detail-label">Color Temperature</div>
  </div>`;
};

ColorTemperatureDetail.prototype.update = function() {
  if (!this.temperature) {
    return;
  }

  if (this.thing.properties.colorTemperature == this.temperature.value) {
    return;
  }

  this.temperature.value = this.thing.properties.colorTemperature;
};

ColorTemperatureDetail.prototype.set = function() {
  this.thing.setColorTemperature(this.temperature.value);
};

module.exports = ColorTemperatureDetail;
