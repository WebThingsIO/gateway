/**
 * Logs Controller.
 *
 * Allows user to download current set of logs.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const archiver = require('archiver');
const express = require('express');
const UserProfile = require('../user-profile');

const LogsController = express.Router();

/**
 * Handle request for logs.zip.
 */
LogsController.get('/', async (request, response) => {
  const archive = archiver('zip');

  archive.on('error', (err) => {
    response.status(500).send(err.message);
  });

  response.attachment('logs.zip');

  archive.pipe(response);
  archive.directory(UserProfile.logDir, 'logs')
  archive.finalize();
});

module.exports = LogsController;
