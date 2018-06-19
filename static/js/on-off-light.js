/**
 * On/Off Light.
 *
 * UI element representing an On/Off Light.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const OnOffDetail = require('./on-off-detail');
const OnOffSwitch = require('./on-off-switch');
const Thing = require('./thing');

/**
 * OnOffLight Constructor (extends OnOffSwitch).
 *
 * @param Object description Thing description object.
 * @param {String} format 'svg', 'html', or 'htmlDetail'.
 */
function OnOffLight(description, format) {
  this.displayedProperties = this.displayedProperties || {};
  if (description.properties) {
    this.displayedProperties.on = {
      href: description.properties.on.href,
      detail: new OnOffDetail(this, 'on'),
    };
  }

  this.base = Thing;
  this.base(description, format, {svgBaseIcon: '/images/bulb.svg',
                                  pngBaseIcon: '/images/bulb.png'});

  if (format === 'svg') {
    // For now the SVG view is just a link.
    return this;
  }

  this.switch = this.element.querySelector('webthing-light-capability');

  if (format === 'htmlDetail') {
    this.attachHtmlDetail();
  } else {
    this.switch.addEventListener('click', this.handleClick.bind(this));
  }

  this.updateStatus();

  return this;
}

OnOffLight.prototype = Object.create(OnOffSwitch.prototype);

OnOffLight.prototype.iconView = function() {
  return `
    <webthing-light-capability>
    </webthing-light-capability>`;
};

module.exports = OnOffLight;
