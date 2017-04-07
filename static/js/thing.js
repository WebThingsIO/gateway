/**
 * Thing.
 *
 * Represents an individual web thing.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

/**
 * Thing constructor.
 *
 * @param Object description Thing description object.
 */
var Thing = function(description) {
  this.type = description.type;
  this.name = description.name;
  this.container = document.getElementById('things');
  this.render();
};

/**
 * HTML view for Thing.
 */
Thing.prototype.view = function() {
  switch(this.type) {
    case 'onOffSwitch':
      return '<div class="thing"><img class="thing-icon" ' +
        'src="/images/on_off_switch.png" /><span class="thing-name">' +
        this.name + '</span></div>';
  }
};

/**
 * Render Thing view and add to DOM.
 */
Thing.prototype.render = function() {
  this.container.insertAdjacentHTML('beforeend', this.view());
};
