/**
 * OpenDetail
 *
 * A bubble showing open state.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const StringLabelDetail = require('./string-label');
const Utils = require('../../utils');

class OpenDetail extends StringLabelDetail {
  constructor(thing, name, property) {
    super(thing, name, !!property.readOnly, property.title || 'Open');
    this.id = `open-${Utils.escapeHtmlForIdClass(this.name)}`;
  }

  view() {
    const readOnly = this.readOnly ? 'data-read-only="true"' : '';

    return `
      <webthing-open-property data-value="CLOSED" ${readOnly}
        data-name="${Utils.escapeHtml(this.label)}" id="${this.id}">
      </webthing-open-property>`;
  }

  update(value) {
    if (!this.label) {
      return;
    }

    this.labelElement.value = value ? 'OPEN' : 'CLOSED';
    this.labelElement.inverted = value;
  }
}

module.exports = OpenDetail;
