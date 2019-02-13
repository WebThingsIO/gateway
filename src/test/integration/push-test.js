'use strict';

/* Tell jshint about mocha globals, and  */
/* globals it */

const {server, chai} = require('../common');
const Database = require('../../db');
const PushService = require('../../push-service');

const {
  TEST_USER,
  createUser,
  headerAuth,
} = require('../user');
const Constants = require('../../constants');

describe('push/', () => {
  let jwt;
  beforeEach(async () => {
    // Clear settings storage
    await Database.deleteEverything();
    jwt = await createUser(server, TEST_USER);
  });

  it('Fail to get a vapid key with PushService not initialized', async () => {
    const err = await chai.request(server)
      .get(`${Constants.PUSH_PATH}/vapid-public-key`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(err.status).toEqual(500);
  });

  it('Get a vapid key with PushService initialized', async () => {
    await PushService.init('https://hogehoge.com');
    const res = await chai.request(server)
      .get(`${Constants.PUSH_PATH}/vapid-public-key`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(res.body).toEqual({
      publicKey: expect.any(String),
    });
  });

  it('Subscribe message', async () => {
    const res = await chai.request(server)
      .post(`${Constants.PUSH_PATH}/register`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({hoge: 'hoge'});

    expect(res.status).toEqual(200);
  });
});
