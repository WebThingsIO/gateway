/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

const e2p = require('event-to-promise');
const Settings = require('../models/settings');
const WebSocket = require('ws');

class ThingConnection {
  constructor(href, messageHandler) {
    this.href = href;
    this.messageHandler = messageHandler;
    this.onMessage = this.onMessage.bind(this);
    this.ws = null;
  }

  async start() {
    const jwt = await Settings.get('RulesEngine.jwt');
    const gateway = await Settings.get('RulesEngine.gateway');
    const wsHref = gateway.replace(/^http/, 'ws') + this.href + '?jwt=' + jwt;

    this.ws = new WebSocket(wsHref);
    this.ws.on('message', this.onMessage);
    await e2p(this.ws, 'open');
  }

  async send(msg) {
    await new Promise((resolve) => {
      this.ws.send(msg, function() {
        resolve();
      });
    });
  }

  stop() {
    if (this.ws) {
      this.ws.removeListener('message', this.onMessage);
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.close();
      }
    } else {
      console.warn(this.constructor.name + '.stop was not started');
    }
  }


  onMessage(text) {
    let msg = JSON.parse(text);
    this.messageHandler(msg);
  }
}

module.exports = ThingConnection;
