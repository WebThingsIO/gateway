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

describe('internal-logs/', () => {
  let jwt;

  beforeEach(async () => {
    jwt = await createUser(server, TEST_USER);
    fs.writeFileSync(path.join(UserProfile.logDir, 'test.log'),
                     'hello, world!');
  });

  it('GET internal-logs index', async () => {
    const res = await chai.request(server)
      .get(Constants.INTERNAL_LOGS_PATH)
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(res.type).toBe('text/html');
    expect(res.text.indexOf('test.log')).toBeGreaterThan(0);
  });

  it('GET test.log', async () => {
    const res = await chai.request(server)
      .get(`${Constants.INTERNAL_LOGS_PATH}/files/test.log`)
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(res.type).toBe('text/plain');
    expect(res.text).toBe('hello, world!');
  });

  it('GET logs.zip', async () => {
    const res = await chai.request(server)
      .get(`${Constants.INTERNAL_LOGS_PATH}/zip`)
      .set(...headerAuth(jwt))
      .buffer()
      .parse((res, cb) => {
        res.setEncoding('binary');
        res.data = '';
        res.on('data', (chunk) => {
          res.data += chunk;
        });
        res.on('end', () => {
          JSZip
            .loadAsync(res.data, {base64: false, checkCRC32: true})
            .then((zip) => cb(null, zip));
        });
      });
    expect(res.status).toEqual(200);
    expect(res.type).toBe('application/zip');
    expect(Object.keys(res.body.files).length).toEqual(2);
    const file = res.body.file('logs/test.log');
    expect(file).toBeTruthy();
    const data = await file.async('text');
    expect(data).toBe('hello, world!');
  });
});
