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

const NumericLabelDetail = require('./numeric-label');
const Utils = require('../../utils');

class CurrentDetail extends NumericLabelDetail {
  constructor(thing, name, property) {
    super(thing,
          name,
          !!property.readOnly,
          property.title || 'Current',
          'A',
          1);
    this.id = `current-${Utils.escapeHtmlForIdClass(this.name)}`;
  }

  view() {
    const readOnly = this.readOnly ? 'data-read-only="true"' : '';
    return `
      <webthing-current-property data-value="0" ${readOnly}
        data-name="${Utils.escapeHtml(this.label)}" id="${this.id}">
      </webthing-current-property>`;
  }
}

module.exports = CurrentDetail;
