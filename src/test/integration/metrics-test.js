'use strict';

/* Tell jshint about mocha globals, and  */
/* globals it */

const {server, chai, mockAdapter} = require('../common');
const {
  TEST_USER,
  createUser,
  headerAuth,
} = require('../user');

const Constants = require('../../constants');

const thingLight1 = {
  id: 'light1',
  name: 'light1',
  type: 'onOffSwitch',
  '@context': 'https://iot.mozilla.org/schemas',
  '@type': ['OnOffSwitch'],
  properties: {
    on: {
      '@type': 'OnOffProperty',
      type: 'boolean',
      value: false,
    },
    color: {
      '@type': 'ColorProperty',
      type: 'string',
      value: '#ff7700',
    },
    brightness: {
      '@type': 'BrightnessProperty',
      type: 'number',
      value: 100,
    },
  },
};

const thingLight2 = JSON.parse(
  JSON.stringify(thingLight1).replace(/light1/g, 'light2'));

describe('metrics/', function() {
  let jwt;

  async function addDevice(desc) {
    const {id} = desc;
    const res = await chai.request(server)
      .post(Constants.THINGS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send(desc);
    await mockAdapter().addDevice(id, desc);
    return res;
  }

  async function setProp(thingId, propId, value) {
    const res = await chai.request(server)
      .put(`${Constants.THINGS_PATH}/${thingId}/properties/${propId}`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({propId: value});
    expect(res.status).toEqual(200);
  }


  beforeEach(async () => {
    jwt = await createUser(server, TEST_USER);
    await addDevice(thingLight1);
    await addDevice(thingLight2);
  });

  const light1OnValues = [true, false, true, false];
  const light1BriValues = [12, 34];
  const light2BriValues = [0, 31];

  async function populatePropertyData() {
    for (const value of light1OnValues.slice(0, light1OnValues.length - 1)) {
      await setProp('light1', 'on', value);
    }

    for (const value of light1BriValues) {
      await setProp('light1', 'brightness', value);
    }

    for (const value of light2BriValues) {
      await setProp('light2', 'brightness', value);
    }

    await setProp('light1', 'on', light1OnValues[light1OnValues.length - 1]);
  }

  function value(data) {
    return data.value;
  }

  it('gets all metrics', async () => {
    await populatePropertyData();

    const res = await chai.request(server)
      .get(Constants.METRICS_PATH)
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    const metrics = res.body;

    expect(metrics.light1.on.map(value))
      .toEqual(light1OnValues);

    expect(metrics.light1.brightness.map(value))
      .toEqual(light1BriValues);

    expect(metrics.light2.brightness.map(value))
      .toEqual(light2BriValues);
  });

  it('gets one device\'s metrics', async () => {
    await populatePropertyData();

    const res = await chai.request(server)
      .get(`${Constants.METRICS_PATH}/things/light1`)
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    const metrics = res.body;

    expect(metrics.on.map(value))
      .toEqual(light1OnValues);

    expect(metrics.brightness.map(value))
      .toEqual(light1BriValues);
  });
});

