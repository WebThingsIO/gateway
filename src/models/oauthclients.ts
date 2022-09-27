import { URL } from 'url';
import { ClientRegistry } from '../oauth-types';
import config from 'config';
import Database from '../db';

class OAuthClients {
  private clients: Map<string, Array<ClientRegistry>> = new Map();

  register(client: ClientRegistry): void {
    if (this.clients.get(client.id)) {
      this.clients.get(client.id)!.push(client);
    } else {
      this.clients.set(client.id, [client]);
    }
  }

  get(id: string, redirectUri?: URL): ClientRegistry | null {
    const clients = this.clients.get(id);
    if (!clients) {
      return null;
    }
    if (!redirectUri) {
      return clients[0];
    }
    for (const client of clients) {
      if (client.redirect_uri.href === redirectUri.href) {
        return client;
      }
    }
    return clients[0];
  }

  async getAuthorized(userId: number): Promise<Array<ClientRegistry>> {
    const jwts = await Database.getJSONWebTokensByUser(userId);
    const authorized = new Map();

    for (const jwt of jwts) {
      const payload = JSON.parse(<string>jwt.payload);
      if (payload.role !== 'access_token') {
        continue;
      }
      if (!this.clients.has(payload.client_id)) {
        console.warn('Orphaned access_token', jwt);
        await Database.deleteJSONWebTokenByKeyId(<string>jwt.keyId);
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

  async revokeClientAuthorization(userId: number, clientId: string): Promise<void> {
    const jwts = await Database.getJSONWebTokensByUser(userId);

    for (const jwt of jwts) {
      const payload = JSON.parse(<string>jwt.payload);
      if (payload.client_id === clientId) {
        await Database.deleteJSONWebTokenByKeyId(<string>jwt.keyId);
      }
    }
  }
}

const oauthClients = new OAuthClients();

if (config.get('oauth.testClients')) {
  oauthClients.register(
    new ClientRegistry(
      new URL('http://127.0.0.1:31338/callback'),
      'test',
      'Test OAuth Client',
      'super secret',
      '/things:readwrite'
    )
  );

  oauthClients.register(
    new ClientRegistry(
      new URL('http://127.0.0.1:31338/bonus-entry'),
      'test',
      'Test OAuth Client',
      'other secret',
      '/things:readwrite'
    )
  );

  oauthClients.register(
    new ClientRegistry(
      new URL('http://localhost:8888/callback'),
      'mycroft',
      'Mycroft',
      'bDaQN6yDgI0GlvJL2UVcIAb4M8c',
      '/things:readwrite'
    )
  );
}

oauthClients.register(
  new ClientRegistry(
    new URL('https://gateway.localhost/oauth/local-token-service'),
    'local-token',
    'Local Token Service',
    'super secret',
    '/things:readwrite'
  )
);

oauthClients.register(
  new ClientRegistry(
    new URL('https://api.mycroft.ai/v1/auth/callback'),
    'mycroft',
    'Mycroft',
    'bDaQN6yDgI0GlvJL2UVcIAb4M8c',
    '/things:readwrite'
  )
);

oauthClients.register(
  new ClientRegistry(
    new URL('https://api-test.mycroft.ai/v1/auth/callback'),
    'mycroft',
    'Mycroft',
    'bDaQN6yDgI0GlvJL2UVcIAb4M8c',
    '/things:readwrite'
  )
);

export default oauthClients;
