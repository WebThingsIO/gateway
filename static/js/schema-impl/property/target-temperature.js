/**
 * TargetTemperatureDetail
 *
 * A bubble showing target temperature.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const NumberDetail = require('./number');
const Utils = require('../../utils');

class TargetTemperatureDetail extends NumberDetail {
  constructor(thing, name, property) {
    super(thing, name, property);
    this.id = `target-temperature-${Utils.escapeHtmlForIdClass(this.name)}`;
  }

  view() {
    const min = this.min === null ? '' : `min="${this.min}"`;
    const max = this.max === null ? '' : `max="${this.max}"`;

    return `
      <webthing-target-temperature-property data-value="0"
        data-name="${Utils.escapeHtml(this.label)}" data-unit="${this.unit}"
        ${min} ${max} value="0" step="${this.step}" id="${this.id}">
      </webthing-target-temperature-property>`;
  }
}

module.exports = TargetTemperatureDetail;
