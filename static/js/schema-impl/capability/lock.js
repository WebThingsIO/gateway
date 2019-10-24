/**
 * Lock.
 *
 * UI element representing a Lock.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const Thing = require('./thing');

class Lock extends Thing {
  /**
   * Lock Constructor (extends Thing).
   *
   * @param {Object} description Thing description object.
   * @param {Number} format See Constants.ThingFormat
   */
  constructor(model, description, format) {
    super(
      model,
      description,
      format,
      {
        baseIcon: '/optimized-images/thing-icons/lock.svg',
      }
    );
  }

  /**
   * Find any properties required for this view.
   */
  findProperties() {
    this.onProperty = null;

    // Look for properties by type first.
    for (const name in this.displayedProperties) {
      const type = this.displayedProperties[name].property['@type'];

      if (type === 'LockedProperty') {
        this.lockedProperty = name;
        break;
      }
    }

    // If necessary, match on name.
    if (this.lockedProperty === null &&
        this.displayedProperties.hasOwnProperty('locked')) {
      this.lockedProperty = 'locked';
    }
  }

  get icon() {
    return this.element.querySelector('webthing-lock-capability');
  }

  /**
   * Update the display for the provided property.
   * @param {string} name - name of the property
   * @param {*} value - value of the property
   */
  updateProperty(name, value) {
    value = super.updateProperty(name, value);

    if (!this.displayedProperties.hasOwnProperty(name)) {
      return;
    }

    if (name === this.lockedProperty) {
      this.icon.state = value;
    }
  }

  iconView() {
    return `
      <webthing-lock-capability>
      </webthing-lock-capability>`;
  }
}

module.exports = Lock;
