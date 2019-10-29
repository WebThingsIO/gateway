/**
 * StringLabelDetail
 *
 * A bubble showing some basic string information with no input.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const Utils = require('../../utils');

class StringLabelDetail {
  constructor(thing, name, readOnly, label) {
    this.thing = thing;
    this.name = name;
    this.readOnly = readOnly;
    this.label = label;
    this.id = `label-${Utils.escapeHtmlForIdClass(this.name)}`;
  }

  attach() {
    this.labelElement = this.thing.element.querySelector(`#${this.id}`);
  }

  view() {
    const name = Utils.escapeHtml(this.label);
    const readOnly = this.readOnly ? 'data-read-only="true"' : '';

    return `
      <webthing-string-label-property data-value="0" data-name="${name}"
        id="${this.id}" ${readOnly}>
      </webthing-string-label-property>`;
  }

  update(value) {
    if (!this.labelElement) {
      return;
    }

    this.labelElement.value = value;
  }
}

module.exports = StringLabelDetail;
