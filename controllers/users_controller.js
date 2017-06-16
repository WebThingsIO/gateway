/**
 * Users Controller.
 *
 * Manages HTTP requests to /users.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

var express = require('express');
var Users = require('../models/users');
var User = require('../models/user');
var UsersController = express.Router();

/**
 * Add a new user.
 */
UsersController.post('/', function() {

});

module.exports = UsersController;
