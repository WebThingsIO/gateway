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
import { URL } from 'url';
import * as assert from 'assert';
const JSONWebToken = require('../models/jsonwebtoken');
const config = require('config');
import * as Database from '../db';
import {
  scopeValidSubset, Scope, ScopeAccess, ScopeRaw, ClientId, ClientRegistry
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
  redirect_uri: URL|undefined,
  state?: string
};

// https://tools.ietf.org/html/rfc6749#section-4.1.1
type AuthorizationRequest = {
  response_type: 'code', // no suppport or desire for implicit auth
  client_id: ClientId,
  redirect_uri: URL|undefined,
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
  state: string|undefined
};

type ErrorResponse<T> = {
  error: T,
  error_description?: string,
  error_uri?: URL,
  state?: string
};

type AuthorizationErrorResponse = ErrorResponse<AuthorizationError>;

type AuthorizationResponse =
  AuthorizationSuccessResponse|AuthorizationErrorResponse;

// https://tools.ietf.org/html/rfc6749#section-4.1.3
type AccessTokenRequest = {
  grant_type: 'authorization_code',
  code: AuthorizationCode,
  redirect_uri: URL|undefined,
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
type AccessTokenResponse = AccessTokenSuccessResponse|AccessTokenErrorResponse;

type RefreshTokenRequest = {
  grant_type: 'refresh_token',
  refresh_token: Token,
  scope: ScopeRaw
};

type RefreshTokenResponse = AccessTokenResponse;

function redirect(response: express.Response, baseURL: URL, params: {[key: string]: any}) {
  let url = new URL(baseURL.toString());
  for (let key in params) {
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
  let client = OAuthClients.get(request.client_id, request.redirect_uri);
  if (!client) {
    let err: ErrorResponse<UnauthorizedClient> = {
      error: 'unauthorized_client',
      error_description: 'client id unknown',
      state: request.state
    };

    response.status(400).json(err);
    return null;
  }

  if (!request.redirect_uri) {
    request.redirect_uri = client.redirect_uri;
  }

  if (request.redirect_uri!.toString() !== client.redirect_uri.toString()) {
    let err: ErrorResponse<InvalidRequest> = {
      error: 'invalid_request',
      error_description: 'mismatched redirect_uri',
      state: request.state
    };

    response.status(400).json(err);
    return null;
  }

  return client;
}

function extractClientInfo(request: express.Request, response: express.Response):
    {clientId: string, clientSecret: string}|undefined {
  let authorization = request.headers.authorization;
  if (!authorization) {
    if (!request.body.client_id) {
      return;
    }
    return {
      clientId: request.body.client_id,
      clientSecret: request.body.client_secret,
    };
  }

  if (typeof authorization !== 'string' || !authorization.startsWith('Basic ')) {
    let err: ErrorResponse<UnauthorizedClient> = {
      error: 'unauthorized_client',
      error_description: 'authorization header missing or malformed',
    };

    response.status(400).json(err);
    return;
  }

  let userPassB64 = authorization.substring('Basic '.length);
  let userPass = Buffer.from(userPassB64, 'base64').toString();

  let parts = userPass.split(':');
  if (parts.length !== 2) {
    let err: ErrorResponse<UnauthorizedClient> = {
      error: 'unauthorized_client',
      error_description: 'authorization header missing or malformed',
    };

    response.status(400).json(err);
    return;
  }

  return {
    clientId: decodeURIComponent(parts[0].replace(/\+/g, '%20')),
    clientSecret: decodeURIComponent(parts[1].replace(/\+/g, '%20')),
  };
}

function verifyAuthorizationRequest(authRequest: AuthorizationRequest,
                                    response: express.Response):
                                      ClientRegistry|undefined {
  let client = verifyClient(authRequest, response);
  if (!client) {
    return;
  }

  if (authRequest.response_type !== 'code') {
    let err: AuthorizationErrorResponse = {
      error: 'unsupported_response_type',
      state: authRequest.state
    };
    redirect(
      response,
      client.redirect_uri,
      err
    );
    return;
  }

  if (!scopeValidSubset(client.scope, authRequest.scope)) {
    let err: AuthorizationErrorResponse = {
      error: 'invalid_scope',
      error_description: 'client scope does not cover requested scope',
      state: authRequest.state
    };
    redirect(
      response,
      client.redirect_uri,
      err
    );
    return;
  }

  return client;
}

OAuthController.get('/authorize', async (request: express.Request, response: express.Response) => {
  // From query component construct
  let authRequest: AuthorizationRequest = {
    response_type: request.query.response_type,
    client_id: request.query.client_id,
    redirect_uri: request.query.redirect_uri && new URL(request.query.redirect_uri),
    scope: request.query.scope,
    state: request.query.state
  };

  let client = verifyAuthorizationRequest(authRequest, response);
  if (!client) {
    return;
  }

  response.render('authorize', {
    name: client.name,
    domain: client.redirect_uri.host,
    request: authRequest
  });
});

OAuthController.get('/local-token-service', async (request: express.Request, response: express.Response) => {
  let localClient: ClientRegistry = OAuthClients.get('local-token', undefined)!;
  let tokenRequest: AccessTokenRequest = {
    grant_type: 'authorization_code',
    code: request.query.code,
    redirect_uri: localClient.redirect_uri,
    client_id: localClient.id
  };
  request.body = tokenRequest;
  request.headers.authorization = 'Basic ' +
    new Buffer(localClient.id + ':' + localClient.secret).toString('base64');
  let token = await handleAccessTokenRequest(request, response);
  if (token) {
    response.render('local-token-service', {
      oauthPostToken: config.get('oauthPostToken'),
      token: token.access_token
    });
  }
});

OAuthController.get('/allow', auth, async (request: express.Request, response: express.Response) => {
  let authRequest: AuthorizationRequest = {
    response_type: request.query.response_type,
    client_id: request.query.client_id,
    redirect_uri: request.query.redirect_uri && new URL(request.query.redirect_uri),
    scope: request.query.scope,
    state: request.query.state
  };

  let client = verifyAuthorizationRequest(authRequest, response);
  if (!client) {
    return;
  }

  let jwt = (request as any).jwt;
  if (!jwt) {
    return;
  }

  if (!jwt.payload || jwt.payload.role !== 'user_token') {
    response.status(401).send('Authorization must come from user');
    return;
  }

  // TODO: should expire in 10 minutes
  let code = await JSONWebToken.issueOAuthToken(client, jwt.user, {
    role: 'authorization_code',
    scope: authRequest.scope
  });

  let success: AuthorizationSuccessResponse = {
    code: code,
    state: authRequest.state
  };

  redirect(
    response,
    client.redirect_uri,
    success
  );
});

OAuthController.post('/token', async (request: express.Request, response: express.Response) => {
  const requestData = request.body;
  if (requestData.grant_type === 'authorization_code') {
    let token = await handleAccessTokenRequest(request, response);
    if (token) {
      response.json(token);
    }
    return;
  }
  // if (requestData.grant_type === 'refresh_token') {
  //   handleRefreshTokenRequest(request, response);
  // }
  let err: AccessTokenErrorResponse = {
    error: 'unsupported_grant_type',
    state: requestData.state
  };
  response.status(400).json(err);
});

/**
 * Handles the request for an access token using an authorization code.
 * On error sends a 400 with a JSON reason.
 */
async function handleAccessTokenRequest(request: express.Request, response: express.Response):
    Promise<AccessTokenSuccessResponse|undefined> {
  const requestData = request.body;
  let reqClientInfo = extractClientInfo(request, response);
  if (!reqClientInfo) {
    let err: ErrorResponse<UnauthorizedClient> = {
      error: 'unauthorized_client',
      error_description: 'client info missing or malformed',
    };

    response.status(400).json(err);
    return;
  }

  let tokenRequest: AccessTokenRequest = {
    grant_type: requestData.grant_type,
    code: requestData.code,
    redirect_uri: requestData.redirect_uri && new URL(requestData.redirect_uri),
    client_id: reqClientInfo.clientId,
  };

  let client = verifyClient(tokenRequest, response);
  if (!client) {
    return;
  }

  if (client.id !== reqClientInfo.clientId ||
      client.secret !== reqClientInfo.clientSecret) {
    let err: ErrorResponse<UnauthorizedClient> = {
      error: 'unauthorized_client',
      error_description: 'client info mismatch',
    };

    response.status(400).json(err);
    return;
  }

  let tokenData = await JSONWebToken.verifyJWT(tokenRequest.code);
  if (!tokenData) {
    let err: AccessTokenErrorResponse = {
      error: 'invalid_grant',
      error_description: 'included JWT is invalid',
      state: request.body.state
    };

    response.status(400).json(err);
    return;
  }

  let payload = tokenData.payload;
  if (!payload || payload.role !== 'authorization_code' || payload.client_id !== client.id) {
    let err: AccessTokenErrorResponse = {
      error: 'invalid_grant',
      state: request.body.state
    };

    response.status(400).json(err);
    return;
  }

  let accessToken = await JSONWebToken.issueOAuthToken(client, tokenData.user, {
    role: Constants.ACCESS_TOKEN,
    scope: tokenData.payload.scope
  });

  // let refreshToken = await JSONWebToken.issueOAuthToken(client, 'refresh_token');

  let res: AccessTokenSuccessResponse = {
    access_token: accessToken,
    token_type: 'bearer',
    // refresh_token: refreshToken,
    scope: client.scope
  };

  return res;
}

export default OAuthController;
