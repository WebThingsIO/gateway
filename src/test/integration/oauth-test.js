const express = require('express');
const e2p = require('event-to-promise');
const http = require('http');
const JSONWebToken = require('../../models/jsonwebtoken');
const simpleOAuth2 = require('simple-oauth2');
const URL = require('url').URL;
const qs = require('querystring');

const {server, chai, mockAdapter} = require('../common');
const Constants = require('../../constants');
const {
  TEST_USER,
  createUser,
  headerAuth,
} = require('../user');

const CLIENT_ID = 'test';
const CLIENT_SECRET = 'super secret';
const REQUEST_SCOPE = '/things:readwrite';
const REQUEST_STATE = 'somethingrandom';
const CLIENT_SERVER_PORT = 31338;

const TEST_THING = {
  id: 'test-1',
  type: 'onOffSwitch',
  title: 'kitchen',
  '@context': 'https://iot.mozilla.org/schemas',
  '@type': ['OnOffSwitch'],
  properties: {
    power: {
      '@type': 'OnOffProperty',
      type: 'boolean',
      value: false,
    },
  },
};

describe('oauth/', function() {
  let clientServer, oauth2, customCallbackHandler, userJWT;

  async function addDevice(desc = TEST_THING) {
    const {id} = desc;
    const res = await chai.request(server).keepOpen()
      .post(Constants.THINGS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(userJWT))
      .send(desc);
    await mockAdapter().addDevice(id, desc);
    return res;
  }

  beforeEach(async () => {
    userJWT = await createUser(server, TEST_USER);
  });


  beforeAll(async () => {
    const client = express();
    client.get('/auth', (req, res) => {
      res.redirect(oauth2.authorizationCode.authorizeURL({
        redirect_uri: `http://127.0.0.1:${CLIENT_SERVER_PORT}/callback`,
        scope: REQUEST_SCOPE,
        state: REQUEST_STATE,
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

      oauth2.authorizationCode.getToken({code: code}).then((result) => {
        const {token} = oauth2.accessToken.create(result);
        res.json({token});
      }).catch((err) => {
        res.status(400).json(err.data.payload);
      });
    });

    client.get('/bonus-entry', (req, res) => {
      if (customCallbackHandler) {
        customCallbackHandler(req, res);
        return;
      }

      const code = req.query.code;
      expect(code).toBeTruthy();
      expect(req.query.state).toEqual('somethingrandom');

      oauth2.authorizationCode.getToken({code: code}).then((result) => {
        const {token} = oauth2.accessToken.create(result);
        res.json(Object.assign({bonus: true}, {token}));
      }).catch((err) => {
        res.status(400).json(err.data.payload);
      });
    });

    clientServer = http.createServer();
    clientServer.on('request', client);
    clientServer.listen(CLIENT_SERVER_PORT);
    await e2p(clientServer, 'listening');
  });

  afterAll(async () => {
    clientServer.close();
    oauth2 = null;
    await e2p(clientServer, 'close');
    // eslint-disable-next-line require-atomic-updates
    clientServer = null;
  });

  function setupOAuth(configProvided, customCallbackHandlerProvided,
                      authorizationMethod = 'body') {
    if (!server.address()) {
      server.listen(0);
    }

    const config = Object.assign({
      client: {
        id: CLIENT_ID,
        secret: CLIENT_SECRET,
      },
      auth: {
        tokenHost: `https://127.0.0.1:${server.address().port}`,
      },
      options: {
        authorizationMethod,
      },
      http: {
        headers: {},
      },
    }, configProvided || {});

    oauth2 = simpleOAuth2.create(config);
    customCallbackHandler = customCallbackHandlerProvided;
  }

  it('performs simple authorization', async () => {
    setupOAuth();

    let res = await chai.request(clientServer).keepOpen()
      .get('/auth')
      .set('Accept', 'application/json');
    // expect that gateway is showing page for user to authorize
    expect(res.status).toEqual(200);

    // send the request that the page would send
    res = await chai.request(server).keepOpen()
      .get(`${Constants.OAUTH_PATH}/allow?${qs.stringify({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: REQUEST_SCOPE,
        state: REQUEST_STATE,
      })}`)
      .set('Accept', 'application/json')
      .set(...headerAuth(userJWT));

    const jwt = res.body.token.access_token;
    // Try using the access token
    res = await chai.request(server)
      .get(Constants.THINGS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);

    // Try using the access token on a forbidden path
    let err = await chai.request(server)
      .get(Constants.OAUTHCLIENTS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(err.status).toEqual(401);

    res = await chai.request(server)
      .get(Constants.OAUTHCLIENTS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(userJWT));
    expect(res.status).toEqual(200);
    expect(res.body.length).toEqual(1);
    expect(res.body[0].id).toEqual(CLIENT_ID);

    res = await chai.request(server)
      .delete(`${Constants.OAUTHCLIENTS_PATH}/${CLIENT_ID}`)
      .set('Accept', 'application/json')
      .set(...headerAuth(userJWT));
    expect(res.status).toEqual(204);

    res = await chai.request(server)
      .get(Constants.OAUTHCLIENTS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(userJWT));
    expect(res.status).toEqual(200);
    expect(res.body.length).toEqual(0);

    // Try using the access token now that it's revoked
    err = await chai.request(server)
      .get(Constants.THINGS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(err.status).toEqual(401);
  });

  it('fails authorization with an incorrect secret', async () => {
    setupOAuth({
      client: {
        id: CLIENT_ID,
        secret: 'not a super secret',
      },
    });

    const res = await chai.request(clientServer).keepOpen()
      .get('/auth')
      .set('Accept', 'application/json');
    // expect that gateway is showing page for user to authorize
    expect(res.status).toEqual(200);

    // send the request that the page would send
    const err = await chai.request(server).keepOpen()
      .get(`${Constants.OAUTH_PATH}/allow?${qs.stringify({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: REQUEST_SCOPE,
        state: REQUEST_STATE,
      })}`)
      .set('Accept', 'application/json')
      .set(...headerAuth(userJWT));

    expect(err.status).toEqual(400);
  });

  it('fails authorization with an unknown client', async () => {
    setupOAuth({
      client: {
        id: 'stranger',
        secret: CLIENT_SECRET,
      },
    });

    const err = await chai.request(clientServer)
      .get('/auth')
      .set('Accept', 'application/json');

    expect(err.status).toEqual(400);
  });

  it('rejects client credential authorization', async () => {
    setupOAuth();
    try {
      const result = await oauth2.clientCredentials.getToken({});
      expect(result).toBeFalsy();
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });

  it('rejects password credential authorization', async () => {
    setupOAuth();
    try {
      const result = await oauth2.ownerPassword.getToken({
        username: CLIENT_ID,
        password: CLIENT_SECRET,
      });
      expect(result).toBeFalsy();
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });

  it('rejects invalid scope', async () => {
    setupOAuth({}, function customCallbackHandler(req, res) {
      expect(req.query.error).toEqual('invalid_scope');
      res.status(400).json(req.query);
    });

    if (!clientServer.address()) {
      clientServer.listen(CLIENT_SERVER_PORT);
    }

    let oauthUrl = new URL(oauth2.authorizationCode.authorizeURL({
      redirect_uri: `http://127.0.0.1:${clientServer.address().port}/callback`,
      scope: 'potato',
      state: 'somethingrandom',
    }));

    oauthUrl = oauthUrl.pathname + oauthUrl.search;

    const err = await chai.request(server)
      .get(oauthUrl)
      .set('Accept', 'application/json');
    expect(err.status).toEqual(400);
  });

  it('rejects redirect_uri mismatch', async () => {
    let oauthUrl = new URL(oauth2.authorizationCode.authorizeURL({
      redirect_uri: `http://127.0.0.1:${clientServer.address().port}/rhubarb`,
      scope: 'readwrite',
      state: 'somethingrandom',
    }));

    oauthUrl = oauthUrl.pathname + oauthUrl.search;

    const err = await chai.request(server)
      .get(oauthUrl)
      .set('Accept', 'application/json');
    expect(err.status).toEqual(400);
    expect(err.body.error).toEqual('invalid_request');
  });

  it('allows secondary redirect_uri', async () => {
    setupOAuth();

    // send the request that the page would send
    let res = await chai.request(server).keepOpen()
      .get(`${Constants.OAUTH_PATH}/allow?${qs.stringify({
        response_type: 'code',
        client_id: CLIENT_ID,
        redirect_uri: `http://127.0.0.1:${clientServer.address().port}/bonus-entry`,
        scope: REQUEST_SCOPE,
        state: REQUEST_STATE,
      })}`)
      .set('Accept', 'application/json')
      .set(...headerAuth(userJWT));

    expect(res.body.bonus).toBeTruthy();

    const jwt = res.body.token.access_token;
    // Try using the access token
    res = await chai.request(server)
      .get(Constants.THINGS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
  });

  it('rejects user JWT in access token request', async () => {
    oauth2.authorizationCode.getToken({code: userJWT}).then((result) => {
      expect(result).toBeFalsy();
    }).catch((err) => {
      expect(err).toBeTruthy();
    });
  });

  it('rejects revoked JWT in access token request', async () => {
    setupOAuth({}, function customCallbackHandler(req, res) {
      const code = req.query.code;
      expect(code).toBeTruthy();
      expect(req.query.state).toEqual('somethingrandom');

      JSONWebToken.verifyJWT(code).then((token) => {
        return JSONWebToken.revokeToken(token.keyId);
      }).then(() => {
        return oauth2.authorizationCode.getToken({code: code});
      }).then((result) => {
        const token = oauth2.accessToken.create(result);
        res.json(token);
      }).catch((err) => {
        res.status(400).json(err.data.payload);
      });
    });

    const res = await chai.request(clientServer).keepOpen()
      .get('/auth')
      .set('Accept', 'application/json');

    // expect that gateway is showing page for user to authorize
    expect(res.status).toEqual(200);

    // send the request that the page would send
    const err = await chai.request(server)
      .get(`${Constants.OAUTH_PATH}/allow?${qs.stringify({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: REQUEST_SCOPE,
        state: REQUEST_STATE,
      })}`)
      .set('Accept', 'application/json')
      .set(...headerAuth(userJWT));

    expect(err.status).toEqual(400);
    expect(err.body.error).toEqual('invalid_grant');
  });

  it('restricts jwt scope and allows header authMethod', async () => {
    setupOAuth(null, null, 'header');
    await addDevice();

    // send the request that the page would send
    let res = await chai.request(server)
      .get(`${Constants.OAUTH_PATH}/allow?${qs.stringify({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: '/things/test-1:read',
        state: REQUEST_STATE,
      })}`)
      .set('Accept', 'application/json')
      .set(...headerAuth(userJWT));

    const jwt = res.body.token.access_token;
    res = await chai.request(server)
      .get(`${Constants.THINGS_PATH}/${TEST_THING.id}`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);

    res = await chai.request(server)
      .get(Constants.THINGS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(res.body.length).toEqual(1);
    expect(res.body[0].href).toEqual('/things/test-1');

    const err = await chai.request(server)
      .delete(`${Constants.THINGS_PATH}/${TEST_THING.id}`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(err.status).toEqual(401);
  });

  it('rejects use of authorization code as access token', async () => {
    setupOAuth({}, function customCallbackHandler(req, res) {
      const code = req.query.code;
      expect(code).toBeTruthy();
      expect(req.query.state).toEqual('somethingrandom');

      res.json(code);
    });

    const res = await chai.request(server)
      .get(`${Constants.OAUTH_PATH}/allow?${qs.stringify({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: '/things/test-1:read',
        state: REQUEST_STATE,
      })}`)
      .set('Accept', 'application/json')
      .set(...headerAuth(userJWT));

    const jwt = res.body;
    expect(jwt).toBeTruthy();

    const err = await chai.request(server)
      .get(Constants.THINGS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(err.status).toEqual(401);
  });
});

