/**
 * Well-Known Controller
 *
 * Handles HTTP requests to /.well-known
 */

import express from 'express';
import * as Constants from '../constants';

function build(): express.Router {
  const controller = express.Router();

  /**
   * OAuth 2.0 Authorization Server Metadata (RFC 8414)
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

  return controller;
}

export default build;
