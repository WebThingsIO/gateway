/**
 * InstantaneousPowerDetail
 *
 * A bubble showing instantaneous power.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const LabelDetail = require('./label');
const Utils = require('../utils');

class InstantaneousPowerDetail extends LabelDetail {
  constructor(thing, name, property) {
    super(thing, name, property.label || 'Power', 'W', 0);
    this.id = `instantaneous-power-${Utils.escapeHtmlForIdClass(this.name)}`;
  }

  view() {
    const name = Utils.escapeHtml(this.label);
    const value = parseFloat(this.thing.properties[this.name]);
    const data = value || 0;

    return `
      <webthing-instantaneous-power-property data-value="${data}"
        data-name="${name}" id="${this.id}">
      </webthing-instantaneous-power-property>`;
  }
}

module.exports = InstantaneousPowerDetail;
