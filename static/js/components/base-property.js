/**
 * BaseProperty
 *
 * A base property webcomponent class.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

class BaseProperty extends HTMLElement {
  constructor(template) {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
  }

  disconnectedCallback() {
  }

  _upgradeProperty(prop) {
    if (this.hasOwnProperty(prop)) {
      const value = this[prop];
      delete this[prop];
      this[prop] = value;
    }

    if (this.hasAttribute(prop)) {
      this[prop] = this.getAttribute(prop);
    }
  }
}

module.exports = BaseProperty;
