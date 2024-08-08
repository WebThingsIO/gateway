/**
 * API Root Controller.
 *
 * Handles requests to /.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import express from 'express';
import Gateway from '../models/gateway';

function build(): express.Router {
  const controller = express.Router();

  /**
   * WoT Thing Description Directory
   * https://www.w3.org/TR/wot-discovery/#exploration-directory
   */
  controller.get('/', (request, response) => {
    const host = request.headers.host;
    const secure = request.secure;
    const td = Gateway.getDescription(host, secure);
    response.set('Content-type', 'application/td+json');
    response.status(200).send(td);
  });

  return controller;
}

export default build;
