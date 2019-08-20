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
  constructor(description, ws) {
    super();
    this.title = description.title;
    this.type = description.type;
    this.descrId = description.id;
    this.properties = {};
    this.events = [];
    this.connected = false;

    // Parse base URL of Thing
    if (description.href) {
      this.href = new URL(description.href, App.ORIGIN);
      this.id = this.href.pathname.split('/').pop();
    }

    // Parse events URL
    for (const link of description.links) {
      switch (link.rel) {
        case 'events':
          this.eventsHref = new URL(link.href, App.ORIGIN);
          break;
        case 'properties':
          this.propertiesHref = new URL(link.href, App.ORIGIN);
          break;
        default:
          break;
      }
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

    this.initWebSocket(ws);

    this.updateEvents();
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
          this.handleEvent(Constants.DELETE_THING, this.id);
          this.cleanup();
          resolve();
        } else {
          reject(`Failed removing thing ${response.statusText}`);
        }
      }).catch((error) => {
        console.error(error);
        reject('Error occurred while removing thing');
      });
    });
  }

  /**
   * Update the thing.
   */
  updateThing(updates) {
    return new Promise((resolve, reject) => {
      fetch(this.href, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${API.jwt}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      }).then((response) => {
        if (response.ok) {
          console.log('Successfully updated Thing.');
          resolve();
        } else {
          reject(`Failed updating thing ${response.statusText}`);
        }
      }).catch((error) => {
        console.error(error);
        reject('Error occurred while updating thing');
      });
    });
  }

  /**
   * Initialize websocket.
   */
  initWebSocket(globalWs) {
    if (!this.hasOwnProperty('href')) {
      return;
    }

    this.ws = globalWs;

    // After the websocket is open, add subscriptions for all events.
    this.ws.addEventListener('open', () => {
      if (Object.keys(this.eventDescriptions).length == 0) {
        return;
      }
      const msg = {
        id: this.descrId,
        messageType: 'addEventSubscription',
        data: {},
      };
      for (const name in this.eventDescriptions) {
        msg.data[name] = {};
      }
      this.ws.send(JSON.stringify(msg));
    });

    const onEvent = (event) => {
      const message = JSON.parse(event.data);
      if (message.hasOwnProperty('id') && message.id !== this.descrId) {
        return;
      }
      switch (message.messageType) {
        case 'propertyStatus':
          this.onPropertyStatus(message.data);
          break;
        case 'event':
          this.onEvent(message.data);
          break;
        case 'connected':
          this.onConnected(message.data);
          break;
        case 'error':
          // status 404 means that the Thing already removed.
          if (message.data.status === '404 Not Found') {
            console.log('Successfully removed Thing.');
            this.handleEvent(Constants.DELETE_THING, this.id);
            this.cleanup();
          }
          break;
      }
    };

    this.ws.addEventListener('message', onEvent);
  }

  subscribe(event, handler) {
    super.subscribe(event, handler);
    switch (event) {
      case Constants.EVENT_OCCURRED:
        break;
      case Constants.PROPERTY_STATUS:
        handler(this.properties);
        break;
      case Constants.DELETE_THING:
        break;
      case Constants.CONNECTED:
        handler(this.connected);
        break;
      default:
        console.warn(`ThingModel does not support event:${event}`);
        break;
    }
  }

  /**
   * Set value of the property.
   *
   * @param {string} name - name of the property
   * @param {*} value - value of the property
   * @return {Promise} which resolves to the property set.
   */
  setProperty(name, value) {
    if (!this.propertyDescriptions.hasOwnProperty(name)) {
      return Promise.reject(`Unavailable property name ${name}`);
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

    let href;
    for (const link of property.links) {
      if (!link.rel || link.rel === 'property') {
        href = link.href;
        break;
      }
    }

    return fetch(href, opts).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(`Status ${response.status} trying to set ${name}`);
      }
    }).then((json) => {
      this.onPropertyStatus(json);
    }).catch((error) => {
      console.error(error);
      throw new Error(`Error trying to set ${name}`);
    });
  }

  /**
   * Update the Properties of Thing.
   */
  updateProperties() {
    const opts = {
      headers: {
        Authorization: `Bearer ${API.jwt}`,
        Accept: 'application/json',
      },
    };

    let getPropertiesPromise;
    if (typeof this.propertiesHref === 'undefined') {
      const urls = Object.values(this.propertyDescriptions).map((v) => {
        for (const link of v.links) {
          if (!link.rel || link.rel === 'property') {
            return link.href;
          }
        }
      });
      const requests = urls.map((u) => fetch(u, opts));
      getPropertiesPromise = Promise.all(requests).then((responses) => {
        return Promise.all(responses.map((response) => {
          return response.json();
        }));
      }).then((responses) => {
        let properties = {};
        responses.forEach((response) => {
          properties = Object.assign(properties, response);
        });
        return properties;
      });
    } else {
      getPropertiesPromise =
      fetch(this.propertiesHref, opts).then((response) => {
        return response.json();
      });
    }

    getPropertiesPromise.then((properties) => {
      this.onPropertyStatus(properties);
    }).catch((error) => {
      console.error(`Error fetching ${this.title} status: ${error}`);
    });
  }

  /**
   * Handle a 'propertyStatus' message.
   * @param {Object} data Property data
   */
  onPropertyStatus(data) {
    const updatedProperties = {};
    for (const prop in data) {
      if (!this.propertyDescriptions.hasOwnProperty(prop)) {
        continue;
      }

      const value = data[prop];
      if (typeof value === 'undefined' || value === null) {
        continue;
      }

      this.properties[prop] = value;
      updatedProperties[prop] = value;
    }
    return this.handleEvent(Constants.PROPERTY_STATUS, updatedProperties);
  }

  /**
   * Get the list of existing events.
   */
  updateEvents() {
    if (typeof this.eventsHref === 'undefined') {
      return;
    }

    const opts = {
      headers: {
        Authorization: `Bearer ${API.jwt}`,
        Accept: 'application/json',
      },
    };
    return fetch(this.eventsHref, opts).then((response) => {
      return response.json();
    }).then((events) => {
      this.events = events;
    }).catch((e) => {
      console.error(`Error fetching events: ${e}`);
    });
  }

  /**
   * Handle an 'event' message.
   * @param {Object} events Event data
   */
  onEvent(data) {
    const events = {};
    for (const event in data) {
      if (!this.eventDescriptions.hasOwnProperty(event)) {
        continue;
      }
      events[event] = data[event];
      this.events.push({[event]: data[event]});
    }
    return this.handleEvent(Constants.EVENT_OCCURRED, events);
  }

  /**
   * Handle a 'connected' message.
   *
   * @param {boolean} connected - Connected state
   */
  onConnected(connected) {
    this.connected = connected;
    return this.handleEvent(Constants.CONNECTED, connected);
  }
}

module.exports = ThingModel;
