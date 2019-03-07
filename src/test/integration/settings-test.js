'use strict';

/* Tell jshint about mocha globals, and  */
/* globals it */

const {server, chai} = require('../common');
const Database = require('../../db');
const Platform = require('../../platform');
const {
  TEST_USER,
  createUser,
  headerAuth,
} = require('../user');
const Constants = require('../../constants');

describe('settings/', () => {
  let jwt;
  beforeEach(async () => {
    jwt = await createUser(server, TEST_USER);
    // Clear settings storage
    await Database.deleteEverything();
  });

  it('Fail to get a setting that hasnt been set', async () => {
    const err = await chai.request(server)
      .get(`${Constants.SETTINGS_PATH}/experiments/foo`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(err.status).toEqual(404);
  });

  it('Fail to set a setting when missing data', async () => {
    const err = await chai.request(server)
      .put(`${Constants.SETTINGS_PATH}/experiments/bar`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send();
    expect(err.status).toEqual(400);
  });

  it('Set a setting', async () => {
    const res = await chai.request(server)
      .put(`${Constants.SETTINGS_PATH}/experiments/bar`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({enabled: true});

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('enabled');
    expect(res.body.enabled).toEqual(true);
  });

  it('Get a setting', async () => {
    const putRes = await chai.request(server)
      .put(`${Constants.SETTINGS_PATH}/experiments/bar`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({enabled: true});

    expect(putRes.status).toEqual(200);
    expect(putRes.body).toHaveProperty('enabled');
    expect(putRes.body.enabled).toEqual(true);

    const res = await chai.request(server)
      .get(`${Constants.SETTINGS_PATH}/experiments/bar`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('enabled');
    expect(res.body.enabled).toEqual(true);
  });

  it('Get platform info', async () => {
    const res = await chai.request(server)
      .get(`${Constants.SETTINGS_PATH}/system/platform`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('architecture');
    expect(res.body).toHaveProperty('os');
    expect(res.body.architecture).toEqual(Platform.getArchitecture());
    expect(res.body.os).toEqual(Platform.getOS());
  });

  it('Get SSH status', async () => {
    const res = await chai.request(server)
      .get(`${Constants.SETTINGS_PATH}/system/ssh`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('enabled');
    expect(res.body.enabled).toEqual(false);
  });

  it('Toggle SSH', async () => {
    const err = await chai.request(server)
      .put(`${Constants.SETTINGS_PATH}/system/ssh`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({enabled: true});

    expect(err.status).toEqual(500);
  });

  it('Restart gateway', async () => {
    const err = await chai.request(server)
      .post(`${Constants.SETTINGS_PATH}/system/actions`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({action: 'restartGateway'});

    expect(err.status).toEqual(500);
  });

  it('Restart system', async () => {
    const err = await chai.request(server)
      .post(`${Constants.SETTINGS_PATH}/system/actions`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({action: 'restartSystem'});

    expect(err.status).toEqual(500);
  });

  it('Unknown platform action', async () => {
    const err = await chai.request(server)
      .post(`${Constants.SETTINGS_PATH}/system/actions`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({action: 'thisIsFake'});

    expect(err.status).toEqual(400);
  });
});
