/**
 * NumericLabelDetail
 *
 * A bubble showing some basic numeric information with no input.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const Units = require('../../units');
const Utils = require('../../utils');

class NumericLabelDetail {
  constructor(thing, name, readOnly, label, unit, precision) {
    this.thing = thing;
    this.name = name;
    this.readOnly = readOnly;
    this.label = label;
    this.unit = Units.nameToAbbreviation(unit);
    this.precision = precision;
    this.id = `label-${Utils.escapeHtmlForIdClass(this.name)}`;
  }

  attach() {
    this.labelElement = this.thing.element.querySelector(`#${this.id}`);
  }

  view() {
    const name = Utils.escapeHtml(this.label);
    const unit = Utils.escapeHtml(this.unit);
    const readOnly = this.readOnly ? 'data-read-only="true"' : '';

    return `
      <webthing-numeric-label-property data-value="0" data-name="${name}"
        data-unit="${unit}" data-precision="${this.precision}" id="${this.id}"
        ${readOnly}>
      </webthing-numeric-label-property>`;
  }

  update(value) {
    if (!this.label) {
      return;
    }

    this.labelElement.value = parseFloat(value) || 0;
  }
}

module.exports = NumericLabelDetail;
