'use strict';

/* Tell jshint about mocha globals, and  */
/* globals it */

const {server, chai, mockAdapter} = require('../common');

var Constants = require('../../constants');

it('GET with no things', (done) => {
  chai.request(server)
    .get(Constants.THINGS_PATH)
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.a('array');
      res.body.length.should.be.eql(0);
      done();
    });
});

it('fail to create a new thing (empty body)', (done) => {
  chai.request(server)
    .post(Constants.THINGS_PATH)
    .send()
    .end((err, res) => {
      res.should.have.status(400);
      done();
    });
});

it('create a new thing', (done) => {
  // Create the thing at the adapter level allows the property stuff
  // later to work. We're essentially creating a paired thing.
  let descr = {
    id: 'test-1',
    type: 'onOffSwitch',
    name: 'test-1',
    properties: {
      on : {type: 'boolean', value: false}
    }
  };
  mockAdapter().addDevice('test-1', descr);
  chai.request(server)
    .post(Constants.THINGS_PATH)
    .send(descr)
    .end((err, res) => {
      res.should.have.status(201);
      done();
    });
});

it('fail to create a new thing (duplicate)', (done) => {
  chai.request(server)
    .post(Constants.THINGS_PATH)
    .send({
      id: 'test-1',
    })
    .end((err, res) => {
      res.should.have.status(500);
      done();
    });
});

it('GET with 1 thing', (done) => {
  chai.request(server)
    .get(Constants.THINGS_PATH)
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.a('array');
      res.body.length.should.be.eql(1);
      res.body[0].should.have.a.property('href');
      res.body[0].href.should.be.eql(Constants.THINGS_PATH + '/test-1');
      done();
    });
});

it('GET a property of a thing', (done) => {
  chai.request(server)
    .get(Constants.THINGS_PATH + '/test-1/properties/on')
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.have.a.property('on');
      res.body.on.should.be.eql(false);
      done();
    });
});

it('fail to GET a non-existant property of a thing', (done) => {
  chai.request(server)
    .get(Constants.THINGS_PATH + '/test-1/properties/xyz')
    .end((err, res) => {
      res.should.have.status(500);
      done();
    });
});

it('fail to GET a property of a non-existent thing', (done) => {
  chai.request(server)
    .get(Constants.THINGS_PATH + '/test-1a/properties/on')
    .end((err, res) => {
      res.should.have.status(500);
      done();
    });
});

it('fail to set a property of a thing', (done) => {
  chai.request(server)
    .put(Constants.THINGS_PATH + '/test-1/properties/on')
    .send({})
    .end((err, res) => {
      res.should.have.status(400);
      done();
    });
});

it('fail to set a property of a thing', (done) => {
  chai.request(server)
    .put(Constants.THINGS_PATH + '/test-1/properties/on')
    .send({abc: true})
    .end((err, res) => {
      res.should.have.status(400);
      done();
    });
});

it('set a property of a thing', (done) => {
  chai.request(server)
    .put(Constants.THINGS_PATH + '/test-1/properties/on')
    .send({on: true})
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.have.a.property('on');
      res.body.on.should.be.eql(true);
      done();
    });
});

it('Verify property of a thing changed', (done) => {
  chai.request(server)
    .get(Constants.THINGS_PATH + '/test-1/properties/on')
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.have.a.property('on');
      res.body.on.should.be.eql(true);
      done();
    });
});
