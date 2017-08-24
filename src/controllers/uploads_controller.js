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
const path = require('path');
const config = require('config');

const UPLOADS_PATH = path.join(__dirname, config.get('uploads.directory'));
const FLOORPLAN_PATH = path.join(UPLOADS_PATH, 'floorplan.svg');

var UploadsController = express.Router();

/**
 * Upload a file.
 */
UploadsController.post('/', function (request, response) {
  if (!request.files || !request.files.file) {
    return response.status(500).send('No file provided for upload');
  }
  var file = request.files.file;
  file.mv(FLOORPLAN_PATH, function(error) {
    if (error) {
      return response.status(500).send('Failed to save uploaded file ' + error);
    }
    response.status(201).send('Successfully uploaded file');
  });
});

module.exports = UploadsController;
