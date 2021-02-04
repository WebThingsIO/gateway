/**
 * JWT authorization middleware.
 *
 * Contains logic to create a middleware which validates the presence of a JWT
 * token in either the header or query parameters (for websockets).
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import express from 'express';
import * as Constants from './constants';
import JSONWebToken from './models/jsonwebtoken';

const AUTH_TYPE = 'Bearer';

export interface WithJWT {
  jwt: JSONWebToken;
}

/**
 * Attempt to find the JWT in query parameters.
 *
 * @param {Request} req incoming http request.
 * @return {string|false} JWT string or false.
 */
export function extractJWTQS(req: express.Request): string | false {
  if (typeof req.query === 'object' && req.query.jwt) {
    return `${req.query.jwt}`;
  }
  return false;
}

/**
 *  Attempt to find the JWT in the Authorization header.
 *
 * @param {Request} req incoming http request.
 * @return {string|false} JWT string or false.
 */
export function extractJWTHeader(req: express.Request): string | false {
  const { authorization } = req.headers;
  if (!authorization) {
    return false;
  }
  const [type, sig] = authorization.split(' ');
  if (type !== AUTH_TYPE) {
    console.warn('JWT header extraction failed: invalid auth type');
    return false;
  }
  return sig;
}

/**
 * Authenticate the incoming call by checking it's JWT.
 *
 * TODO: User error messages.
 */
export async function authenticate(req: express.Request): Promise<JSONWebToken | null> {
  const sig = extractJWTHeader(req) || extractJWTQS(req);
  if (!sig) {
    return null;
  }
  return await JSONWebToken.verifyJWT(<string>sig);
}

export function scopeAllowsRequest(scope: string | undefined, request: express.Request): boolean {
  const requestPath = request.originalUrl;
  if (!scope) {
    return true;
  }
  const paths = scope.split(' ');
  for (let path of paths) {
    const parts = path.split(':');
    if (parts.length !== 2) {
      console.warn('Invalid scope', scope);
      return false;
    }
    const access = parts[1];
    const readwrite = access === Constants.READWRITE;
    path = parts[0];
    const allowedDirect = requestPath.startsWith(path);
    const allowedThings =
      requestPath === Constants.THINGS_PATH && path.startsWith(Constants.THINGS_PATH);
    // Allow access to media only if scope covers all things
    const allowedMedia =
      requestPath.startsWith(Constants.MEDIA_PATH) && path === Constants.THINGS_PATH;

    if (allowedDirect || allowedThings || allowedMedia) {
      if (!readwrite && request.method !== 'GET' && request.method !== 'OPTIONS') {
        return false;
      }
      return true;
    }
  }
  return false;
}

export function middleware(): express.Handler {
  return (req, res, next) => {
    authenticate(req)
      .then((jwt) => {
        if (!jwt) {
          res.status(401).end();
          return;
        }

        const payload = (<JSONWebToken>jwt).getPayload()!;
        let scope = payload!.scope;
        if (payload!.role === Constants.AUTHORIZATION_CODE) {
          scope = `${Constants.OAUTH_PATH}:${Constants.READWRITE}`;
        }
        if (!scopeAllowsRequest(scope, req)) {
          res.status(401).send(`Token of role ${payload.role} used out of scope: ${scope}`);
          return;
        }
        if (payload.role !== Constants.USER_TOKEN) {
          if (!payload.scope) {
            res.status(400).send('Token must contain scope');
            return;
          }
        }

        (<express.Request & WithJWT>req).jwt = jwt;
        next();
      })
      .catch((err) => {
        console.error('error running jwt middleware', err.stack);
        next(err);
      });
  };
}
