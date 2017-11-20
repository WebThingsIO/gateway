const express = require('express');
const e2p = require('event-to-promise');
const http = require('http');
const pFinal = require('../promise-final');
const simpleOAuth2 = require('simple-oauth2');

const {server, chai} = require('../common');
const Constants = require('../../constants');
const {headerAuth} = require('../user');

describe('oauth/', function() {
  let clientServer, oauth2;

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

  function setupOAuth(configProvided) {
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
});

