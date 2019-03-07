/**
 * Root Controller.
 *
 * Handles requests to /.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const express = require('express');
const Constants = require('../constants');
const TunnelService = require('../ssltunnel');

const RootController = express.Router();

/**
 * Get the home page.
 */
RootController.get('/', TunnelService.isTunnelSet, (request, response) => {
  response.sendFile('index.html', {
    root: Constants.BUILD_STATIC_PATH,
  });
});

module.exports = RootController;
