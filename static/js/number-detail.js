/**
 * NumberDetail
 *
 * A generic numeric property detail.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const Utils = require('./utils');

class NumberDetail {
  constructor(thing, name, type, unit, min, max) {
    this.thing = thing;
    this.name = name;
    this.type = type;
    this.unit = typeof unit === 'undefined' ? null : unit;
    this.min = typeof min === 'undefined' ? null : min;
    this.max = typeof max === 'undefined' ? null : max;
    this.id = `number-${Utils.escapeHtmlForIdClass(this.name)}`;
  }

  /**
   * Attach to the view.
   */
  attach() {
    this.input = this.thing.element.querySelector(`#${this.id}`);
    const setNumber = Utils.debounce(500, this.set.bind(this));
    this.input.addEventListener('change', setNumber);
  }

  /**
   * Build the detail view.
   */
  view() {
    const min = this.min === null ? '' : `min=${Utils.escapeHtml(this.min)}`;
    const max = this.max === null ? '' : `max=${Utils.escapeHtml(this.max)}`;
    const unit = this.unit || '';
    const step = this.type === 'number' ? 'any' : '1';

    return `
      <webthing-number-property data-name="${Utils.escapeHtml(this.name)}"
        data-unit="${unit}" ${min} ${max} value="0" step="${step}"
        id="${this.id}">
      </webthing-number-property>`;
  }

  /**
   * Update the detail view with the new property value.
   */
  update() {
    if (!this.input || this.thing.properties[this.name] == this.input.value) {
      return;
    }

    this.input.value = this.thing.properties[this.name];
  }

  set() {
    this.thing.setProperty(this.name, this.input.value);
  }
}

module.exports = NumberDetail;
