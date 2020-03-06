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
const rateLimit = require('express-rate-limit');

const LoginController = Router();

const loginRoot = path.join(Constants.BUILD_STATIC_PATH, 'login');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                  // 10 failed requests per windowMs
  skipSuccessfulRequests: true,
});

/**
 * Serve the static login page
 */
LoginController.get('/', async (request, response) => {
  response.sendFile('index.html', {root: loginRoot});
});

/**
 * Handle login request.
 */
LoginController.post('/', limiter, async (request, response) => {
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

  if (user.mfaEnrolled) {
    if (!body.mfa) {
      response.status(401).json({mfaRequired: true});
      return;
    }

    if (!Passwords.verifyMfaToken(user.mfaSharedSecret, body.mfa)) {
      let backupMatch = false;

      if (body.mfa.totp.length === 12) {
        let index = 0;
        for (const backup of user.mfaBackupCodes) {
          backupMatch = await Passwords.compare(body.mfa.totp, backup);
          if (backupMatch) {
            break;
          }

          ++index;
        }

        if (backupMatch) {
          user.mfaBackupCodes.splice(index, 1);
          await Users.editUser(user);
        }
      }

      if (!backupMatch) {
        response.status(401).json({mfaRequired: true});
        return;
      }
    }
  }

  // Issue a new JWT for this user.
  const jwt = await JSONWebToken.issueToken(user.id);
  limiter.resetKey(request.ip);
  response.status(200).json({jwt});
});

module.exports = LoginController;
