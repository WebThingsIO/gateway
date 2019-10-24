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

const App = require('../app');
const Constants = require('../constants');
const Units = require('../units');
const Utils = require('../utils');

class EventList {
  constructor(model, description) {
    this.limit = 100;
    this.href = new URL(description.href, App.ORIGIN);
    this.model = model;

    // Build up the event schema now. This is used later when building list
    // items.
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

    this.container = document.getElementById('things');

    this.element = this.render();

    let events = model.events;

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

    this.onEvent = this.onEvent.bind(this);
    this.model.subscribe(Constants.EVENT_OCCURRED, this.onEvent);

    // Update event timestamps every 10 seconds.
    setInterval(() => this.updateTimestamps(), 10000);
  }

  onEvent(data) {
    const events = Object.keys(data).map((name) => {
      const timestamp = new Date(data[name].timestamp);
      return Object.assign(data[name], {name, timestamp});
    }).sort((a, b) => a.timestamp - b.timestamp);

    for (const event of events) {
      this.prependEvent(event);
    }
  }

  cleanup() {
    this.model.unsubscribe(Constants.EVENT_OCCURRED, this.onEvent);
  }

  render() {
    const element = document.createElement('div');
    const list = '<ul class="event-list"></ul>';
    element.innerHTML = list;
    return this.container.appendChild(element.firstChild);
  }

  prependEvent(event) {
    if (!this.schema.hasOwnProperty(event.name)) {
      return;
    }

    const schema = this.schema[event.name];

    let body = '';
    let data = event.data;
    if (data !== null) {
      if (typeof data !== 'object' || Array.isArray(data)) {
        data = {data};
      }

      for (const name of Array.from(Object.keys(data)).sort()) {
        if (!schema.hasOwnProperty(name)) {
          continue;
        }

        // eslint-disable-next-line prefer-const
        let {value, unit} = Units.convert(data[name], schema[name].unit);

        switch (schema[name].type) {
          case 'number':
          case 'integer':
            body += `${Utils.escapeHtml(name)}: ${Utils.escapeHtml(value)}`;
            if (unit) {
              body += ` ${Units.nameToAbbreviation(unit)}`;
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
    }

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
  }

  updateTimestamps() {
    for (const el of this.element.querySelectorAll('.event-time')) {
      el.innerText = Utils.fuzzyTime(new Date(el.dataset.original));
    }
  }
}

module.exports = EventList;
