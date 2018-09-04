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
  webSocketClose,
} = require('../websocket-util');

const WebSocket = require('ws');

const Constants = require('../../constants');
const Event = require('../../models/event');
const Events = require('../../models/events');

const TEST_THING = {
  id: 'test-1',
  type: 'onOffSwitch',
  name: 'test-1',
  '@context': 'https://iot.mozilla.org/schemas',
  '@type': ['OnOffSwitch'],
  properties: {
    power: {
      '@type': 'OnOffProperty',
      type: 'boolean',
      value: false,
    },
    percent: {
      '@type': 'LevelProperty',
      type: 'number',
      value: 20,
    },
  },
};

const piDescr = {
  id: 'pi-1',
  type: 'thing',
  name: 'pi-1',
  '@context': 'https://iot.mozilla.org/schemas',
  '@type': ['OnOffSwitch'],
  properties: {
    power: {
      '@type': 'OnOffProperty',
      type: 'boolean',
      value: true,
    },
  },
  actions: {
    reboot: {
      description: 'Reboot the device',
    },
  },
  events: {
    reboot: {
      description: 'Going down for reboot',
    },
  },
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
      properties: {},
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
    } catch (err) {
      expect(err.response.status).toEqual(400);
    }
  });

  it('fail to create a new thing (duplicate)', async () => {
    await addDevice();
    const err = await pFinal(addDevice());
    expect(err.response.status).toEqual(400);
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
    expect(res.body[0].href).toEqual(`${Constants.THINGS_PATH}/test-1`);
  });

  it('GET a thing', async () => {
    const thingDescr = JSON.parse(JSON.stringify(piDescr));

    await addDevice(thingDescr);
    const res = await chai.request(server)
      .get(`${Constants.THINGS_PATH}/${thingDescr.id}`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('name');
    expect(res.body.name).toEqual(thingDescr.name);
    delete thingDescr.id;
    delete thingDescr.properties.power.value;
    expect(res.body).toMatchObject(thingDescr);
  });

  it('fail to GET a non-existent thing', async () => {
    await addDevice();
    const err = await pFinal(chai.request(server)
      .get(`${Constants.THINGS_PATH}/test-2`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt)));

    expect(err.response.status).toEqual(404);
  });

  it('fail to rename a thing', async () => {
    const thingDescr = Object.assign({}, piDescr);

    await addDevice(thingDescr);
    const res = await chai.request(server)
      .get(`${Constants.THINGS_PATH}/${thingDescr.id}`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('name');
    expect(res.body.name).toEqual(thingDescr.name);

    let err = await pFinal(chai.request(server)
      .put(`${Constants.THINGS_PATH}/${thingDescr.id}`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({}));

    expect(err.response.status).toEqual(400);

    err = await pFinal(chai.request(server)
      .put(`${Constants.THINGS_PATH}/${thingDescr.id}`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({name: '  \n  '}));

    expect(err.response.status).toEqual(400);
  });

  it('rename a thing', async () => {
    const thingDescr = Object.assign({}, piDescr);

    await addDevice(thingDescr);
    let res = await chai.request(server)
      .get(`${Constants.THINGS_PATH}/${thingDescr.id}`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('name');
    expect(res.body.name).toEqual(thingDescr.name);

    res = await chai.request(server)
      .put(`${Constants.THINGS_PATH}/${thingDescr.id}`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({name: 'new name'});

    expect(res.status).toEqual(200);

    res = await chai.request(server)
      .get(`${Constants.THINGS_PATH}/${thingDescr.id}`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('name');
    expect(res.body.name).toEqual('new name');
  });

  it('GET all properties of a thing', async () => {
    await addDevice();
    const res = await chai.request(server)
      .get(`${Constants.THINGS_PATH}/test-1/properties`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('power');
    expect(res.body.power).toEqual(false);
    expect(res.body).toHaveProperty('percent');
    expect(res.body.percent).toEqual(20);
  });

  it('GET a property of a thing', async () => {
    await addDevice();
    const res = await chai.request(server)
      .get(`${Constants.THINGS_PATH}/test-1/properties/power`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('power');
    expect(res.body.power).toEqual(false);
  });

  it('fail to GET a non-existant property of a thing', async () => {
    const err = await pFinal(chai.request(server)
      .get(`${Constants.THINGS_PATH}/test-1/properties/xyz`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt)));

    expect(err.response.status).toEqual(500);
  });

  it('fail to GET a property of a non-existent thing', async () => {
    const err = await pFinal(chai.request(server)
      .get(`${Constants.THINGS_PATH}/test-1a/properties/power`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt)));
    expect(err.response.status).toEqual(500);
  });

  it('fail to set a property of a thing', async () => {
    await addDevice();
    const err = await pFinal(chai.request(server)
      .put(`${Constants.THINGS_PATH}/test-1/properties/power`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({}));
    expect(err.response.status).toEqual(400);
  });

  it('fail to set a property of a thing', async () => {
    const err = await pFinal(chai.request(server)
      .put(`${Constants.THINGS_PATH}/test-1/properties/power`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({abc: true}));
    expect(err.response.status).toEqual(400);
  });

  it('set a property of a thing', async () => {
    await addDevice();
    const on = await chai.request(server)
      .put(`${Constants.THINGS_PATH}/test-1/properties/power`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({power: true});

    expect(on.status).toEqual(200);
    expect(on.body).toHaveProperty('power');
    expect(on.body.power).toEqual(true);


    // Flip it back to off...
    const off = await chai.request(server)
      .put(`${Constants.THINGS_PATH}/test-1/properties/power`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({power: false});

    expect(off.status).toEqual(200);
    expect(off.body).toHaveProperty('power');
    expect(off.body.power).toEqual(false);
  });

  it('set x and y coordinates of a thing', async () => {
    await addDevice();
    const on = await chai.request(server)
      .patch(`${Constants.THINGS_PATH}/test-1`)
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
      .patch(`${Constants.THINGS_PATH}/test-1`)
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
      .set(...headerAuth(jwt));

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
    expect(res.body[0].href).toEqual(`${Constants.THINGS_PATH}/test-2`);
    expect(res.body[1]).toHaveProperty('href');
    expect(res.body[1].href).toEqual(`${Constants.THINGS_PATH}/test-3`);
  });

  it('should send multiple devices during pairing', async () => {
    const ws = await webSocketOpen(Constants.NEW_THINGS_PATH, jwt);

    // We expect things test-4, and test-5 to show up eventually
    const [messages, res] = await Promise.all([
      webSocketRead(ws, 2),
      (async () => {
        const res = await chai.request(server)
          .post(Constants.ACTIONS_PATH)
          .set('Accept', 'application/json')
          .set(...headerAuth(jwt))
          .send({pair: {input: {timeout: 60}}});

        await mockAdapter().addDevice('test-4', makeDescr('test-4'));
        await mockAdapter().addDevice('test-5', makeDescr('test-5'));
        return res;
      })(),
    ]);

    const parsedIds = messages.map((msg) => {
      expect(typeof msg.id).toBe('string');
      return msg.id;
    });
    expect(parsedIds.sort()).toEqual(['test-4', 'test-5']);
    expect(res.status).toEqual(201);

    await webSocketClose(ws);
  });

  it('should add a device during pairing then create a thing', async () => {
    const thingId = 'test-6';
    const descr = makeDescr(thingId);
    mockAdapter().pairDevice(thingId, descr);
    // send pair action
    let res = await chai.request(server)
      .post(Constants.ACTIONS_PATH)
      .set(...headerAuth(jwt))
      .set('Accept', 'application/json')
      .send({pair: {input: {timeout: 60}}});
    expect(res.status).toEqual(201);

    res = await chai.request(server)
      .get(Constants.NEW_THINGS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    let found = false;
    for (const thing of res.body) {
      if (thing.href === `${Constants.THINGS_PATH}/${thingId}`) {
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
    for (const thing of res.body) {
      if (thing.href === `${Constants.THINGS_PATH}/${thingId}`) {
        found = true;
      }
    }
    expect(!found).assert(
      `should find no longer thing in /new_things output:${
        JSON.stringify(res.body, null, 2)}`);

    res = await chai.request(server)
      .get(Constants.THINGS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    found = false;
    for (const thing of res.body) {
      if (thing.href === `${Constants.THINGS_PATH}/${thingId}`) {
        found = true;
      }
    }
    expect(found).assert('should find thing in /new_things output');
  });

  it('should remove a thing', async () => {
    const thingId = 'test-6';
    const descr = makeDescr(thingId);
    mockAdapter().pairDevice(thingId, descr);
    // send pair action
    const pair = await chai.request(server)
      .post(Constants.ACTIONS_PATH)
      .set(...headerAuth(jwt))
      .set('Accept', 'application/json')
      .send({pair: {input: {timeout: 60}}});
    expect(pair.status).toEqual(201);

    let res = await chai.request(server)
      .delete(`${Constants.THINGS_PATH}/${thingId}`)
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
    for (const thing of res.body) {
      if (thing.href === `${Constants.THINGS_PATH}/${thingId}`) {
        found = true;
      }
    }
    expect(!found).assert('should not find thing in /things output');
  });

  it('should remove a device', async () => {
    const thingId = 'test-6';
    await addDevice(Object.assign({}, TEST_THING, {
      id: thingId,
    }));
    const descr = makeDescr(thingId);
    mockAdapter().pairDevice(thingId, descr);
    // send pair action
    const pair = await chai.request(server)
      .post(Constants.ACTIONS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({pair: {input: {timeout: 60}}});
    expect(pair.status).toEqual(201);
    await mockAdapter().removeDevice(thingId);

    const res = await chai.request(server)
      .get(Constants.NEW_THINGS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    let found = false;
    for (const thing of res.body) {
      if (thing.href === `${Constants.THINGS_PATH}/${thingId}`) {
        found = true;
      }
    }
    expect(!found).assert('should not find thing in /new_things output');
  });

  it('should remove a device in response to unpair', async () => {
    await mockAdapter().addDevice('test-5', makeDescr('test-5'));
    const thingId = 'test-5';
    // The mock adapter requires knowing in advance that we're going to unpair
    // a specific device
    mockAdapter().unpairDevice(thingId);
    let res = await chai.request(server)
      .post(Constants.ACTIONS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({unpair: {input: {id: thingId}}});
    expect(res.status).toEqual(201);

    res = await chai.request(server)
      .get(Constants.NEW_THINGS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    let found = false;
    for (const thing of res.body) {
      if (thing.href === `${Constants.THINGS_PATH}/${thingId}`) {
        found = true;
      }
    }

    expect(!found).assert('should not find thing in /new_things output');
  });

  it('should receive propertyStatus messages over websocket', async () => {
    await addDevice();
    const ws = await webSocketOpen(`${Constants.THINGS_PATH}/${TEST_THING.id}`,
                                   jwt);

    const [messages, res] = await Promise.all([
      webSocketRead(ws, 1),
      chai.request(server)
        .put(`${Constants.THINGS_PATH}/${TEST_THING.id}/properties/power`)
        .set('Accept', 'application/json')
        .set(...headerAuth(jwt))
        .send({power: true}),
    ]);
    expect(res.status).toEqual(200);
    expect(messages[0].messageType).toEqual(Constants.PROPERTY_STATUS);
    expect(messages[0].data.power).toEqual(true);

    await webSocketClose(ws);
  });

  it('should set a property using setProperty over websocket', async () => {
    await addDevice();
    const ws = await webSocketOpen(`${Constants.THINGS_PATH}/${TEST_THING.id}`,
                                   jwt);

    await webSocketSend(ws, {
      messageType: Constants.SET_PROPERTY,
      data: {
        power: true,
      },
    });

    const on = await chai.request(server)
      .get(`${Constants.THINGS_PATH}/test-1/properties/power`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(on.status).toEqual(200);
    expect(on.body).toHaveProperty('power');
    expect(on.body.power).toEqual(true);

    await webSocketClose(ws);
  });

  it('should fail to set a nonexistent property using setProperty',
     async () => {
       await addDevice();
       const ws = await webSocketOpen(
         `${Constants.THINGS_PATH}/${TEST_THING.id}`, jwt);

       const request = {
         messageType: Constants.SET_PROPERTY,
         data: {
           rutabaga: true,
         },
       };
       const [sendError, messages] = await Promise.all([
         webSocketSend(ws, request),
         webSocketRead(ws, 1),
       ]);

       expect(sendError).toBeFalsy();

       const error = messages[0];
       expect(error.messageType).toBe(Constants.ERROR);
       expect(error.data.request).toMatchObject(request);

       await webSocketClose(ws);
     });

  it('should receive an error from sending a malformed message',
     async () => {
       await addDevice();
       const ws =
         await webSocketOpen(`${Constants.THINGS_PATH}/${TEST_THING.id}`, jwt);

       const request = 'good morning friend I am not JSON';

       const [sendError, messages] = await Promise.all([
         webSocketSend(ws, request),
         webSocketRead(ws, 1),
       ]);

       expect(sendError).toBeFalsy();

       const error = messages[0];
       expect(error.messageType).toBe(Constants.ERROR);

       await webSocketClose(ws);
     });

  it('should fail to connect to a nonexistent thing over websocket',
     async () => {
       const ws = await webSocketOpen(
         `${Constants.THINGS_PATH}/nonexistent-thing`, jwt);

       const messages = await webSocketRead(ws, 1);

       const error = messages[0];
       expect(error.messageType).toBe(Constants.ERROR);
       expect(error.data.status).toEqual('404 Not Found');

       if (ws.readyState !== WebSocket.CLOSED) {
         await e2p(ws, 'close');
       }
     });

  it('should only receive propertyStatus messages from the connected thing',
     async () => {
       await addDevice();
       const otherThingId = 'test-7';
       await addDevice(Object.assign({}, TEST_THING, {
         id: otherThingId,
         name: otherThingId,
       }));
       const ws =
         await webSocketOpen(`${Constants.THINGS_PATH}/${TEST_THING.id}`, jwt);


       // PUT test-7 on true, then test-1 on true, then test-1 on false. If we
       // receive an update that on is true twice, we know that the WS received
       // both test-7 and test-1's statuses. If we receive true then false, the
       // WS correctly received both of test-1's statuses.
       const [res, messages] = await Promise.all([
         chai.request(server)
           .put(`${Constants.THINGS_PATH}/${otherThingId}/properties/power`)
           .set('Accept', 'application/json')
           .set(...headerAuth(jwt))
           .send({power: true}).then(() => {
             return chai.request(server)
               .put(`${Constants.THINGS_PATH}/${TEST_THING.id
               }/properties/power`)
               .set('Accept', 'application/json')
               .set(...headerAuth(jwt))
               .send({power: true});
           }).then(() => {
             return chai.request(server)
               .put(`${Constants.THINGS_PATH}/${TEST_THING.id
               }/properties/power`)
               .set('Accept', 'application/json')
               .set(...headerAuth(jwt))
               .send({power: false});
           }),
         webSocketRead(ws, 2),
       ]);

       expect(res.status).toEqual(200);

       expect(messages[0].messageType).toEqual(Constants.PROPERTY_STATUS);
       expect(messages[0].data.power).toEqual(true);

       expect(messages[1].messageType).toEqual(Constants.PROPERTY_STATUS);
       expect(messages[1].data.power).toEqual(false);

       await webSocketClose(ws);
     });

  it('should receive event notifications over websocket',
     async () => {
       await addDevice();
       const ws =
         await webSocketOpen(`${Constants.THINGS_PATH}/${TEST_THING.id}`, jwt);

       const eventAFirst = new Event('a', 'just a cool event', TEST_THING.id);
       const eventB = new Event('b', 'just a boring event', TEST_THING.id);
       const eventASecond =
         new Event('a', 'just another cool event', TEST_THING.id);

       const subscriptionRequest = {
         messageType: Constants.ADD_EVENT_SUBSCRIPTION,
         data: {
           a: {},
         },
       };

       await webSocketSend(ws, subscriptionRequest);

       const [res, messages] = await Promise.all([
         (async () => {
           await new Promise((res) => {
             setTimeout(res, 0);
           });
           Events.add(eventAFirst);
           Events.add(eventB);
           Events.add(eventASecond);
           return true;
         })(),
         webSocketRead(ws, 2),
       ]);

       expect(res).toBeTruthy();

       expect(messages[0].messageType).toEqual(Constants.EVENT);
       expect(messages[0].data).toHaveProperty(eventAFirst.name);
       expect(messages[0].data[eventAFirst.name]).toHaveProperty('data');
       expect(messages[0].data[eventAFirst.name].data).toEqual(
         eventAFirst.data);

       expect(messages[1].messageType).toEqual(Constants.EVENT);
       expect(messages[1].data).toHaveProperty(eventASecond.name);
       expect(messages[1].data[eventASecond.name]).toHaveProperty('data');
       expect(
         messages[1].data[eventASecond.name].data).toEqual(eventASecond.data);

       await webSocketClose(ws);
     });

  it('should receive thing\'s action status messages over websocket',
     async () => {
       await addDevice();
       const ws =
         await webSocketOpen(`${Constants.THINGS_PATH}/${TEST_THING.id}`, jwt);

       const [actionHref, messages] = await Promise.all([
         (async () => {
           await chai.request(server)
             .post(Constants.ACTIONS_PATH)
             .set('Accept', 'application/json')
             .set(...headerAuth(jwt))
             .send({pair: {input: {timeout: 60}}});

           let res = await chai.request(server)
             .get(Constants.ACTIONS_PATH)
             .set('Accept', 'application/json')
             .set(...headerAuth(jwt));
           expect(res.status).toEqual(200);
           expect(Array.isArray(res.body)).toBeTruthy();
           expect(res.body.length).toEqual(1);
           const actionHref = res.body[0].pair.href;

           res = await chai.request(server)
             .delete(actionHref)
             .set('Accept', 'application/json')
             .set(...headerAuth(jwt));
           expect(res.status).toEqual(204);

           res = await chai.request(server)
             .get(Constants.ACTIONS_PATH)
             .set('Accept', 'application/json')
             .set(...headerAuth(jwt));

           expect(Array.isArray(res.body)).toBeTruthy();
           expect(res.body.length).toEqual(0);

           return actionHref;
         })(),
         webSocketRead(ws, 3),
       ]);

       expect(messages[0].messageType).toEqual(Constants.ACTION_STATUS);
       expect(messages[0].data.pair.status).toEqual('created');
       expect(messages[0].data.pair.href).toEqual(actionHref);

       expect(messages[1].messageType).toEqual(Constants.ACTION_STATUS);
       expect(messages[1].data.pair.status).toEqual('pending');
       expect(messages[1].data.pair.href).toEqual(actionHref);

       expect(messages[2].messageType).toEqual(Constants.ACTION_STATUS);
       expect(messages[2].data.pair.status).toEqual('deleted');
       expect(messages[2].data.pair.href).toEqual(actionHref);

       await webSocketClose(ws);
     });

  it('should close websocket connections on thing deletion', async () => {
    await addDevice();
    const ws = await webSocketOpen(`${Constants.THINGS_PATH}/${TEST_THING.id}`,
                                   jwt);

    const res = await chai.request(server)
      .delete(`${Constants.THINGS_PATH}/${TEST_THING.id}`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(204);

    await e2p(ws, 'close');
  });

  it('creates and gets the actions of a thing', async () => {
    await addDevice(piDescr);

    const thingBase = `${Constants.THINGS_PATH}/${piDescr.id}`;

    let res = await chai.request(server)
      .get(thingBase)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);

    const actionDescr = {
      reboot: {},
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
    expect(res.body[0]).toHaveProperty('reboot');
    expect(res.body[0].reboot).toHaveProperty('href');
    expect(res.body[0].reboot.href.startsWith(thingBase)).toBeTruthy();

    // Expect it to not show up in the root (Gateway's) actions route
    res = await chai.request(server)
      .get(Constants.ACTIONS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(0);
  });

  it('fails to create an action on a nonexistent thing', async () => {
    const thingBase = `${Constants.THINGS_PATH}/nonexistent-thing`;

    const actionDescr = {
      pair: {
        input: {
          timeout: 60,
        },
      },
    };

    const err = await pFinal(chai.request(server)
      .post(thingBase + Constants.ACTIONS_PATH)
      .set(...headerAuth(jwt))
      .set('Accept', 'application/json')
      .send(actionDescr));
    expect(err.response.status).toEqual(404);
  });

  it('fails to create thing action which does not exist', async () => {
    await addDevice(piDescr);

    const thingBase = `${Constants.THINGS_PATH}/${piDescr.id}`;

    const res = await chai.request(server)
      .get(thingBase)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);

    const actionDescr = {
      pair: {
        input: {
          timeout: 60,
        },
      },
    };

    const err = await pFinal(chai.request(server)
      .post(thingBase + Constants.ACTIONS_PATH)
      .set(...headerAuth(jwt))
      .set('Accept', 'application/json')
      .send(actionDescr));
    expect(err.response.status).toEqual(400);
  });

  it('should create an action over websocket', async () => {
    await addDevice(piDescr);
    const thingBase = `${Constants.THINGS_PATH}/${piDescr.id}`;
    const ws = await webSocketOpen(thingBase, jwt);

    const [_, messages] = await Promise.all([
      webSocketSend(ws, {
        messageType: Constants.REQUEST_ACTION,
        data: {
          reboot: {},
        },
      }),
      webSocketRead(ws, 1),
    ]);

    const actionStatus = messages[0];
    expect(actionStatus.messageType).toEqual(Constants.ACTION_STATUS);
    expect(actionStatus.data).toHaveProperty('reboot');

    const res = await chai.request(server)
      .get(thingBase + Constants.ACTIONS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(1);
    expect(res.body[0]).toHaveProperty('reboot');
    expect(res.body[0].reboot).toHaveProperty('href');
    expect(res.body[0].reboot.href.startsWith(thingBase)).toBeTruthy();

    await webSocketClose(ws);
  });

  it('should fail to create an unknown action over websocket', async () => {
    await addDevice(piDescr);
    const thingBase = `${Constants.THINGS_PATH}/${piDescr.id}`;
    const ws = await webSocketOpen(thingBase, jwt);

    const [_, messages] = await Promise.all([
      webSocketSend(ws, {
        messageType: Constants.REQUEST_ACTION,
        data: {
          pair: {
            input: {
              timeout: 60,
            },
          },
        },
      }),
      webSocketRead(ws, 2),
    ]);

    const created = messages[0];
    expect(created.messageType).toEqual(Constants.ACTION_STATUS);
    expect(created.data.pair.status).toEqual('created');

    const err = messages[1];
    expect(err.messageType).toEqual(Constants.ERROR);

    await webSocketClose(ws);
  });

  it('should fail to handle an unknown websocket messageType', async () => {
    await addDevice(piDescr);
    const thingBase = `${Constants.THINGS_PATH}/${piDescr.id}`;
    const ws = await webSocketOpen(thingBase, jwt);

    const [_, messages] = await Promise.all([
      webSocketSend(ws, {
        messageType: 'tomato',
        data: {},
      }),
      webSocketRead(ws, 1),
    ]);

    const actionStatus = messages[0];
    expect(actionStatus.messageType).toEqual(Constants.ERROR);

    await webSocketClose(ws);
  });

  it('fail to set PIN for device', async () => {
    await addDevice(piDescr);

    const err = await pFinal(chai.request(server)
      .patch(Constants.THINGS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({thingId: piDescr.id, pin: '0000'}));

    expect(err.response.status).toEqual(400);
  });

  it('set PIN for device', async () => {
    await addDevice(piDescr);

    const res = await chai.request(server)
      .patch(Constants.THINGS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({thingId: piDescr.id, pin: '1234'});

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('name');
    expect(res.body.name).toEqual(piDescr.name);
    expect(res.body).toHaveProperty('type');
    expect(res.body.type).toEqual(piDescr.type);
  });
});
