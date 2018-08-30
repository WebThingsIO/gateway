/**
 * CurrentProperty
 *
 * A bubble showing a current label.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const NumericLabelProperty = require('./numeric-label');

class CurrentProperty extends NumericLabelProperty {
  connectedCallback() {
    this.unit = 'A';
    this.precision = 1;
    super.connectedCallback();
  }
}

window.customElements.define('webthing-current-property', CurrentProperty);
module.exports = CurrentProperty;
