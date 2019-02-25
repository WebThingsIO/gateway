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
    fetch(`/logs/`, {headers: API.headers()}).then((res) => {
      return res.json();
    }).then((data) => {
      window.debugData = data;
      for (const thingId in data) {
        for (const propId in data[thingId]) {
          if (!this.logs[thingId]) {
            this.logs[thingId] = {};
          }
          let log = this.logs[thingId][propId];
          if (!log) {
            const firstData = data[thingId][propId][0];
            if (!firstData ||
                !['boolean', 'number'].includes(typeof firstData.value)) {
              continue;
            }
            log = new Log(thingId, propId);
            this.logs[thingId][propId] = log;
            this.logsContainer.appendChild(log.elt);
          }
          log.reload(data[thingId][propId]);
        }
      }
    });
  },

  onWindowResize: function() {
  },
};

module.exports = LogsScreen;
