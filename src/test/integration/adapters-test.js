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

describe('adapters/', function() {
  let jwt;
  beforeEach(async () => {
    jwt = await createUser(server, TEST_USER);
  })

  it('gets all adapters', async () => {
    const res = await chai.request(server)
      .get(Constants.ADAPTERS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(1);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0].id).toEqual(mockAdapter().getId());
    expect(res.body[0]).toHaveProperty('ready');
    expect(res.body[0].ready).toEqual(mockAdapter().isReady());
  });

  it('gets specifically mockAdapter', async () => {
    let mockAdapterId = mockAdapter().getId();

    const res = await chai.request(server)
      .get(Constants.ADAPTERS_PATH + '/' + mockAdapterId)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body.id).toEqual(mockAdapter().getId());
    expect(res.body).toHaveProperty('ready');
    expect(res.body.ready).toEqual(mockAdapter().isReady());
  });

  it('fails to get a nonexistent adapter', async () => {
    let mockAdapterId = 'nonexistent-adapter';

    try {
      await chai.request(server)
        .get(Constants.ADAPTERS_PATH + '/' + mockAdapterId)
        .set('Accept', 'application/json')
        .set(...headerAuth(jwt));
      throw new Error('request should fail');
    } catch(err) {
      expect(err.response.status).toEqual(404);
    }
  });

});
