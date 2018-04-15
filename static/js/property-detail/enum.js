/**
 * EnumDetail
 *
 * A generic enum property detail.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const Utils = require('../utils');

class EnumDetail {
  constructor(thing, name, property) {
    this.thing = thing;
    this.name = name;
    this.label = property.label || name;
    this.type = property.type;
    this.unit =
      property.unit ? Utils.unitNameToAbbreviation(property.unit) : null;
    this.choices = property.enum;
    this.id = `enum-${Utils.escapeHtmlForIdClass(this.name)}`;
  }

  attach() {
    this.select = this.thing.element.querySelector(`#${this.id}`);
    const setValue = Utils.debounce(500, this.set.bind(this));
    this.select.addEventListener('change', setValue);
  }

  view() {
    const unit = this.unit || '';

    return `
      <webthing-enum-property data-name="${Utils.escapeHtml(this.label)}"
        data-unit="${unit}" data-choices="${btoa(JSON.stringify(this.choices))}"
        data-type="${this.type}" id="${this.id}">
      </webthing-enum-property>`;
  }

  update() {
    if (!this.select || this.thing.properties[this.name] == this.select.value) {
      return;
    }

    this.select.value = this.thing.properties[this.name];
  }

  set() {
    this.thing.setProperty(this.name, this.select.value);
  }
}

module.exports = EnumDetail;
