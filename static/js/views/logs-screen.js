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

const API = require('../api');
const App = require('../app');
const Constants = require('../app');
const Log = require('../logs/log');

class LogsScreen {
  constructor() {
    this.logs = {};
    this.start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    this.end = new Date(Date.now());
    this.onWindowResize = this.onWindowResize.bind(this);
    window.addEventListener('resize', this.onWindowResize);
  }

  init() {
    this.view = document.getElementById('logs-view');
    this.logsContainer = this.view.querySelector('.logs');
    this.onWindowResize();
  }

  show() {
    this.reload();

    App.gatewayModel.unsubscribe(Constants.REFRESH_THINGS, this.refreshThings);
    App.gatewayModel.subscribe(
      Constants.REFRESH_THINGS,
      this.refreshThings,
      true);
  }

  reload() {
    fetch(`/logs/.schema`, {headers: API.headers()}).then((res) => {
      return res.json();
    }).then((schema) => {
      for (const logInfo of schema) {
        if (this.logs[logInfo.id]) {
          this.logs[logInfo.id].clearPoints();
          continue;
        }
        const log = new Log(logInfo.thing, logInfo.property, this.start,
                            this.end);
        this.logs[logInfo.id] = log;
        this.logsContainer.appendChild(log.elt);
        log.load();
      }
      this.streamAll();
    });
  }

  streamAll() {
    if (this.messageSocket) {
      return;
    }
    const timeBounds = `start=${this.start.getTime()}&end=${this.end.getTime()}`;
    const path = `${App.ORIGIN.replace(/^http/, 'ws')}/logs?jwt=${API.jwt}&${timeBounds}`;
    this.messageSocket = new WebSocket(path);

    const onMessage = (msg) => {
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

      for (const id in this.logs) {
        this.logs[id].redraw();
      }
    };

    this.messageSocket.addEventListener('message', onMessage);
    this.messageSocket.addEventListener('close', cleanup);
    this.messageSocket.addEventListener('error', cleanup);
  }

  refreshThings() {
  }

  onWindowResize() {
  }
}

module.exports = new LogsScreen();
