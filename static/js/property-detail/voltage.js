/**
 * VoltageDetail
 *
 * A bubble showing voltage.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const LabelDetail = require('./label');
const Utils = require('../utils');

class VoltageDetail extends LabelDetail {
  constructor(thing, name, property) {
    super(thing, name, property.label || 'Voltage', 'V', 0);
    this.id = `voltage-${Utils.escapeHtmlForIdClass(this.name)}`;
  }

  view() {
    return `
      <webthing-voltage-property data-value="0"
        data-name="${Utils.escapeHtml(this.label)}" id="${this.id}">
      </webthing-voltage-property>`;
  }
}

module.exports = VoltageDetail;
