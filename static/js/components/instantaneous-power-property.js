/**
 * InstantaneousPowerProperty
 *
 * A bubble showing an instantaneous power label.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const LabelProperty = require('./label-property');

class InstantaneousPowerProperty extends LabelProperty {
  connectedCallback() {
    super.connectedCallback();
    this.unit = 'W';
    this.precision = 0;
  }
}

window.customElements.define('webthing-instantaneous-power-property',
                             InstantaneousPowerProperty);
module.exports = InstantaneousPowerProperty;
