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

const Utils = require('./utils');

class OnOffDetail {
  constructor(thing, name) {
    this.thing = thing;
    this.name = name;
    this.id = `on-off-${Utils.escapeHtmlForIdClass(this.name)}`;
  }

  attach() {
    this.onOffSwitch = this.thing.element.querySelector(`#${this.id}`);
    if (typeof this.thing.handleClick === 'function') {
      this.onOffSwitch.addEventListener(
        'change', this.thing.handleClick.bind(this.thing));
    }
  }

  view() {
    const checked = this.thing.properties[this.name];

    return `
      <webthing-on-off-property data-name="On/Off" ${checked ? 'checked' : ''}
        id="${this.id}">
      </webthing-on-off-property>`;
  }

  update() {
    const on = this.thing.properties[this.name];
    this.onOffSwitch.checked = on;
  }
}

module.exports = OnOffDetail;
