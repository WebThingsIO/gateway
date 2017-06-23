'use strict';

/* Tell jshint about mocha globals, and  */
/* globals it */

const {server, chai, mockAdapter} = require('../common');
const {
  TEST_USER,
  createUser,
  headerAuth,
} = require('../user');

const pFinal = require('../promise-final');

const Constants = require('../../constants');
const WebSocket = require('ws');

describe('actions/', function() {
  let jwt;

  beforeEach(async () => {
    jwt = await createUser(server, TEST_USER);
  })

  it('GET with no actions', async () => {
    const res = await chai.request(server)
      .get(Constants.ACTIONS_PATH)
      .set(...headerAuth(jwt));
    res.should.have.status(200);
    res.body.should.be.a('array');
    res.body.length.should.be.eql(0);
  });

  it('should fail to create a new action (empty body)', async () => {
    const err = await pFinal(chai.request(server)
      .post(Constants.ACTIONS_PATH)
      .set(...headerAuth(jwt))
      .send());
    err.response.should.have.status(400);
  });

  it('should fail to create a new action (unknown name)', async () => {
    let descr = {
      name: 'potato'
    };
    const err = await pFinal(chai.request(server)
      .post(Constants.ACTIONS_PATH)
      .set(...headerAuth(jwt))
      .send(descr));
    err.response.should.have.status(400);
  });

  it('should list and retrieve the new action', async () => {
    let descr = {
      name: 'pair'
    };

    const pair = await chai.request(server)
      .post(Constants.ACTIONS_PATH)
      .set(...headerAuth(jwt))
      .send(descr);

    pair.should.have.status(201);

    let res = await chai.request(server)
      .get(Constants.ACTIONS_PATH)
      .set(...headerAuth(jwt));
    res.should.have.status(200);
    res.body.should.be.a('array');
    res.body.length.should.be.eql(1);
    res.body[0].should.have.a.property('name');
    res.body[0].should.have.a.property('id');
    res.body[0].name.should.be.eql('pair');

    const actionId = res.body[0].id;
    res = await chai.request(server)
      .get(Constants.ACTIONS_PATH + '/' + actionId)
      .set(...headerAuth(jwt));
    res.should.have.status(200);
    res.body.should.have.a.property('name');
    res.body.name.should.be.eql('pair');
    res.body.should.have.a.property('id');
  });

  it('should error retrieving a nonexistent action', async () => {
    const actionId = 'foobarmissing';
    const err = await pFinal(chai.request(server)
      .get(Constants.ACTIONS_PATH + '/' + actionId)
      .set(...headerAuth(jwt)));
    err.response.should.have.status(404);
  });

  it('should remove an action', async () => {
    let descr = {
      name: 'pair'
    };

    await chai.request(server)
      .post(Constants.ACTIONS_PATH)
      .set(...headerAuth(jwt))
      .send(descr);

    let res = await chai.request(server)
      .get(Constants.ACTIONS_PATH)
      .set(...headerAuth(jwt));
    res.should.have.status(200);
    res.body.should.be.a('array');
    res.body.length.should.be.eql(1);
    const actionId = res.body[0].id;

    res = await chai.request(server)
      .delete(Constants.ACTIONS_PATH + '/' + actionId)
      .set(...headerAuth(jwt));
    res.should.have.status(204);

    res = await chai.request(server)
      .get(Constants.ACTIONS_PATH)
      .set(...headerAuth(jwt));
    res.body.should.be.a('array');
    res.body.length.should.be.eql(0);
  });

  it('should error removing a nonexistent action', async () => {
    let actionId = 555;
    const err = await pFinal(chai.request(server)
      .delete(Constants.ACTIONS_PATH + '/' + actionId)
      .set(...headerAuth(jwt)));
    err.response.status.should.be.eql(404);
  });

  it('should error on an unpair of a nonexistent device', async () => {
    let thingId = 'test-nonexistent';
    // The mock adapter requires knowing in advance that we're going to unpair
    // a specific device
    mockAdapter().unpairDevice(thingId);

    let res = await chai.request(server)
      .post(Constants.ACTIONS_PATH)
      .set(...headerAuth(jwt))
      .send({name: 'unpair', parameters: {id: thingId}});
    res.should.have.status(201);

    res = await chai.request(server)
        .get(Constants.ACTIONS_PATH)
        .set(...headerAuth(jwt));
    res.body.should.be.a('array');
    res.body[0].should.have.a.property('name');
    res.body[0].name.should.be.eql('unpair');

    res.body[0].should.have.a.property('id');

    res.body[0].should.have.a.property('status');
    res.body[0].status.should.be.eql('error');

    res.body[0].should.have.a.property('error');
  });

});
