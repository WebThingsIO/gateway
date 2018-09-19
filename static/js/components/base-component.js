/**
 * BaseComponent
 *
 * A base webcomponent class.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

class BaseComponent extends HTMLElement {
  constructor(template) {
    super();
    this.attachShadow({mode: 'open'});
    const templateClone = template.content.cloneNode(true);
    // Detect whether ShadowRoot has been polyfilled on this browser
    if (ShadowRoot.name !== 'ShadowRoot') {
      const tagName = this.shadowRoot.host.tagName;
      templateClone.querySelectorAll('style').forEach((style) => {
        style.innerHTML = style.innerHTML.replace(/:host/g, tagName);
      });
    }

    this.shadowRoot.appendChild(templateClone);
    BaseComponent.count++;
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

BaseComponent.count = 0;
module.exports = BaseComponent;
