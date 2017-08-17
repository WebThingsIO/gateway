'use strict';

/* Tell jshint about mocha globals, and  */
/* globals it */

const {server, chai} = require('../common');
const pFinal = require('../promise-final');
const storage = require('node-persist');
const config = require('config');
const {
  TEST_USER,
  createUser,
  headerAuth,
} = require('../user');
const Constants = require('../../constants');

describe('settings/', function() {

  let jwt;
  beforeEach(async () => {
    jwt = await createUser(server, TEST_USER);
    // Clear settings storage
    storage.init({
      dir: config.get('settings.directory')
    }).then(async () => {
      await storage.clear();
    });
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

});
