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
var Users = require('../models/users');

var LoginController = express.Router();

const viewsRoot = path.join(__dirname, '../views');

/**
 * Get the login page.
 */
LoginController.get('/',
  function(request, response) {
    Users.getUsers().then(users => {
      if (users.length > 0) {
        response.sendFile('login.html', { root: viewsRoot });
      } else {
        response.sendFile('create_user.html', { root: viewsRoot });
      }
    });
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
