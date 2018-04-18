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

const path = require('path');

const Router = require('express-promise-router');
const Users = require('../models/users');
const JSONWebToken = require('../models/jsonwebtoken');
const Passwords = require('../passwords');
const Constants = require('../constants');

const LoginController = Router();

const loginRoot = path.join(Constants.BUILD_STATIC_PATH, 'login');

/**
 * Serve the static login page
 */
LoginController.get('/', async (request, response) => {
  response.sendFile('index.html', {root: loginRoot});
});

/**
 * Handle login request.
 */
LoginController.post('/', async (request, response) => {
  const {body} = request;
  if (!body || !body.email || !body.password) {
    response.status(400).send('User requires email and password');
    return;
  }

  const user = await Users.getUser(body.email.toLowerCase());
  if (!user) {
    response.sendStatus(401);
    return;
  }

  const passwordMatch = await Passwords.compare(
    body.password,
    user.password
  );

  if (!passwordMatch) {
    response.sendStatus(401);
    return;
  }

  // Issue a new JWT for this user.
  const jwt = await JSONWebToken.issueToken(user.id);

  response.send({
    jwt,
  });
});

module.exports = LoginController;
