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
const config = require('config');
const Constants = require('../constants');

const UPLOADS_PATH = path.join(__dirname, config.get('uploads.directory'));
const FLOORPLAN_PATH = path.join(UPLOADS_PATH, 'floorplan.svg');
const FALLBACK_FLOORPLAN_PATH = path.join(Constants.STATIC_PATH,
                                          'images',
                                          'floorplan.svg');

// On startup, symlink to the default floorplan, if necessary.
if (!fs.existsSync(FLOORPLAN_PATH)) {
  try {
    fs.symlinkSync(FALLBACK_FLOORPLAN_PATH, FLOORPLAN_PATH);
  } catch (err) {
    console.error(`Failed to symlink floorplan: ${err}`);
  }
}

var UploadsController = express.Router();

/**
 * Upload a file.
 */
UploadsController.post('/', function (request, response) {
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

  var file = request.files.file;
  file.mv(FLOORPLAN_PATH, function(error) {
    if (error) {
      // On error, try to symlink to the fallback.
      try {
        fs.symlinkSync(FALLBACK_FLOORPLAN_PATH, FLOORPLAN_PATH);
      } catch (err) {
        console.error(`Failed to symlink floorplan: ${err}`);
      }

      return response.status(500).send(
        `Failed to save uploaded file: ${error}`);
    }

    response.status(201).send('Successfully uploaded file');
  });
});

module.exports = UploadsController;
