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

/* globals OnOffSwitch, Thing */

/**
 * OnOffLight Constructor (extends OnOffSwitch).
 *
 * @param Object description Thing description object.
 * @param {String} format 'svg', 'html', or 'htmlDetail'.
 */
function OnOffLight(description, format) {
  this.base = Thing;
  this.base(description, format, {svgBaseIcon: '/images/bulb.svg',
                                  pngBaseIcon: '/images/bulb.png',
                                  thingCssClass: 'on-off-light',
                                  addIconToView: false});
  if (format == 'svg') {
    // For now the SVG view is just a link.
    return this;
  }
  // Parse on property URL
  if (this.propertyDescriptions.on.href) {
    this.onPropertyUrl = new URL(this.propertyDescriptions.on.href, this.href);
  }
  this.updateStatus();
  this.element.addEventListener('click', this.handleClick.bind(this));
  return this;
}

OnOffLight.prototype = Object.create(OnOffSwitch.prototype);
