/**
 * OccupiedDetail
 *
 * A bubble showing occupied state.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const StringLabelDetail = require('./string-label');
const Utils = require('../../utils');
const fluent = require('../../fluent');

class OccupiedDetail extends StringLabelDetail {
  constructor(thing, name, property) {
    super(thing, name, !!property.readOnly, property.title || fluent.getMessage('occupied'));
    this.id = `occupied-${Utils.escapeHtmlForIdClass(this.name)}`;
  }

  view() {
    const readOnly = this.readOnly ? 'data-read-only="true"' : '';

    return `
      <webthing-occupied-property
        data-value="${fluent.getMessage('unoccupied')}" ${readOnly}
        data-name="${Utils.escapeHtml(this.label)}" id="${this.id}">
      </webthing-occupied-property>`;
  }

  update(value) {
    if (!this.label) {
      return;
    }

    this.labelElement.value = value
      ? fluent.getMessage('occupied')
      : fluent.getMessage('unoccupied');
    this.labelElement.inverted = value;
  }
}

module.exports = OccupiedDetail;
