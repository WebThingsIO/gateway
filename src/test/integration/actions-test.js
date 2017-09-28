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

const {
  webSocketOpen,
  webSocketRead,
  webSocketClose
} = require('../websocket-util');

const Constants = require('../../constants');

describe('actions/', function() {
  let jwt;

  beforeEach(async () => {
    jwt = await createUser(server, TEST_USER);
  })

  it('GET with no actions', async () => {
    const res = await chai.request(server)
      .get(Constants.ACTIONS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(0);
  });

  it('should fail to create a new action (empty body)', async () => {
    const err = await pFinal(chai.request(server)
      .post(Constants.ACTIONS_PATH)
      .set(...headerAuth(jwt))
      .set('Accept', 'application/json')
      .send());
    expect(err.response.status).toEqual(400);
  });

  it('should fail to create a new action (unknown name)', async () => {
    let descr = {
      name: 'potato'
    };
    const err = await pFinal(chai.request(server)
      .post(Constants.ACTIONS_PATH)
      .set(...headerAuth(jwt))
      .set('Accept', 'application/json')
      .send(descr));
    expect(err.response.status).toEqual(400);
  });

  it('should list and retrieve the new action', async () => {
    let descr = {
      name: 'pair'
    };

    const pair = await chai.request(server)
      .post(Constants.ACTIONS_PATH)
      .set(...headerAuth(jwt))
      .set('Accept', 'application/json')
      .send(descr);

    expect(pair.status).toEqual(201);

    let res = await chai.request(server)
      .get(Constants.ACTIONS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(1);
    expect(res.body[0]).toHaveProperty('name');
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0].name).toEqual('pair');

    const actionId = res.body[0].id;
    res = await chai.request(server)
      .get(Constants.ACTIONS_PATH + '/' + actionId)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('name');
    expect(res.body.name).toEqual('pair');
    expect(res.body).toHaveProperty('id');
  });

  it('should error retrieving a nonexistent action', async () => {
    const actionId = 'foobarmissing';
    const err = await pFinal(chai.request(server)
      .get(Constants.ACTIONS_PATH + '/' + actionId)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt)));
    expect(err.response.status).toEqual(404);
  });

  it('should remove an action', async () => {
    let descr = {
      name: 'pair'
    };

    await chai.request(server)
      .post(Constants.ACTIONS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send(descr);

    let res = await chai.request(server)
      .get(Constants.ACTIONS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(1);
    const actionId = res.body[0].id;

    res = await chai.request(server)
      .delete(Constants.ACTIONS_PATH + '/' + actionId)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(204);

    res = await chai.request(server)
      .get(Constants.ACTIONS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(0);
  });

  it('should error removing a nonexistent action', async () => {
    let actionId = 555;
    const err = await pFinal(chai.request(server)
      .delete(Constants.ACTIONS_PATH + '/' + actionId)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt)));
    expect(err.response.status).toEqual(404);
  });

  it('should error on an unpair of a nonexistent device', async () => {
    let thingId = 'test-nonexistent';
    // The mock adapter requires knowing in advance that we're going to unpair
    // a specific device
    mockAdapter().unpairDevice(thingId);

    let res = await chai.request(server)
      .post(Constants.ACTIONS_PATH)
      .set(...headerAuth(jwt))
      .set('Accept', 'application/json')
      .send({name: 'unpair', parameters: {id: thingId}});
    expect(res.status).toEqual(201);

    res = await chai.request(server)
        .get(Constants.ACTIONS_PATH)
        .set('Accept', 'application/json')
        .set(...headerAuth(jwt));
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body[0]).toHaveProperty('name');
    expect(res.body[0].name).toEqual('unpair');

    expect(res.body[0]).toHaveProperty('id');

    expect(res.body[0]).toHaveProperty('status');
    expect(res.body[0].status).toEqual('error');

    expect(res.body[0]).toHaveProperty('error');
  });

  it('should receive action status messages over websocket', async () => {
    let descr = {
      name: 'pair'
    };

    let ws = await webSocketOpen(Constants.THINGS_PATH + '/test',
      jwt);

    const [actionId, messages] = await Promise.all([
      (async () => {
        await chai.request(server)
          .post(Constants.ACTIONS_PATH)
          .set('Accept', 'application/json')
          .set(...headerAuth(jwt))
          .send(descr);

        let res = await chai.request(server)
          .get(Constants.ACTIONS_PATH)
          .set('Accept', 'application/json')
          .set(...headerAuth(jwt));
        expect(res.status).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toEqual(1);
        const actionId = res.body[0].id;

        res = await chai.request(server)
          .delete(Constants.ACTIONS_PATH + '/' + actionId)
          .set('Accept', 'application/json')
          .set(...headerAuth(jwt));
        expect(res.status).toEqual(204);

        res = await chai.request(server)
          .get(Constants.ACTIONS_PATH)
          .set('Accept', 'application/json')
          .set(...headerAuth(jwt));

        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toEqual(0);

        return actionId;
      })(),
      webSocketRead(ws, 2)
    ]);

    const actionPath = Constants.ACTIONS_PATH + '/' + actionId;

    expect(messages[0].messageType).toEqual(Constants.ACTION_STATUS);
    expect(messages[0].data.status).toEqual('pending');
    expect(messages[0].data.href).toEqual(actionPath);

    expect(messages[1].messageType).toEqual(Constants.ACTION_STATUS);
    expect(messages[1].data.status).toEqual('deleted');
    expect(messages[1].data.href).toEqual(actionPath);

    await webSocketClose(ws);
  });
});
