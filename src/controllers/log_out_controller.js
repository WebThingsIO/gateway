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

const Router = require('express-promise-router');

const JSONWebToken = require('../models/jsonwebtoken');

const LogOutController = new Router();

/**
 * Log out the user
 */
LogOutController.post('/', async (request, response) => {
  const {jwt} = request;
  await JSONWebToken.revokeToken(jwt.keyId);
  response.sendStatus(200);
});

module.exports = LogOutController;
