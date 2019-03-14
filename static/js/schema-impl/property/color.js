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

const Utils = require('../../utils');

class ColorDetail {
  constructor(thing, name, property) {
    this.thing = thing;
    this.name = name;
    this.readOnly = !!property.readOnly;
    this.label = property.title || 'Color';
    this.id = `color-${Utils.escapeHtmlForIdClass(this.name)}`;
  }

  attach() {
    this.color = this.thing.element.querySelector(`#${this.id}`);
    this.color.addEventListener('change', this.set.bind(this));
  }

  view() {
    const readOnly = this.readOnly ? 'data-read-only="true"' : '';
    return `
      <webthing-color-property data-name="${Utils.escapeHtml(this.label)}"
        id="${this.id}" ${readOnly}>
      </webthing-color-property>`;
  }

  update(color) {
    if (!this.color) {
      return;
    }

    this.color.value = color;
  }

  set() {
    this.thing.setProperty(this.name, this.color.value);
  }
}

module.exports = ColorDetail;
