/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

const assert = require('assert');
const fetch = require('node-fetch');
const storage = require('node-persist');
const winston = require('winston');
const EventEmitter = require('events').EventEmitter;
const WebSocket = require('ws');
const Events = require('./Events');

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
    this.ws = null;
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
    let href = await storage.getItem('RulesEngine.gateway') + this.href;
    winston.log('getHref', href);
    return href;
  }

  /**
   * @return {Promise<Object>} headers for JWT bearer auth
   */
  async headerAuth() {
    const jwt = await storage.getItem('RulesEngine.jwt');
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
    winston.info('property get', {name: this.name});
    const res = await fetch(await this.getHref(), {
      headers: Object.assign({
        'Accept': 'application/json'
      }, await this.headerAuth()),
    });
    const data = await res.json();

    winston.info('property got', {data: data});
    return data[this.name]
  }

  /**
   * @param {any} value
   * @return {Promise} resolves if property is set to value
   */
  async set(value) {
    let data = {};
    data[this.name] = value;
    winston.info('property set', {data: data});
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
    const thingHref = this.href.split('/properties')[0];
    const jwt = await storage.getItem('RulesEngine.jwt');
    const gateway = await storage.getItem('RulesEngine.gateway') ;
    const wsHref = gateway.replace(/^http/, 'ws') + thingHref +
      '?jwt=' + jwt;

    this.ws = new WebSocket(wsHref);
    this.ws.on('message', this.onMessage);
  }

  onMessage(text) {
    let msg = JSON.parse(text);
    if (msg.messageType === 'propertyStatus') {
      if (msg.data.hasOwnProperty(this.name)) {
        winston.info('emit', {
          event: Events.VALUE_CHANGED,
          data: msg.data[this.name]
        });
        this.emit(Events.VALUE_CHANGED, msg.data[this.name]);
      }
    }
  }

  stop() {
    if (this.ws) {
      this.ws.removeListener('message', this.onMessage);
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.close();
      }
    } else {
      winston.warn(this.constructor.name + '.stop was not started');
    }
  }
}

module.exports = Property;
