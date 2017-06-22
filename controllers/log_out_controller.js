/**
 * LogOut Controller.
 *
 * Handles logging out the user.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

var express = require('express');
const Constants = require('../constants');

var LogOutController = express.Router();

/**
 * Log out the user
 */
LogOutController.post('/', (request, response) => {
  request.logOut()
  response.redirect(Constants.LOGIN_PATH);
});

module.exports = LogOutController;
