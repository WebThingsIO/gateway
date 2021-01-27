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
import {WithJWT} from '../jwt-middleware';

function build(): express.Router {
  const controller = express.Router();

  /**
   * Log out the user
   */
  controller.post('/', async (req, response) => {
    const request = <express.Request & WithJWT>req;
    await JSONWebToken.revokeToken(request.jwt.getKeyId());
    response.status(200).json({});
  });

  return controller;
}

export default build;
