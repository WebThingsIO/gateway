/**
 * SmokeDetail
 *
 * A bubble showing smoke state.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const StringLabelDetail = require('./string-label');
const Utils = require('../../utils');
const fluent = require('../../fluent');

class SmokeDetail extends StringLabelDetail {
  constructor(thing, name, property) {
    super(thing, name, !!property.readOnly,
          property.title || fluent.getMessage('smoke'));
    this.id = `smoke-${Utils.escapeHtmlForIdClass(this.name)}`;
  }

  view() {
    const readOnly = this.readOnly ? 'data-read-only="true"' : '';

    return `
      <webthing-smoke-property data-name="${Utils.escapeHtml(this.label)}"
        id="${this.id}" ${readOnly}>
      </webthing-smoke-property>`;
  }

  update(value) {
    if (!this.label) {
      return;
    }

    this.labelElement.value = value;
  }
}

module.exports = SmokeDetail;
