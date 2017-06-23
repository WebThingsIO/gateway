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

const Router = require('express-promise-router');
const Authentication = require('../authentication');
const Users = require('../models/users');
const JSONWebToken = require('../models/jsonwebtoken');

const UsersController = Router();
const auth = require('../jwt-middleware')();

/**
 * Get the count of users.
 *
 * NOTE: This is temporary while we figure out mutli user UI.
 */
UsersController.get('/count', async (request, response) => {
  const count = await Users.getCount();
  return response.status(200).send({ count });
});

/**
 * Get a user.
 */
UsersController.get('/info', auth, async (request, response) => {
  const user = await Users.getUserById(request.jwt.user);
  // This should never happen if we auth'ed the JWT the user row should
  // be present barring any bugs/races.
  if (!user) {
    response.sendStatus(500);
    return;
  }
  response.status(200).json(user.getDescription());
});

/**
 * Create a user
 */
UsersController.post('/', async (request, response) => {
  let body = request.body;

  if (!body || !body.email || !body.password) {
    response.status(400).send('User requires email and password');
    return;
  }

  const hasEmail = await Users.getUser(body.email);
  if (hasEmail) {
    response.sendStatus(400);
    return;
  }

  // TODO: user facing errors...
  const hash = await Authentication.hashPassword(body.password);
  const user = await Users.createUser(body.email, hash, body.name);
  const jwt = await JSONWebToken.issueToken(user.id);

  response.send({
    jwt,
  });
});

module.exports = UsersController;
