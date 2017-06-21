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

it('gets a route but is not authed', (done) => {
  chai.request(server)
    .get('/')
    .end((err, res) => {
      assert(res.request.url.endsWith('/login'),
             'should be redirected to /login');
      done();
    });
});

it('creates a user', (done) => {
  chai.request(server)
    .post(Constants.USERS_PATH)
    .send(testUser)
    .end((err, res) => {
      res.should.have.status(200);
      done();
    });
});


it('fail to GET a non-existent user', (done) => {
  chai.request(server)
    .get(Constants.USERS_PATH + '/wrong@example.com')
    .end((err, res) => {
      res.should.have.status(404);
      done();
    });
});

it('gets that user', (done) => {
  chai.request(server)
    .get(Constants.USERS_PATH + '/' + testUser.email)
    .end((err, res) => {
      res.should.have.status(200);
      res.body.email.should.be.eql(testUser.email);
      res.body.name.should.be.eql(testUser.name);
      res.body.should.not.have.a.property('password');

      done();
    });
});

it('logs out', (done) => {
  chai.request(server)
    .post(Constants.LOG_OUT_PATH)
    .end((err, res) => {
      res.should.have.status(200);
      done();
    });
});

it('fails to create a user when a user exists', (done) => {
  chai.request(server)
    .post(Constants.USERS_PATH)
    .send(testUser)
    .end((err, res) => {
      assert.ok(res.request.url.endsWith('/login'),
                'should be redirected to /login');
      done();
    });
});

it('logs in as a user', (done) => {
  chai.request(server)
    .post(Constants.LOGIN_PATH)
    .send(testUser)
    .end((err, res) => {
      res.should.have.status(200);
      done();
    });
});

