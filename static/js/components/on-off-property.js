/**
 * OnOffProperty
 *
 * A bubble showing an on/off switch.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const SwitchProperty = require('./switch-property');

class OnOffProperty extends SwitchProperty {
  connectedCallback() {
    super.connectedCallback();
    this.onLabel = 'On';
    this.offLabel = 'Off';
  }
}

window.customElements.define('webthing-on-off-property', OnOffProperty);
module.exports = OnOffProperty;
