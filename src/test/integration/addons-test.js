'use strict';

/* Tell jshint about mocha globals, and  */
/* globals it */

const {server, chai} = require('../common');
const {
  TEST_USER,
  createUser,
  headerAuth,
} = require('../user');
const Constants = require('../../constants');

describe('addons', function() {
  let jwt;
  beforeEach(async () => {
    jwt = await createUser(server, TEST_USER);
  })

  it('Discover add-ons', async () => {
    const res = await chai.request(server)
      .get(`${Constants.ADDONS_PATH}/discover`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length >= 1).toBeTruthy();
    expect(res.body[0]).toHaveProperty('name');
    expect(res.body[0]).toHaveProperty('display_name');
    expect(res.body[0]).toHaveProperty('description');
    expect(res.body[0]).toHaveProperty('version');
    expect(res.body[0]).toHaveProperty('url');
  });
});
