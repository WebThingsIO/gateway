/**
 * Thing Model.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const API = require('../api');
const App = require('../app');
const Model = require('./model');
const Constants = require('../constants');

class ThingModel extends Model {
  constructor(description) {
    super();
    this.name = description.name;
    this.type = description.type;
    this.properties = {};

    // Parse base URL of Thing
    if (description.href) {
      this.href = new URL(description.href, App.ORIGIN);
      this.eventsHref = `${this.href.pathname}/events`;
      this.id = this.href.pathname.split('/').pop();
    }

    // Parse properties
    this.propertyDescriptions = {};
    if (description.hasOwnProperty('properties')) {
      for (const propertyName in description.properties) {
        const property = description.properties[propertyName];
        this.propertyDescriptions[propertyName] = property;
      }
    }

    // Parse events
    this.eventDescriptions = {};
    if (description.hasOwnProperty('events')) {
      for (const eventName in description.events) {
        const event = description.events[eventName];
        this.eventDescriptions[eventName] = event;
      }
    }

    this.initWebsocket();

    this.updateProperties();

    return this;
  }

  /**
   * Remove the thing.
   */
  removeThing() {
    return new Promise((resolve, reject) => {
      fetch(this.href, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${API.jwt}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        if (response.ok) {
          console.log('Successfully removed Thing.');
          this.cleanup();
          resolve();
        } else {
          console.error(`Error removing thing ${response.statusText}`);
          reject();
        }
      }).catch((error) => {
        console.error(`Error removing thing ${error}`);
        reject();
      });
    });
  }

  /**
   * Initialize websocket.
   */
  initWebsocket() {
    if (!this.hasOwnProperty('href')) {
      return;
    }
    const wsHref = this.href.href.replace(/^http/, 'ws');
    this.ws = new WebSocket(`${wsHref}?jwt=${API.jwt}`);

    // After the websocket is open, add subscriptions for all events.
    this.ws.addEventListener('open', () => {
      if (Object.keys(this.eventDescriptions).length == 0) {
        return;
      }
      const msg = {
        messageType: 'addEventSubscription',
        data: {},
      };
      for (const name in this.eventDescriptions) {
        msg.data[name] = {};
      }
      this.ws.send(JSON.stringify(msg));
    }, {once: true});


    const onEvent = (event) => {
      const message = JSON.parse(event.data);
      if (message.messageType === 'propertyStatus') {
        this.onPropertyStatus(message.data);
      } else if (message.messageType === 'event') {
        this.onEvent(message.data);
      }
    };

    const cleanup = () => {
      this.ws.removeEventListener('message', onEvent);
      this.ws.removeEventListener('close', cleanup);
      this.ws.removeEventListener('error', cleanup);
    };

    this.ws.addEventListener('message', onEvent);
    this.ws.addEventListener('close', cleanup);
    this.ws.addEventListener('error', cleanup);
  }

  /**
   * Cleanup objects.
   */
  cleanup() {
    this.ws.close();
    super.cleanup();
  }

  subscribe(event, handler) {
    super.subscribe(event, handler);
    switch (event) {
      case Constants.OCCUR_EVENT:
        break;
      case Constants.STATE_PROPERTIES:
        handler(this.properties);
        break;
      default:
        console.warn(`ThingModel does not support event:${event}`);
        break;
    }
  }

  /**
   * Handle an 'event' message.
   * @param {Object} events Event data
   */
  onEvent(events) {
    this.handleEvent(Constants.OCCUR_EVENT, events);
  }

  /**
   * Set value to the property.
   *
   * @param {string} name - name of the property
   * @param {*} value - value of the property
   * @return {Promise} which resolves to the property set.
   */
  setProperty(name, value) {
    if (!this.propertyDescriptions.hasOwnProperty(name)) {
      return Promise.reject();
    }

    switch (this.propertyDescriptions[name].type) {
      case 'number':
        value = parseFloat(value);
        break;
      case 'integer':
        value = parseInt(value);
        break;
      case 'boolean':
        value = Boolean(value);
        break;
    }

    const property = this.propertyDescriptions[name];
    const payload = {
      [name]: value,
    };
    const opts = {
      method: 'PUT',
      body: JSON.stringify(payload),
      headers: Object.assign(API.headers(), {
        'Content-Type': 'application/json',
      }),
    };

    return fetch(property.href, opts).then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error(`Status ${response.status} trying to set ${name}`);
      }
    }).then((json) => {
      this.onPropertyStatus(json);
    }).catch(function(error) {
      console.error(`Error trying to set ${name}: ${error}`);
      throw new Error();
    });
  }

  /**
   * Update the Properties of Thing.
   */
  updateProperties() {
    const urls = Object.values(this.propertyDescriptions).map((v) => v.href);
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
      let properties = {};
      responses.forEach((response) => {
        properties = Object.assign(properties, response);
      });
      this.onPropertyStatus(properties);
    }).catch((error) => {
      console.error(`Error fetching ${this.name} status: ${error}`);
    });
  }

  /**
   * Handle a 'propertyStatus' message.
   * @param {Object} data Property data
   */
  onPropertyStatus(data) {
    for (const prop in data) {
      if (!this.propertyDescriptions.hasOwnProperty(prop)) {
        continue;
      }

      const value = data[prop];
      if (typeof value === 'undefined' || value === null) {
        continue;
      }

      this.properties[prop] = value;
    }
    this.handleEvent(Constants.STATE_PROPERTIES, this.properties);
  }
}

module.exports = ThingModel;
