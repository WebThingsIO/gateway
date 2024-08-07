import express from 'express';
import e2p from 'event-to-promise';
import http from 'http';
import JSONWebToken from '../../models/jsonwebtoken';
import * as simpleOAuth2 from 'simple-oauth2';
import { URL } from 'url';
import qs from 'querystring';
import { server, chai, mockAdapter } from '../common';
import * as Constants from '../../constants';
import { TEST_USER, createUser, headerAuth } from '../user';
import { AddressInfo } from 'net';

const CLIENT_ID = 'test';
const CLIENT_SECRET = 'super secret';
const REQUEST_SCOPE = '/things:readwrite';
const REQUEST_STATE = 'somethingrandom';
const CLIENT_SERVER_PORT = 31338;

const TEST_THING = {
  id: 'test-1',
  title: 'kitchen',
  '@context': ['https://www.w3.org/2022/wot/td/v1.1', 'https://webthings.io/schemas'],
  '@type': ['OnOffSwitch'],
  properties: {
    power: {
      '@type': 'OnOffProperty',
      type: 'boolean',
      value: false,
    },
  },
};

describe('oauth/', function () {
  let clientServer: http.Server | null;
  let oauth2: simpleOAuth2.OAuthClient | null;
  let customCallbackHandler: ((req: express.Request, res: express.Response) => void) | null;
  let userJWT: string;

  async function addDevice(desc = TEST_THING): Promise<ChaiHttp.Response> {
    const { id } = desc;
    const res = await chai
      .request(server)
      .keepOpen()
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
    client.get('/auth', (_req, res) => {
      res.redirect(
        oauth2!.authorizationCode.authorizeURL({
          redirect_uri: `http://127.0.0.1:${CLIENT_SERVER_PORT}/callback`,
          scope: REQUEST_SCOPE,
          state: REQUEST_STATE,
        })
      );
    });

    client.get('/callback', (req, res) => {
      if (customCallbackHandler) {
        customCallbackHandler(req, res);
        return;
      }

      const code = req.query.code;
      expect(code).toBeTruthy();
      expect(req.query.state).toEqual('somethingrandom');

      oauth2!.authorizationCode
        .getToken({
          code: `${code!}`,
          redirect_uri: `http://127.0.0.1:${CLIENT_SERVER_PORT}/callback`,
        })
        .then((result) => {
          const { token } = oauth2!.accessToken.create(result);
          res.json({ token });
        })
        .catch((err) => {
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

      oauth2!.authorizationCode
        .getToken({
          code: `${code!}`,
          redirect_uri: `http://127.0.0.1:${CLIENT_SERVER_PORT}/callback`,
        })
        .then((result) => {
          const { token } = oauth2!.accessToken.create(result);
          res.json(Object.assign({ bonus: true }, { token }));
        })
        .catch((err) => {
          res.status(400).json(err.data.payload);
        });
    });

    clientServer = http.createServer();
    clientServer.on('request', client);
    clientServer.listen(CLIENT_SERVER_PORT);
    await e2p(clientServer, 'listening');
  });

  afterAll(async () => {
    if (clientServer) {
      clientServer.close();
      await e2p(clientServer, 'close');
      // eslint-disable-next-line require-atomic-updates
      clientServer = null;
    }

    oauth2 = null;
  });

  function setupOAuth(
    configProvided?: Partial<simpleOAuth2.ModuleOptions> | null,
    customCallbackHandlerProvided?: ((req: express.Request, res: express.Response) => void) | null,
    authorizationMethod = 'body'
  ): void {
    if (!server.address()) {
      server.listen(0);
    }

    const config = Object.assign(
      {
        client: {
          id: CLIENT_ID,
          secret: CLIENT_SECRET,
        },
        auth: {
          tokenHost: `https://127.0.0.1:${(<AddressInfo>server.address()!).port}`,
        },
        options: {
          authorizationMethod,
        },
        http: {
          headers: {},
        },
      },
      configProvided || {}
    );

    oauth2 = simpleOAuth2.create(config);
    customCallbackHandler = customCallbackHandlerProvided || null;
  }

  it('rejects request with no JWT', async () => {
    setupOAuth();

    // Try using the access token
    const res = await chai
      .request(server)
      .get(Constants.THINGS_PATH)
      .set('Accept', 'application/json');
    expect(res.status).toEqual(401);
    expect(res.header).toHaveProperty('www-authenticate');
    expect(res.get('WWW-Authenticate')).toEqual('Bearer');
  });

  it('performs simple authorization', async () => {
    setupOAuth();

    let res = await chai
      .request(clientServer)
      .keepOpen()
      .get('/auth')
      .set('Accept', 'application/json');
    // expect that gateway is showing page for user to authorize
    expect(res.status).toEqual(200);

    // send the request that the page would send
    res = await chai
      .request(server)
      .keepOpen()
      .get(
        `${Constants.OAUTH_PATH}/allow?${qs.stringify({
          response_type: 'code',
          client_id: CLIENT_ID,
          scope: REQUEST_SCOPE,
          state: REQUEST_STATE,
        })}`
      )
      .set('Accept', 'application/json')
      .set(...headerAuth(userJWT));

    const jwt = res.body.token.access_token;
    // Try using the access token
    res = await chai
      .request(server)
      .get(Constants.THINGS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);

    // Try using the access token on a forbidden path
    let err = await chai
      .request(server)
      .get(Constants.OAUTHCLIENTS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(err.status).toEqual(403);
    expect(err.header).toHaveProperty('www-authenticate');
    expect(err.get('www-authenticate')).toEqual(expect.stringContaining('insufficient_scope'));

    res = await chai
      .request(server)
      .get(Constants.OAUTHCLIENTS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(userJWT));
    expect(res.status).toEqual(200);
    expect(res.body.length).toEqual(1);
    expect(res.body[0].id).toEqual(CLIENT_ID);

    res = await chai
      .request(server)
      .delete(`${Constants.OAUTHCLIENTS_PATH}/${CLIENT_ID}`)
      .set('Accept', 'application/json')
      .set(...headerAuth(userJWT));
    expect(res.status).toEqual(204);

    res = await chai
      .request(server)
      .get(Constants.OAUTHCLIENTS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(userJWT));
    expect(res.status).toEqual(200);
    expect(res.body.length).toEqual(0);

    // Try using the access token now that it's revoked
    err = await chai
      .request(server)
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

    const res = await chai
      .request(clientServer)
      .keepOpen()
      .get('/auth')
      .set('Accept', 'application/json');
    // expect that gateway is showing page for user to authorize
    expect(res.status).toEqual(200);

    // send the request that the page would send
    const err = await chai
      .request(server)
      .keepOpen()
      .get(
        `${Constants.OAUTH_PATH}/allow?${qs.stringify({
          response_type: 'code',
          client_id: CLIENT_ID,
          scope: REQUEST_SCOPE,
          state: REQUEST_STATE,
        })}`
      )
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

    const err = await chai.request(clientServer).get('/auth').set('Accept', 'application/json');

    expect(err.status).toEqual(400);
  });

  it('rejects client credential authorization', async () => {
    setupOAuth();
    try {
      const result = await oauth2!.clientCredentials.getToken({});
      expect(result).toBeFalsy();
    } catch (err) {
      expect(err).toBeTruthy();
    }
  });

  it('rejects password credential authorization', async () => {
    setupOAuth();
    try {
      const result = await oauth2!.ownerPassword.getToken({
        username: CLIENT_ID,
        password: CLIENT_SECRET,
        scope: REQUEST_SCOPE,
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

    if (!clientServer!.address()) {
      clientServer!.listen(CLIENT_SERVER_PORT);
    }

    const oauthUrl = new URL(
      oauth2!.authorizationCode.authorizeURL({
        redirect_uri: `http://127.0.0.1:${(<AddressInfo>clientServer!.address()!).port}/callback`,
        scope: 'potato',
        state: 'somethingrandom',
      })
    );

    const url = oauthUrl.pathname + oauthUrl.search;

    const err = await chai.request(server).get(url).set('Accept', 'application/json');
    expect(err.status).toEqual(400);
  });

  it('rejects redirect_uri mismatch', async () => {
    const oauthUrl = new URL(
      oauth2!.authorizationCode.authorizeURL({
        redirect_uri: `http://127.0.0.1:${(<AddressInfo>clientServer!.address()!).port}/rhubarb`,
        scope: 'readwrite',
        state: 'somethingrandom',
      })
    );

    const url = oauthUrl.pathname + oauthUrl.search;

    const err = await chai.request(server).get(url).set('Accept', 'application/json');
    expect(err.status).toEqual(400);
    expect(err.body.error).toEqual('invalid_request');
  });

  it('allows secondary redirect_uri', async () => {
    setupOAuth();

    // send the request that the page would send
    let res = await chai
      .request(server)
      .keepOpen()
      .get(
        `${Constants.OAUTH_PATH}/allow?${qs.stringify({
          response_type: 'code',
          client_id: CLIENT_ID,
          redirect_uri: `http://127.0.0.1:${
            (<AddressInfo>clientServer!.address()!).port
          }/bonus-entry`,
          scope: REQUEST_SCOPE,
          state: REQUEST_STATE,
        })}`
      )
      .set('Accept', 'application/json')
      .set(...headerAuth(userJWT));

    expect(res.body.bonus).toBeTruthy();

    const jwt = res.body.token.access_token;
    // Try using the access token
    res = await chai
      .request(server)
      .get(Constants.THINGS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
  });

  it('rejects user JWT in access token request', async () => {
    oauth2!.authorizationCode
      .getToken({
        code: userJWT,
        redirect_uri: `http://127.0.0.1:${CLIENT_SERVER_PORT}/callback`,
      })
      .then((result) => {
        expect(result).toBeFalsy();
      })
      .catch((err) => {
        expect(err).toBeTruthy();
      });
  });

  it('rejects revoked JWT in access token request', async () => {
    setupOAuth({}, function customCallbackHandler(req: express.Request, res: express.Response) {
      const code = req.query.code;
      expect(code).toBeTruthy();
      expect(req.query.state).toEqual('somethingrandom');

      JSONWebToken.verifyJWT(`${code!}`)
        .then((token) => {
          return JSONWebToken.revokeToken(token!.getKeyId());
        })
        .then(() => {
          return oauth2!.authorizationCode.getToken({
            code: `${code!}`,
            redirect_uri: `http://127.0.0.1:${CLIENT_SERVER_PORT}/callback`,
          });
        })
        .then((result) => {
          const token = oauth2!.accessToken.create(result);
          res.json(token);
        })
        .catch((err) => {
          res.status(400).json(err.data.payload);
        });
    });

    const res = await chai
      .request(clientServer)
      .keepOpen()
      .get('/auth')
      .set('Accept', 'application/json');

    // expect that gateway is showing page for user to authorize
    expect(res.status).toEqual(200);

    // send the request that the page would send
    const err = await chai
      .request(server)
      .get(
        `${Constants.OAUTH_PATH}/allow?${qs.stringify({
          response_type: 'code',
          client_id: CLIENT_ID,
          scope: REQUEST_SCOPE,
          state: REQUEST_STATE,
        })}`
      )
      .set('Accept', 'application/json')
      .set(...headerAuth(userJWT));

    expect(err.status).toEqual(400);
    expect(err.body.error).toEqual('invalid_grant');
  });

  it('restricts jwt scope and allows header authMethod', async () => {
    setupOAuth(null, null, 'header');
    await addDevice();

    // send the request that the page would send
    let res = await chai
      .request(server)
      .get(
        `${Constants.OAUTH_PATH}/allow?${qs.stringify({
          response_type: 'code',
          client_id: CLIENT_ID,
          scope: '/things/test-1:read',
          state: REQUEST_STATE,
        })}`
      )
      .set('Accept', 'application/json')
      .set(...headerAuth(userJWT));

    const jwt = res.body.token.access_token;
    res = await chai
      .request(server)
      .get(`${Constants.THINGS_PATH}/${TEST_THING.id}`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);

    res = await chai
      .request(server)
      .get(Constants.THINGS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(res.body.length).toEqual(1);
    expect(res.body[0].href).toEqual('/things/test-1');

    const err = await chai
      .request(server)
      .delete(`${Constants.THINGS_PATH}/${TEST_THING.id}`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(err.status).toEqual(403);
    expect(err.header).toHaveProperty('www-authenticate');
    expect(err.get('www-authenticate')).toEqual(expect.stringContaining('insufficient_scope'));
  });

  it('rejects use of authorization code as access token', async () => {
    setupOAuth({}, function customCallbackHandler(req: express.Request, res: express.Response) {
      const code = req.query.code;
      expect(code).toBeTruthy();
      expect(req.query.state).toEqual('somethingrandom');

      res.json(code);
    });

    const res = await chai
      .request(server)
      .get(
        `${Constants.OAUTH_PATH}/allow?${qs.stringify({
          response_type: 'code',
          client_id: CLIENT_ID,
          scope: '/things/test-1:read',
          state: REQUEST_STATE,
        })}`
      )
      .set('Accept', 'application/json')
      .set(...headerAuth(userJWT));

    const jwt = res.body;
    expect(jwt).toBeTruthy();

    const err = await chai
      .request(server)
      .get(Constants.THINGS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(err.status).toEqual(403);
    expect(err.header).toHaveProperty('www-authenticate');
    expect(err.get('www-authenticate')).toEqual(expect.stringContaining('insufficient_scope'));
  });
});
