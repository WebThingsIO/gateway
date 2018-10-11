/**
 * Multi level switch
 *
 * UI element representing a switch with multiple levels
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const OnOffSwitch = require('./on-off-switch');

class MultiLevelSwitch extends OnOffSwitch {
  /**
   * MultiLevelSwitch Constructor (extends OnOffSwitch).
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
        baseIcon: '/optimized-images/thing-icons/multi_level_switch.svg',
      }
    );
  }

  /**
   * Find any properties required for this view.
   */
  findProperties() {
    super.findProperties();

    this.levelProperty = null;

    // Look for properties by type first.
    for (const name in this.displayedProperties) {
      const type = this.displayedProperties[name].property['@type'];

      if (type === 'LevelProperty') {
        this.levelProperty = name;
        break;
      }
    }

    // If necessary, match on name.
    if (this.levelProperty === null &&
        this.displayedProperties.hasOwnProperty('level')) {
      this.levelProperty = 'level';
    }
  }

  get icon() {
    return this.element.querySelector('webthing-multi-level-switch-capability');
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

    if (name === this.levelProperty) {
      value = parseInt(value, 10);
      this.icon.level = value;
    }
  }

  handleClick() {
    // Only click to toggle if we have an on/off property
    if (this.onProperty) {
      super.handleClick();
    }
  }

  iconView() {
    return `
      <webthing-multi-level-switch-capability>
      </webthing-multi-level-switch-capability>`;
  }
}

module.exports = MultiLevelSwitch;
