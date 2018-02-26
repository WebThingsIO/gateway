/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

const assert = require('assert');
const fetch = require('node-fetch');
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
    assert(desc.href);

    this.type = desc.type;
    this.href = desc.href;
    if (desc.unit) {
      this.unit = desc.unit;
    }
    if (desc.description) {
      this.description = desc.description;
    }
    const parts = this.href.split('/');
    this.name = parts[parts.length - 1];

    this.onMessage = this.onMessage.bind(this);
    let thingHref = this.href.split('/properties')[0];
    this.thingConn = new ThingConnection(thingHref, this.onMessage);
    this.id = Math.floor(Math.random() * 100000);
  }

  /**
   * @return {PropertyDescription}
   */
  toDescription() {
    let desc = {
      type: this.type,
      href: this.href,
      name: this.name
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
    let href = await Settings.get('RulesEngine.gateway') + this.href;
    return href;
  }

  /**
   * @return {Promise<Object>} headers for JWT bearer auth
   */
  async headerAuth() {
    const jwt = await Settings.get('RulesEngine.jwt');
    if (jwt) {
      return {
        Authorization: 'Bearer ' + jwt
      };
    } else {
      return {};
    }
  }

  /**
   * @return {Promise} resolves to property's value
   */
  async get() {
    console.info('property get', this.name);
    const res = await fetch(await this.getHref(), {
      headers: Object.assign({
        'Accept': 'application/json'
      }, await this.headerAuth()),
    });
    const data = await res.json();

    console.info('property got', data);
    return data[this.name]
  }

  /**
   * @param {any} value
   * @return {Promise} resolves if property is set to value
   */
  async set(value) {
    let data = {};
    data[this.name] = value;
    console.info('property set', data);
    return fetch(await this.getHref(), {
      method: 'PUT',
      headers: Object.assign({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }, await this.headerAuth()),
      body: JSON.stringify(data),
      cors: true
    });
  }

  async start() {
    await this.thingConn.start();
  }

  onMessage(msg) {
    if (msg.messageType === 'propertyStatus') {
      if (msg.data.hasOwnProperty(this.name)) {
        console.info('emit', {
          event: Events.VALUE_CHANGED,
          data: msg.data[this.name]
        });
        this.emit(Events.VALUE_CHANGED, msg.data[this.name]);
      }
    }
  }

  stop() {
    this.thingConn.stop();
  }
}

module.exports = Property;
