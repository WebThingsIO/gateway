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
 * @param {Object} description Thing description object.
 * @param {String} format 'svg' or 'html', defaults to html.
 */
var Thing = function(description, format) {
  this.name = description.name;
  this.type = description.type;
  if (format == 'svg') {
    this.container = document.getElementById('floorplan-things');
    this.x = description.floorplanX;
    this.y = description.floorplanY;
  } else {
    this.container = document.getElementById('things');
  }
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
  this.element = this.render(format);
  // Only allow things to be removed from the HTML view for now.
  if (format != 'svg') {
    this.element.addEventListener('contextmenu',
      this.handleContextMenu.bind(this));
  }
  return this;
};

/**
 * HTML view for Thing.
 */
Thing.prototype.htmlView = function() {
  return '<div class="thing"><img class="thing-icon" ' +
    'src="/images/unknown-thing.png" /><span class="thing-name">' +
    this.name + '</span></div>';
};

/**
 * SVG view for Thing.
 */
Thing.prototype.svgView = function() {
  return '<a href="' + this.href +'" class="svg-thing-link">' +
    '  <circle cx="' + this.x + '" cy="' + this.y + '" ' +
    '    r="5" class="svg-thing-icon"></circle>' +
    '</a>';
};

/**
 * Render Thing view and add to DOM.
 *
 * @param {String} format 'svg' or 'html'.
 */
Thing.prototype.render = function(format) {
  var element;
  if (format == 'svg') {
    element = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    element.innerHTML = this.svgView();
  } else {
    element = document.createElement('div');
    element.innerHTML = this.htmlView();
  }
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
