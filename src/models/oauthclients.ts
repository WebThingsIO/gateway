'use strict';

import { URL } from 'url';
import {Scope, ClientId, ClientRegistry} from '../oauth-types';
const config = require('config');
const Database = require('../db');


class OAuthClients {
  private clients: Map<string, Array<ClientRegistry>> = new Map();
  constructor() {
  }

  register(client: ClientRegistry) {
    if (this.clients.get(client.id)) {
      this.clients.get(client.id)!.push(client);
    } else {
      this.clients.set(client.id, [client]);
    }
  }

  get(id: string, redirectUri: URL|undefined): ClientRegistry|undefined {
    const clients = this.clients.get(id);
    if (!clients) {
      return;
    }
    if (!redirectUri) {
      return clients[0];
    }
    for (let client of clients) {
      if (client.redirect_uri.href === redirectUri.href) {
        return client;
      }
    }
    return clients[0];
  }

  async getAuthorized(userId: number): Promise<Array<ClientRegistry>> {
    let jwts = await Database.getJSONWebTokensByUser(userId);
    let authorized = new Map();

    for (let jwt of jwts) {
      let payload = JSON.parse(jwt.payload);
      if (payload.role !== 'access_token') {
        continue;
      }
      if (!this.clients.has(payload.client_id)) {
        console.warn('Orphaned access_token', jwt);
        await Database.deleteJSONWebTokenByKeyId(jwt.keyId);
        continue;
      }
      const defaultClient = this.clients.get(payload.client_id)![0];
      if (!defaultClient) {
        continue;
      }
      authorized.set(payload.client_id, defaultClient);
    }

    return Array.from(authorized.values());
  }

  async revokeClientAuthorization(userId: number, clientId: string) {
    let jwts = await Database.getJSONWebTokensByUser(userId);

    for (let jwt of jwts) {
      let payload = JSON.parse(jwt.payload);
      if (payload.client_id === clientId) {
        await Database.deleteJSONWebTokenByKeyId(jwt.keyId);
      }
    }
  }
}

let oauthClients = new OAuthClients();

if (config.get('oauthTestClients')) {
  oauthClients.register(
    new ClientRegistry(new URL('http://127.0.0.1:31338/callback'), 'test',
                       'Test OAuth Client', 'super secret', '/things:readwrite')
  );

  oauthClients.register(
    new ClientRegistry(new URL('http://127.0.0.1:31338/bonus-entry'), 'test',
                       'Test OAuth Client', 'other secret', '/things:readwrite')
  );

  oauthClients.register(
    new ClientRegistry(new URL('http://localhost:8888/callback'), 'mycroft',
                       'Mycroft', 'bDaQN6yDgI0GlvJL2UVcIAb4M8c', '/things:readwrite')
  );
}

oauthClients.register(
  new ClientRegistry(new URL('https://gateway.localhost/oauth/local-token-service'), 'local-token',
                     'Local Token Service', 'super secret',
                     '/things:readwrite')
);

oauthClients.register(
  new ClientRegistry(new URL('https://api.mycroft.ai/v1/auth/callback'), 'mycroft',
                     'Mycroft', 'bDaQN6yDgI0GlvJL2UVcIAb4M8c', '/things:readwrite')
);

oauthClients.register(
  new ClientRegistry(new URL('https://api-test.mycroft.ai/v1/auth/callback'), 'mycroft',
                     'Mycroft', 'bDaQN6yDgI0GlvJL2UVcIAb4M8c', '/things:readwrite')
);

export default oauthClients;
