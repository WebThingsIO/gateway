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
  openWebSocket,
  readWebSocket,
  closeWebSocket
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
      .send(TEST_THING);
    mockAdapter().addDevice(id, TEST_THING);
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
    await addDevice();
    const res = await chai.request(server)
      .get(Constants.THINGS_PATH + '/test-1')
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('name');
    expect(res.body.name).toEqual('test-1');
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
    mockAdapter().addDevice('test-2', makeDescr('test-2'));
    mockAdapter().addDevice('test-3', makeDescr('test-3'));

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
    let ws = await openWebSocket(Constants.NEW_THINGS_PATH, jwt);

    // We expect things test-4, and test-5 to show up eventually
    const [messages, res] = await Promise.all([
      readWebSocket(ws, 2),
      (async () => {
        const res = await chai.request(server)
          .post(Constants.ACTIONS_PATH)
          .set('Accept', 'application/json')
          .set(...headerAuth(jwt))
          .send({name: 'pair'});

        mockAdapter().addDevice('test-4', makeDescr('test-4'));
        mockAdapter().addDevice('test-5', makeDescr('test-5'));
        return res;
      })(),
    ]);

    let parsedIds = messages.map(msg => {
      expect(typeof msg.id).toBe('string');
      return msg.id;
    });
    expect(parsedIds.sort()).toEqual(['test-4', 'test-5']);
    expect(res.status).toEqual(201);

    await closeWebSocket(ws);
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
    mockAdapter().addDevice('test-5', makeDescr('test-5'));
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
    let ws = await openWebSocket(Constants.THINGS_PATH + '/' + TEST_THING.id,
      jwt);

    let [res, messages] = await Promise.all([
      (async () => {
        await addDevice();
        return await chai.request(server)
          .put(Constants.THINGS_PATH + '/' + TEST_THING.id + '/properties/on')
          .set('Accept', 'application/json')
          .set(...headerAuth(jwt))
          .send({on: true});
      })(),
      readWebSocket(ws, 2)
    ]);
    expect(res.status).toEqual(200);
    expect(messages[0].messageType).toEqual(Constants.PROPERTY_STATUS);
    // NB: the property changes from undefined to false
    expect(messages[0].data.on).toEqual(false);

    expect(messages[1].messageType).toEqual(Constants.PROPERTY_STATUS);
    expect(messages[1].data.on).toEqual(true);

    await closeWebSocket(ws);
  });

});
