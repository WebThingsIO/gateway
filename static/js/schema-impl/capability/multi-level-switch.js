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
const Units = require('../../units');
const Utils = require('../../utils');

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

    this.precision = 0;
    this.unit = '';
    this.minimum = 0;
    this.maximum = 100;

    if (this.levelProperty) {
      const property =
        this.displayedProperties[this.levelProperty].convertedProperty;

      if (property.hasOwnProperty('multipleOf') &&
          `${property.multipleOf}`.includes('.')) {
        this.precision = `${property.multipleOf}`.split('.')[1].length;
      }

      if (property.hasOwnProperty('unit')) {
        this.unit = property.unit;
      }

      if (property.hasOwnProperty('minimum')) {
        this.minimum = property.minimum;
      }

      if (property.hasOwnProperty('maximum')) {
        this.maximum = property.maximum;
      }
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
    value = super.updateProperty(name, value);

    if (!this.displayedProperties.hasOwnProperty(name)) {
      return;
    }

    if (name === this.levelProperty) {
      value = parseFloat(value);
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
    const unit = Utils.escapeHtml(Units.nameToAbbreviation(this.unit));
    return `
      <webthing-multi-level-switch-capability data-unit="${unit}"
        data-precision="${this.precision}" min="${this.minimum}"
        max="${this.maximum}">
      </webthing-multi-level-switch-capability>`;
  }
}

module.exports = MultiLevelSwitch;
