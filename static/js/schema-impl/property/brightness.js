/**
 * BrightnessDetail
 *
 * A bubble showing the brightness of a thing
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const Utils = require('../../utils');

class BrightnessDetail {
  constructor(thing, name, property) {
    this.thing = thing;
    this.name = name;
    this.readOnly = !!property.readOnly;
    this.label = property.title || 'Brightness';

    if (property.hasOwnProperty('minimum')) {
      this.min = property.minimum;
    } else {
      this.min = 0;
    }

    if (property.hasOwnProperty('maximum')) {
      this.max = property.maximum;
    } else {
      this.max = 100;
    }

    if (property.hasOwnProperty('multipleOf')) {
      this.step = property.multipleOf;
    } else if (property.type === 'number') {
      this.step = 'any';
    } else {
      this.step = 1;
    }

    this.id = `brightness-${Utils.escapeHtmlForIdClass(this.name)}`;
  }

  attach() {
    this.brightness = this.thing.element.querySelector(`#${this.id}`);
    const setBrightness = Utils.debounce(500, this.set.bind(this));
    this.brightness.addEventListener('change', setBrightness);
  }

  view() {
    const readOnly = this.readOnly ? 'data-read-only="true"' : '';

    return `
      <webthing-brightness-property data-name="${Utils.escapeHtml(this.label)}"
        value="0" min="${this.min}" max="${this.max}" step="${this.step}"
        id="${this.id}" ${readOnly}>
      </webthing-brightness-property>`;
  }

  update(brightness) {
    if (!this.brightness) {
      return;
    }

    this.brightness.value = brightness;
  }

  set() {
    this.thing.setProperty(this.name, this.brightness.value);
  }
}

module.exports = BrightnessDetail;
