/**
 * Push Button.
 *
 * UI element representing a Push Button.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const Thing = require('./thing');

class PushButton extends Thing {
  /**
   * PushButton Constructor (extends Thing).
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
        baseIcon: '/optimized-images/thing-icons/push_button.svg',
      }
    );
  }

  /**
   * Find any properties required for this view.
   */
  findProperties() {
    this.pushedProperty = null;

    // Look for properties by type first.
    for (const name in this.displayedProperties) {
      const type = this.displayedProperties[name].property['@type'];

      if (type === 'PushedProperty') {
        this.pushedProperty = name;
        break;
      }
    }
  }

  get icon() {
    return this.element.querySelector('webthing-push-button-capability');
  }

  /**
   * Update the display for the provided property.
   * @param {string} name - name of the property
   * @param {*} value - value of the property
   */
  updateProperty(name, value) {
    super.updateProperty(name, value);

    if (!this.displayedProperties.hasOwnProperty(name)) {
      return;
    }

    if (name === this.pushedProperty) {
      this.icon.pushed = !!value;
    }
  }

  iconView() {
    return `
      <webthing-push-button-capability>
      </webthing-push-button-capability>`;
  }
}

module.exports = PushButton;
