'use strict';

/* Tell jshint about mocha globals, and  */
/* globals it, chai, server */

require('../common');

var Constants = require('../../constants');

it('GET a user', (done) => {
  chai.request(server)
    .get(Constants.USERS_PATH + '/test@example.com')
    .end((err, res) => {
      res.should.have.status(200);
      res.body.email.should.be.eql('test@example.com');
      res.body.name.should.be.eql('Test User');
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
