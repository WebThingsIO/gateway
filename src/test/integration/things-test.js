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
const e2p = require('event-to-promise');

const {
  webSocketOpen,
  webSocketRead,
  webSocketSend,
  webSocketClose
} = require('../websocket-util');

var Constants = require('../../constants');

const TEST_THING = {
  id: 'test-1',
  type: 'onOffSwitch',
  name: 'test-1',
  properties: {
    on : {type: 'boolean', value: false}
  }
};

const piDescr = {
  id: 'pi-1',
  type: 'thing',
  name: 'pi-1',
  properties: {
    on : {type: 'boolean', value: true}
  },
  actions: {
    reboot: {
      description: 'Reboot the device'
    }
  },
  events: {
    reboot: {
      description: 'Going down for reboot'
    }
  }
};

describe('things/', function() {
  let jwt;
  beforeEach(async () => {
    jwt = await createUser(server, TEST_USER);
  });

  async function addDevice(desc = TEST_THING) {
    const {id} = desc;
    const res = await chai.request(server)
      .post(Constants.THINGS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send(desc);
    await mockAdapter().addDevice(id, desc);
    return res;
  }

  function makeDescr(id) {
    return {
      id: id,
      name: id,
      properties: {}
    };
  }

  it('GET with no things', async () => {
    const res = await chai.request(server)
      .get(Constants.THINGS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(0);
  });

  it('fail to create a new thing (empty body)', async () => {
    try {
      await chai.request(server)
        .post(Constants.THINGS_PATH)
        .set(...headerAuth(jwt))
        .set('Accept', 'application/json')
        .send();
      throw new Error('Should have failed to create new thing');
    } catch(err) {
      expect(err.response.status).toEqual(400);
    }
  });

  it('fail to create a new thing (duplicate)', async () => {
    await addDevice();
    const err = await pFinal(addDevice());
    expect(err.response.status).toEqual(500);
  });

  it('GET with 1 thing', async () => {
    await addDevice();
    const res = await chai.request(server)
      .get(Constants.THINGS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(1);
    expect(res.body[0]).toHaveProperty('href');
    expect(res.body[0].href).toEqual(Constants.THINGS_PATH + '/test-1');
  });

  it('GET a thing', async () => {
    const thingDescr = Object.assign({}, piDescr);

    await addDevice(thingDescr);
    const res = await chai.request(server)
      .get(Constants.THINGS_PATH + '/' + thingDescr.id)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('name');
    expect(res.body.name).toEqual(thingDescr.id);
    delete thingDescr.id;
    expect(res.body).toMatchObject(thingDescr);
  });

  it('fail to GET a non-existent thing', async () => {
    await addDevice();
    const err = await pFinal(chai.request(server)
      .get(Constants.THINGS_PATH + '/test-2')
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt)));

    expect(err.response.status).toEqual(404);
  });

  it('GET a property of a thing', async () => {
    await addDevice();
    const res = await chai.request(server)
      .get(Constants.THINGS_PATH + '/test-1/properties/on')
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('on');
    expect(res.body.on).toEqual(false);
  });

  it('fail to GET a non-existant property of a thing', async () => {
    const err = await pFinal(chai.request(server)
      .get(Constants.THINGS_PATH + '/test-1/properties/xyz')
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt)));

    expect(err.response.status).toEqual(500);
  });

  it('fail to GET a property of a non-existent thing', async () => {
    const err = await pFinal(chai.request(server)
      .get(Constants.THINGS_PATH + '/test-1a/properties/on')
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt)));
    expect(err.response.status).toEqual(500);
  });

  it('fail to set a property of a thing', async () => {
    await addDevice();
    const err = await pFinal(chai.request(server)
      .put(Constants.THINGS_PATH + '/test-1/properties/on')
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({}));
    expect(err.response.status).toEqual(400);
  });

  it('fail to set a property of a thing', async () => {
    const err = await pFinal(chai.request(server)
      .put(Constants.THINGS_PATH + '/test-1/properties/on')
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({abc: true}));
    expect(err.response.status).toEqual(400);
  });

  it('set a property of a thing', async () => {
    await addDevice();
    const on = await chai.request(server)
      .put(Constants.THINGS_PATH + '/test-1/properties/on')
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({on: true});

    expect(on.status).toEqual(200);
    expect(on.body).toHaveProperty('on');
    expect(on.body.on).toEqual(true);


    // Flip it back to off...
    const off = await chai.request(server)
      .put(Constants.THINGS_PATH + '/test-1/properties/on')
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({on: false});

    expect(off.status).toEqual(200);
    expect(off.body).toHaveProperty('on');
    expect(off.body.on).toEqual(false);
  });

  it('set x and y coordinates of a thing', async () => {
    await addDevice();
    const on = await chai.request(server)
      .patch(Constants.THINGS_PATH + '/test-1')
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({floorplanX: 10, floorplanY: 20});

    expect(on.status).toEqual(200);
    expect(on.body).toHaveProperty('floorplanX');
    expect(on.body).toHaveProperty('floorplanY');
    expect(on.body.floorplanX).toEqual(10);
    expect(on.body.floorplanY).toEqual(20);
  });

  it('fail to set x and y coordinates of a thing', async () => {
    const err = await pFinal(chai.request(server)
      .patch(Constants.THINGS_PATH + '/test-1')
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({abc: true}));
    expect(err.response.status).toEqual(400);
  });

  it('lists 0 new things after creating thing', async () => {
    await addDevice();
    const res = await chai.request(server)
      .get(Constants.NEW_THINGS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))

    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(0);
  });

  it('lists new things when devices are added', async () => {
    await mockAdapter().addDevice('test-2', makeDescr('test-2'));
    await mockAdapter().addDevice('test-3', makeDescr('test-3'));

    const res = await chai.request(server)
      .get(Constants.NEW_THINGS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(2);
    expect(res.body[0]).toHaveProperty('href');
    expect(res.body[0].href).toEqual(Constants.THINGS_PATH + '/test-2');
    expect(res.body[1]).toHaveProperty('href');
    expect(res.body[1].href).toEqual(Constants.THINGS_PATH + '/test-3');
  });

  it('should send multiple devices during pairing', async () => {
    let ws = await webSocketOpen(Constants.NEW_THINGS_PATH, jwt);

    // We expect things test-4, and test-5 to show up eventually
    const [messages, res] = await Promise.all([
      webSocketRead(ws, 2),
      (async () => {
        const res = await chai.request(server)
          .post(Constants.ACTIONS_PATH)
          .set('Accept', 'application/json')
          .set(...headerAuth(jwt))
          .send({name: 'pair'});

        await mockAdapter().addDevice('test-4', makeDescr('test-4'));
        await mockAdapter().addDevice('test-5', makeDescr('test-5'));
        return res;
      })(),
    ]);

    let parsedIds = messages.map(msg => {
      expect(typeof msg.id).toBe('string');
      return msg.id;
    });
    expect(parsedIds.sort()).toEqual(['test-4', 'test-5']);
    expect(res.status).toEqual(201);

    await webSocketClose(ws);
  });

  it('should add a device during pairing then create a thing', async () => {
    let thingId = 'test-6';
    let descr = makeDescr(thingId);
    mockAdapter().pairDevice(thingId, descr);
    // send pair action
    let res = await chai.request(server)
      .post(Constants.ACTIONS_PATH)
      .set(...headerAuth(jwt))
      .set('Accept', 'application/json')
      .send({name: 'pair'});
    expect(res.status).toEqual(201);

    res = await chai.request(server)
      .get(Constants.NEW_THINGS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    let found = false;
    for (let thing of res.body) {
      if (thing.href === Constants.THINGS_PATH + '/' + thingId) {
        found = true;
      }
    }
    expect(found).assert('should find thing in /new_things output');

    res = await chai.request(server)
      .post(Constants.THINGS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send(descr);
    expect(res.status).toEqual(201);

    res = await chai.request(server)
      .get(Constants.NEW_THINGS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    found = false;
    for (let thing of res.body) {
      if (thing.href === Constants.THINGS_PATH + '/' + thingId) {
        found = true;
      }
    }
    expect(!found).assert('should find no longer thing in /new_things output:'
      + JSON.stringify(res.body, null, 2));

    res = await chai.request(server)
      .get(Constants.THINGS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    found = false;
    for (let thing of res.body) {
      if (thing.href === Constants.THINGS_PATH + '/' + thingId) {
        found = true;
      }
    }
    expect(found).assert('should find thing in /new_things output');
  });

  it('should remove a thing', async () => {
    let thingId = 'test-6';
    let descr = makeDescr(thingId);
    mockAdapter().pairDevice(thingId, descr);
    // send pair action
    let pair = await chai.request(server)
      .post(Constants.ACTIONS_PATH)
      .set(...headerAuth(jwt))
      .set('Accept', 'application/json')
      .send({name: 'pair'});
    expect(pair.status).toEqual(201);

    let res = await chai.request(server)
      .delete(Constants.THINGS_PATH + '/' + thingId)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(204);

    res = await chai.request(server)
      .get(Constants.THINGS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    let found = false;
    for (let thing of res.body) {
      if (thing.href === Constants.THINGS_PATH + '/' + thingId) {
        found = true;
      }
    }
    expect(!found).assert('should not find thing in /things output');

    res = await chai.request(server)
      .get(Constants.NEW_THINGS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    found = false;
    for (let thing of res.body) {
      if (thing.href === Constants.THINGS_PATH + '/' + thingId) {
        found = true;
      }
    }
    expect(found).assert('should find thing in /new_things output');
  });

  it('should remove a device', async () => {
    let thingId = 'test-6';
    await addDevice(Object.assign({}, TEST_THING, {
      id: thingId
    }));
    let descr = makeDescr(thingId);
    mockAdapter().pairDevice(thingId, descr);
    // send pair action
    let pair = await chai.request(server)
      .post(Constants.ACTIONS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({name: 'pair'});
    expect(pair.status).toEqual(201);
    await mockAdapter().removeDevice(thingId);

    const res = await chai.request(server)
      .get(Constants.NEW_THINGS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    let found = false;
    for (let thing of res.body) {
      if (thing.href === Constants.THINGS_PATH + '/' + thingId) {
        found = true;
      }
    }
    expect(!found).assert('should not find thing in /new_things output');
  });

  it('should remove a device in response to unpair', async () => {
    await mockAdapter().addDevice('test-5', makeDescr('test-5'));
    let thingId = 'test-5';
    // The mock adapter requires knowing in advance that we're going to unpair
    // a specific device
    mockAdapter().unpairDevice(thingId);
    let res = await chai.request(server)
      .post(Constants.ACTIONS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({name: 'unpair', parameters: {id: thingId}});
    expect(res.status).toEqual(201);

    res = await chai.request(server)
      .get(Constants.NEW_THINGS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    let found = false;
    for (let thing of res.body) {
      if (thing.href === Constants.THINGS_PATH + '/' + thingId) {
        found = true;
      }
    }

    expect(!found).assert('should not find thing in /new_things output');
  });

  it('should receive propertyStatus messages over websocket', async () => {
    await addDevice();
    let ws = await webSocketOpen(Constants.THINGS_PATH + '/' + TEST_THING.id,
      jwt);

    let [messages, res] = await Promise.all([
      webSocketRead(ws, 1),
      chai.request(server)
        .put(Constants.THINGS_PATH + '/' + TEST_THING.id + '/properties/on')
        .set('Accept', 'application/json')
        .set(...headerAuth(jwt))
        .send({on: true})
    ]);
    expect(res.status).toEqual(200);
    expect(messages[0].messageType).toEqual(Constants.PROPERTY_STATUS);
    expect(messages[0].data.on).toEqual(true);

    await webSocketClose(ws);
  });

  it('should set a property using setProperty over websocket', async () => {
    await addDevice();
    let ws = await webSocketOpen(Constants.THINGS_PATH + '/' + TEST_THING.id,
      jwt);

    await webSocketSend(ws, {
      messageType: Constants.SET_PROPERTY,
      data: {
        on: true
      }
    });

    const on = await chai.request(server)
      .get(Constants.THINGS_PATH + '/test-1/properties/on')
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(on.status).toEqual(200);
    expect(on.body).toHaveProperty('on');
    expect(on.body.on).toEqual(true);

    await webSocketClose(ws);
  });

  it('should fail to set a nonexistent property using setProperty', async () =>
  {
    await addDevice();
    let ws = await webSocketOpen(Constants.THINGS_PATH + '/' + TEST_THING.id,
      jwt);

    let request = {
      messageType: Constants.SET_PROPERTY,
      data: {
        rutabaga: true
      }
    };
    let [sendError, messages] = await Promise.all([
      webSocketSend(ws, request),
      webSocketRead(ws, 1)
    ]);

    expect(sendError).toBeFalsy();

    let error = messages[0];
    expect(error.messageType).toBe(Constants.ERROR);
    expect(error.data.request).toMatchObject(request);

    await webSocketClose(ws);
  });

  it('should receive an error from sending a malformed message', async () =>
  {
    await addDevice();
    let ws = await webSocketOpen(Constants.THINGS_PATH + '/' + TEST_THING.id,
      jwt);

    let request = 'good morning friend I am not JSON';

    let [sendError, messages] = await Promise.all([
      webSocketSend(ws, request),
      webSocketRead(ws, 1)
    ]);

    expect(sendError).toBeFalsy();

    let error = messages[0];
    expect(error.messageType).toBe(Constants.ERROR);

    await webSocketClose(ws);
  });

  it('should fail to connect to a nonexistent thing over websocket',
  async () => {
    let ws = await webSocketOpen(Constants.THINGS_PATH + '/nonexistent-thing',
      jwt);

    let messages = await webSocketRead(ws, 1);

    let error = messages[0];
    expect(error.messageType).toBe(Constants.ERROR);
    expect(error.data.status).toEqual('404 Not Found');

    await e2p(ws, 'close');
  });

  it('should only receive propertyStatus messages from the connected thing',
  async () => {
    await addDevice();
    let otherThingId = 'test-7';
    await addDevice(Object.assign({}, TEST_THING, {
      id: otherThingId,
      name: otherThingId
    }));
    let ws = await webSocketOpen(Constants.THINGS_PATH + '/' + TEST_THING.id,
      jwt);


    // PUT test-7 on true, then test-1 on true, then test-1 on false. If we
    // receive an update that on is true twice, we know that the WS received
    // both test-7 and test-1's statuses. If we receive true then false, the WS
    // correctly received both of test-1's statuses.
    let [res, messages] = await Promise.all([
      chai.request(server)
        .put(Constants.THINGS_PATH + '/' + otherThingId + '/properties/on')
        .set('Accept', 'application/json')
        .set(...headerAuth(jwt))
        .send({on: true}).then(() => {
          return chai.request(server)
            .put(Constants.THINGS_PATH + '/' + TEST_THING.id + '/properties/on')
            .set('Accept', 'application/json')
            .set(...headerAuth(jwt))
            .send({on: true});
        }).then(() => {
          return chai.request(server)
            .put(Constants.THINGS_PATH + '/' + TEST_THING.id + '/properties/on')
            .set('Accept', 'application/json')
            .set(...headerAuth(jwt))
            .send({on: false});
        }),
      webSocketRead(ws, 2)
    ]);

    expect(res.status).toEqual(200);

    expect(messages[0].messageType).toEqual(Constants.PROPERTY_STATUS);
    expect(messages[0].data.on).toEqual(true);

    expect(messages[1].messageType).toEqual(Constants.PROPERTY_STATUS);
    expect(messages[1].data.on).toEqual(false);

    await webSocketClose(ws);
  });

  it('should receive event notifications over websocket',
  async () => {
    await addDevice();
    let ws = await webSocketOpen(Constants.THINGS_PATH + '/' + TEST_THING.id,
      jwt);


    const Things = require('../../models/things');
    const Event = require('../../models/event');

    let thing = await Things.getThing(TEST_THING.id);
    let eventAFirst = new Event('a', 'just a cool event');
    let eventB = new Event('b', 'just a boring event');
    let eventASecond = new Event('a', 'just another cool event');

    let subscriptionRequest = {
      messageType: Constants.ADD_EVENT_SUBSCRIPTION,
      data: {
        name: 'a'
      }
    };

    await webSocketSend(ws, subscriptionRequest);

    let [res, messages] = await Promise.all([
      (async () => {
        await new Promise(res => {
          setTimeout(res, 0);
        });
        thing.dispatchEvent(eventAFirst);
        thing.dispatchEvent(eventB);
        thing.dispatchEvent(eventASecond);
        return true;
      })(),
      webSocketRead(ws, 2)
    ]);

    expect(res).toBeTruthy();

    expect(messages[0].messageType).toEqual(Constants.EVENT);
    expect(messages[0].data.name).toEqual(eventAFirst.name);
    expect(messages[0].data.description).toEqual(eventAFirst.description);

    expect(messages[1].messageType).toEqual(Constants.EVENT);
    expect(messages[1].data.name).toEqual(eventASecond.name);
    expect(messages[1].data.description).toEqual(eventASecond.description);

    await webSocketClose(ws);
  });

  it('should receive thing\'s action status messages over websocket',
  async () => {
    await addDevice();
    let ws = await webSocketOpen(Constants.THINGS_PATH + '/' + TEST_THING.id,
      jwt);

    const [actionId, messages] = await Promise.all([
      (async () => {
        await chai.request(server)
          .post(Constants.ACTIONS_PATH)
          .set('Accept', 'application/json')
          .set(...headerAuth(jwt))
          .send({name: 'pair'});

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

  it('should close websocket connections on thing deletion', async () => {
    await addDevice();
    let ws = await webSocketOpen(Constants.THINGS_PATH + '/' + TEST_THING.id,
      jwt);

    let res = await chai.request(server)
      .delete(Constants.THINGS_PATH + '/' + TEST_THING.id)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(204);

    await e2p(ws, 'close');
  });

  it('creates and gets the actions of a thing', async () => {
    await addDevice(piDescr);

    const thingBase = Constants.THINGS_PATH + '/' + piDescr.id;

    let res = await chai.request(server)
      .get(thingBase)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);

    const actionDescr = {
      name: 'reboot'
    };

    res = await chai.request(server)
      .post(thingBase + Constants.ACTIONS_PATH)
      .set(...headerAuth(jwt))
      .set('Accept', 'application/json')
      .send(actionDescr);
    expect(res.status).toEqual(201);

    res = await chai.request(server)
      .get(thingBase + Constants.ACTIONS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(1);
    expect(res.body[0]).toHaveProperty('name');
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0].name).toEqual('reboot');
    expect(res.body[0].href.startsWith(thingBase)).toBeTruthy();

    // Expect it to also show up in the root actions route
    res = await chai.request(server)
      .get(Constants.ACTIONS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(1);
    expect(res.body[0]).toHaveProperty('name');
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0].name).toEqual('reboot');
    expect(res.body[0].href.startsWith(thingBase)).toBeTruthy();
  });

  it('fails to create thing action which does not exist', async () => {
    await addDevice(piDescr);

    const thingBase = Constants.THINGS_PATH + '/' + piDescr.id;

    let res = await chai.request(server)
      .get(thingBase)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);

    const actionDescr = {
      name: 'pair'
    };

    let err = await pFinal(chai.request(server)
      .post(thingBase + Constants.ACTIONS_PATH)
      .set(...headerAuth(jwt))
      .set('Accept', 'application/json')
      .send(actionDescr));
    expect(err.response.status).toEqual(400);
  });
});
