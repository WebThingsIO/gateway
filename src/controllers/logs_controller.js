/**
 * Logs Controller.
 *
 * Allows user to download current set of logs.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const AddonManager = require('../addon-manager');
const archiver = require('archiver');
const express = require('express');
const fs = require('fs');
const path = require('path');
const jwtMiddleware = require('../jwt-middleware');
const UserProfile = require('../user-profile');
const Utils = require('../utils');
const WebSocket = require('ws');

const LogsController = express.Router();

/**
 * Generate an index of log files.
 */
LogsController.get('/', async (request, response) => {
  const jwt = jwtMiddleware.extractJWTHeader(request) ||
    jwtMiddleware.extractJWTQS(request);
  const files = fs.readdirSync(UserProfile.logDir);
  files.sort();

  let content =
    '<!DOCTYPE html>' +
    '<html lang="en">' +
    '<head>' +
    '<meta charset="utf-8">' +
    '<title>Things Gateway - Logs</title>' +
    '</head>' +
    '<body>' +
    '<ul>';

  for (const name of files) {
    if (fs.lstatSync(path.join(UserProfile.logDir, name)).isFile()) {
      content +=
        `${'<li>' +
        `<a href="/logs/files/${encodeURIComponent(name)}?jwt=${jwt}">`}${
          Utils.escapeHtml(name)
        }</a>` +
        `</li>`;
    }
  }

  content +=
    '</ul>' +
    '</body>' +
    '</html>';

  response.send(content);
});

/**
 * Static handler for log files.
 */
LogsController.use('/files', express.static(UserProfile.logDir));

/**
 * Handle request for logs.zip.
 */
LogsController.get('/zip', async (request, response) => {
  const archive = archiver('zip');

  archive.on('error', (err) => {
    response.status(500).send(err.message);
  });

  response.attachment('logs.zip');

  archive.pipe(response);
  archive.directory(UserProfile.logDir, 'logs');
  archive.finalize();
});

LogsController.ws('/', (websocket) => {
  if (websocket.readyState !== WebSocket.OPEN) {
    return;
  }

  const heartbeat = setInterval(() => {
    try {
      websocket.ping();
    } catch (e) {
      websocket.terminate();
    }
  }, 30 * 1000);

  const onLog = (message) => {
    websocket.send(JSON.stringify(message), (err) => {
      if (err) {
        console.error('WebSocket sendMessage failed:', err);
      }
    });
  };

  AddonManager.pluginServer.on('log', onLog);

  const cleanup = () => {
    AddonManager.pluginServer.removeListener('log', onLog);
    clearInterval(heartbeat);
  };

  websocket.on('error', cleanup);
  websocket.on('close', cleanup);
});

module.exports = LogsController;
