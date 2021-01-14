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
import {ClientRegistry} from '../oauth-types';

const OAuthClientsController = express.Router();

/**
 * Get the currently authorized clients
 */
OAuthClientsController.get('/', async (request: express.Request, response: express.Response) => {
  const user = (request as any).jwt.user;
  const clients = await OAuthClients.getAuthorized(user);

  response.json(clients.map((client: ClientRegistry) => {
    return client.getDescription();
  }));
});

OAuthClientsController.delete(
  '/:clientId',
  async (request: express.Request, response: express.Response) => {
    const clientId = request.params.clientId;
    if (!OAuthClients.get(clientId)) {
      response.status(404).send('Client not found');
      return;
    }
    const user = (request as any).jwt.user;

    await OAuthClients.revokeClientAuthorization(user, clientId);
    response.sendStatus(204);
  }
);

export = OAuthClientsController;
