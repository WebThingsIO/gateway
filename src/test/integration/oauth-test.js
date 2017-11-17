const express = require('express');
const e2p = require('event-to-promise');
const http = require('http');
const simpleOAuth2 = require('simple-oauth2');

const {server, chai} = require('../common');

describe('oauth/', function() {
  async function setupOAuth() {
    const config = {
      client: {
        id: 'hello',
        secret: 'super secret'
      },
      auth: {
        tokenHost: 'https://127.0.0.1:' + server.address().port
      }
    };

    const oauth2 = simpleOAuth2.create(config);

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

      oauth2.authorizationCode.getToken({code: code}, (err, result) => {
        expect(err).toBeFalsy();
        const token = oauth2.accessToken.create(result);
        res.json(token);
      });
    });

    let clientServer = http.createServer();
    clientServer.on('request', client);
    clientServer.listen(port);
    await e2p(clientServer, 'listening')
    return clientServer;
  }

  it('performs simple authorization', async () => {
    const clientServer = await setupOAuth();
    const res = await chai.request(clientServer)
      .get('/auth');
    console.log(res.body);
    clientServer.close();
    await e2p(clientServer, 'close');
  });
});

