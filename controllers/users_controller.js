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
var UsersController = express.Router();

/**
 * Get a user.
 */
UsersController.get('/:email', function(request, response) {
  var email = request.params.email;
  Users.getUser(email).then(function(user) {
    if (user) {
      response.status(200).json(user.getDescription());
    } else {
      response.status(404).send('User not found');
    }
  }).catch(function(error) {
    response.status(500).send(error);
    console.error('Failed to get user ' + email);
  });
});

module.exports = UsersController;
