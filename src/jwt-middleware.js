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
const Constants = require('./constants');
const JSONWebToken = require('./models/jsonwebtoken');

const AUTH_TYPE = 'Bearer';

/**
 * Attempt to find the JWT in query parameters.
 *
 * @param {Request} req incoming http request.
 * @return {string|false} JWT string or false.
 */
function extractJWTQS(req) {
  if (typeof req.query === 'object' && req.query.jwt) {
    return req.query.jwt;
  }
  return false;
}

/**
 *  Attempt to find the JWT in the Authorization header.
 *
 * @param {Request} req incoming http request.
 * @return {string|false} JWT string or false.
 */
function extractJWTHeader(req) {
  const {authorization} = req.headers;
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
async function authenticate(req) {
  const sig = extractJWTHeader(req) || extractJWTQS(req);
  if (!sig) {
    return false;
  }
  return await JSONWebToken.verifyJWT(sig);
}

function scopeAllowsRequest(scope, request) {
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
    if (requestPath.startsWith(path) || path.startsWith(requestPath)) {
      if (!readwrite && request.method !== 'GET' &&
          request.method !== 'OPTIONS') {
        return false;
      }
      return true;
    }
  }
  return false;
}

function middleware() {
  return (req, res, next) => {
    authenticate(req, res).
      then((jwt) => {
        if (!jwt) {
          res.status(401).end();
          return;
        }
        let scope = jwt.payload.scope;
        if (jwt.payload.role === Constants.AUTHORIZATION_CODE) {
          scope = `${Constants.OAUTH_PATH}:${Constants.READWRITE}`;
        }
        if (!scopeAllowsRequest(scope, req)) {
          res.status(401).send(
            `Token of role ${jwt.payload.role} used out of scope: ${scope}`);
          return;
        }
        if (jwt.payload.role !== Constants.USER_TOKEN) {
          if (!jwt.payload.scope) {
            res.status(400)
              .send('Token must contain scope');
            return;
          }
        }

        req.jwt = jwt;
        next();
      }).
      catch((err) => {
        console.error('error running jwt middleware', err.stack);
        next(err);
      });
  };
}

module.exports = {
  middleware,
  authenticate,
  extractJWTQS,
  extractJWTHeader,
};
