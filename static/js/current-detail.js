/**
 * CurrentDetail
 *
 * A bubble showing current.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const LabelDetail = require('./label-detail');
const Utils = require('./utils');

class CurrentDetail extends LabelDetail {
  constructor(thing, name, friendlyName) {
    super(thing, name, friendlyName, 'A', 1);
    this.id = `current-${Utils.escapeHtmlForIdClass(this.name)}`;
  }

  view() {
    const name = Utils.escapeHtml(this.friendlyName);
    const value = parseFloat(this.thing.properties[this.name]);
    const data = value || 0;

    return `
      <webthing-current-property data-value="${data}" data-name="${name}"
        id="${this.id}">
      </webthing-current-property>`;
  }
}

module.exports = CurrentDetail;
