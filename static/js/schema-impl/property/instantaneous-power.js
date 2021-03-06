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

const NumericLabelDetail = require('./numeric-label');
const Utils = require('../../utils');
const fluent = require('../../fluent');

class InstantaneousPowerDetail extends NumericLabelDetail {
  constructor(thing, name, property) {
    super(thing, name, !!property.readOnly, property.title || fluent.getMessage('power'), 'W', 0);
    this.id = `instantaneous-power-${Utils.escapeHtmlForIdClass(this.name)}`;

    if (property.hasOwnProperty('multipleOf') && `${property.multipleOf}`.includes('.')) {
      this.precision = `${property.multipleOf}`.split('.')[1].length;
    } else {
      this.precision = 0;
    }
  }

  view() {
    const readOnly = this.readOnly ? 'data-read-only="true"' : '';
    return `
      <webthing-instantaneous-power-property data-value="0" ${readOnly}
        data-name="${Utils.escapeHtml(this.label)}" data-unit="${this.unit}"
        data-precision="${this.precision}" id="${this.id}">
      </webthing-instantaneous-power-property>`;
  }
}

module.exports = InstantaneousPowerDetail;
