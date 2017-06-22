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

var express = require('express');
var path = require('path');
var Authentication = require('../authentication');

var RootController = express.Router();

/**
 * Get the home page.
 */
RootController.get('/', function(request, response) {
  response.sendFile(
    'index.html',
    { root: path.join(__dirname, '../views')
  });
});

module.exports = RootController;
