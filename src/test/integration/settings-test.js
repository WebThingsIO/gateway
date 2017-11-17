'use strict';

/* Tell jshint about mocha globals, and  */
/* globals it */

const {server, chai} = require('../common');
const pFinal = require('../promise-final');
const Database = require('../../db');
const {
  TEST_USER,
  createUser,
  headerAuth,
} = require('../user');
const Constants = require('../../constants');
const AdapterManager = require('../../adapter-manager');

describe('settings/', function() {

  let jwt;
  beforeEach(async () => {
    jwt = await createUser(server, TEST_USER);
    // Clear settings storage
    await Database.deleteEverything();
  });

  it('Fail to get a setting that hasnt been set', async () => {
    const err = await pFinal(chai.request(server)
      .get(Constants.SETTINGS_PATH + '/experiments/foo')
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt)));

    expect(err.response.status).toEqual(404);
  });

  it('Set a setting', async() => {
    const res = await chai.request(server)
      .put(Constants.SETTINGS_PATH + '/experiments/bar')
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({'enabled': true});

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('enabled');
    expect(res.body.enabled).toEqual(true);
  });

  it('Get a setting', async () => {
    const putRes = await chai.request(server)
      .put(Constants.SETTINGS_PATH + '/experiments/bar')
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({'enabled': true});

    expect(putRes.status).toEqual(200);
    expect(putRes.body).toHaveProperty('enabled');
    expect(putRes.body.enabled).toEqual(true);

    const res = await chai.request(server)
      .get(Constants.SETTINGS_PATH + '/experiments/bar')
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('enabled');
    expect(res.body.enabled).toEqual(true);
  });

  it('Get the adapter list', async () => {
    try {
      await AdapterManager.loadAdaptersByPackageName('moziot-adapter-example');
    } catch (_e) {
      // pass intentionally
    }

    const res = await chai.request(server)
      .get(Constants.SETTINGS_PATH + '/adapters')
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('value');
    expect(JSON.parse(res.body[0].value)).toHaveProperty('name');
    expect(JSON.parse(res.body[0].value)).toHaveProperty('description');
    expect(JSON.parse(res.body[0].value)).toHaveProperty('moziot');
  });

  it('Toggle an adapter', async () => {
    try {
      await AdapterManager.loadAdaptersByPackageName('moziot-adapter-example');
    } catch (_e) {
      // pass intentionally
    }

    // Toggle on
    console.log('enabling...');
    const res1 = await chai.request(server)
      .put(Constants.SETTINGS_PATH + '/adapters/moziot-adapter-example')
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({'enabled': true});

    expect(res1.status).toEqual(200);

    // Get status
    const res2 = await chai.request(server)
      .get(Constants.SETTINGS_PATH + '/adapters')
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res2.status).toEqual(200);
    let adapterConfig1;
    for (const cfg of res2.body) {
      if (cfg.key.indexOf('moziot-adapter-example') > -1) {
        adapterConfig1 = JSON.parse(cfg.value);
        break;
      }
    }

    expect(adapterConfig1).toHaveProperty('moziot');
    expect(adapterConfig1.moziot.enabled).toBe(true);

    // Toggle off
    console.log('disabling...');
    const res3 = await chai.request(server)
      .put(Constants.SETTINGS_PATH + '/adapters/moziot-adapter-example')
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({'enabled': false});

    expect(res3.status).toEqual(200);

    // Get status
    const res4 = await chai.request(server)
      .get(Constants.SETTINGS_PATH + '/adapters')
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res4.status).toEqual(200);
    let adapterConfig2;
    for (const cfg of res4.body) {
      if (cfg.key.indexOf('moziot-adapter-example') > -1) {
        adapterConfig2 = JSON.parse(cfg.value);
        break;
      }
    }

    expect(adapterConfig2).toHaveProperty('moziot');
    expect(adapterConfig2.moziot.enabled).toBe(false);
  });

});
