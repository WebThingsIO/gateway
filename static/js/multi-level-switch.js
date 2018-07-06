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
   * @param {String} format 'svg', 'html', or 'htmlDetail'.
   */
  constructor(description, format) {
    super(
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
    this.onProperty = null;

    for (const name in this.displayedProperties) {
      const type = this.displayedProperties[name].property['@type'];

      if (this.levelProperty === null &&
          (type === 'LevelProperty' || name === 'level')) {
        this.levelProperty = name;
      } else if (this.onProperty === null &&
                 (type === 'OnOffProperty' || name === 'on')) {
        this.onProperty = name;
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
    super.updateProperty(name, value);

    if (!this.displayedProperties.hasOwnProperty(name)) {
      return;
    }

    if (name === this.levelProperty) {
      value = parseInt(value, 10);
      this.icon.level = value;
    }
  }

  iconView() {
    return `
      <webthing-multi-level-switch-capability>
      </webthing-multi-level-switch-capability>`;
  }
}

module.exports = MultiLevelSwitch;
