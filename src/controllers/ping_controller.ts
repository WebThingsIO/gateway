/**
 * Ping Controller.
 *
 * Handles requests to /ping, used for connectivity checks.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import express from 'express';

function build(): express.Router {
  const controller = express.Router();

  controller.get('/', (_request, response) => {
    response.sendStatus(204);
  });

  return controller;
}

export default build;
