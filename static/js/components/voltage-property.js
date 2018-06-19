/**
 * VoltageProperty
 *
 * A bubble showing a voltage label.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const LabelProperty = require('./label-property');

class VoltageProperty extends LabelProperty {
  connectedCallback() {
    super.connectedCallback();
    this.unit = 'V';
    this.precision = 0;
  }
}

window.customElements.define('webthing-voltage-property', VoltageProperty);
module.exports = VoltageProperty;
