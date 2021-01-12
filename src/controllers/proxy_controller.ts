/**
 * Proxy Controller.
 *
 * Handles proxied resources.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Server from 'http-proxy';
import express from 'express';

export class ProxyStore {
  private proxies = new Map<string, string>();

  addProxyServer(thingId: string, server: string): void {
    this.proxies.set(thingId, server);
  }

  removeProxyServer(thingId: string): void {
    this.proxies.delete(thingId);
  }

  get(thingId: string): string | undefined {
    return this.proxies.get(thingId);
  }
}

export default function ProxyController(): [express.Router, ProxyStore] {
  const router = express.Router();
  const proxyStore = new ProxyStore();
  const proxy = Server.createProxyServer({
    changeOrigin: true,
  });

  proxy.on('error', (e) => {
    console.debug('Proxy error:', e);
  });

  /**
   * Proxy the request, if configured.
   */
  router.all('/:thingId/*', (request, response) => {
    const thingId = request.params.thingId;
    const server = proxyStore.get(thingId);

    if (!server) {
      response.sendStatus(404);
      return;
    }

    request.url = request.url.substring(thingId.length + 1);
    proxy.web(request, response, {target: server});
  });

  return [router, proxyStore];
}
