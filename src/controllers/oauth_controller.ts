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
import * as JSONWebToken from '../models/jsonwebtoken';
import * as Database from '../db';
import {Scope, ClientId, ClientRegistry} from '../oauth-types';
import OAuthClients from '../models/oauthclients';

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
  scope: Scope,
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
  scope: Scope
};

type AccessTokenError =
  'invalid_request' | 'invalid_client' | 'invalid_grant' |
  'unauthorized_client' | 'unsupported_grant_type' | 'invalid_scope';

type AccessTokenErrorResponse = ErrorResponse<AccessTokenError>;
type AccessTokenResponse = AccessTokenSuccessResponse|AccessTokenErrorResponse;

type RefreshTokenRequest = {
  grant_type: 'refresh_token',
  refresh_token: Token,
  scope: Scope
};

type RefreshTokenResponse = AccessTokenResponse;

function redirect(response: express.Response, baseURL: URL, params: {[key: string]: any}) {
  let url = new URL(baseURL.toString());
  for (let key in params) {
    if (!params.hasOwnProperty(key)) {
      continue;
    }
    url.searchParams.set(key, params[key].toString());
  }
  response.redirect(url.toString());
}

function verifyClient(request: OAuthRequest, response: express.Response):
  ClientRegistry|null {
  let client = OAuthClients.get(request.client_id);
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

function verifyClientAuthorization(client: ClientRegistry,
  request: express.Request, response: express.Response): boolean {
  let authorization = request.headers.authorization;
  if (typeof authorization !== 'string' || !authorization.startsWith('Basic ')) {
    let err: ErrorResponse<UnauthorizedClient> = {
      error: 'unauthorized_client',
      error_description: 'authorization header missing or malformed',
    };

    response.status(400).json(err);
    return false;
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
    return false;
  }

  let clientId = decodeURIComponent(parts[0]);
  let clientSecret = decodeURIComponent(parts[1]);

  if (client.id !== clientId || client.secret !== clientSecret) {
    let err: ErrorResponse<UnauthorizedClient> = {
      error: 'unauthorized_client',
      error_description: 'authorization header mismatch',
    };

    response.status(400).json(err);
    return false;
  }

  return true;
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

  if (authRequest.scope !== client.scope) {
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

  // TODO: prompt user for auth instead of always granting
  // TODO: use that user's UID instead of -1
  // TODO: should expire in 10 minutes
  // const {jwt} = request;
  // const tokenData = await Database.getJSONWebTokenByKeyId(jwt.kid);
  let code = await JSONWebToken.issueOAuthToken(client, 'authorization_code');

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
    handleAccessTokenRequest(request, response);
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

async function handleAccessTokenRequest(request: express.Request, response: express.Response) {
  const requestData = request.body;
  let tokenRequest: AccessTokenRequest = {
    grant_type: requestData.grant_type,
    code: requestData.code,
    redirect_uri: requestData.redirect_uri && new URL(requestData.redirect_uri),
    client_id: requestData.client_id
  };

  let client = verifyClient(tokenRequest, response);
  if (!client) {
    return;
  }

  if (!verifyClientAuthorization(client, request, response)) {
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

  let accessToken = await JSONWebToken.issueOAuthToken(client, 'access_token');
  // let refreshToken = await JSONWebToken.issueOAuthToken(client, 'refresh_token');

  let res: AccessTokenSuccessResponse = {
    access_token: accessToken,
    token_type: 'bearer',
    // refresh_token: refreshToken,
    scope: client.scope
  };

  response.json(res);
}

export default OAuthController;
