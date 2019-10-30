/**
 * AlarmDetail
 *
 * A bubble showing alarm state.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const StringLabelDetail = require('./string-label');
const Utils = require('../../utils');
const fluent = require('../../fluent');

class AlarmDetail extends StringLabelDetail {
  constructor(thing, name, property) {
    super(thing, name, !!property.readOnly,
          property.title || fluent.getMessage('alarm'));
    this.readOnly = !!property.readOnly;
    this.id = `alarm-${Utils.escapeHtmlForIdClass(this.name)}`;
  }

  attach() {
    super.attach();

    if (!this.readOnly) {
      this.input = this.labelElement;
      const setChecked = Utils.debounce(500, this.set.bind(this));
      this.input.addEventListener('change', setChecked);
    }
  }

  view() {
    if (this.readOnly) {
      return `
        <webthing-alarm-property data-value="OK"
          data-name="${Utils.escapeHtml(this.label)}" id="${this.id}">
        </webthing-alarm-property>`;
    } else {
      return `
        <webthing-boolean-property
          data-name="${Utils.escapeHtml(this.label)}" id="${this.id}">
        </webthing-boolean-property>`;
    }
  }

  update(value) {
    if (!this.labelElement) {
      return;
    }

    if (this.readOnly) {
      this.labelElement.value = value ? 'ALARM' : 'OK';
      this.labelElement.inverted = value;
    } else {
      if (value == this.input.checked) {
        return;
      }

      this.input.checked = value;
    }
  }

  set() {
    this.thing.setProperty(this.name, this.input.checked);
  }
}

module.exports = AlarmDetail;
