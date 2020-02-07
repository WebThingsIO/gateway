/**
 * ColorModeDetail
 *
 * A bubble showing color mode.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const StringLabelDetail = require('./string-label');
const Utils = require('../../utils');
const fluent = require('../../fluent');

class ColorModeDetail extends StringLabelDetail {
  constructor(thing, name, property) {
    super(thing, name, !!property.readOnly,
          property.title || fluent.getMessage('off'));
    this.id = `color-mode-${Utils.escapeHtmlForIdClass(this.name)}`;
  }

  view() {
    return `
      <webthing-color-mode-property
        data-read-only="true" data-name="${Utils.escapeHtml(this.label)}"
        id="${this.id}">
      </webthing-color-mode-property>`;
  }

  update(value) {
    if (!this.label) {
      return;
    }

    this.labelElement.value = `${value}`.toUpperCase();
  }
}

module.exports = ColorModeDetail;
