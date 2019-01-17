/**
 * Proxy Controller.
 *
 * Handles proxied resources.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const httpProxy = require('http-proxy');
const Router = require('express-promise-router');

const ProxyController = new Router();

const proxies = new Map();
const proxy = httpProxy.createProxyServer({
  changeOrigin: true,
});

proxy.on('error', (e) => {
  console.debug('Proxy error:', e);
});

ProxyController.addProxyServer = (thingId, server) => {
  proxies.set(thingId, server);
};

ProxyController.removeProxyServer = (thingId) => {
  proxies.delete(thingId);
};

/**
 * Proxy the request, if configured.
 */
ProxyController.all('/:thingId/*', (request, response) => {
  const thingId = request.params.thingId;

  if (!proxies.has(thingId)) {
    response.sendStatus(404);
    return;
  }

  request.url = request.url.substring(thingId.length + 1);
  proxy.web(request, response, {target: proxies.get(thingId)});
});

module.exports = ProxyController;
