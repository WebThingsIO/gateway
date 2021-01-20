/**
 * LogOut Controller.
 *
 * Handles logging out the user.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import express from 'express';
import JSONWebToken from '../models/jsonwebtoken';

const LogOutController = express.Router();

/**
 * Log out the user
 */
LogOutController.post('/', async (request, response) => {
  const {jwt} = request as any;
  await JSONWebToken.revokeToken(jwt.keyId);
  response.status(200).json({});
});

export default LogOutController;
