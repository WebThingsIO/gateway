/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

const assert = require('assert');
const fetch = require('node-fetch');
const https = require('https');
const Settings = require('../models/settings');
const EventEmitter = require('events').EventEmitter;
const Events = require('./Events');
const ThingConnection = require('./ThingConnection');

/**
 * Utility to support operations on Thing's properties
 */
class Property extends EventEmitter {
  /**
   * Create a Property from a descriptor returned by the WoT API
   * @param {PropertyDescription} desc
   */
  constructor(desc) {
    super();

    this.originator = new Error().stack;

    assert(desc.type);
    assert(desc.href || (desc.links && desc.links.length > 0));

    this.type = desc.type;

    if (desc.href) {
      this.href = desc.href;
    } else {
      for (const link of desc.links) {
        if (!link.rel || link.rel === 'property') {
          this.href = link.href;
          break;
        }
      }
    }

    if (desc.unit) {
      this.unit = desc.unit;
    }
    if (desc.description) {
      this.description = desc.description;
    }
    const parts = this.href.split('/');
    this.name = parts[parts.length - 1];

    this.onMessage = this.onMessage.bind(this);
    const thingHref = this.href.split('/properties')[0];
    this.thingConn = new ThingConnection(thingHref, this.onMessage);
  }

  /**
   * @return {PropertyDescription}
   */
  toDescription() {
    const desc = {
      type: this.type,
      href: this.href,
      name: this.name,
    };
    if (this.unit) {
      desc.unit = this.unit;
    }
    if (this.description) {
      desc.description = this.description;
    }
    return desc;
  }

  /**
   * @return {String} full property href
   */
  async getHref() {
    const href = await Settings.get('RulesEngine.gateway') + this.href;
    return href;
  }

  /**
   * @return {Promise<Object>} headers for JWT bearer auth
   */
  async headerAuth() {
    const jwt = await Settings.get('RulesEngine.jwt');
    if (jwt) {
      return {
        Authorization: `Bearer ${jwt}`,
      };
    } else {
      return {};
    }
  }

  /**
   * @return {Promise} resolves to property's value
   */
  async get() {
    const href = await this.getHref();
    let agent = null;
    if (href.startsWith('https')) {
      agent = new https.Agent({rejectUnauthorized: false});
    }

    const res = await fetch(href, {
      headers: Object.assign({
        Accept: 'application/json',
      }, await this.headerAuth()),
      agent,
    });
    const data = await res.json();

    return data[this.name];
  }

  /**
   * @param {any} value
   * @return {Promise} resolves if property is set to value
   */
  async set(value) {
    const href = await this.getHref();
    let agent = null;
    if (href.startsWith('https')) {
      agent = new https.Agent({rejectUnauthorized: false});
    }

    const data = {};
    data[this.name] = value;
    return fetch(href, {
      method: 'PUT',
      headers: Object.assign({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }, await this.headerAuth()),
      body: JSON.stringify(data),
      cors: true,
      agent,
    });
  }

  async start() {
    await this.thingConn.start();
  }

  onMessage(msg) {
    if (msg.messageType === 'propertyStatus') {
      if (msg.data.hasOwnProperty(this.name)) {
        this.emit(Events.VALUE_CHANGED, msg.data[this.name]);
      }
    }
  }

  stop() {
    this.thingConn.stop();
  }
}

module.exports = Property;
