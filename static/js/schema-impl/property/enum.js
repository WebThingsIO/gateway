/**
 * EnumDetail
 *
 * A generic enum property detail.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const Units = require('../../units');
const Utils = require('../../utils');

class EnumDetail {
  constructor(thing, name, property) {
    this.thing = thing;
    this.name = name;
    this.readOnly = !!property.readOnly;
    this.label = property.title || name;
    this.type = property.type;
    this.unit =
      property.unit ? Units.nameToAbbreviation(property.unit) : null;
    this.choices = property.enum;
    this.id = `enum-${Utils.escapeHtmlForIdClass(this.name)}`;
  }

  attach() {
    this.select = this.thing.element.querySelector(`#${this.id}`);
    const setValue = Utils.debounce(500, this.set.bind(this));
    this.select.addEventListener('change', setValue);
  }

  view() {
    const unit = this.unit || '';

    if (this.readOnly) {
      if (this.type === 'number' || this.type === 'integer') {
        let precision = 0;

        // If the enum type is number, determine the precision from the
        // precision of the choices.
        if (this.type === 'number') {
          for (const choice of this.choices) {
            const decimal = `${choice}`.split('.')[1];
            if (typeof decimal === 'string') {
              precision = Math.max(precision, decimal.length);
            }
          }
        }

        return `
          <webthing-numeric-label-property
            data-name="${Utils.escapeHtml(this.label)}" data-unit="${unit}"
            data-precision="${precision}" id="${this.id}">
          </webthing-numeric-label-property>`;
      } else {
        return `
          <webthing-string-label-property
            data-name="${Utils.escapeHtml(this.label)}" id="${this.id}">
          </webthing-string-label-property>`;
      }
    } else {
      return `
        <webthing-enum-property data-name="${Utils.escapeHtml(this.label)}"
          data-unit="${unit}" data-type="${this.type}" id="${this.id}"
          data-choices="${btoa(JSON.stringify(this.choices))}">
        </webthing-enum-property>`;
    }
  }

  update(value) {
    if (!this.select) {
      return;
    }

    this.select.value = value;
  }

  set() {
    this.thing.setProperty(this.name, this.select.value);
  }
}

module.exports = EnumDetail;
