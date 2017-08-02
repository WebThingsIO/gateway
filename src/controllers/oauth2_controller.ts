/**
 * OAuth2 Controller.
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
import JSONWebToken from '../models/jsonwebtoken';
import Database from '../db';

const OAuth2Controller = express.Router();

type ClientId = string;

class ClientRegistry {
  constructor(public redirect_uri: URL, public id: ClientId, public scope: Scope) {
  }
}

type Scope = 'readwrite';

type InvalidRequest = 'invalid_request';
type UnauthorizedClient = 'unauthorized_client';

type OAuth2Request = {
  client_id: ClientId,
  redirect_uri: URL|undefined,
  state?: string
};

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

type AccessTokenRequest = {
  grant_type: 'authorization_code',
  code: AuthorizationCode,
  redirect_uri: URL,
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

const OAuth2Clients = new Map();
OAuth2Clients.set('hello',
                  new ClientRegistry(new URL('http://localhost:8080/'), 'hello', 'readwrite'));

function redirect(response: express.Response, url: URL, params: {[key: string]: any}) {
  for (let key in params) {
    if (!params.hasOwnProperty(key)) {
      continue;
    }
    url.searchParams.set(key, params[key].toString());
  }
  response.redirect(url.toString());
}

function verifyClient(request: OAuth2Request, response: express.Response): ClientRegistry|null {
  let client = OAuth2Clients.get(request.client_id);
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

  if (request.redirect_uri !== client.redirect_uri) {
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

OAuth2Controller.get('/authorization', async (request: express.Request, response: express.Response) => {
  // From query component construct
  let authRequest: AuthorizationRequest = {
    response_type: request.params.response_type,
    client_id: request.params.client_id,
    redirect_uri: request.params.redirect_uri,
    scope: request.params.scope,
    state: request.params.state
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

OAuth2Controller.post('/token', async (request: express.Request, response: express.Response) => {

  if (request.params.grant_type === 'authorization_code') {
    handleAccessTokenRequest(request, response);
  } else if (request.params.grant_type === 'refresh_token') {
    handleAccessTokenRequest(request, response);
    // handleRefreshTokenRequest(request, response);
  }
});

async function handleAccessTokenRequest(request: express.Request, response: express.Response) {
  let tokenRequest: AccessTokenRequest = {
    grant_type: request.params.grant_type,
    code: request.params.code,
    redirect_uri: request.params.redirect_uri,
    client_id: request.params.client_id
  };

  let client = verifyClient(tokenRequest, response);
  if (!client) {
    return;
  }

  let tokenData = await JSONWebToken.verifyJWT(tokenRequest.code);
  if (!tokenData || tokenData.role !== 'authorization_code' || tokenData.client_id !== client.id) {
    let err: AccessTokenErrorResponse = {
      error: 'invalid_grant',
      state: request.params.state
    };

    redirect(
      response,
      request.params.redirect_uri,
      err
    );
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

async function handleRefreshTokenRequest(request: express.Request, response: express.Response) {
  let tokenRequest: RefreshTokenRequest = {
    grant_type: request.params.grant_type,
    refresh_token: request.params.refresh_token,
    scope: request.params.scope
  };

  // Issue things the same way as in the accesstokenrequest code
}

