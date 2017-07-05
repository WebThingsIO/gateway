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

var Constants = require('../../constants');
const WebSocket = require('ws');

const TEST_THING = {
  id: 'test-1',
  type: 'onOffSwitch',
  name: 'test-1',
  properties: {
    on : {type: 'boolean', value: false}
  }
};

describe('actions/', function() {
  let jwt, toClose = [];
  beforeEach(async () => {
    jwt = await createUser(server, TEST_USER);
  });

  // Ensure these objects get properly closed after tests.
  afterAll(async () => {
    await Promise.all(toClose.map(async (item) => {
      item.close();
      await e2p(item, 'close');
    }));
  });

  /**
   * Add an item (any interface /w close event and method) to the list of
   * resources that must be closed to cleanly exit the test.
   */
  function ensureClose(item) {
    toClose.push(item);
  }

  async function addDevice(desc = TEST_THING) {
    const {id} = desc;
    const res = await chai.request(server)
      .post(Constants.THINGS_PATH)
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
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(1);
    expect(res.body[0]).toHaveProperty('href');
    expect(res.body[0].href).toEqual(Constants.THINGS_PATH + '/test-1');
  });

  it('GET a property of a thing', async () => {
    await addDevice();
    const res = await chai.request(server)
      .get(Constants.THINGS_PATH + '/test-1/properties/on')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('on');
    expect(res.body.on).toEqual(false);
  });

  it('fail to GET a non-existant property of a thing', async () => {
    const err = await pFinal(chai.request(server)
      .get(Constants.THINGS_PATH + '/test-1/properties/xyz')
      .set(...headerAuth(jwt)));

    expect(err.response.status).toEqual(500);
  });

  it('fail to GET a property of a non-existent thing', async () => {
    const err = await pFinal(chai.request(server)
      .get(Constants.THINGS_PATH + '/test-1a/properties/on')
      .set(...headerAuth(jwt)));
    expect(err.response.status).toEqual(500);
  });

  it('fail to set a property of a thing', async () => {
    await addDevice();
    const err = await pFinal(chai.request(server)
      .put(Constants.THINGS_PATH + '/test-1/properties/on')
      .set(...headerAuth(jwt))
      .send({}));
    expect(err.response.status).toEqual(400);
  });

  it('fail to set a property of a thing', async () => {
    const err = await pFinal(chai.request(server)
      .put(Constants.THINGS_PATH + '/test-1/properties/on')
      .set(...headerAuth(jwt))
      .send({abc: true}));
    expect(err.response.status).toEqual(400);
  });

  it('set a property of a thing', async () => {
    await addDevice();
    const on = await chai.request(server)
      .put(Constants.THINGS_PATH + '/test-1/properties/on')
      .set(...headerAuth(jwt))
      .send({on: true});

    expect(on.status).toEqual(200);
    expect(on.body).toHaveProperty('on');
    expect(on.body.on).toEqual(true);


    // Flip it back to off...
    const off = await chai.request(server)
      .put(Constants.THINGS_PATH + '/test-1/properties/on')
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
    let addr = server.address();
    let socketPath =
      `wss://127.0.0.1:${addr.port}${Constants.NEW_THINGS_PATH}?jwt=${jwt}`;

    const ws = new WebSocket(socketPath);
    ensureClose(ws);
    await e2p(ws, 'open');

    // We expect things test-4, and test-5 to show up eventually
    const [messages, res] = await Promise.all([
      (async () => {
        let messages = [];
        let expectedMessages = 2;
        while ((expectedMessages--) > 0) {
          const {data} = await e2p(ws, 'message');
          const parsed = JSON.parse(data);
          expect(typeof parsed.id).toBe('string');
          messages.push(parsed.id);
        }
        return messages;
      })(),
      (async () => {
        const res = await chai.request(server)
          .post(Constants.ACTIONS_PATH)
          .set(...headerAuth(jwt))
          .send({name: 'pair'});

        mockAdapter().addDevice('test-4', makeDescr('test-4'));
        mockAdapter().addDevice('test-5', makeDescr('test-5'));
        return res;
      })(),
    ]);

    expect(messages.sort()).toEqual(['test-4', 'test-5']);
    expect(res.status).toEqual(201);
  });

  it('should add a device during pairing then create a thing', async () => {
    let thingId = 'test-6';
    let descr = makeDescr(thingId);
    mockAdapter().pairDevice(thingId, descr);
    // send pair action
    let res = await chai.request(server)
      .post(Constants.ACTIONS_PATH)
      .set(...headerAuth(jwt))
      .send({name: 'pair'});
    expect(res.status).toEqual(201);

    res = await chai.request(server)
      .get(Constants.NEW_THINGS_PATH)
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
      .set(...headerAuth(jwt))
      .send(descr);
    expect(res.status).toEqual(201);

    res = await chai.request(server)
      .get(Constants.NEW_THINGS_PATH)
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
      .send({name: 'pair'});
    expect(pair.status).toEqual(201);

    let res = await chai.request(server)
      .delete(Constants.THINGS_PATH + '/' + thingId)
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(204);

    res = await chai.request(server)
      .get(Constants.THINGS_PATH)
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
      .set(...headerAuth(jwt))
      .send({name: 'pair'});
    expect(pair.status).toEqual(201);
    await mockAdapter().removeDevice(thingId);

    const res = await chai.request(server)
      .get(Constants.NEW_THINGS_PATH)
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
      .set(...headerAuth(jwt))
      .send({name: 'unpair', parameters: {id: thingId}});
    expect(res.status).toEqual(201);

    res = await chai.request(server)
      .get(Constants.NEW_THINGS_PATH)
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
});
