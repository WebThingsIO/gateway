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

class ColorTemperatureDetail {
  constructor(thing, name, min, max) {
    this.thing = thing;
    this.name = name;
    this.min = min;
    this.max = max;
    this.id = `color-temperature-${Utils.escapeHtmlForIdClass(this.name)}`;
  }

  attach() {
    this.temperature = this.thing.element.querySelector(`#${this.id}`);
    this.temperature.addEventListener('change', this.set.bind(this));
  }

  view() {
    const temperature = this.thing.properties[this.name];

    return `
      <webthing-color-temperature-property min="${this.min}" max="${this.max}"
        data-name="Color Temperature" value="${Utils.escapeHtml(temperature)}"
        id="${this.id}">
      </webthing-color-temperature-property>`;
  }

  update() {
    if (!this.temperature) {
      return;
    }

    if (this.thing.properties[this.name] == this.temperature.value) {
      return;
    }

    this.temperature.value = this.thing.properties[this.name];
  }

  set() {
    this.thing.setColorTemperature(this.temperature.value);
  }
}

module.exports = ColorTemperatureDetail;
