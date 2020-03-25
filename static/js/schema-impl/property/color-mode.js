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

const EnumDetail = require('./enum');
const Utils = require('../../utils');

class ColorModeDetail extends EnumDetail {
  constructor(thing, name, property) {
    super(thing, name, property);
    this.id = `color-mode-${Utils.escapeHtmlForIdClass(this.name)}`;
  }

  attach() {
    if (this.readOnly) {
      this.labelElement = this.thing.element.querySelector(`#${this.id}`);
    } else {
      super.attach();
    }
  }

  view() {
    if (this.readOnly) {
      return `
        <webthing-string-label-property
          data-read-only="true" data-name="${Utils.escapeHtml(this.label)}"
          id="${this.id}">
        </webthing-string-label-property>`;
    } else {
      return `
        <webthing-color-mode-property
          data-choices="${btoa(JSON.stringify(this.choices))}"
          data-name="${Utils.escapeHtml(this.label)}" id="${this.id}">
        </webthing-color-mode-property>`;
    }
  }

  update(value) {
    if (this.readOnly) {
      if (!this.labelElement) {
        return;
      }

      this.labelElement.value = `${value}`.toUpperCase();
    } else {
      super.update(value);
    }
  }
}

module.exports = ColorModeDetail;
