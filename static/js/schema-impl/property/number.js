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

const Utils = require('../../utils');

class NumberDetail {
  constructor(thing, name, property) {
    this.thing = thing;
    this.name = name;
    this.readOnly = !!property.readOnly;
    this.label = property.title || name;
    this.type = property.type;
    this.unit =
      property.unit ? Utils.unitNameToAbbreviation(property.unit) : null;
    this.precision = property.type === 'integer' ? 0 : 3;

    if (property.hasOwnProperty('minimum')) {
      this.min = property.minimum;
    } else {
      this.min = null;
    }

    if (property.hasOwnProperty('maximum')) {
      this.max = property.maximum;
    } else {
      this.max = null;
    }

    if (property.hasOwnProperty('multipleOf')) {
      this.step = property.multipleOf;
    } else if (property.type === 'number') {
      this.step = 'any';
    } else {
      this.step = 1;
    }

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
    const unit = this.unit || '';

    if (this.readOnly) {
      return `
        <webthing-numeric-label-property
          data-name="${Utils.escapeHtml(this.label)}" data-unit="${unit}"
          data-precision="${this.precision}" id="${this.id}">
        </webthing-numeric-label-property>`;
    } else {
      const min = this.min === null ? '' : `min="${this.min}"`;
      const max = this.max === null ? '' : `max="${this.max}"`;

      return `
        <webthing-number-property data-name="${Utils.escapeHtml(this.label)}"
          data-unit="${unit}" ${min} ${max} value="0" step="${this.step}"
          id="${this.id}">
        </webthing-number-property>`;
    }
  }

  /**
   * Update the detail view with the new property value.
   */
  update(number) {
    if (!this.input) {
      return;
    }

    this.input.value = number;
  }

  set() {
    this.thing.setProperty(this.name, this.input.value);
  }
}

module.exports = NumberDetail;
