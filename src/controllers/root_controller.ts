/**
 * Root Controller.
 *
 * Handles requests to /.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import express from 'express';
import * as Constants from '../constants';
import TunnelService from '../tunnel-service';

function build(): express.Router {
  const controller = express.Router();

  /**
   * Get the home page.
   */
  controller.get('/', TunnelService.isTunnelSet.bind(TunnelService), (_request, response) => {
    response.sendFile('index.html', {
      root: Constants.BUILD_STATIC_PATH,
    });
  });

  return controller;
}

export = build;
