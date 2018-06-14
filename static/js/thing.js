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

const App = require('./app');
const API = require('./api');
const Utils = require('./utils');
const ThingDetailLayout = require('./thing-detail-layout');

/**
 * Thing constructor.
 *
 * @param {Object} description Thing description object.
 * @param {String} format 'svg' or 'html', defaults to html.
 */
const Thing = function(description, format, options) {
  const opts = options || {};
  this.name = description.name;
  this.type = description.type;
  this.svgBaseIcon = opts.svgBaseIcon || '/images/unknown-thing.svg';
  this.pngBaseIcon = opts.pngBaseIcon || '/images/unknown-thing.png';
  this.thingCssClass = opts.thingCssClass || '';
  this.thingDetailCssClass = opts.thingDetailCssClass || '';
  this.format = format;
  this.addIconToView =
    typeof opts.addIconToView === 'boolean' ? opts.addIconToView : true;

  if (format == 'svg') {
    this.container = document.getElementById('floorplan-things');
    this.x = description.floorplanX;
    this.y = description.floorplanY;
  } else {
    this.container = document.getElementById('things');
  }
  this.displayedProperties = this.displayedProperties || {};
  this.displayedActions = this.displayedActions || {};
  this.properties = {};

  this.uiHref = null;
  if (description.links) {
    for (const link of description.links) {
      if (link.rel === 'alternate' &&
          link.mediaType === 'text/html' &&
          link.href.startsWith('http')) {
        this.uiHref = link.href;
        break;
      }
    }
  }

  // Parse base URL of Thing
  if (description.href) {
    this.href = new URL(description.href, App.ORIGIN);
    this.eventsHref = `${this.href.pathname}/events?referrer=${
      encodeURIComponent(this.href.pathname)}`;
    this.id = this.href.pathname.split('/').pop();

    const wsHref = this.href.href.replace(/^http/, 'ws');
    this.ws = new WebSocket(`${wsHref}?jwt=${API.jwt}`);

    // After the websocket is open, add subscriptions for all events.
    this.ws.addEventListener('open', () => {
      if (description.hasOwnProperty('events')) {
        const msg = {
          messageType: 'addEventSubscription',
          data: {},
        };

        for (const name in description.events) {
          msg.data[name] = {};
        }

        this.ws.send(JSON.stringify(msg));
      }
    });

    this.ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.messageType === 'propertyStatus') {
        this.onPropertyStatus(message.data);
      } else if (message.messageType === 'event') {
        this.onEvent(message.data);
      }
    });
  }

  // Parse properties
  if (description.properties) {
    this.propertyDescriptions = {};
    for (const propertyName in description.properties) {
      const property = description.properties[propertyName];
      this.propertyDescriptions[propertyName] = property;
    }
  }

  // Parse events
  if (format === 'htmlDetail') {
    const menu = [];
    if (description.hasOwnProperty('events') &&
        Object.keys(description.events).length > 0) {
      this.displayEvents = true;
      menu.push({
        href: this.eventsHref,
        name: 'Event Log',
        icon: '/images/rules-icon.png',
      });
    } else {
      this.displayEvents = false;
    }

    menu.push({
      listener: this.handleEdit.bind(this),
      name: 'Edit',
      icon: '/images/edit-plain.svg',
    }, {
      listener: this.handleRemove.bind(this),
      name: 'Remove',
      icon: '/images/remove.svg',
    });

    App.buildOverflowMenu(menu);
    App.showOverflowButton();
  } else {
    App.hideOverflowButton();
  }

  this.element = this.render(format);

  return this;
};

/**
 * HTML view for Thing.
 */
Thing.prototype.attachHtmlDetail = function() {
  for (const prop of Object.values(this.displayedProperties)) {
    // only attach the first time.
    if ((!prop.hasOwnProperty('attached') || !prop.attached) &&
          prop.hasOwnProperty('detail')) {
      prop.detail.attach();
      prop.attached = true;
    }
  }

  for (const action of Object.values(this.displayedActions)) {
    // only attach the first time.
    if ((!action.hasOwnProperty('attached') || !action.attached) &&
          action.hasOwnProperty('detail')) {
      action.detail.attach();
      action.attached = true;
    }
  }

  this.layout = new ThingDetailLayout(
    this.element.querySelectorAll('.thing-detail-container'));
};

/**
 * HTML icon view for Thing.
 */
Thing.prototype.iconView = function() {
  let thingIcon = '<div class="thing-icon"></div>';
  if (this.addIconToView) {
    thingIcon =
      `<img class="thing-icon" src="${encodeURI(this.pngBaseIcon)}"/>`;
  }
  return thingIcon;
};

/**
 * HTML link for Thing Detail view
 */
Thing.prototype.detailLink = function() {
  return `<a href="${encodeURI(this.href)}" class="thing-details-link"></a>`;
};

/**
 * HTML link for custom UI.
 */
Thing.prototype.uiLink = function() {
  return `<a href="${this.uiHref}" class="thing-ui-link" target="_blank"
             rel="noopener"></a>`;
};

/**
 * HTML view for Thing.
 */
Thing.prototype.htmlView = function() {
  return `<div class="thing ${this.thingCssClass}">
    ${this.uiHref ? this.uiLink() : ''}
    ${this.detailLink()}
    ${this.iconView()}
    <span class="thing-name">${Utils.escapeHtml(this.name)}</span>
  </div>`;
};

/**
 * HTML detail view for Thing.
 */
Thing.prototype.htmlDetailView = function() {
  let detailsHTML = '';

  for (const prop of Object.values(this.displayedProperties)) {
    if (prop.hasOwnProperty('detail')) {
      detailsHTML += prop.detail.view();
    }
  }

  for (const action of Object.values(this.displayedActions)) {
    if (action.hasOwnProperty('detail')) {
      detailsHTML += action.detail.view();
    }
  }

  return `<div class="thing ${this.thingDetailCssClass}">
    ${this.iconView()}
    ${detailsHTML}
  </div>`;
};

/**
 * Update the status of Thing.
 */
Thing.prototype.updateStatus = function() {
  const urls = Object.values(this.displayedProperties).map((v) => v.href);
  const opts = {
    headers: {
      Authorization: `Bearer ${API.jwt}`,
      Accept: 'application/json',
    },
  };

  const requests = urls.map((u) => fetch(u, opts));
  Promise.all(requests).then((responses) => {
    return Promise.all(responses.map((response) => {
      return response.json();
    }));
  }).then((responses) => {
    responses.forEach((response) => {
      this.onPropertyStatus(response);
    });
  }).catch((error) => {
    console.error(`Error fetching ${this.name} status: ${error}`);
  });
};

/**
 * Generate a wrapped svg text element containing the provided text
 * @param {String} text
 * @return {Element}
 */
Thing.prototype.makeWrappedSVGText = function(text) {
  const lineHeight = 2.5;
  const lineWidth = 12;
  const x = 0;
  let y = 8;
  let row = '';
  const words = text.split(' ');

  const textElt =
    document.createElementNS('http://www.w3.org/2000/svg', 'text');
  textElt.setAttribute('x', x);
  textElt.setAttribute('y', y);
  textElt.setAttribute('text-anchor', 'middle');
  textElt.classList.add('svg-thing-text');

  function makeTSpan(textContent) {
    const tspan =
      document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
    tspan.setAttribute('x', x);
    tspan.setAttribute('y', y);
    tspan.textContent = textContent;
    return tspan;
  }

  while (words.length > 0) {
    const word = words.shift();
    if (row.length + word.length + 1 < lineWidth) {
      row += ` ${word}`;
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
 * SVG view for Thing.
 */
Thing.prototype.svgView = function() {
  return `<g transform="translate(${this.x},${this.y})"
            dragx="${this.x}" dragy="${this.y}"
            class="floorplan-thing">
            <a xlink:href="${encodeURI(this.href)}?referrer=%2Ffloorplan"
               class="svg-thing-link">
              <circle cx="0" cy="0" r="5" class="svg-thing-icon" />
              <image x="-2.5" y="-2.5" width="5" height="5"
                xlink:href="${encodeURI(this.svgBaseIcon)}" />
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
  let element;
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
 * Handle an edit click event.
 */
Thing.prototype.handleEdit = function() {
  const newEvent = new CustomEvent('_contextmenu', {
    detail: {
      thingUrl: this.href.href,
      thingName: this.name,
      thingIcon: this.pngBaseIcon,
      action: 'edit',
    },
  });
  window.dispatchEvent(newEvent);
};

/**
 * Handle a remove click event.
 */
Thing.prototype.handleRemove = function() {
  const newEvent = new CustomEvent('_contextmenu', {
    detail: {
      thingUrl: this.href.href,
      thingName: this.name,
      thingIcon: this.pngBaseIcon,
      action: 'remove',
    },
  });
  window.dispatchEvent(newEvent);
};

/**
 * Handle a 'propertyStatus' message.
 * @param {Object} data Property data
 */
Thing.prototype.onPropertyStatus = function(data) {
  for (const prop in data) {
    if (!this.displayedProperties.hasOwnProperty(prop)) {
      continue;
    }

    const value = data[prop];
    if (typeof value === 'undefined' || value === null) {
      continue;
    }

    this.properties[prop] = value;
    this.updateProperty(prop, value);
  }
};

/**
 * Handle an 'event' message.
 * @param {Object} data Event data
 */
Thing.prototype.onEvent = function(data) {
  if (!this.displayEvents) {
    return;
  }

  for (const name in data) {
    App.showMessage(
      `<a href="${this.eventsHref}">${Utils.escapeHtml(name)}</a>`,
      3000);
  }
};

module.exports = Thing;
