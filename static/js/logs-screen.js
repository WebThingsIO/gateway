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
    this.logs = [new Log('virtual-things-2', 'level')];
    this.onWindowResize = this.onWindowResize.bind(this);
    window.addEventListener('resize', this.onWindowResize);
    this.onWindowResize();
  },

  show: function() {
    this.logsContainer.innerHTML = '';
    this.logsContainer.appendChild(this.logs[0].elt);
  },

  onWindowResize: function() {
  },
};

module.exports = LogsScreen;
