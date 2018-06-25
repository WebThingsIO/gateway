/**
 * LabelDetail
 *
 * A bubble showing some basic information with no input.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const Utils = require('../utils');

class LabelDetail {
  constructor(thing, name, label, unit, precision) {
    this.thing = thing;
    this.name = name;
    this.label = label;
    this.unit = Utils.unitNameToAbbreviation(unit);
    this.precision = precision;
    this.id = `label-${Utils.escapeHtmlForIdClass(this.name)}`;
  }

  attach() {
    this.labelElement = this.thing.element.querySelector(`#${this.id}`);
  }

  view() {
    const name = Utils.escapeHtml(this.label);
    const unit = Utils.escapeHtml(this.unit);
    const value = parseFloat(this.thing.properties[this.name]);
    const data = value || 0;

    return `
      <webthing-label-property data-value="${data}" data-name="${name}"
        data-unit="${unit}" data-precision="${this.precision}" id="${this.id}">
      </webthing-label-property>`;
  }

  update() {
    if (!this.label) {
      return;
    }

    this.labelElement.value = parseFloat(this.thing.properties[this.name]) || 0;
  }
}

module.exports = LabelDetail;
