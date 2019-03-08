/**
 * Logs Screen
 *
 * Shows all logs
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const API = require('./api');
const App = require('./app');
const Log = require('./logs/log');

const LogsScreen = {
  init: function() {
    this.view = document.getElementById('logs-view');
    this.logsContainer = this.view.querySelector('.logs');
    this.logs = {};
    //  new Log('virtual-things-2', 'level'),
    //  new Log('virtual-things-2', 'on'),
    //  new Log('weather-8b8f279cfcc42b05f2b3cdfd4b0c7f9c5eac5b18',
    //          'temperature'),
    //  new Log('philips-hue-001788fffe4f2113-sensors-2',
    //          'temperature'),
    this.onWindowResize = this.onWindowResize.bind(this);
    window.addEventListener('resize', this.onWindowResize);
    this.onWindowResize();
  },

  show: function() {
    this.reload();
  },

  reload: function() {
    fetch(`/logs/.schema`, {headers: API.headers()}).then((res) => {
      return res.json();
    }).then((schema) => {
      for (const logInfo of schema) {
        if (this.logs[logInfo.id]) {
          continue;
        }
        const log = new Log(logInfo.thing, logInfo.property);
        this.logs[logInfo.id] = log;
        this.logsContainer.appendChild(log.elt);
        log.load();
      }
      this.streamAll();
    });
  },

  streamAll: function() {
    if (this.messageSocket) {
      return;
    }
    console.log('startzo', window.performance.now());
    const path = `${App.ORIGIN.replace(/^http/, 'ws')}/logs?jwt=${API.jwt}`;
    this.messageSocket = new WebSocket(path);

    let really = false;
    const onMessage = (msg) => {
      if (!really) {
        console.log('yikes', window.performance.now());
        really = true;
      }
      const messages = JSON.parse(msg.data);
      for (const message of messages) {
        if (this.logs.hasOwnProperty(message.id)) {
          this.logs[message.id].addRawPoint(message);
        }
      }
    };

    const cleanup = () => {
      this.messageSocket.removeEventListener('message', onMessage);
      this.messageSocket.removeEventListener('close', cleanup);
      this.messageSocket.removeEventListener('error', cleanup);
      this.messageSocket.close();
      this.messageSocket = null;

      console.log('donezo', window.performance.now());
      for (const id in this.logs) {
        this.logs[id].redraw();
      }
    };

    this.messageSocket.addEventListener('message', onMessage);
    this.messageSocket.addEventListener('close', cleanup);
    this.messageSocket.addEventListener('error', cleanup);
  },

  onWindowResize: function() {
  },
};

module.exports = LogsScreen;
