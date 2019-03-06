/**
 * Uploads Controller.
 *
 * Manages file uploads.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const express = require('express');
const fs = require('fs');
const path = require('path');
const Constants = require('../constants');
const UserProfile = require('../user-profile');

const UPLOADS_PATH = UserProfile.uploadsDir;
const FLOORPLAN_PATH = path.join(UPLOADS_PATH, 'floorplan.svg');
const FALLBACK_FLOORPLAN_PATH = path.join(Constants.STATIC_PATH,
                                          'images',
                                          'floorplan.svg');

// On startup, copy the default floorplan, if necessary.
if (!fs.existsSync(FLOORPLAN_PATH)) {
  try {
    fs.copyFileSync(FALLBACK_FLOORPLAN_PATH, FLOORPLAN_PATH);
  } catch (err) {
    console.error(`Failed to copy floorplan: ${err}`);
  }
}

const UploadsController = express.Router();

/**
 * Upload a file.
 */
UploadsController.post('/', (request, response) => {
  if (!request.files || !request.files.file) {
    return response.status(500).send('No file provided for upload');
  }

  try {
    if (fs.existsSync(FLOORPLAN_PATH)) {
      fs.unlinkSync(FLOORPLAN_PATH);
    }
  } catch (err) {
    return response.status(500).send(`Failed to unlink old floorplan: ${err}`);
  }

  const file = request.files.file;
  file.mv(FLOORPLAN_PATH, (error) => {
    if (error) {
      // On error, try to copy the fallback.
      try {
        fs.copyFileSync(FALLBACK_FLOORPLAN_PATH, FLOORPLAN_PATH);
      } catch (err) {
        console.error(`Failed to copy floorplan: ${err}`);
      }

      return response.status(500).send(
        `Failed to save uploaded file: ${error}`);
    }

    response.status(201).send('Successfully uploaded file');
  });
});

module.exports = UploadsController;
