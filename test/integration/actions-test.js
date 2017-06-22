'use strict';

/* Tell jshint about mocha globals, and  */
/* globals it */

const {server, chai, mockAdapter} = require('../common');

var Constants = require('../../constants');
const WebSocket = require('ws');

it('removes all existing actions', async () => {

  let res = await chai.request(server)
    .get(Constants.ACTIONS_PATH)
  res.should.have.status(200);
  res.body.should.be.a('array');

  // Issue a request to delete all current actions
  let deleteReqs = res.body.map(action => {
    return chai.request(server)
      .delete(Constants.ACTIONS_PATH + '/' + action.id);
  });

  const responses = await Promise.all(deleteReqs);
  for (let res of responses) {
    res.should.have.status(204);
  }

  res = await chai.request(server)
      .get(Constants.ACTIONS_PATH);

  res.body.should.be.a('array');
  res.body.length.should.be.eql(0);
});

it('GET with no actions', async () => {
  const res = await chai.request(server)
    .get(Constants.ACTIONS_PATH);
  res.should.have.status(200);
  res.body.should.be.a('array');
  res.body.length.should.be.eql(0);
});

it('should fail to create a new action (empty body)', async () => {
  try {
    await chai.request(server)
      .post(Constants.ACTIONS_PATH)
      .send();
  } catch(err) {
    err.response.should.have.status(400);
  }
});

it('should fail to create a new action (unknown name)', async () => {
  let descr = {
    name: 'potato'
  };
  try {
    await chai.request(server)
      .post(Constants.ACTIONS_PATH)
      .send(descr);
  } catch(err) {
    err.response.should.have.status(400);
  }
});

it('should create a new pairing action', async () => {
  let descr = {
    name: 'pair'
  };
  const res = await chai.request(server)
    .post(Constants.ACTIONS_PATH)
    .send(descr);

  res.should.have.status(201);
});

it('should list and retrieve the new action', async () => {
  let res = await chai.request(server)
    .get(Constants.ACTIONS_PATH);
  res.should.have.status(200);
  res.body.should.be.a('array');
  res.body.length.should.be.eql(1);
  res.body[0].should.have.a.property('name');
  res.body[0].should.have.a.property('id');
  res.body[0].name.should.be.eql('pair');

  const actionId = res.body[0].id;
  res = await chai.request(server)
    .get(Constants.ACTIONS_PATH + '/' + actionId);
  res.should.have.status(200);
  res.body.should.have.a.property('name');
  res.body.name.should.be.eql('pair');
  res.body.should.have.a.property('id');
});

it('should error retrieving a nonexistent action', async () => {
  let actionId = 'tomato';
  try {
    const res = await chai.request(server)
      .get(Constants.ACTIONS_PATH + '/' + actionId);
  } catch(err) {
    err.response.should.have.status(404);
  }
});

it('should remove an action', async () => {

  let res = await chai.request(server)
    .get(Constants.ACTIONS_PATH);
  res.should.have.status(200);
  res.body.should.be.a('array');
  res.body.length.should.be.eql(1);
  const actionId = res.body[0].id;

  res = await chai.request(server)
    .delete(Constants.ACTIONS_PATH + '/' + actionId);
  res.should.have.status(204);

  res = await chai.request(server)
    .get(Constants.ACTIONS_PATH);
  res.body.should.be.a('array');
  res.body.length.should.be.eql(0);
});

it('should error removing a nonexistent action', async () => {
  let actionId = 555;

  try {
    await chai.request(server)
      .delete(Constants.ACTIONS_PATH + '/' + actionId);
  } catch(err) {
    err.response.status.should.be.eql(404);
  }
});

it('should error on an unpair of a nonexistent device', async () => {
  let thingId = 'test-nonexistent';
  // The mock adapter requires knowing in advance that we're going to unpair
  // a specific device
  mockAdapter().unpairDevice(thingId);

  let res = await chai.request(server)
    .post(Constants.ACTIONS_PATH)
    .send({name: 'unpair', parameters: {id: thingId}});
  res.should.have.status(201);

  res = await chai.request(server)
      .get(Constants.ACTIONS_PATH);
  res.body.should.be.a('array');
  res.body[0].should.have.a.property('name');
  res.body[0].name.should.be.eql('unpair');

  res.body[0].should.have.a.property('id');

  res.body[0].should.have.a.property('status');
  res.body[0].status.should.be.eql('error');

  res.body[0].should.have.a.property('error');
});

