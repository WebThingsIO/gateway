/**
 * ThermostatModeDetail
 *
 * A property detail showing a thermostat mode selector.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const EnumDetail = require('./enum');
const Utils = require('../../utils');

class ThermostatModeDetail extends EnumDetail {
  constructor(thing, name, property) {
    super(thing, name, property);
    this.id = `thermostat-mode-${Utils.escapeHtmlForIdClass(this.name)}`;
  }

  view() {
    const unit = this.unit || '';

    return `
      <webthing-thermostat-mode-property data-name="${Utils.escapeHtml(this.label)}"
        data-unit="${unit}" data-type="${this.type}" id="${this.id}"
        data-choices="${btoa(JSON.stringify(this.choices))}">
      </webthing-thermostat-mode-property>`;
  }
}

module.exports = ThermostatModeDetail;
