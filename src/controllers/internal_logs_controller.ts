/**
 * Internal logs Controller.
 *
 * Allows user to download current set of internal log files.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import archiver from 'archiver';
import express from 'express';
import expressWs from 'express-ws';
import fs from 'fs';
import path from 'path';
import WebSocket from 'ws';
import * as Constants from '../constants';
import * as jwtMiddleware from '../jwt-middleware';
import UserProfile from '../user-profile';
import * as Utils from '../utils';
import AddonManager from '../addon-manager';
import {EventEmitter} from 'events';

function build(): express.Router {
  const controller: express.Router & expressWs.WithWebsocketMethod = express.Router();

  /**
   * Generate an index of log files.
   */
  controller.get('/', async (request, response) => {
    const jwt = jwtMiddleware.extractJWTHeader(request) ||
      jwtMiddleware.extractJWTQS(request);
    const files = fs.readdirSync(UserProfile.logDir)
      .filter((f) => !f.startsWith('.') && f !== 'logs.sqlite3');
    files.sort();

    let content =
      '<!DOCTYPE html>' +
      '<html lang="en">' +
      '<head>' +
      '<meta charset="utf-8">' +
      '<title>Logs - WebThings Gateway</title>' +
      '</head>' +
      '<body>' +
      '<ul>';

    for (const name of files) {
      if (fs.lstatSync(path.join(UserProfile.logDir, name)).isFile()) {
        content +=
          `${'<li>' +
          `<a href="${Constants.INTERNAL_LOGS_PATH}/files/${encodeURIComponent(name)}?jwt=${jwt}">`
          }${Utils.escapeHtml(name)}</a>` +
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
  controller.use(
    '/files',
    express.static(
      UserProfile.logDir,
      {
        setHeaders: (res, filepath) => {
          const base = path.basename(filepath);
          if (base.startsWith('run-app.log')) {
            res.set('Content-Type', 'text/plain');
          }
        },
      }
    )
  );

  /**
   * Handle request for logs.zip.
   */
  controller.get('/zip', async (_request, response) => {
    const archive = archiver('zip');

    archive.on('error', (err) => {
      response.status(500).send(err.message);
    });

    response.attachment('logs.zip');

    archive.pipe(response);
    fs.readdirSync(
      UserProfile.logDir
    ).map((f) => {
      const fullPath = path.join(UserProfile.logDir, f);
      if (!f.startsWith('.') && fs.lstatSync(fullPath).isFile() &&
          f !== 'logs.sqlite3') {
        archive.file(fullPath, {name: path.join('logs', f)});
      }
    });
    archive.finalize();
  });

  controller.ws('/', (websocket: WebSocket) => {
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

    function onLog(message: Constants.LogMessage): void {
      websocket.send(JSON.stringify(message), (err) => {
        if (err) {
          console.error('WebSocket sendMessage failed:', err);
        }
      });
    }

    const pluginServer: EventEmitter | null = AddonManager.getPluginServer();
    if (pluginServer) {
      pluginServer.on('log', onLog);

      const cleanup = (): void => {
        pluginServer.removeListener('log', onLog);
        clearInterval(heartbeat);
      };

      websocket.on('error', cleanup);
      websocket.on('close', cleanup);
    }
  });

  return controller;
}

export default build;
