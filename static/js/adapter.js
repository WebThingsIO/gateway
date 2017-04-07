/**
 * Adapter.
 *
 * Represents an individual adapter (e.g. ZigBee, Z-Wave, or Philips Hue).
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

/**
 * Adapter constructor.
 *
 * @param Object description Adapter metadata object.
 */
var Adapter = function(metadata) {
  this.name = metadata.name;
  this.container = document.getElementById('adapters');
  this.render();
};

/**
 * HTML view for Adapter.
 */
Adapter.prototype.view = function() {
  return '<div class="adapter"><img class="adapter-icon" ' +
    'src="/images/adapter-icon.png" /><span class="adapter-name">' +
    this.name + '</span></div>';
};

/**
 * Render Adapter view and add to DOM.
 */
Adapter.prototype.render = function() {
  this.container.insertAdjacentHTML('beforeend', this.view());
};
