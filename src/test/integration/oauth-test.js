const express = require('express');
const e2p = require('event-to-promise');
const simpleOAuth2 = require('simple-oauth2');

const {server, chai} = require('../common');

describe('oauth/', function() {
  function setupOAuth() {
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

    return new Promise(resolve => {
      let server = client.listen(port, () => {
        resolve({
          client: client,
          clientServer: server
        });
      });
    });
  }

  it('performs simple authorization', async () => {
    const {client, clientServer} = await setupOAuth();
    const res = await chai.request(client)
      .get('/auth');
    console.log(res.body);
    clientServer.close();
    await e2p(clientServer, 'close');
  });
});

