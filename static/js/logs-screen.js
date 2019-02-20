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

const Log = require('./logs/log');

const LogsScreen = {
  init: function() {
    this.view = document.getElementById('logs-view');
    this.logsContainer = this.view.querySelector('.logs');
    this.logs = [
      new Log('virtual-things-2', 'level'),
      new Log('virtual-things-2', 'on'),
      new Log('weather-8b8f279cfcc42b05f2b3cdfd4b0c7f9c5eac5b18',
              'temperature'),
      new Log('philips-hue-001788fffe4f2113-sensors-2',
              'temperature'),
    ];
    this.onWindowResize = this.onWindowResize.bind(this);
    window.addEventListener('resize', this.onWindowResize);
    this.onWindowResize();
  },

  show: function() {
    this.logsContainer.innerHTML = '';
    this.logs.forEach((log) => {
      log.reload();
      this.logsContainer.appendChild(log.elt);
    });
  },

  onWindowResize: function() {
  },
};

module.exports = LogsScreen;
