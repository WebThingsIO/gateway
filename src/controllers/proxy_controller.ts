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

export interface WithProxyMethods {
  addProxyServer: (thingId: string, server: string) => void;
  removeProxyServer: (thingId: string) => void;
}

function build(): express.Router & WithProxyMethods {
  const proxies = new Map();

  function addProxyServer(thingId: string, server: string): void {
    proxies.set(thingId, server);
  }

  function removeProxyServer(thingId: string): void {
    proxies.delete(thingId);
  }

  const controller = Object.assign(express.Router(), {
    addProxyServer,
    removeProxyServer,
  });

  const proxy = Server.createProxyServer({
    changeOrigin: true,
  });

  proxy.on('error', (e) => {
    console.error('Proxy error:', e);
  });

  /**
   * Proxy the request, if configured.
   */
  controller.all('/:thingId/*', (request, response) => {
    const thingId = request.params.thingId;

    if (!proxies.has(thingId)) {
      response.sendStatus(404);
      return;
    }

    request.url = request.url.substring(thingId.length + 1);
    proxy.web(request, response, { target: proxies.get(thingId) });
  });

  return controller;
}

export default build;
