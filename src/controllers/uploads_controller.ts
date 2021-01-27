/**
 * Uploads Controller.
 *
 * Manages file uploads.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import express from 'express';
import fs from 'fs';
import path from 'path';
import * as Constants from '../constants';
import UserProfile from '../user-profile';
import fileUpload from 'express-fileupload';

const UPLOADS_PATH = UserProfile.uploadsDir;
const FLOORPLAN_PATH = path.join(UPLOADS_PATH, 'floorplan.svg');
const FALLBACK_FLOORPLAN_PATH = path.join(Constants.STATIC_PATH,
                                          'images',
                                          'floorplan.svg');

interface WithFiles {
  files?: fileUpload.FileArray;
}

// On startup, copy the default floorplan, if necessary.
if (!fs.existsSync(FLOORPLAN_PATH)) {
  try {
    fs.copyFileSync(FALLBACK_FLOORPLAN_PATH, FLOORPLAN_PATH);
  } catch (err) {
    console.error(`Failed to copy floorplan: ${err}`);
  }
}

function build(): express.Router {
  const controller = express.Router();

  /**
   * Upload a file.
   */
  controller.post('/', (req, response) => {
    const request = <express.Request & WithFiles>req;
    if (!request.files || !request.files!.file) {
      response.status(500).send('No file provided for upload');
      return;
    }

    try {
      if (fs.existsSync(FLOORPLAN_PATH)) {
        fs.unlinkSync(FLOORPLAN_PATH);
      }
    } catch (err) {
      response.status(500).send(`Failed to unlink old floorplan: ${err}`);
      return;
    }

    const file = <fileUpload.UploadedFile>request.files!.file;
    file.mv(FLOORPLAN_PATH, (error?: unknown) => {
      if (error) {
        // On error, try to copy the fallback.
        try {
          fs.copyFileSync(FALLBACK_FLOORPLAN_PATH, FLOORPLAN_PATH);
        } catch (err) {
          console.error(`Failed to copy floorplan: ${err}`);
        }

        response.status(500).send(`Failed to save uploaded file: ${error}`);
        return;
      }

      response.status(201).send('Successfully uploaded file');
    });
  });

  return controller;
}

export default build;
