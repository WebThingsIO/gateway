'use strict';

/* Tell jshint about mocha globals, and  */
/* globals it */

const {chai, server} = require('../common');
const assert = chai.assert;

var Constants = require('../../constants');

const testUser = {
  email: 'test@example.com',
  name: 'Test User',
  password: 'rhubarb'
};

it('gets a route but is not authed', async () => {
  const res = await chai.request(server)
    .get('/');

  assert(res.request.url.endsWith('/login'),
         'should be redirected to /login');
});

it('creates a user', async () => {
  const res = await chai.request(server)
    .post(Constants.USERS_PATH)
    .send(testUser);

  res.should.have.status(200);
});


it('fail to GET a non-existent user', async () => {
  try {
    await chai.request(server)
      .get(Constants.USERS_PATH + '/wrong@example.com');
    throw new Error('request should fail');
  } catch(err) {
    err.response.should.have.status(404);
  }
});

it('gets that user', async () => {
  const res = await chai.request(server)
    .get(Constants.USERS_PATH + '/' + testUser.email);

  res.should.have.status(200);
  res.body.email.should.be.eql(testUser.email);
  res.body.name.should.be.eql(testUser.name);
  res.body.should.not.have.a.property('password');

});

it('logs out', async () => {
  const res = await chai.request(server)
    .post(Constants.LOG_OUT_PATH);

  res.should.have.status(200);
});

it('fails to create a user when a user exists', async () => {
  const res = await chai.request(server)
    .post(Constants.USERS_PATH)
    .send(testUser);

  assert.ok(res.request.url.endsWith('/login'),
            'should be redirected to /login');
});

it('logs in as a user', async () => {
  const res = await chai.request(server)
    .post(Constants.LOGIN_PATH)
    .send(testUser);

  res.should.have.status(200);
});

