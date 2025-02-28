/**
 * Login Controller.
 *
 * Handles user login.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import express from 'express';
import path from 'path';
import * as Constants from '../constants';
import * as Passwords from '../passwords';
import * as Users from '../models/users';
import JSONWebToken from '../models/jsonwebtoken';
import rateLimit from 'express-rate-limit';

function build(): express.Router {
  const controller = express.Router();

  const loginRoot = path.join(Constants.BUILD_STATIC_PATH, 'login');

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 failed requests per windowMs
    skipSuccessfulRequests: true,
  });

  /**
   * Serve the static login page
   */
  controller.get('/', async (_request, response) => {
    response.sendFile('index.html', { root: loginRoot });
  });

  /**
   * Handle login request.
   */
  controller.post('/', limiter, async (request, response) => {
    const { body } = request;
    if (!body || !body.email || !body.password) {
      response.status(400).send('User requires email and password');
      return;
    }

    const user = await Users.getUser(body.email.toLowerCase());
    if (!user) {
      response.sendStatus(401);
      return;
    }

    const passwordMatch = await Passwords.compare(body.password, user.getPassword());

    if (!passwordMatch) {
      response.sendStatus(401);
      return;
    }

    if (user.getMfaEnrolled()) {
      if (!body.mfa) {
        response.status(401).json({ mfaRequired: true });
        return;
      }

      if (!Passwords.verifyMfaToken(user.getMfaSharedSecret(), body.mfa)) {
        let backupMatch = false;

        if (body.mfa.totp.length === 12) {
          let index = 0;
          for (const backup of user.getMfaBackupCodes()) {
            backupMatch = await Passwords.compare(body.mfa.totp, backup);
            if (backupMatch) {
              break;
            }

            ++index;
          }

          if (backupMatch) {
            user.getMfaBackupCodes().splice(index, 1);
            await Users.editUser(user);
          }
        }

        if (!backupMatch) {
          response.status(401).json({ mfaRequired: true });
          return;
        }
      }
    }

    // Issue a new JWT for this user.
    const jwt = await JSONWebToken.issueToken(user.getId()!);
    if (request.ip) {
      limiter.resetKey(request.ip);
    }
    response.status(200).json({ jwt });
  });

  return controller;
}

export default build;
