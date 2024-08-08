/**
 * Well-Known Controller
 *
 * Handles HTTP requests to /.well-known
 */

import express from 'express';
import * as Constants from '../constants';
import Gateway from '../models/gateway';

function build(): express.Router {
  const controller = express.Router();

  /**
   * OAuth 2.0 Authorization Server Metadata (RFC 8414)
   * https://datatracker.ietf.org/doc/html/rfc8414
   */
  controller.get('/oauth-authorization-server', (request, response) => {
    const origin = `${request.protocol}://${request.headers.host}`;
    response.json({
      issuer: origin,
      authorization_endpoint: `${origin}${Constants.OAUTH_PATH}/authorize`,
      token_endpoint: `${origin}${Constants.OAUTH_PATH}/token`,
      response_types_supported: ['code'],
      // Only expose top-level scopes to unauthenticated clients
      scopes_supported: [Constants.THINGS_PATH, `${Constants.THINGS_PATH}:readwrite`],
    });
  });

  /**
   * WoT Thing Description Directory
   * https://www.w3.org/TR/wot-discovery/#exploration-directory
   */
  controller.get('/wot', (request, response) => {
    const host = request.headers.host;
    const secure = request.secure;

    // Get a Thing Description of the gateway
    const td = Gateway.getDescription(host, secure);

    // Add a link to root as the canonical URL of the Thing Description
    if (typeof td.links === 'undefined') {
      td.links = [];
    }
    td.links.push({
      rel: 'canonical',
      href: '/',
      type: 'application/td+json',
    });

    // Send the Thing Description in response
    response.set('Content-type', 'application/td+json');
    response.status(200).send(td);
  });

  return controller;
}

export default build;
