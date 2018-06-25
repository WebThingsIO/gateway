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

const LevelDetail = require('./property-detail/level');
const OnOffDetail = require('./property-detail/on-off');
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
        svgBaseIcon: '/images/level.svg',
        pngBaseIcon: '/images/level.svg',
      },
      {
        on: OnOffDetail,
        level: LevelDetail,
      }
    );
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

    const property = this.displayedProperties[name].property;
    if (property['@type'] === 'OnOffProperty' || name === 'on') {
      this.icon.on = !!value;
    } else if (property['@type'] === 'LevelProperty' || name === 'level') {
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
