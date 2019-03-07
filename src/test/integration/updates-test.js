'use strict';

/* globals it */

const config = require('config');
const nock = require('nock');
const {URL} = require('url');

const {server, chai} = require('../common');
const Constants = require('../../constants');
const {
  TEST_USER,
  createUser,
  headerAuth,
} = require('../user');

const releases = [
  {
    prerelease: false,
    draft: true,
    tag_name: '0.1.2',
  },
  {
    prerelease: true,
    draft: false,
    tag_name: '0.1.1',
  },
  {
    prerelease: false,
    draft: false,
    tag_name: '0.1.0',
  },
  {
    prerelease: false,
    draft: false,
    tag_name: '0.0.19',
  },
];

const updateUrl = new URL(config.get('updateUrl'));

describe('updates/', () => {
  let jwt;
  beforeEach(async () => {
    jwt = await createUser(server, TEST_USER);
  });

  it('should get /latest with a normal response', async () => {
    nock(updateUrl.origin)
      .get(updateUrl.pathname)
      .reply(200, releases);

    const res = await chai.request(server)
      .get(`${Constants.UPDATES_PATH}/latest`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    console.log(res.body);
    expect(res.body.version).toEqual('0.1.0');
  });

  it('should get /latest with no good releases', async () => {
    nock(updateUrl.origin)
      .get(updateUrl.pathname)
      .reply(200, releases.slice(0, 2));

    const res = await chai.request(server)
      .get(`${Constants.UPDATES_PATH}/latest`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(res.body.version).toBeFalsy();
  });

  it('should get /latest with a strange error', async () => {
    nock(updateUrl.origin)
      .get(updateUrl.pathname)
      .reply(200, {error: true});

    const res = await chai.request(server)
      .get(`${Constants.UPDATES_PATH}/latest`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(res.body.version).toBeFalsy();
  });

  it('GET /status', async () => {
    const res = await chai.request(server)
      .get(`${Constants.UPDATES_PATH}/status`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('success');
    expect(res.body).toHaveProperty('version');
  });
});

