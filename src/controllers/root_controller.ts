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

const RootController = express.Router();

/**
 * Get the home page.
 */
RootController.get('/', TunnelService.isTunnelSet.bind(TunnelService), (_request, response) => {
  response.sendFile('index.html', {
    root: Constants.BUILD_STATIC_PATH,
  });
});

export default RootController;
