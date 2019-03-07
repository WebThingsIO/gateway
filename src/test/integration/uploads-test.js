'use strict';

/* Tell jshint about mocha globals, and  */
/* globals it */

const {server, chai} = require('../common');
const fs = require('fs');
const path = require('path');
const Constants = require('../../constants');
const {
  TEST_USER,
  createUser,
  headerAuth,
} = require('../user');

describe('uploads/', () => {
  let jwt;
  beforeEach(async () => {
    jwt = await createUser(server, TEST_USER);
  });

  it('Upload a file', async () => {
    const res = await chai.request(server)
      .post(Constants.UPLOADS_PATH)
      .set(...headerAuth(jwt))
      .attach('file', fs.readFileSync(
        path.join(__dirname, 'assets/test.svg')), 'test.svg');

    expect(res.status).toEqual(201);
  });
});
