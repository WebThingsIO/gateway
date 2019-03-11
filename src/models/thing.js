/**
 * Thing Model.
 *
 * Represents a Web Thing.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const Constants = require('../constants');
const Database = require('../db.js');
const EventEmitter = require('events');
const Router = require('../router');
const UserProfile = require('../user-profile');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const tmp = require('tmp');

class Thing {
  /**
   * Thing constructor.
   *
   * Create a Thing object from an id and a valid Thing description.
   *
   * @param {String} id Unique ID.
   * @param {Object} description Thing description.
   */
  constructor(id, description) {
    if (!id || !description) {
      console.error('id and description needed to create new Thing');
      return;
    }
    // Parse the Thing Description
    this.id = id;
    this.name = description.name || '';
    this.type = description.type || '';
    this['@context'] =
      description['@context'] || 'https://iot.mozilla.org/schemas';
    this['@type'] = description['@type'] || [];
    this.description = description.description || '';
    this.href = `${Constants.THINGS_PATH}/${this.id}`;
    this.properties = {};
    this.actions = description.actions || {};
    this.events = description.events || {};
    this.connected = false;
    this.eventsDispatched = [];
    this.emitter = new EventEmitter();
    if (description.properties) {
      for (const propertyName in description.properties) {
        const property = description.properties[propertyName];

        if (property.hasOwnProperty('href')) {
          delete property.href;
        }

        if (property.hasOwnProperty('links')) {
          property.links = property.links.filter((link) => {
            return link.rel && link.rel !== 'property';
          }).map((link) => {
            if (link.proxy) {
              delete link.proxy;
              link.href = `${Constants.PROXY_PATH}/${this.id}${link.href}`;
            }

            return link;
          });
        } else {
          property.links = [];
        }

        // Give the property a URL
        property.links.push({
          rel: 'property',
          href: `${this.href}${Constants.PROPERTIES_PATH}/${propertyName}`,
        });

        this.properties[propertyName] = property;
      }
    }
    this.floorplanX = description.floorplanX;
    this.floorplanY = description.floorplanY;
    this.layoutIndex = description.layoutIndex;
    this.selectedCapability = description.selectedCapability;
    this.websockets = [];
    this.links = [
      {
        rel: 'properties',
        href: `${this.href}/properties`,
      },
      {
        rel: 'actions',
        href: `${this.href}/actions`,
      },
      {
        rel: 'events',
        href: `${this.href}/events`,
      },
    ];

    const uiLink = {
      rel: 'alternate',
      mediaType: 'text/html',
      href: this.href,
    };

    if (description.hasOwnProperty('baseHref') && description.baseHref) {
      Router.addProxyServer(this.id, description.baseHref);
    }

    if (description.hasOwnProperty('links')) {
      for (const link of description.links) {
        if (['properties', 'actions', 'events'].includes(link.rel)) {
          continue;
        }

        if (link.rel === 'alternate' && link.mediaType === 'text/html') {
          if (link.proxy) {
            delete link.proxy;
            uiLink.href = `${Constants.PROXY_PATH}/${this.id}${link.href}`;
          } else {
            uiLink.href = link.href;
          }
        } else {
          if (link.proxy) {
            delete link.proxy;
            link.href = `${Constants.PROXY_PATH}/${this.id}${link.href}`;
          }

          this.links.push(link);
        }
      }
    }

    this.links.push(uiLink);

    for (const actionName in this.actions) {
      const action = this.actions[actionName];

      if (action.hasOwnProperty('href')) {
        delete action.href;
      }

      if (action.hasOwnProperty('links')) {
        action.links = action.links.filter((link) => {
          return link.rel && link.rel !== 'action';
        }).map((link) => {
          if (link.proxy) {
            delete link.proxy;
            link.href = `${Constants.PROXY_PATH}/${this.id}${link.href}`;
          }

          return link;
        });
      } else {
        action.links = [];
      }

      // Give the action a URL
      action.links.push({
        rel: 'action',
        href: `${this.href}${Constants.ACTIONS_PATH}/${actionName}`,
      });
    }

    for (const eventName in this.events) {
      const event = this.events[eventName];

      if (event.hasOwnProperty('href')) {
        delete event.href;
      }

      if (event.hasOwnProperty('links')) {
        event.links = event.links.filter((link) => {
          return link.rel && link.rel !== 'event';
        }).map((link) => {
          if (link.proxy) {
            delete link.proxy;
            link.href = `${Constants.PROXY_PATH}/${this.id}${link.href}`;
          }

          return link;
        });
      } else {
        event.links = [];
      }

      // Give the event a URL
      event.links.push({
        rel: 'event',
        href: `${this.href}${Constants.EVENTS_PATH}/${eventName}`,
      });
    }

    this.iconHref = null;
    if (description.iconHref) {
      this.iconHref = description.iconHref;
    } else if (description.iconData) {
      this.setIcon(description.iconData, false);
    }
  }

  /**
   * Set the x and y co-ordinates for a Thing on the floorplan.
   *
   * @param {number} x The x co-ordinate on floorplan (0-100).
   * @param {number} y The y co-ordinate on floorplan (0-100).
   * @return {Promise} A promise which resolves with the description set.
   */
  setCoordinates(x, y) {
    this.floorplanX = x;
    this.floorplanY = y;
    return Database.updateThing(this.id, this.getDescription());
  }

  /**
   * Set the layout index for a Thing.
   *
   * @param {number} index The new layout index.
   * @return {Promise} A promise which resolves with the description set.
   */
  setLayoutIndex(index) {
    this.layoutIndex = index;
    return Database.updateThing(this.id, this.getDescription());
  }

  /**
   * Set the name of this Thing.
   *
   * @param {String} name The new name
   * @return {Promise} A promise which resolves with the description set.
   */
  setName(name) {
    this.name = name;
    return Database.updateThing(this.id, this.getDescription());
  }

  /**
   * Set the custom icon for this Thing.
   *
   * @param {Object} iconData Base64-encoded icon and its mime-type.
   * @param {Boolean} updateDatabase Whether or not to update the database after
   *                                 setting.
   */
  setIcon(iconData, updateDatabase) {
    if (!iconData.data ||
        !['image/jpeg', 'image/png', 'image/svg+xml'].includes(iconData.mime)) {
      console.error('Invalid icon data:', iconData);
      return;
    }

    if (this.iconHref) {
      try {
        fs.unlinkSync(path.join(UserProfile.baseDir, this.iconHref));
      } catch (e) {
        console.error('Failed to remove old icon:', e);
        // continue
      }

      this.iconHref = null;
    }

    let extension;
    switch (iconData.mime) {
      case 'image/jpeg':
        extension = '.jpg';
        break;
      case 'image/png':
        extension = '.png';
        break;
      case 'image/svg+xml':
        extension = '.svg';
        break;
    }

    let tempfile;
    try {
      tempfile = tmp.fileSync({
        mode: parseInt('0644', 8),
        template: path.join(UserProfile.uploadsDir, `XXXXXX${extension}`),
        detachDescriptor: true,
        keep: true,
      });

      const data = Buffer.from(iconData.data, 'base64');
      fs.writeFileSync(tempfile.fd, data);
    } catch (e) {
      console.error('Failed to write icon:', e);
      if (tempfile) {
        try {
          fs.unlinkSync(tempfile.fd);
        } catch (e) {
          // pass
        }
      }

      return;
    }

    this.iconHref = path.join('/uploads', path.basename(tempfile.name));

    if (updateDatabase) {
      return Database.updateThing(this.id, this.getDescription());
    }
  }

  /**
   * Set the selected capability of this Thing.
   *
   * @param {String} capability The selected capability
   * @return {Promise} A promise which resolves with the description set.
   */
  setSelectedCapability(capability) {
    this.selectedCapability = capability;
    return Database.updateThing(this.id, this.getDescription());
  }

  /**
   * Dispatch an event to all listeners subscribed to the Thing
   * @param {Event} event
   */
  dispatchEvent(event) {
    if (!event.thingId) {
      event.thingId = this.id;
    }
    this.eventsDispatched.push(event);
    this.emitter.emit(Constants.EVENT, event);
  }

  /**
   * Add a subscription to the Thing's events
   * @param {Function} callback
   */
  addEventSubscription(callback) {
    this.emitter.on(Constants.EVENT, callback);
  }

  /**
   * Remove a subscription to the Thing's events
   * @param {Function} callback
   */
  removeEventSubscription(callback) {
    this.emitter.removeListener(Constants.EVENT, callback);
  }

  /**
   * Add a subscription to the Thing's connected state
   * @param {Function} callback
   */
  addConnectedSubscription(callback) {
    this.emitter.on(Constants.CONNECTED, callback);
    callback(this.connected);
  }

  /**
   * Remove a subscription to the Thing's connected state
   * @param {Function} callback
   */
  removeConnectedSubscription(callback) {
    this.emitter.removeListener(Constants.CONNECTED, callback);
  }

  /**
   * Get a JSON Thing Description for this Thing.
   *
   * @param {String} reqHost request host, if coming via HTTP
   * @param {Boolean} reqSecure whether or not the request is secure, i.e. TLS
   */
  getDescription(reqHost, reqSecure) {
    const links = JSON.parse(JSON.stringify(this.links));

    if (typeof reqHost !== 'undefined') {
      const wsLink = {
        rel: 'alternate',
        href: `${reqSecure ? 'wss' : 'ws'}://${reqHost}${this.href}`,
      };

      links.push(wsLink);
    }

    return {
      name: this.name,
      type: this.type,
      '@context': this['@context'],
      '@type': this['@type'],
      description: this.description,
      href: this.href,
      properties: this.properties,
      actions: this.actions,
      events: this.events,
      links,
      floorplanX: this.floorplanX,
      floorplanY: this.floorplanY,
      layoutIndex: this.layoutIndex,
      selectedCapability: this.selectedCapability,
      iconHref: this.iconHref,
    };
  }

  registerWebsocket(ws) {
    this.websockets.push(ws);
  }

  /**
   * Remove and clean up the Thing
   */
  remove() {
    if (this.iconHref) {
      try {
        fs.unlinkSync(path.join(UserProfile.baseDir, this.iconHref));
      } catch (e) {
        console.error('Failed to remove old icon:', e);
        // continue
      }

      this.iconHref = null;
    }

    this.websockets.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN ||
          ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    });
  }

  /**
   * Add an action
   * @param {Action} action
   * @return {boolean} Whether a known action
   */
  addAction(action) {
    return this.actions.hasOwnProperty(action.name);
  }

  /**
   * Remove an action
   * @param {Action} action
   * @return {boolean} Whether a known action
   */
  removeAction(action) {
    return this.actions.hasOwnProperty(action.name);
  }

  /**
   * Update a thing from a description.
   *
   * Thing descriptions can change as new capabilities are developed, so this
   * method allows us to update the stored thing description.
   *
   * @param {Object} description Thing description.
   * @return {Promise} A promise which resolves with the description set.
   */
  updateFromDescription(description) {
    // Update type
    this.type = description.type || '';

    // Update @context
    this['@context'] =
      description['@context'] || 'https://iot.mozilla.org/schemas';

    // Update @type
    this['@type'] = description['@type'] || [];

    // Update description
    this.description = description.description || '';

    // Update properties
    this.properties = {};
    if (description.properties) {
      for (const propertyName in description.properties) {
        const property = description.properties[propertyName];

        if (property.hasOwnProperty('href')) {
          delete property.href;
        }

        if (property.hasOwnProperty('links')) {
          property.links = property.links.filter((link) => {
            return link.rel && link.rel !== 'property';
          }).map((link) => {
            if (link.proxy) {
              delete link.proxy;
              link.href = `${Constants.PROXY_PATH}/${this.id}${link.href}`;
            }

            return link;
          });
        } else {
          property.links = [];
        }

        // Give the property a URL
        property.links.push({
          rel: 'property',
          href: `${this.href}${Constants.PROPERTIES_PATH}/${propertyName}`,
        });
        this.properties[propertyName] = property;
      }
    }

    // Update actions
    this.actions = description.actions || {};
    for (const actionName in this.actions) {
      const action = this.actions[actionName];

      if (action.hasOwnProperty('href')) {
        delete action.href;
      }

      if (action.hasOwnProperty('links')) {
        action.links = action.links.filter((link) => {
          return link.rel && link.rel !== 'action';
        }).map((link) => {
          if (link.proxy) {
            delete link.proxy;
            link.href = `${Constants.PROXY_PATH}/${this.id}${link.href}`;
          }

          return link;
        });
      } else {
        action.links = [];
      }

      // Give the action a URL
      action.links.push({
        rel: 'action',
        href: `${this.href}${Constants.ACTIONS_PATH}/${actionName}`,
      });
    }

    // Update events
    this.events = description.events || {};
    for (const eventName in this.events) {
      const event = this.events[eventName];

      if (event.hasOwnProperty('href')) {
        delete event.href;
      }

      if (event.hasOwnProperty('links')) {
        event.links = event.links.filter((link) => {
          return link.rel && link.rel !== 'event';
        }).map((link) => {
          if (link.proxy) {
            delete link.proxy;
            link.href = `${Constants.PROXY_PATH}/${this.id}${link.href}`;
          }

          return link;
        });
      } else {
        event.links = [];
      }

      // Give the event a URL
      event.links.push({
        rel: 'event',
        href: `${this.href}${Constants.EVENTS_PATH}/${eventName}`,
      });
    }

    let uiLink = {
      rel: 'alternate',
      mediaType: 'text/html',
      href: this.href,
    };
    for (const link of this.links) {
      if (link.rel === 'alternate' && link.mediaType === 'text/html') {
        uiLink = link;
        break;
      }
    }

    if (description.hasOwnProperty('baseHref') && description.baseHref) {
      Router.addProxyServer(this.id, description.baseHref);
    }

    // Update the UI href
    if (description.hasOwnProperty('links')) {
      for (const link of description.links) {
        if (['properties', 'actions', 'events'].includes(link.rel)) {
          continue;
        }

        if (link.rel === 'alternate' && link.mediaType === 'text/html') {
          if (link.proxy) {
            delete link.proxy;
            uiLink.href = `${Constants.PROXY_PATH}/${this.id}${link.href}`;
          } else {
            uiLink.href = link.href;
          }
        } else {
          if (link.proxy) {
            delete link.proxy;
            link.href = `${Constants.PROXY_PATH}/${this.id}${link.href}`;
          }

          this.links.push(link);
        }
      }
    }

    // If the previously selected capability is no longer present, reset it.
    if (this.selectedCapability &&
        !this['@type'].includes(this.selectedCapability)) {
      this.selectedCapability = '';
    }

    return Database.updateThing(this.id, this.getDescription());
  }

  /**
   * Set the connected state of this thing.
   *
   * @param {boolean} connected - Whether or not the thing is connected
   */
  setConnected(connected) {
    this.connected = connected;
    this.emitter.emit(Constants.CONNECTED, connected);
  }
}

module.exports = Thing;
