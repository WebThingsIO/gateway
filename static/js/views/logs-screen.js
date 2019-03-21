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
const Constants = require('../constants');
const Log = require('../logs/log');

class LogsScreen {
  constructor() {
    this.logs = {};
    this.start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    this.end = new Date(Date.now());
    this.refreshThings = this.refreshThings.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.toggleCreateLog = this.toggleCreateLog.bind(this);
    this.onCreateLogDeviceSelect = this.onCreateLogDeviceSelect.bind(this);
    this.onCreateLog = this.onCreateLog.bind(this);
    window.addEventListener('resize', this.onWindowResize);
  }

  init() {
    this.view = document.getElementById('logs-view');
    this.createLogScreen = document.getElementById('create-log-screen');
    this.createLogHint = document.querySelector('.create-log-hint');
    this.createLogDevice = document.querySelector('.create-log-device');
    this.createLogDevice.addEventListener('change',
                                          this.onCreateLogDeviceSelect);
    this.createLogProperty = document.querySelector('.create-log-property');
    this.createLogSaveButton =
      document.getElementById('create-log-save-button');
    this.createLogSaveButton.addEventListener('click', this.onCreateLog);

    this.createLogButton = document.querySelector('.create-log-button');
    this.createLogButton.addEventListener('click', this.toggleCreateLog);
    this.createLogRetention =
      document.querySelector('.create-log-retention-duration');
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
      if (!schema || schema.length === 0) {
        this.createLogHint.classList.remove('hidden');
      } else {
        this.createLogHint.classList.add('hidden');
      }
      this.streamAll();
    }).catch((e) => {
      console.error('Unable to fetch schema', e);
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

  refreshThings(things) {
    this.createLogDevice.innerHTML = '';
    this.things = things;
    things.forEach((description, thingId) => {
      const opt = document.createElement('option');
      opt.innerText = description.name;
      opt.value = thingId;
      this.createLogDevice.appendChild(opt);
    });
    this.onCreateLogDeviceSelect();
  }

  onCreateLogDeviceSelect() {
    const thing = this.things.get(this.createLogDevice.value);
    if (!thing) {
      return;
    }
    function capitalize(str) {
      return str[0].toLocaleUpperCase() + str.slice(1);
    }

    this.createLogProperty.innerHTML = '';
    for (const propId in thing.properties) {
      const opt = document.createElement('option');
      opt.innerText = thing.properties[propId].title ||
        capitalize(propId);
      opt.value = propId;
      this.createLogProperty.appendChild(opt);
    }
  }

  toggleCreateLog() {
    this.createLogScreen.classList.toggle('hidden');
  }

  onCreateLog() {
    const dayToMs = 24 * 60 * 60 * 1000;

    fetch('/logs', {
      method: 'POST',
      headers: Object.assign(API.headers(),
                             {'Content-Type': 'application/json'}),
      body: JSON.stringify({
        descr: {
          type: 'property',
          thing: this.createLogDevice.value,
          property: this.createLogProperty.value,
        },
        maxAge: this.createLogRetention.value * dayToMs,
      }),
    }).then((res) => {
      if (res.ok) {
        this.toggleCreateLog();
        this.createLogHint.classList.add('hidden');
        this.reload();
      } else {
        // do the alert thing
      }
    });
  }

  onWindowResize() {
  }
}

module.exports = new LogsScreen();
