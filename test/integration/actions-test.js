'use strict';

/* Tell jshint about mocha globals, and  */
/* globals it */

const {server, chai, mockAdapter, rp} = require('../common');

var Constants = require('../../constants');
const WebSocket = require('ws');


it('GET with no actions', (done) => {
  chai.request(server)
    .get(Constants.ACTIONS_PATH)
    .end((err, res) => {
      console.log(res.body);
      res.should.have.status(200);
      res.body.should.be.a('array');
      res.body.length.should.be.eql(0);
      done();
    });
});

it('should fail to create a new action (empty body)', (done) => {
  chai.request(server)
    .post(Constants.ACTIONS_PATH)
    .send()
    .end((err, res) => {
      res.should.have.status(400);
      done();
    });
});

it('should fail to create a new action (unknown name)', (done) => {
  let descr = {
    name: 'potato'
  };
  chai.request(server)
    .post(Constants.ACTIONS_PATH)
    .send(descr)
    .end((err, res) => {
      res.should.have.status(400);
      done();
    });
});

it('should create a new pairing action', (done) => {
  let descr = {
    name: 'pair'
  };
  chai.request(server)
    .post(Constants.ACTIONS_PATH)
    .send(descr)
    .end((err, res) => {
      res.should.have.status(201);
      done();
    });
});


it('should retrieve the new action', (done) => {
  chai.request(server)
    .get(Constants.ACTIONS_PATH)
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.a('array');
      res.body.length.should.be.eql(1);
      res.body[0].should.have.a.property('name');
      res.body[0].should.have.a.property('id');
      res.body[0].name.should.be.eql('pair');
      done();
    });
});

it('should remove an action', done => {

  rp(chai.request(server)
    .get(Constants.ACTIONS_PATH)).then(res => {
    res.should.have.status(200);
    res.body.should.be.a('array');
    res.body.length.should.be.eql(1);
    let actionId = res.body[0].id;
    return actionId;
  }).then(actionId => {
    return rp(chai.request(server)
      .delete(Constants.ACTIONS_PATH + '/' + actionId));
  }).then(res => {
    res.should.have.status(204);

    return rp(chai.request(server)
      .get(Constants.ACTIONS_PATH));
  }).then(res => {
    res.body.should.be.a('array');
    res.body.length.should.be.eql(0);

    done();
  });
});

