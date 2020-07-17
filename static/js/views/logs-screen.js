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
const fluent = require('../fluent');
const Log = require('../logs/log');
const page = require('page');
const Utils = require('../utils');

class LogsScreen {
  constructor() {
    this.logs = {};
    this.logDescr = null;
    this.resizeTimeout = null;
    this.start = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    this.end = new Date(Date.now());
    this.refreshThings = this.refreshThings.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.showCreateLog = this.showCreateLog.bind(this);
    this.hideCreateLog = this.hideCreateLog.bind(this);
    this.onCreateLogDeviceSelect = this.onCreateLogDeviceSelect.bind(this);
    this.onCreateLog = this.onCreateLog.bind(this);
    this.hideRemoveDialog = this.hideRemoveDialog.bind(this);
    this.onRemoveConfirm = this.onRemoveConfirm.bind(this);
    window.addEventListener('resize', this.onWindowResize);
    this.closing = false;
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
    this.createLogButton.addEventListener('click', this.showCreateLog);
    this.createLogRetentionNumber =
      document.querySelector('.create-log-retention-duration-number');
    this.createLogRetentionUnit =
      document.querySelector('.create-log-retention-duration-unit');
    this.createLogBackButton =
      document.getElementById('create-log-back-button');
    this.createLogBackButton.addEventListener('click', this.hideCreateLog);

    this.logsContainer = this.view.querySelector('.logs');
    this.logsHeader = document.querySelector('.logs-header');
    this.logRemoveDialog = document.getElementById('log-remove-dialog');
    this.logRemoveButton = document.getElementById('log-remove-button');
    this.logRemoveButton.addEventListener('click', this.onRemoveConfirm);
    this.logRemoveName = document.getElementById('log-remove-name');
    this.logRemoveBackButton =
      document.getElementById('log-remove-back-button');
    this.logRemoveBackButton.addEventListener('click', this.hideRemoveDialog);
    this.logsBackButton =
      document.getElementById('logs-back-button');
    this.logsBackButton.addEventListener('click', () => {
      page('/logs');
    });
    this.menuButton =
      document.getElementById('menu-button');
    this.onWindowResize();
  }

  show(logDescr) {
    this.logDescr = logDescr;
    this.reload();

    App.gatewayModel.unsubscribe(Constants.REFRESH_THINGS, this.refreshThings);
    App.gatewayModel.subscribe(
      Constants.REFRESH_THINGS,
      this.refreshThings,
      true);
  }

  reload() {
    this.end = new Date(Date.now());
    const soloView = !!this.logDescr;

    if (soloView) {
      const menu = [
        // {
        //   listener: this.handleEdit.bind(this),
        //   name: 'Edit',
        //   icon: '/images/edit-plain.svg',
        // },
        {
          listener: this.handleRemove.bind(this),
          name: fluent.getMessage('remove'),
          icon: '/images/remove.svg',
        },
      ];
      App.buildOverflowMenu(menu);
      App.showOverflowButton();
      this.createLogButton.classList.add('hidden');
      this.menuButton.classList.add('hidden');
      this.logsBackButton.classList.remove('hidden');
      this.view.classList.add('solo-view');
    } else {
      App.hideOverflowButton();
      this.createLogButton.classList.remove('hidden');
      this.menuButton.classList.remove('hidden');
      this.logsBackButton.classList.add('hidden');
      this.logsHeader.textContent = 'Logs';
      this.view.classList.remove('solo-view');
    }

    API.getLogs().then((schema) => {
      for (const id in this.logs) {
        const log = this.logs[id];
        log.remove();
        delete this.logs[id];
      }

      const loadPromises = [];
      for (const logInfo of schema) {
        let included = true;
        if (soloView) {
          included = logInfo.thing === this.logDescr.thing &&
            logInfo.property === this.logDescr.property;
        }

        if (!included) {
          continue;
        }

        const log = new Log(logInfo.thing, logInfo.property,
                            this.start, this.end, soloView);

        this.logs[logInfo.id] = log;
        this.logsContainer.appendChild(log.elt);
        loadPromises.push(log.load());
      }

      if (!schema || schema.length === 0) {
        this.createLogHint.classList.remove('hidden');
      } else {
        this.createLogHint.classList.add('hidden');
      }

      return Promise.all(loadPromises);
    }).then(() => {
      this.streamAll();
    }).catch((e) => {
      App.showMessage('Server error: unable to retrieve logs', 5000);
      console.error('Unable to fetch schema', e);
    });
  }

  streamAll() {
    if (this.closing || this.messageSocket) {
      return;
    }

    const timeBounds = `start=${this.start.getTime()}&end=${this.end.getTime()}`;
    const query = `jwt=${API.jwt}&${timeBounds}`;
    let subPath = '';
    if (this.thing) {
      subPath = `things/${this.thing}/properties/${this.property}`;
    }

    const path = `${App.ORIGIN.replace(/^http/, 'ws')}/logs/${subPath}?${query}`;
    this.messageSocket = new WebSocket(path);

    const close = () => {
      this.closing = true;

      if (!this.messageSocket) {
        return;
      }

      if (this.messageSocket.readyState === WebSocket.OPEN ||
          this.messageSocket.readyState === WebSocket.CONNECTING) {
        this.messageSocket.close();
      }
    };
    window.addEventListener('beforeunload', close);

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
      window.removeEventListener('beforeunload', close);

      for (const id in this.logs) {
        this.logs[id].loading = false;
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
      for (const propId in description.properties) {
        const prop = description.properties[propId];

        // Only add an option for the device if it has loggable properties.
        if (prop.type === 'boolean' ||
            prop.type === 'number' ||
            prop.type === 'integer') {
          const opt = document.createElement('option');
          opt.innerText = description.title;
          opt.value = thingId;
          this.createLogDevice.appendChild(opt);
          break;
        }
      }
    });
    this.createLogSaveButton.disabled =
      this.createLogDevice.childNodes.length === 0;
    this.onCreateLogDeviceSelect();
  }

  onCreateLogDeviceSelect() {
    this.createLogProperty.innerHTML = '';

    const thing = this.things.get(this.createLogDevice.value);
    if (!thing) {
      return;
    }

    for (const propId in thing.properties) {
      const prop = thing.properties[propId];
      if (prop.type !== 'boolean' &&
          prop.type !== 'number' &&
          prop.type !== 'integer') {
        continue;
      }
      const opt = document.createElement('option');
      opt.innerText = prop.title ||
        Utils.capitalize(propId);
      opt.value = propId;
      this.createLogProperty.appendChild(opt);
    }
  }

  showCreateLog() {
    this.createLogScreen.classList.remove('hidden');
    App.hideOverflowButton();
  }

  hideCreateLog() {
    this.createLogScreen.classList.add('hidden');
    this.reload();
  }

  async onCreateLog() {
    const hourToMs = 60 * 60 * 1000;
    const dayToMs = 24 * hourToMs;
    const weekToMs = 7 * dayToMs;

    let maxAge = this.createLogRetentionNumber.value;
    switch (this.createLogRetentionUnit.value) {
      case 'hours':
        maxAge *= hourToMs;
        break;
      case 'days':
      default:
        maxAge *= dayToMs;
        break;
      case 'weeks':
        maxAge *= weekToMs;
        break;
    }

    API.addLog({
      descr: {
        type: 'property',
        thing: this.createLogDevice.value,
        property: this.createLogProperty.value,
      },
      maxAge,
    }).then(([ok, body]) => {
      if (ok) {
        this.createLogHint.classList.add('hidden');
        this.hideCreateLog();
        return;
      }

      if (body) {
        App.showMessage(
          `${fluent.getMessage('logs-unable-to-create')}: ${body}`,
          5000
        );
      } else {
        App.showMessage(fluent.getMessage('logs-unable-to-create'), 5000);
      }
    });
  }

  onWindowResize() {
    if (this.resizeTimeout) {
      window.clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout(() => {
      for (const id in this.logs) {
        this.logs[id].dimension();
        this.logs[id].drawSkeleton();
        this.logs[id].redraw();
      }
      this.resizeTimeout = null;
    }, 100);
  }

  handleEdit() {
  }

  handleRemove() {
    this.logRemoveName.textContent = this.logsHeader.textContent;

    this.logRemoveDialog.classList.remove('hidden');
  }

  hideRemoveDialog() {
    this.logRemoveDialog.classList.add('hidden');
  }

  onRemoveConfirm() {
    this.hideRemoveDialog();
    if (!this.logDescr) {
      console.warn('Ignoring attempt to remove log from logs view');
      return;
    }
    const thing = this.logDescr.thing;
    const property = this.logDescr.property;
    API.deleteLog(thing, property).then(() => {
      page('/logs');
    }).catch(() => {
      App.showMessage(fluent.getMessage('logs-server-remove-error'), 5000);
    });
  }
}

module.exports = new LogsScreen();
