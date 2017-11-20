const express = require('express');
const e2p = require('event-to-promise');
const http = require('http');
const JSONWebToken = require('../../models/jsonwebtoken');
const pFinal = require('../promise-final');
const simpleOAuth2 = require('simple-oauth2');
const URL = require('url').URL;

const {server, chai} = require('../common');
const Constants = require('../../constants');
const {
  TEST_USER,
  createUser,
  headerAuth,
} = require('../user');

describe('oauth/', function() {
  let clientServer, oauth2, customCallbackHandler;

  beforeAll(async () => {
    const client = express();
    const port = 31338;
    client.get('/auth', (req, res) => {
      res.redirect(oauth2.authorizationCode.authorizeURL({
        redirect_uri: `http://127.0.0.1:${port}/callback`,
        scope: 'readwrite',
        state: 'somethingrandom'
      }));
    });

    client.get('/callback', (req, res) => {
      if (customCallbackHandler) {
        customCallbackHandler(req, res);
        return;
      }

      const code = req.query.code;
      expect(code).toBeTruthy();
      expect(req.query.state).toEqual('somethingrandom');

      oauth2.authorizationCode.getToken({code: code}).then(result => {
        const token = oauth2.accessToken.create(result);
        res.json(token);
      }).catch(err => {
        res.status(400).json(err);
      });
    });

    clientServer = http.createServer();
    clientServer.on('request', client);
    clientServer.listen(port);
    await e2p(clientServer, 'listening')
  });

  afterAll(async () => {
    clientServer.close();
    oauth2 = null;
    await e2p(clientServer, 'close');
    clientServer = null;
  });

  function setupOAuth(configProvided, customCallbackHandlerProvided) {
    const config = Object.assign({
      client: {
        id: 'hello',
        secret: 'super secret'
      },
      auth: {
        tokenHost: 'https://127.0.0.1:' + server.address().port +
          Constants.OAUTH_PATH
      }
    }, configProvided || {});

    oauth2 = simpleOAuth2.create(config);
    customCallbackHandler = customCallbackHandlerProvided;
  }

  it('performs simple authorization', async () => {
    setupOAuth();

    let res = await chai.request(clientServer)
      .get('/auth')
      .set('Accept', 'application/json');

    expect(res.status).toEqual(200);
    let jwt = res.body.token.access_token;
    // Try using the access token
    res = await chai.request(server)
      .get(Constants.THINGS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
  });

  it('fails authorization with an incorrect secret', async () => {
    setupOAuth({
      client: {
        id: 'hello',
        secret: 'not a super secret'
      }
    });

    const err = await pFinal(chai.request(clientServer)
        .get('/auth')
        .set('Accept', 'application/json'));

    expect(err.response.status).toEqual(400);
  });

  it('fails authorization with an unknown client', async () => {
    setupOAuth({
      client: {
        id: 'stranger',
        secret: 'super secret'
      }
    });

    const err = await pFinal(chai.request(clientServer)
        .get('/auth')
        .set('Accept', 'application/json'));

    expect(err.response.status).toEqual(400);
  });

  it('rejects client credential authorization', async () => {
    setupOAuth();
    try {
      let result = await oauth2.clientCredentials.getToken({});
      expect(result).toBeFalsy();
    } catch(err) {
      expect(err).toBeTruthy();
    }
  });

  it('rejects password credential authorization', async () => {
    setupOAuth();
    try {
      let result = await oauth2.ownerPassword.getToken({
        username: 'hello',
        password: 'super secret'
      });
      expect(result).toBeFalsy();
    } catch(err) {
      expect(err).toBeTruthy();
    }
  });

  it('rejects invalid scope', async () => {
    setupOAuth({}, function customCallbackHandler(req, res) {
      expect(req.query.error).toEqual('invalid_scope');
      res.status(400).json(req.query);
    });

    let oauthUrl = new URL(oauth2.authorizationCode.authorizeURL({
      redirect_uri: `http://127.0.0.1:${clientServer.address().port}/callback`,
      scope: 'potato',
      state: 'somethingrandom'
    }));

    oauthUrl = oauthUrl.pathname + oauthUrl.search;

    const err = await pFinal(chai.request(server)
      .get(oauthUrl)
      .set('Accept', 'application/json'));
    expect(err.response.status).toEqual(400);
  });

  it('rejects redirect_uri mismatch', async () => {
    let oauthUrl = new URL(oauth2.authorizationCode.authorizeURL({
      redirect_uri: `http://127.0.0.1:${clientServer.address().port}/rhubarb`,
      scope: 'readwrite',
      state: 'somethingrandom'
    }));

    oauthUrl = oauthUrl.pathname + oauthUrl.search;

    const err = await pFinal(chai.request(server)
      .get(oauthUrl)
      .set('Accept', 'application/json'));
    expect(err.response.status).toEqual(400);
    expect(err.response.body.error).toEqual('invalid_request');
  });

  it('rejects access_token JWT in access token request', async () => {
    let code = await createUser(server, TEST_USER);
    oauth2.authorizationCode.getToken({code: code}).then(result => {
      expect(result).toBeFalsy();
    }).catch(err => {
      expect(err).toBeTruthy();
    });
  });

  it('rejects revoked JWT in access token request', async () => {
    setupOAuth({}, function customCallbackHandler(req, res) {
      const code = req.query.code;
      expect(code).toBeTruthy();
      expect(req.query.state).toEqual('somethingrandom');

      JSONWebToken.verifyJWT(code).then(token => {
        return JSONWebToken.revokeToken(token.keyId);
      }).then(() => {
        return oauth2.authorizationCode.getToken({code: code});
      }).then(result => {
        const token = oauth2.accessToken.create(result);
        res.json(token);
      }).catch(err => {
        res.status(400).json(err.context);
      });
    });

    let err = await pFinal(chai.request(clientServer)
      .get('/auth')
      .set('Accept', 'application/json'));

    expect(err.response.status).toEqual(400);
    expect(err.response.body.error).toEqual('invalid_grant');
  });
});

