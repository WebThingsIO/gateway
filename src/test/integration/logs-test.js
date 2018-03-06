'use strict';

/* Tell jshint about mocha globals, and  */
/* globals it */

const {server, chai} = require('../common');
const {
  TEST_USER,
  createUser,
  headerAuth,
} = require('../user');

const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');
const Constants = require('../../constants');
const UserProfile = require('../../user-profile');

describe('logs/', function() {
  let jwt;

  beforeEach(async () => {
    jwt = await createUser(server, TEST_USER);
  })

  it('GET logs.zip', async () => {
    fs.writeFileSync(path.join(UserProfile.logDir, 'test.log'),
                     'hello, world!');

    const res = await chai.request(server)
      .get(Constants.LOGS_PATH)
      .set('Accept', 'application/zip')
      .set(...headerAuth(jwt))
      .buffer()
      .parse((res, cb) => {
        res.setEncoding('binary');
        res.data = '';
        res.on('data', (chunk) => res.data += chunk);
        res.on('end', () => {
          JSZip
            .loadAsync(res.data, {base64: false, checkCRC32: true})
            .then((zip) => cb(null, zip));
        })
      });
    expect(res.status).toEqual(200);
    expect(res.type).toBe('application/zip');
    expect(Object.keys(res.body.files).length).toEqual(1);
    const file = res.body.file('logs/test.log');
    expect(file).toBeTruthy();
    const data = await file.async('text');
    expect(data).toBe('hello, world!');
  });
});
