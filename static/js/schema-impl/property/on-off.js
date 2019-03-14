/**
 * OnOffDetail
 *
 * A bubble showing the on/off state of a thing
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const Utils = require('../../utils');

class OnOffDetail {
  constructor(thing, name, property) {
    this.thing = thing;
    this.name = name;
    this.readOnly = !!property.readOnly;
    this.label = property.title || 'On/Off';
    this.id = `on-off-${Utils.escapeHtmlForIdClass(this.name)}`;
  }

  attach() {
    this.input = this.thing.element.querySelector(`#${this.id}`);
    const setOnOff = Utils.debounce(500, this.set.bind(this));
    this.input.addEventListener('change', setOnOff);
  }

  view() {
    const readOnly = this.readOnly ? 'data-read-only="true"' : '';

    return `
      <webthing-on-off-property data-name="${Utils.escapeHtml(this.label)}"
        id="${this.id}" ${readOnly}>
      </webthing-on-off-property>`;
  }

  update(on) {
    this.input.checked = on;
  }

  set() {
    this.thing.setProperty(this.name, this.input.checked);
  }
}

module.exports = OnOffDetail;
