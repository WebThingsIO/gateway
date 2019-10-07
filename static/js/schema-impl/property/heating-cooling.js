/**
 * HeatingCoolingDetail
 *
 * A bubble showing heating/cooling state.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const StringLabelDetail = require('./string-label');
const Utils = require('../../utils');
const fluent = require('../../fluent');

class HeatingCoolingDetail extends StringLabelDetail {
  constructor(thing, name, property) {
    super(thing, name, !!property.readOnly,
          property.title || fluent.getMessage('off'));
    this.id = `heating-cooling-${Utils.escapeHtmlForIdClass(this.name)}`;
  }

  view() {
    return `
      <webthing-heating-cooling-property
        data-read-only="true" data-value="${fluent.getMessage('off')}"
        data-name="${Utils.escapeHtml(this.label)}" id="${this.id}">
      </webthing-heating-cooling-property>`;
  }

  update(value) {
    if (!this.label) {
      return;
    }

    this.labelElement.value = `${value}`.toUpperCase();
  }
}

module.exports = HeatingCoolingDetail;
