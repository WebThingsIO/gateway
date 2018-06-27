'use strict';

/* Tell jshint about mocha globals, and  */
/* globals it */

const nock = require('nock');

const pFinal = require('../promise-final');
const {waitForExpect} = require('../expect-utils');
const {server, chai, mockAdapter} = require('../common');

const {
  TEST_USER,
  createUser,
  headerAuth,
} = require('../user');

const Constants = require('../../constants');

const OAuthClients = require('../../models/oauthclients').default;
const JSONWebToken = require('../../models/jsonwebtoken');

const TEST_THING = {
  id: 'test-1',
  type: 'onOffSwitch',
  name: 'kitchen',
  properties: {
    on: {type: 'boolean', value: false},
  },
};

describe('command/', function() {
  let jwt;
  beforeEach(async () => {
    jwt = await createUser(server, TEST_USER);

    const commandParser = require('../../controllers/commands_controller.js');
    const gatewayHref = `https://localhost:${server.address().port}`;
    commandParser.configure(gatewayHref);
  });

  function setupNock() {
    const apiResp = {
      result: {
        action: 'iot',
        parameters: {
          onoff: 'on',
          rooms: 'kitchen',
        },
      },
      status: {
        code: 200,
        errorType: 'success',
      },
    };

    nock('https://api.api.ai')
      .post('/api/query')
      .reply(200, apiResp);
  }

  async function addDevice(desc = TEST_THING) {
    const {id} = desc;
    const res = await chai.request(server)
      .post(Constants.THINGS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send(desc);
    await mockAdapter().addDevice(id, desc);
    return res;
  }

  async function getOn(lightId) {
    const res = await chai.request(server)
      .get(`${Constants.THINGS_PATH}/${lightId}/properties/on`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    return res.body.on;
  }

  it('should return 400 for POST with no text body', async () => {
    setupNock();
    try {
      await chai.request(server)
        .post(Constants.COMMANDS_PATH)
        .set(...headerAuth(jwt))
        .set('Accept', 'application/json')
        .send();
      throw new Error('Should have failed to create new thing');
    } catch (err) {
      expect(err.response.status).toEqual(400);
    }
  });

  it('should understand a command to turn on a light', async () => {
    await addDevice();
    setupNock();

    const res = await chai.request(server)
      .post(Constants.COMMANDS_PATH)
      .set(...headerAuth(jwt))
      .set('Accept', 'application/json')
      .send({text: 'turn on the kitchen'});
    expect(res.status).toEqual(201);

    await waitForExpect(async () => {
      expect(await getOn(TEST_THING.id)).toEqual(true);
    });
  });

  it('should return an error when a matching thing is not found', async () => {
    await addDevice();
    setupNock();

    const err = await pFinal(chai.request(server)
      .post(Constants.COMMANDS_PATH)
      .set(...headerAuth(jwt))
      .set('Accept', 'application/json')
      .send({text: 'turn on the bathroom'}));

    expect(err.response.status).toEqual(404);
  });

  it('should support an OAuth-issued JWT', async () => {
    await addDevice();
    setupNock();

    const testClient = OAuthClients.get('test');
    const accessToken = await JSONWebToken.issueOAuthToken(testClient, -1, {
      role: Constants.ACCESS_TOKEN,
      scope: '/things:readwrite',
    });

    const res = await chai.request(server)
      .post(Constants.COMMANDS_PATH)
      .set(...headerAuth(accessToken))
      .set('Accept', 'application/json')
      .send({text: 'turn on the kitchen'});
    expect(res.status).toEqual(201);

    await waitForExpect(async () => {
      expect(await getOn(TEST_THING.id)).toEqual(true);
    });
  });
});
