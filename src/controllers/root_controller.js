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
const TunnelSetup = require('../tunnel_setup');
const Constants = require('../constants');

const RootController = express.Router();

/**
 * Get the home page.
 */
RootController.get('/', TunnelSetup.isTunnelSet,
  function(request, response) {
    response.sendFile('index.html', {
      root: Constants.VIEWS_PATH,
      maxAge: '14d'
    });
  }
);

module.exports = RootController;
