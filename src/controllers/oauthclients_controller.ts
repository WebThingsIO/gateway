/**
 * OAuthClients Controller.
 *
 * Lists and revokes oauth client authorizations
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

import * as express from 'express';

const PromiseRouter = require('express-promise-router');
import OAuthClients from '../models/oauthclients';
import {ClientRegistry} from '../oauth-types';

const OAuthClientsController = PromiseRouter();

/**
 * Get the currently authorized clients
 */
OAuthClientsController.get('/', async (request: express.Request, response: express.Response) => {
  let user = (request as any).jwt.user;
  let clients = await OAuthClients.getAuthorized(user);

  response.json(clients.map((client: ClientRegistry) => {
    return client.getDescription();
  }));
});

OAuthClientsController.delete('/:clientId', async (request: express.Request, response: express.Response) => {
  let clientId = request.params.clientId;
  if (!OAuthClients.get(clientId, undefined)) {
    response.status(404).send('Client not found');
    return;
  }
  let user = (request as any).jwt.user;

  await OAuthClients.revokeClientAuthorization(user, clientId);
  response.sendStatus(200);
});

export default OAuthClientsController;
