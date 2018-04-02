'use strict';

/* Tell jshint about mocha globals, and  */
/* globals it */

const nock = require('nock');

const {server, chai, mockAdapter} = require('../common');

const {
  TEST_USER,
  createUser,
  headerAuth,
} = require('../user');

const Constants = require('../../constants');

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
    const gatewayHref = 'http://fake.host';
    commandParser.configure(gatewayHref, jwt);
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
    const resp = [{
      name: 'Kitchen',
      type: 'onOffSwitch',
      href: '/things/zwave-efbddb01-4',
      properties: {
        on: {
          type: 'boolean',
          href: '/things/zwave-efbddb01-4/properties/on',
        },
      },
      actions: {},
      events: {},
    }];
    nock('http://fake.host')
      .get('/things')
      .reply(200, resp);

    nock('http://fake.host')
      .put('/things/zwave-efbddb01-4/properties/on')
      .reply(200, resp);
    setupNock();

    const res = await addDevice();
    await chai.request(server)
      .post(Constants.COMMANDS_PATH)
      .set(...headerAuth(jwt))
      .set('Accept', 'application/json')
      .send({text: 'turn on the kitchen'});
    expect(res.status).toEqual(201);
  });

  it('should return and error when a matching thing is not found', async () => {
    const resp = [{
      name: 'Bathroom',
      type: 'onOffSwitch',
      href: '/things/zwave-efbddb01-4',
      properties: {
        on: {
          type: 'boolean',
          href: '/things/zwave-efbddb01-4/properties/on',
        },
      },
      actions: {},
      events: {},
    }];
    nock('http://fake.host')
      .get('/things')
      .reply(200, resp);
    setupNock();

    await addDevice();

    try {
      await chai.request(server)
        .post(Constants.COMMANDS_PATH)
        .set(...headerAuth(jwt))
        .set('Accept', 'application/json')
        .send({text: 'turn on the bathroom'});
      throw new Error('Should have failed to create new thing');
    } catch (err) {
      expect(err);
    }
  });
});
