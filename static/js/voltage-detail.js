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

const LabelDetail = require('./label-detail');
const Utils = require('./utils');

class VoltageDetail extends LabelDetail {
  constructor(thing, name, label) {
    super(thing, name, label || 'Voltage', 'V', 0);
    this.id = `voltage-${Utils.escapeHtmlForIdClass(this.name)}`;
  }

  view() {
    const name = Utils.escapeHtml(this.label);
    const value = parseFloat(this.thing.properties[this.name]);
    const data = value || 0;

    return `
      <webthing-voltage-property data-value="${data}" data-name="${name}"
        id="${this.id}">
      </webthing-voltage-property>`;
  }
}

module.exports = VoltageDetail;
