import { URL } from 'url';
import {Scope, ClientId, ClientRegistry} from '../oauth-types';
const Database = require('../db');


class OAuthClients {
  private clients = new Map();
  constructor() {
  }

  register(client: ClientRegistry) {
    this.clients.set(client.id, client);
  }

  get(id: string) {
    return this.clients.get(id);
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
      authorized.set(payload.client_id, this.clients.get(payload.client_id));
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
oauthClients.register(
  new ClientRegistry(new URL('http://127.0.0.1:31338/callback'), 'test',
                     'Test OAuth Client', 'super secret', '/things:readwrite')
);

oauthClients.register(
  new ClientRegistry(new URL('https://gateway.localhost/oauth/local-token-service'), 'local-token',
                     'Local Token Service', 'super secret',
                     '/things:readwrite')
);
export default oauthClients;
