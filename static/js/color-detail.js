/**
 * ColorDetail
 *
 * A bubble showing the color of a thing
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const Utils = require('./utils');

class ColorDetail {
  constructor(thing, name, label) {
    this.thing = thing;
    this.name = name;
    this.label = label || 'Color';
    this.id = `color-${Utils.escapeHtmlForIdClass(this.name)}`;
  }

  attach() {
    this.color = this.thing.element.querySelector(`#${this.id}`);
    this.color.addEventListener('change', this.set.bind(this));
  }

  view() {
    const color = this.thing.properties[this.name];
    return `
      <webthing-color-property data-name="${Utils.escapeHtml(this.label)}"
        value="${Utils.escapeHtml(color)}" id="${this.id}">
      </webthing-color-property>`;
  }

  update() {
    if (this.thing.properties[this.name] == this.color.value) {
      return;
    }
    this.color.value = this.thing.properties[this.name];
  }

  set() {
    this.thing.setColor(this.color.value);
  }
}

module.exports = ColorDetail;
