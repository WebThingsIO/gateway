/**
 * On/Off Switch.
 *
 * UI element representing an On/Off Switch.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const Constants = require('../../constants');
const Thing = require('./thing');

class OnOffSwitch extends Thing {
  /**
   * OnOffSwitch Constructor (extends Thing).
   *
   * @param {Object} description Thing description object.
   * @param {Number} format See Constants.ThingFormat
   * @param {Object} options Options for building the view.
   */
  constructor(model, description, format, options) {
    options = options ||
      {
        baseIcon: '/optimized-images/thing-icons/on_off_switch.svg',
      };

    super(model, description, format, options);

    if (this.format !== Constants.ThingFormat.LINK_ICON) {
      this.icon.addEventListener('click', this.handleClick.bind(this));
    }
  }

  /**
   * Find any properties required for this view.
   */
  findProperties() {
    this.onProperty = null;

    // Look for properties by type first.
    for (const name in this.displayedProperties) {
      const type = this.displayedProperties[name].property['@type'];

      if (type === 'OnOffProperty') {
        this.onProperty = name;
        break;
      }
    }

    // If necessary, match on name.
    if (this.onProperty === null &&
        this.displayedProperties.hasOwnProperty('on')) {
      this.onProperty = 'on';
    }
  }

  get icon() {
    return this.element.querySelector('webthing-on-off-switch-capability');
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

    if (name === this.onProperty) {
      this.icon.on = !!value;
    }

    return value;
  }

  /**
   * Handle a click on the on/off switch.
   */
  handleClick() {
    const newValue = !this.icon.on;
    this.icon.on = null;
    this.model.setProperty(this.onProperty, newValue).catch((error) => {
      console.error(`Error trying to toggle switch: ${error}`);
    });
  }

  iconView() {
    return `
      <webthing-on-off-switch-capability>
      </webthing-on-off-switch-capability>`;
  }
}

module.exports = OnOffSwitch;
