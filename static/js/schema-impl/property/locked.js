/**
 * LockedDetail
 *
 * A bubble showing locked state.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const StringLabelDetail = require('./string-label');
const Utils = require('../../utils');
const fluent = require('../../fluent');

class LockedDetail extends StringLabelDetail {
  constructor(thing, name, property) {
    super(thing, name, !!property.readOnly,
          property.title || fluent.getMessage('locked'));
    this.id = `locked-${Utils.escapeHtmlForIdClass(this.name)}`;
  }

  view() {
    const readOnly = this.readOnly ? 'data-read-only="true"' : '';

    return `
      <webthing-locked-property
        data-value="${fluent.getMessage('unknown')}" ${readOnly}
        data-name="${Utils.escapeHtml(this.label)}" id="${this.id}">
      </webthing-locked-property>`;
  }

  update(value) {
    if (!this.label) {
      return;
    }

    if (!['locked', 'unlocked', 'unknown', 'jammed'].includes(value)) {
      value = 'unknown';
    }

    this.labelElement.value = fluent.getMessage(value);
    this.labelElement.inverted = value !== 'locked';
  }
}

module.exports = LockedDetail;
