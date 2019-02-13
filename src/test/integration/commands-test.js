'use strict';

/* Tell jshint about mocha globals, and  */
/* globals it */

const nock = require('nock');

const {waitForExpect} = require('../expect-utils');
const {server, chai, mockAdapter} = require('../common');

const {
  TEST_USER,
  createUser,
  headerAuth,
} = require('../user');

const CommandUtils = require('../../command-utils');
const Constants = require('../../constants');

const OAuthClients = require('../../models/oauthclients').default;
const JSONWebToken = require('../../models/jsonwebtoken');

const TEST_THING = {
  id: 'test-1',
  type: 'dimmableColorLight',
  name: 'kitchen',
  '@context': 'https://iot.mozilla.org/schemas',
  '@type': ['OnOffSwitch', 'Light', 'ColorControl'],
  properties: {
    power: {
      '@type': 'OnOffProperty',
      type: 'boolean',
      value: false,
    },
    rgb: {
      '@type': 'ColorProperty',
      type: 'string',
      value: '#ffffff',
    },
    temperature: {
      '@type': 'ColorTemperatureProperty',
      type: 'number',
      minimum: 2000,
      maximum: 6500,
      value: 3000,
      unit: 'kelvin',
    },
    brightness: {
      '@type': 'BrightnessProperty',
      type: 'number',
      minimum: 0,
      maximum: 100,
      value: 50,
      unit: 'percent',
    },
  },
};

describe('command/', function() {
  let jwt;
  beforeEach(async () => {
    jwt = await createUser(server, TEST_USER);
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

  async function getProperty(lightId, propName) {
    const res = await chai.request(server)
      .get(`${Constants.THINGS_PATH}/${lightId}/properties/${propName}`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    return res.body[propName];
  }

  it('should return 400 for POST with no text body', async () => {
    setupNock();
    const err = await chai.request(server)
      .post(Constants.COMMANDS_PATH)
      .set(...headerAuth(jwt))
      .set('Accept', 'application/json')
      .send();
    expect(err.status).toEqual(400);
  });

  it('should understand a command to turn a light on/off', async () => {
    await addDevice();
    setupNock();

    let res = await chai.request(server)
      .post(Constants.COMMANDS_PATH)
      .set(...headerAuth(jwt))
      .set('Accept', 'application/json')
      .send({text: 'turn on the kitchen light'});
    expect(res.status).toEqual(201);

    await waitForExpect(async () => {
      expect(await getProperty(TEST_THING.id, 'power')).toEqual(true);
    });

    res = await chai.request(server)
      .post(Constants.COMMANDS_PATH)
      .set(...headerAuth(jwt))
      .set('Accept', 'application/json')
      .send({text: 'turn the kitchen light off'});
    expect(res.status).toEqual(201);

    await waitForExpect(async () => {
      expect(await getProperty(TEST_THING.id, 'power')).toEqual(false);
    });
  });

  it('should understand a command to set light color', async () => {
    await addDevice();
    setupNock();

    const res = await chai.request(server)
      .post(Constants.COMMANDS_PATH)
      .set(...headerAuth(jwt))
      .set('Accept', 'application/json')
      .send({text: 'turn the kitchen light red'});
    expect(res.status).toEqual(201);

    await waitForExpect(async () => {
      expect(await getProperty(TEST_THING.id, 'rgb')).toEqual(
        CommandUtils.colors.red);
    });
  });

  it('should understand a command to set light color temperature', async () => {
    await addDevice();
    setupNock();

    let res = await chai.request(server)
      .post(Constants.COMMANDS_PATH)
      .set(...headerAuth(jwt))
      .set('Accept', 'application/json')
      .send({text: 'make the kitchen light warmer'});
    expect(res.status).toEqual(201);

    await waitForExpect(async () => {
      expect(await getProperty(TEST_THING.id, 'temperature')).toEqual(2900);
    });

    res = await chai.request(server)
      .post(Constants.COMMANDS_PATH)
      .set(...headerAuth(jwt))
      .set('Accept', 'application/json')
      .send({text: 'make the kitchen light cooler'});
    expect(res.status).toEqual(201);

    await waitForExpect(async () => {
      expect(await getProperty(TEST_THING.id, 'temperature')).toEqual(3000);
    });
  });

  it('should understand a command to dim/brighten light', async () => {
    await addDevice();
    setupNock();

    let res = await chai.request(server)
      .post(Constants.COMMANDS_PATH)
      .set(...headerAuth(jwt))
      .set('Accept', 'application/json')
      .send({text: 'brighten the kitchen light'});
    expect(res.status).toEqual(201);

    await waitForExpect(async () => {
      expect(await getProperty(TEST_THING.id, 'brightness')).toEqual(60);
    });

    res = await chai.request(server)
      .post(Constants.COMMANDS_PATH)
      .set(...headerAuth(jwt))
      .set('Accept', 'application/json')
      .send({text: 'dim the kitchen light'});
    expect(res.status).toEqual(201);

    await waitForExpect(async () => {
      expect(await getProperty(TEST_THING.id, 'brightness')).toEqual(50);
    });

    res = await chai.request(server)
      .post(Constants.COMMANDS_PATH)
      .set(...headerAuth(jwt))
      .set('Accept', 'application/json')
      .send({text: 'dim the kitchen light by thirty percent'});
    expect(res.status).toEqual(201);

    await waitForExpect(async () => {
      expect(await getProperty(TEST_THING.id, 'brightness')).toEqual(20);
    });

    res = await chai.request(server)
      .post(Constants.COMMANDS_PATH)
      .set(...headerAuth(jwt))
      .set('Accept', 'application/json')
      .send({text: 'brighten the kitchen light by fifty percent'});
    expect(res.status).toEqual(201);

    await waitForExpect(async () => {
      expect(await getProperty(TEST_THING.id, 'brightness')).toEqual(70);
    });

    res = await chai.request(server)
      .post(Constants.COMMANDS_PATH)
      .set(...headerAuth(jwt))
      .set('Accept', 'application/json')
      .send({text: 'set the kitchen light to forty three percent'});
    expect(res.status).toEqual(201);

    await waitForExpect(async () => {
      expect(await getProperty(TEST_THING.id, 'brightness')).toEqual(43);
    });
  });

  it('should return an error when a matching thing is not found', async () => {
    await addDevice();
    setupNock();

    const err = await chai.request(server)
      .post(Constants.COMMANDS_PATH)
      .set(...headerAuth(jwt))
      .set('Accept', 'application/json')
      .send({text: 'turn on the bathroom light'});

    expect(err.status).toEqual(400);
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
      .send({text: 'turn on the kitchen light'});
    expect(res.status).toEqual(201);

    await waitForExpect(async () => {
      expect(await getProperty(TEST_THING.id, 'power')).toEqual(true);
    });
  });
});
