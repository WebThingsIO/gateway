'use strict';

const {server, chai} = require('../common');
const {
  TEST_USER,
  createUser,
  headerAuth,
} = require('../user');
const Constants = require('../../constants');

describe('extensions/', () => {
  let jwt;
  beforeEach(async () => {
    jwt = await createUser(server, TEST_USER);
  });

  it('gets a list of all extensions', async () => {
    const res = await chai.request(server)
      .get(Constants.EXTENSIONS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(typeof res.body).toEqual('object');
    expect(Object.keys(res.body).length).toEqual(0);
  });

  it('fails to use an extension API without authentication', async () => {
    const res = await chai.request(server)
      .get(`${Constants.EXTENSIONS_PATH}/fake-extension/api/fake`)
      .set('Accept', 'application/json');

    expect(res.status).toEqual(401);
  });

  it('fails to use a nonexistent extension API', async () => {
    const res = await chai.request(server)
      .get(`${Constants.EXTENSIONS_PATH}/fake-extension/api/fake`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(404);
  });

  it('fails to get a nonexistent extension data file', async () => {
    const res = await chai.request(server)
      .get(`${Constants.EXTENSIONS_PATH}/fake-extension/js/something.js`);

    expect(res.status).toEqual(404);
  });
});

