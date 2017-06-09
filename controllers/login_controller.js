/**
 * Login Controller.
 *
 * Handles user login.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

var express = require('express');
var passport = require('passport');
var path = require('path');

var LoginController = express.Router();

/**
 * Get the login page.
 */
LoginController.get('/',
  function(request, response) {
    response.sendFile('login.html', { root: path.join(__dirname, '../views') });
  }
);

/**
 * Handle login request.
 */
LoginController.post('/', passport.authenticate('local',
  {
    successRedirect: '/',
    failureRedirect: '/login/'
  }
));

module.exports = LoginController;
