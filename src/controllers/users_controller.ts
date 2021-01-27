/**
 * Users Controller.
 *
 * Manages HTTP requests to /users.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import express from 'express';
import * as Passwords from '../passwords';
import * as Users from '../models/users';
import JSONWebToken from '../models/jsonwebtoken';
import * as jwtMiddleware from '../jwt-middleware';

function build(): express.Router {
  const auth = jwtMiddleware.middleware();

  const controller = express.Router();

  /**
   * Get the count of users.
   *
   * NOTE: This is temporary while we figure out mutli user UI.
   */
  controller.get('/count', async (_request, response) => {
    const count = await Users.getCount();
    return response.status(200).send({count});
  });

  /**
   * Get info about all users.
   */
  controller.get('/info', auth, async (req, response) => {
    const request = <express.Request & jwtMiddleware.WithJWT>req;
    const users = await Users.getUsers();
    const descriptions = users.map((user) => {
      const loggedIn = user.getId() === request.jwt.getUser();
      return Object.assign(user.getDescription(), {loggedIn});
    });
    return response.status(200).send(descriptions);
  });

  /**
   * Get a user.
   */
  controller.get('/:userId', auth, async (request, response) => {
    const user = await Users.getUserById(parseInt(request.params.userId));

    if (!user) {
      response.sendStatus(404);
      return;
    }

    response.status(200).json(user.getDescription());
  });

  /**
   * Create a user
   */
  controller.post('/', async (request, response) => {
    const body = request.body;

    if (!body || !body.email || !body.password) {
      response.status(400).send('User requires email and password.');
      return;
    }

    // If a user has already been created, this path must be authenticated.
    const count = await Users.getCount();
    if (count > 0) {
      const jwt = await jwtMiddleware.authenticate(request);
      if (!jwt) {
        response.sendStatus(401);
        return;
      }
    }

    // See if this user already exists.
    const found = await Users.getUser(body.email);
    if (found) {
      response.status(400).send('User already exists.');
      return;
    }

    // TODO: user facing errors...
    const hash = await Passwords.hash(body.password);
    const user = await Users.createUser(body.email, hash, body.name);
    const jwt = await JSONWebToken.issueToken(user.getId()!);

    response.send({
      jwt,
    });
  });

  controller.post('/:userId/mfa', auth, async (request, response) => {
    const user = await Users.getUserById(parseInt(request.params.userId));

    if (!user) {
      response.sendStatus(404);
      return;
    }

    const body = request.body;
    if (body.enable) {
      if (!body.mfa) {
        // Initial MFA enablement, generate params
        const params = await user.generateMfaParams();
        response.status(200).json(params);
      } else if (Passwords.verifyMfaToken(user.getMfaSharedSecret(), body.mfa)) {
        // Stage 2, verify MFA token
        user.setMfaEnrolled(true);
        const backupCodes = await user.generateMfaBackupCodes();
        await Users.editUser(user);
        response.status(200).json({backupCodes});
      } else {
        response.sendStatus(401);
      }
    } else {
      // Disable MFA
      user.setMfaEnrolled(false);
      await Users.editUser(user);
      response.sendStatus(204);
    }
  });

  controller.put('/:userId/mfa/codes', auth, async (request, response) => {
    const user = await Users.getUserById(parseInt(request.params.userId));

    if (!user) {
      response.sendStatus(404);
      return;
    }

    const body = request.body;
    if (body.generate) {
      const backupCodes = await user.generateMfaBackupCodes();
      await Users.editUser(user);
      response.status(200).json({backupCodes});
      return;
    }

    response.status(400).send('Request missing generate parameter');
  });

  /**
   * Edit a user
   */
  controller.put('/:userId', auth, async (request, response) => {
    const user = await Users.getUserById(parseInt(request.params.userId));

    if (!user) {
      response.sendStatus(404);
      return;
    }

    const body = request.body;
    if (!body || !body.email || !body.password) {
      response.status(400).send('User requires email and password.');
      return;
    }

    const passwordMatch = await Passwords.compare(body.password, user.getPassword());
    if (!passwordMatch) {
      response.status(400).send('Passwords do not match.');
      return;
    }

    if (body.newPassword) {
      user.setPassword(await Passwords.hash(body.newPassword));
    }

    user.setEmail(body.email);
    user.setName(body.name);

    await Users.editUser(user);
    response.status(200).json({});
  });

  /**
   * Delete a user
   */
  controller.delete('/:userId', auth, async (request, response) => {
    await Users.deleteUser(parseInt(request.params.userId));
    response.sendStatus(204);
  });

  return controller;
}

export default build;
