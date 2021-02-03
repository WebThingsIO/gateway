/**
 * OAuthClients Controller.
 *
 * Lists and revokes oauth client authorizations
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import express from 'express';
import OAuthClients from '../models/oauthclients';
import { ClientRegistry } from '../oauth-types';
import { WithJWT } from '../jwt-middleware';

function build(): express.Router {
  const controller = express.Router();

  /**
   * Get the currently authorized clients
   */
  controller.get('/', async (req: express.Request, response: express.Response) => {
    const request = <express.Request & WithJWT>req;
    const user = request.jwt.getUser();
    const clients = await OAuthClients.getAuthorized(user);

    response.json(
      clients.map((client: ClientRegistry) => {
        return client.getDescription();
      })
    );
  });

  controller.delete('/:clientId', async (req: express.Request, response: express.Response) => {
    const request = <express.Request & WithJWT>req;
    const clientId = request.params.clientId;
    if (!OAuthClients.get(clientId)) {
      response.status(404).send('Client not found');
      return;
    }
    const user = request.jwt.getUser();

    await OAuthClients.revokeClientAuthorization(user, clientId);
    response.sendStatus(204);
  });

  return controller;
}

export default build;
