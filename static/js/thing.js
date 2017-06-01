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

/* globals App */

/**
 * Thing constructor.
 *
 * @param Object description Thing description object.
 */
var Thing = function(description) {
  this.name = description.name;
  this.type = description.type;
  this.container = document.getElementById('things');
  this.element = this.render();
  this.element.addEventListener('contextmenu',
    this.handleContextMenu.bind(this));
  this.properties = {};
  // Parse base URL of Thing
  if (description.href) {
    this.href = new URL(description.href, App.ORIGIN);
  }
  // Parse properties
  if (description.properties) {
    this.propertyDescriptions = {};
    for (var propertyName in description.properties) {
      var property = description.properties[propertyName];
      this.propertyDescriptions[propertyName] = property;
    }
  }
  return this;
};

/**
 * HTML view for Thing.
 */
Thing.prototype.view = function() {
  return '<div class="thing"><img class="thing-icon" ' +
    'src="/images/unknown-thing.png" /><span class="thing-name">' +
    this.name + '</span></div>';
};

/**
 * Render Thing view and add to DOM.
 */
Thing.prototype.render = function() {
  var element = document.createElement('div');
  element.innerHTML = this.view();
  return this.container.appendChild(element.firstChild);
};

/**
 * Handle a context menu event.
 *
 * Right click on desktop, long press on mobile.
 *
 * @param {Event} e contextmenu event.
 */
Thing.prototype.handleContextMenu = function(e) {
  e.preventDefault(e);
  var newEvent = new CustomEvent('_contextmenu', {
    detail: {
      thingUrl: this.href.href,
      thingName: this.name
    }
  });
  window.dispatchEvent(newEvent);
};
