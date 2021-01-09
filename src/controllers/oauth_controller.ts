/**
 * OAuth Controller.
 *
 * Handles a simple OAuth2 flow with a hardcoded client
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as express from 'express';
import {URL} from 'url';
import JSONWebToken from '../models/jsonwebtoken';
const config = require('config');
import {
  scopeValidSubset, ScopeRaw, ClientId, ClientRegistry,
} from '../oauth-types';

import OAuthClients from '../models/oauthclients';
import * as jwtMiddleware from '../jwt-middleware';
import * as Constants from '../constants';

const auth = jwtMiddleware.middleware();

const OAuthController = express.Router();

type InvalidRequest = 'invalid_request';
type UnauthorizedClient = 'unauthorized_client';

type OAuthRequest = {
  client_id: ClientId,
  redirect_uri?: URL,
  state?: string
};

// https://tools.ietf.org/html/rfc6749#section-4.1.1
type AuthorizationRequest = {
  response_type: string,
  client_id: ClientId,
  redirect_uri?: URL,
  scope: ScopeRaw,
  state?: string
};

type AuthorizationCode = string;
type AuthorizationError =
  'invalid_request' | 'unauthorized_client' | 'access_denied' |
  'unsupported_response_type' | 'invalid_scope' | 'server_error' |
  'temporarily_unavailable';

type AuthorizationSuccessResponse = {
  code: AuthorizationCode,
  state?: string
};

type ErrorResponse<T> = {
  error: T,
  error_description?: string,
  error_uri?: URL,
  state?: string
};

type AuthorizationErrorResponse = ErrorResponse<AuthorizationError>;

// https://tools.ietf.org/html/rfc6749#section-4.1.3
type AccessTokenRequest = {
  grant_type: 'authorization_code',
  code: AuthorizationCode,
  redirect_uri?: URL,
  client_id: ClientId
};

type Token = string; // JWT

type AccessTokenSuccessResponse = {
  access_token: Token,
  token_type: 'bearer',
  expires_in?: number,
  refresh_token?: Token,
  scope: ScopeRaw
};

type AccessTokenError =
  'invalid_request' | 'invalid_client' | 'invalid_grant' |
  'unauthorized_client' | 'unsupported_grant_type' | 'invalid_scope';

type AccessTokenErrorResponse = ErrorResponse<AccessTokenError>;

function redirect(response: express.Response, baseURL: URL, params: {[key: string]: any}) {
  const url = new URL(baseURL.toString());
  for (const key in params) {
    if (!params.hasOwnProperty(key)) {
      continue;
    }
    if (typeof params[key] !== 'undefined') {
      url.searchParams.set(key, params[key].toString());
    }
  }
  if (url.hostname === 'gateway.localhost') {
    response.redirect(url.toString().replace(/^https:\/\/gateway\.localhost/, ''));
    return;
  }
  response.redirect(url.toString());
}

function verifyClient(request: OAuthRequest, response: express.Response):
ClientRegistry|null {
  const client = OAuthClients.get(request.client_id, request.redirect_uri);
  if (!client) {
    const err: ErrorResponse<UnauthorizedClient> = {
      error: 'unauthorized_client',
      error_description: 'client id unknown',
      state: request.state,
    };

    response.status(400).json(err);
    return null;
  }

  if (!request.redirect_uri) {
    request.redirect_uri = client.redirect_uri;
  }

  if (request.redirect_uri!.toString() !== client.redirect_uri.toString()) {
    const err: ErrorResponse<InvalidRequest> = {
      error: 'invalid_request',
      error_description: 'mismatched redirect_uri',
      state: request.state,
    };

    response.status(400).json(err);
    return null;
  }

  return client;
}

function extractClientInfo(request: express.Request, response: express.Response):
{clientId: string, clientSecret: string}|null {
  const authorization = request.headers.authorization;
  if (!authorization) {
    if (!request.body.client_id) {
      return null;
    }

    return {
      clientId: request.body.client_id,
      clientSecret: request.body.client_secret,
    };
  }

  if (typeof authorization !== 'string' || !authorization.startsWith('Basic ')) {
    const err: ErrorResponse<UnauthorizedClient> = {
      error: 'unauthorized_client',
      error_description: 'authorization header missing or malformed',
    };

    response.status(400).json(err);
    return null;
  }

  const userPassB64 = authorization.substring('Basic '.length);
  const userPass = Buffer.from(userPassB64, 'base64').toString();

  const parts = userPass.split(':');
  if (parts.length !== 2) {
    const err: ErrorResponse<UnauthorizedClient> = {
      error: 'unauthorized_client',
      error_description: 'authorization header missing or malformed',
    };

    response.status(400).json(err);
    return null;
  }

  return {
    clientId: decodeURIComponent(parts[0].replace(/\+/g, '%20')),
    clientSecret: decodeURIComponent(parts[1].replace(/\+/g, '%20')),
  };
}

function verifyAuthorizationRequest(authRequest: AuthorizationRequest, response: express.Response):
ClientRegistry|null {
  const client = verifyClient(authRequest, response);
  if (!client) {
    return null;
  }

  if (authRequest.response_type !== 'code') {
    const err: AuthorizationErrorResponse = {
      error: 'unsupported_response_type',
      state: authRequest.state,
    };
    redirect(
      response,
      client.redirect_uri,
      err
    );
    return null;
  }

  if (!scopeValidSubset(client.scope, authRequest.scope)) {
    const err: AuthorizationErrorResponse = {
      error: 'invalid_scope',
      error_description: 'client scope does not cover requested scope',
      state: authRequest.state,
    };
    redirect(
      response,
      client.redirect_uri,
      err
    );
    return null;
  }

  return client;
}

OAuthController.get('/authorize', async (request: express.Request, response: express.Response) => {
  let redirect_uri;
  if (request.query.redirect_uri) {
    redirect_uri = new URL(`${request.query.redirect_uri}`);
  }

  // From query component construct
  const authRequest: AuthorizationRequest = {
    response_type: `${request.query.response_type}`,
    client_id: `${request.query.client_id}`,
    redirect_uri: redirect_uri,
    scope: `${request.query.scope}`,
    state: `${request.query.state}`,
  };

  const client = verifyAuthorizationRequest(authRequest, response);
  if (!client) {
    return;
  }

  response.render('authorize', {
    name: client.name,
    domain: client.redirect_uri.host,
    request: authRequest,
  });
});

OAuthController.get(
  '/local-token-service',
  async (request: express.Request, response: express.Response) => {
    const localClient: ClientRegistry = OAuthClients.get('local-token')!;
    const tokenRequest: AccessTokenRequest = {
      grant_type: 'authorization_code',
      code: `${request.query.code}`,
      redirect_uri: localClient.redirect_uri,
      client_id: localClient.id,
    };
    request.body = tokenRequest;
    request.headers.authorization = `Basic ${
      Buffer.from(`${localClient.id}:${localClient.secret}`).toString('base64')}`;
    const token = await handleAccessTokenRequest(request, response);
    if (token) {
      response.render('local-token-service', {
        oauthPostToken: config.get('oauth.postToken'),
        token: token.access_token,
      });
    }
  }
);

OAuthController.get(
  '/allow',
  auth,
  async (request: express.Request, response: express.Response) => {
    let redirect_uri;
    if (request.query.redirect_uri) {
      redirect_uri = new URL(`${request.query.redirect_uri}`);
    }

    const authRequest: AuthorizationRequest = {
      response_type: `${request.query.response_type}`,
      client_id: `${request.query.client_id}`,
      redirect_uri: redirect_uri,
      scope: `${request.query.scope}`,
      state: `${request.query.state}`,
    };

    const client = verifyAuthorizationRequest(authRequest, response);
    if (!client) {
      return;
    }

    const jwt = (request as any).jwt;
    if (!jwt) {
      return;
    }

    if (!jwt.payload || jwt.payload.role !== 'user_token') {
      response.status(401).send('Authorization must come from user');
      return;
    }

    // TODO: should expire in 10 minutes
    const code = await JSONWebToken.issueOAuthToken(client, jwt.user, {
      role: 'authorization_code',
      scope: authRequest.scope,
    });

    const success: AuthorizationSuccessResponse = {
      code: code,
      state: authRequest.state,
    };

    redirect(
      response,
      client.redirect_uri,
      success
    );
  }
);

OAuthController.post('/token', async (request: express.Request, response: express.Response) => {
  const requestData = request.body;
  if (requestData.grant_type === 'authorization_code') {
    const token = await handleAccessTokenRequest(request, response);
    if (token) {
      response.json(token);
    }
    return;
  }
  // if (requestData.grant_type === 'refresh_token') {
  //   handleRefreshTokenRequest(request, response);
  // }
  const err: AccessTokenErrorResponse = {
    error: 'unsupported_grant_type',
    state: requestData.state,
  };
  response.status(400).json(err);
});

/**
 * Handles the request for an access token using an authorization code.
 * On error sends a 400 with a JSON reason.
 */
async function handleAccessTokenRequest(request: express.Request, response: express.Response):
Promise<AccessTokenSuccessResponse|null> {
  const requestData = request.body;
  const reqClientInfo = extractClientInfo(request, response);
  if (!reqClientInfo) {
    const err: ErrorResponse<UnauthorizedClient> = {
      error: 'unauthorized_client',
      error_description: 'client info missing or malformed',
    };

    response.status(400).json(err);
    return null;
  }

  const tokenRequest: AccessTokenRequest = {
    grant_type: requestData.grant_type,
    code: requestData.code,
    redirect_uri: requestData.redirect_uri && new URL(requestData.redirect_uri),
    client_id: reqClientInfo.clientId,
  };

  const client = verifyClient(tokenRequest, response);
  if (!client) {
    return null;
  }

  if (client.id !== reqClientInfo.clientId ||
      client.secret !== reqClientInfo.clientSecret) {
    const err: ErrorResponse<UnauthorizedClient> = {
      error: 'unauthorized_client',
      error_description: 'client info mismatch',
    };

    response.status(400).json(err);
    return null;
  }

  let tokenData = await JSONWebToken.verifyJWT(tokenRequest.code);
  if (!tokenData) {
    const err: AccessTokenErrorResponse = {
      error: 'invalid_grant',
      error_description: 'included JWT is invalid',
      state: request.body.state,
    };

    response.status(400).json(err);
    return null;
  }

  tokenData = <JSONWebToken>tokenData;
  const payload = tokenData.getPayload();
  if (!payload || payload.role !== 'authorization_code' || payload.client_id !== client.id) {
    const err: AccessTokenErrorResponse = {
      error: 'invalid_grant',
      state: request.body.state,
    };

    response.status(400).json(err);
    return null;
  }

  const accessToken = await JSONWebToken.issueOAuthToken(client, tokenData.getUser(), {
    role: Constants.ACCESS_TOKEN,
    scope: payload.scope,
  });

  // let refreshToken = await JSONWebToken.issueOAuthToken(client, 'refresh_token');

  const res: AccessTokenSuccessResponse = {
    access_token: accessToken,
    token_type: 'bearer',
    // refresh_token: refreshToken,
    scope: client.scope,
  };

  return res;
}

export default OAuthController;
