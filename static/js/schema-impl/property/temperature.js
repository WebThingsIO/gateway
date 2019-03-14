/**
 * TemperatureDetail
 *
 * A bubble showing temperature.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const NumericLabelDetail = require('./numeric-label');
const Utils = require('../../utils');

class TemperatureDetail extends NumericLabelDetail {
  constructor(thing, name, property) {
    super(thing,
          name,
          !!property.readOnly,
          property.title || 'Temperature',
          property.unit || 'degree celsius',
          0);
    this.id = `temperature-${Utils.escapeHtmlForIdClass(this.name)}`;
  }

  view() {
    const readOnly = this.readOnly ? 'data-read-only="true"' : '';

    return `
      <webthing-temperature-property data-value="0" ${readOnly}
        data-name="${Utils.escapeHtml(this.label)}" data-unit="${this.unit}"
        id="${this.id}">
      </webthing-temperature-property>`;
  }
}

module.exports = TemperatureDetail;
