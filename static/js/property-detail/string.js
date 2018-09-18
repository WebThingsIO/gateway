/**
 * StringDetail
 *
 * A generic string property detail.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const Utils = require('../utils');

class StringDetail {
  constructor(thing, name, property) {
    this.thing = thing;
    this.name = name;
    this.readOnly = !!property.readOnly;
    this.label = property.label || name;
    this.id = `string-${Utils.escapeHtmlForIdClass(this.name)}`;
  }

  /**
   * Attach to the view.
   */
  attach() {
    this.input = this.thing.element.querySelector(`#${this.id}`);
    this.input.addEventListener('change', () => {
      this.thing.setProperty(this.name, this.input.value);
    });
  }

  /**
   * Build the detail view.
   */
  view() {
    const readOnly = this.readOnly ? 'data-read-only="true"' : '';

    return `
      <webthing-string-property data-name="${Utils.escapeHtml(this.label)}"
        id="${this.id}" ${readOnly}>
      </webthing-string-property>`;
  }

  /**
   * Update the detail view with the new property value.
   */
  update(string) {
    if (!this.input || string == this.input.value) {
      return;
    }

    this.input.value = string;
  }
}

module.exports = StringDetail;
