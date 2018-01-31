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

/* globals App, API */

/**
 * Thing constructor.
 *
 * @param {Object} description Thing description object.
 * @param {String} format 'svg' or 'html', defaults to html.
 */
var Thing = function(description, format, options) {
  const opts = options || {};
  this.name = description.name;
  this.type = description.type;
  this.svgBaseIcon = opts.svgBaseIcon || '/images/unknown-thing.svg';
  this.pngBaseIcon = opts.pngBaseIcon || '/images/unknown-thing.png';
  this.thingCssClass = opts.thingCssClass || '';
  this.addIconToView =
    typeof(opts.addIconToView) === 'boolean' ? opts.addIconToView : true;

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
    this.id = this.href.pathname.split('/').pop();

    var wsHref = this.href.href.replace(/^http/, 'ws');
    this.ws = new WebSocket(wsHref + '?jwt=' + API.jwt);
    this.ws.addEventListener('message', function(event) {
      var message = JSON.parse(event.data);
      if (message.messageType === 'propertyStatus') {
        this.onPropertyStatus(message.data);
      }
    }.bind(this));
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
 * HTML view for unknown Thing.
 */
Thing.prototype.htmlView = function() {
  return `<div class="thing ${this.thingCssClass}">
    <img class="thing-icon"
      ${this.addIconToView ? `src="${this.pngBaseIcon}"` : ''} />
    <span class="thing-name">${this.name}</span>
  </div>`;
};

/**
 * HTML detail view for unknown Thing.
 */
Thing.prototype.htmlDetailView = function() {
  return `<div class="thing ${this.thingCssClass}">
    <img class="thing-icon"
      ${this.addIconToView ? `src="${this.pngBaseIcon}"` : ''} />
  </div>`;
};

/**
 * Generate a wrapped svg text element containing the provided text
 * @param {String} text
 * @return {Element}
 */
Thing.prototype.makeWrappedSVGText = function(text) {
  let lineHeight = 2.5;
  let lineWidth = 12;
  let x = 0;
  let y = 8;
  let row = '';
  let words = text.split(' ');

  let textElt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  textElt.setAttribute('x', x);
  textElt.setAttribute('y', y);
  textElt.setAttribute('text-anchor', 'middle');
  textElt.classList.add('svg-thing-text');

  function makeTSpan(textContent) {
    let tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    tspan.setAttribute('x', x);
    tspan.setAttribute('y', y);
    tspan.textContent = textContent;
    return tspan;
  }

  while (words.length > 0) {
    let word = words.shift();
    if (row.length + word.length + 1 < lineWidth) {
      row += ' ' + word;
    } else {
      textElt.appendChild(makeTSpan(row));
      row = word;
      y += lineHeight;
    }
  }
  if (row) {
    textElt.appendChild(makeTSpan(row));
  }

  return textElt;
};

/**
 * SVG view for unknown thing.
 */
Thing.prototype.svgView = function() {
  return `<g transform="translate(${this.x},${this.y})"
            dragx="${this.x}" dragy="${this.y}"
            class="floorplan-thing">
            <a href="${this.href}" class="svg-thing-link">
              <circle cx="0" cy="0" r="5" class="svg-thing-icon" />
              <image x="-2.5" y="-2.5" width="5" height="5"
                xlink:href="${this.svgBaseIcon}" />
              ${this.makeWrappedSVGText(this.name).outerHTML}
            </a>
          </g>`;
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
    if (format == 'htmlDetail') {
      element.innerHTML = this.htmlDetailView();
    } else {
      element.innerHTML = this.htmlView();
    }
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

/**
 * Handle a 'propertyStatus' websocket message
 * @param {Object} properties - property data
 */
Thing.prototype.onPropertyStatus = function(_properties) {
};
