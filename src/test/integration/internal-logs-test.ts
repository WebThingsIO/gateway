import { server, chai } from '../common';
import { TEST_USER, createUser, headerAuth } from '../user';
import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import * as Constants from '../../constants';
import UserProfile from '../../user-profile';

describe('internal-logs/', () => {
  let jwt: string;

  beforeEach(async () => {
    jwt = await createUser(server, TEST_USER);
    fs.writeFileSync(path.join(UserProfile.logDir, 'test.log'), 'hello, world!');

    // clean up folder from previous logs
    const regex = /^run-app\.log\./;
    fs.readdirSync(UserProfile.logDir)
      .filter((f) => regex.test(f))
      .map((f) => fs.unlinkSync(path.join(UserProfile.logDir, f)));
  });

  it('GET internal-logs index', async () => {
    const res = await chai
      .request(server)
      .get(Constants.INTERNAL_LOGS_PATH)
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(res.type).toBe('text/html');
    expect(res.text.indexOf('test.log')).toBeGreaterThan(0);
  });

  it('GET test.log', async () => {
    const res = await chai
      .request(server)
      .get(`${Constants.INTERNAL_LOGS_PATH}/files/test.log`)
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(res.type).toBe('text/plain');
    expect(res.text).toBe('hello, world!');
  });

  it('GET logs.zip', async () => {
    let responseData: string;
    const res = await chai
      .request(server)
      .get(`${Constants.INTERNAL_LOGS_PATH}/zip`)
      .set(...headerAuth(jwt))
      .buffer()
      .parse((res, cb) => {
        res.setEncoding('binary');
        responseData = '';
        res.on('data', (chunk) => {
          responseData += chunk;
        });
        res.on('end', () => {
          JSZip.loadAsync(responseData, { base64: false, checkCRC32: true }).then((zip) =>
            cb(null, zip)
          );
        });
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
