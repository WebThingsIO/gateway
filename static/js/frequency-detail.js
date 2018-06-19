/**
 * FrequencyDetail
 *
 * A bubble showing frequency.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const LabelDetail = require('./label-detail');
const Utils = require('./utils');

class FrequencyDetail extends LabelDetail {
  constructor(thing, name, friendlyName) {
    super(thing, name, friendlyName, 'Hz', 0);
    this.id = `frequency-${Utils.escapeHtmlForIdClass(this.name)}`;
  }

  view() {
    const name = Utils.escapeHtml(this.friendlyName);
    const value = parseFloat(this.thing.properties[this.name]);
    const data = value || 0;

    return `
      <webthing-frequency-property data-value="${data}" data-name="${name}"
        id="${this.id}">
      </webthing-frequency-property>`;
  }
}

module.exports = FrequencyDetail;
