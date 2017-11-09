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

const PromiseRouter = require('express-promise-router');
const Passwords = require('../passwords');
const Users = require('../models/users');
const JSONWebToken = require('../models/jsonwebtoken');
const config = require('config');
const fetch = require('node-fetch');
const auth = require('../jwt-middleware')();
const Settings = require('../models/settings');

const UsersController = PromiseRouter();

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

  const count = await Users.getCount();
  if (count > 0) {
    response.status(400).send('Gateway user already created');
    return;
  }

  if (config.get('ssltunnel.enabled')) {
    let result;
    try {
      result = await Settings.get('tunneltoken');
    } catch (e) {
      console.error('Failed to get tunneltoken setting');
      console.error(e);
      response.status(400).send(e);
      return;
    }

    if (typeof result === 'object') {
      try {
        // now we associate user's emails with the subdomain
        await fetch(config.get('ssltunnel.registration_endpoint') +
                    '/setemail?token=' + result.token + '&email=' +
                    body.email);
      } catch (e) {
        // https://github.com/mozilla-iot/gateway/issues/358
        // we should store this error and display to the user on
        // settings page to allow him to retry
        throw e;
      }

      console.log('Online account created.');
    }
  }

  // TODO: user facing errors...
  const hash = await Passwords.hash(body.password);
  const user = await Users.createUser(body.email, hash, body.name);
  const jwt = await JSONWebToken.issueToken(user.id);

  response.send({
    jwt,
  });
});

module.exports = UsersController;
