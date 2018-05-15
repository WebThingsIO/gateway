/**
 * EventList.
 *
 * Represents a list of events for a thing.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const API = require('./api');
const App = require('./app');
const Utils = require('./utils');

const EventList = function(description) {
  this.limit = 100;
  this.href = new URL(description.href, App.ORIGIN);
  this.wsHref = this.href.href.replace(/^http/, 'ws');

  // Build up the event schema now. This is used later when building list items.
  this.schema = {};
  for (const eventName in description.events) {
    this.schema[eventName] = {};

    const schema = description.events[eventName];

    if (schema.type === 'object') {
      const keys = Array.from(Object.keys(schema.properties));
      for (const name of keys) {
        this.schema[eventName][name] = schema.properties[name];
      }
    } else {
      // If there is a single, non-object data item, use the generic name
      // 'data'.
      this.schema[eventName].data = schema;
    }
  }

  for (const link of description.links) {
    if (link.rel === 'events') {
      this.eventsHref = new URL(link.href, App.ORIGIN);
      break;
    }
  }

  this.container = document.getElementById('things');

  this.element = this.render();

  const opts = {
    headers: {
      Authorization: `Bearer ${API.jwt}`,
      Accept: 'application/json',
    },
  };

  // Get the list of existing events.
  fetch(this.eventsHref, opts).then((response) => {
    return response.json();
  }).then((events) => {
    // Get the list in a more friendly format.
    events = events.map((e) => {
      const name = Object.keys(e)[0];
      const timestamp = new Date(e[name].timestamp);
      return Object.assign(e[name], {name, timestamp});
    }).sort((a, b) => b.timestamp - a.timestamp).slice(0, this.limit).reverse();

    // Build the list in descending order by date.
    for (const event of events) {
      this.prependEvent(event);
    }

    // Now, set up a websocket to listen for new events.
    this.ws = new WebSocket(`${this.wsHref}?jwt=${API.jwt}`);
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

    // When a new event comes in, prepend it to the list.
    this.ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.messageType === 'event') {
        const events = Object.keys(message.data).map((name) => {
          const timestamp = new Date(message.data[name].timestamp);
          return Object.assign(message.data[name], {name, timestamp});
        }).sort((a, b) => a.timestamp - b.timestamp);

        for (const event of events) {
          this.prependEvent(event);
        }
      }
    });
  }).catch((e) => {
    console.error(`Error fetching events: ${e}`);
  });

  // Update event timestamps every 10 seconds.
  setInterval(() => this.updateTimestamps(), 10000);
};

EventList.prototype.render = function() {
  const element = document.createElement('div');
  const list = '<ul class="event-list"></ul>';
  element.innerHTML = list;
  return this.container.appendChild(element.firstChild);
};

EventList.prototype.prependEvent = function(event) {
  if (!this.schema.hasOwnProperty(event.name)) {
    return;
  }

  const schema = this.schema[event.name];

  let data = event.data;
  if (typeof data !== 'object' || Array.isArray(data)) {
    data = {data};
  }

  let body = '';
  for (const name of Array.from(Object.keys(data)).sort()) {
    if (!schema.hasOwnProperty(name)) {
      continue;
    }

    let value = data[name];

    switch (schema[name].type) {
      case 'number':
      case 'integer':
        body += `${Utils.escapeHtml(name)}: ${Utils.escapeHtml(value)}`;
        if (schema[name].hasOwnProperty('unit')) {
          body += ` ${schema[name].unit}`;
        }
        break;
      case 'object':
      case 'array':
        value = JSON.stringify(value);
        // eslint-ignore-next-line no-fallthrough
      case 'boolean':
      case 'string':
      default:
        body += `${Utils.escapeHtml(name)}: ${Utils.escapeHtml(value)}`;
        break;
    }

    body += '<br>';
  }

  // Trim off the final '<br>'
  body = body.substring(0, body.length - 4);

  const el = document.createElement('div');

  const item = `<li class="event-item">
    <div class="event-header">
      <span class="event-name">${Utils.escapeHtml(event.name)}</span>
      <span class="event-time" data-original="${event.timestamp.toISOString()}"
            title="${event.timestamp.toLocaleString()}">
        ${Utils.fuzzyTime(event.timestamp)}
      </span>
    </div>
    <div class="event-body">${body}</div>
  </li>`;
  el.innerHTML = item;

  while (this.element.childNodes.length >= this.limit) {
    this.element.removeChild(this.element.lastChild);
  }

  this.element.insertBefore(el.firstChild, this.element.firstChild);
};

EventList.prototype.updateTimestamps = function() {
  for (const el of this.element.querySelectorAll('.event-time')) {
    el.innerText = Utils.fuzzyTime(new Date(el.dataset.original));
  }
};

module.exports = EventList;
