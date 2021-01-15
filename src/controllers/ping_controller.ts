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

export default function PingController(): express.Router {
  const router = express.Router();

  router.get('/', (_request, response) => {
    response.sendStatus(204);
  });

  return router;
}
