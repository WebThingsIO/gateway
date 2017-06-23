'use strict';

/* Tell jshint about mocha globals, and  */
/* globals it */

const {server, chai, mockAdapter, rp} = require('../common');
const assert = chai.assert;

var Constants = require('../../constants');
const WebSocket = require('ws');

it('GET with no things', async () => {
  const res = await chai.request(server)
    .get(Constants.THINGS_PATH)
  res.should.have.status(200);
  res.body.should.be.a('array');
  res.body.length.should.be.eql(0);
});

it('fail to create a new thing (empty body)', async () => {
  try {
    await chai.request(server)
      .post(Constants.THINGS_PATH)
      .send();
    throw new Error('Should have failed to create new thing');
  } catch(err) {
    err.response.should.have.status(400);
  }
});

it('create a new thing', async () => {
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
  const res = await chai.request(server)
    .post(Constants.THINGS_PATH)
    .send(descr);
  res.should.have.status(201);
});

it('fail to create a new thing (duplicate)', async () => {
  try {
    await chai.request(server)
      .post(Constants.THINGS_PATH)
      .send({
        id: 'test-1',
      });
    throw new Error('Should have failed to create new thing');
  } catch(err) {
    err.response.should.have.status(500);
  }
});

it('GET with 1 thing', async () => {
  const res = await chai.request(server)
    .get(Constants.THINGS_PATH);

  res.should.have.status(200);
  res.body.should.be.a('array');
  res.body.length.should.be.eql(1);
  res.body[0].should.have.a.property('href');
  res.body[0].href.should.be.eql(Constants.THINGS_PATH + '/test-1');
});

it('GET a property of a thing', async () => {
  const res = await chai.request(server)
    .get(Constants.THINGS_PATH + '/test-1/properties/on');

  res.should.have.status(200);
  res.body.should.have.a.property('on');
  res.body.on.should.be.eql(false);
});

it('fail to GET a non-existant property of a thing', async () => {
  try {
    await chai.request(server)
      .get(Constants.THINGS_PATH + '/test-1/properties/xyz');
    throw new Error('request should fail');
  } catch(err) {
    err.response.should.have.status(500);
  }
});

it('fail to GET a property of a non-existent thing', async () => {
  try {
    await chai.request(server)
      .get(Constants.THINGS_PATH + '/test-1a/properties/on');
    throw new Error('request should fail');
  } catch(err) {
    err.response.should.have.status(500);
  }
});

it('fail to set a property of a thing', async () => {
  try {
    await chai.request(server)
      .put(Constants.THINGS_PATH + '/test-1/properties/on')
      .send({});
    throw new Error('request should fail');
  } catch(err) {
    err.response.should.have.status(400);
  }
});

it('fail to set a property of a thing', async () => {
  try {
    await chai.request(server)
      .put(Constants.THINGS_PATH + '/test-1/properties/on')
      .send({abc: true});
    throw new Error('request should fail');
  } catch(err) {
    err.response.should.have.status(400);
  }
});

it('set a property of a thing', async () => {
  const res = await chai.request(server)
    .put(Constants.THINGS_PATH + '/test-1/properties/on')
    .send({on: true});

  res.should.have.status(200);
  res.body.should.have.a.property('on');
  res.body.on.should.be.eql(true);
});

it('Verify property of a thing changed', async () => {
  const res = await chai.request(server)
    .get(Constants.THINGS_PATH + '/test-1/properties/on');

  res.should.have.status(200);
  res.body.should.have.a.property('on');
  res.body.on.should.be.eql(true);
});

it('lists 0 new things after creating thing', async () => {
  const res = await chai.request(server)
    .get(Constants.NEW_THINGS_PATH);

  res.should.have.status(200);
  res.body.should.be.a('array');
  res.body.length.should.be.eql(0);
});

function makeDescr(id) {
  return {
    id: id,
    name: id,
    properties: {}
  };
}

it('lists new things when devices are added', async () => {
  mockAdapter().addDevice('test-2', makeDescr('test-2'));
  mockAdapter().addDevice('test-3', makeDescr('test-3'));

  const res = await chai.request(server)
    .get(Constants.NEW_THINGS_PATH);

  res.should.have.status(200);
  res.body.should.be.a('array');
  res.body.length.should.be.eql(2);
  res.body[0].should.have.a.property('href');
  res.body[0].href.should.be.eql(Constants.THINGS_PATH + '/test-2');
  res.body[1].should.have.a.property('href');
  res.body[1].href.should.be.eql(Constants.THINGS_PATH + '/test-3');
});

it('should send multiple devices during pairing', (done) => {
  let addr = server.address();
  let socketPath = 'wss://127.0.0.1:' + addr.port + Constants.NEW_THINGS_PATH;
  function connectSocket() {
    return new Promise((resolve, reject) => {
      let ws = new WebSocket(socketPath);

      ws.once('open', function() {
        resolve(ws);
      });
    });
  }

  // We expect things test-2, test-3, test-4, and test-5 to show up eventually
  let found = {
    'test-2': false,
    'test-3': false,
    'test-4': false,
    'test-5': false
  };

  function allFound() {
    for (let id in found) {
      if (!found[id]) {
        return false;
      }
    }
    return true;
  }

  connectSocket().then(ws => {
    ws.on('message', function onNewThing(newThingStr) {
      let newThing = JSON.parse(newThingStr);
      found[newThing.id] = true;
      if (allFound()) {
        ws.removeEventListener('message', onNewThing);
        done();
      }
    });

    chai.request(server)
      .post(Constants.ACTIONS_PATH)
      .send({name: 'pair'})
      .end((err, res) => {
        res.should.have.status(201);
        mockAdapter().addDevice('test-4', makeDescr('test-4'));
        mockAdapter().addDevice('test-5', makeDescr('test-5'));
      });
  });
});

it('should add a device during pairing then create a thing', async () => {
  let thingId = 'test-6';
  let descr = makeDescr(thingId);
  mockAdapter().pairDevice(thingId, descr);
  // send pair action
  let res = await chai.request(server)
    .post(Constants.ACTIONS_PATH)
    .send({name: 'pair'});
  res.should.have.status(201);

  res = await chai.request(server)
    .get(Constants.NEW_THINGS_PATH);
  res.should.have.status(200);
  res.body.should.be.a('array');
  let found = false;
  for (let thing of res.body) {
    if (thing.href === Constants.THINGS_PATH + '/' + thingId) {
      found = true;
    }
  }
  assert(found, 'should find thing in /new_things output');

  res = await chai.request(server)
    .post(Constants.THINGS_PATH)
    .send(descr);
  res.should.have.status(201);

  res = await chai.request(server)
    .get(Constants.NEW_THINGS_PATH);
  res.should.have.status(200);
  res.body.should.be.a('array');
  found = false;
  for (let thing of res.body) {
    if (thing.href === Constants.THINGS_PATH + '/' + thingId) {
      found = true;
    }
  }
  assert(!found, 'should find no longer thing in /new_things output:'
    + JSON.stringify(res.body, null, 2));

  res = await chai.request(server)
    .get(Constants.THINGS_PATH);
  res.should.have.status(200);
  res.body.should.be.a('array');
  found = false;
  for (let thing of res.body) {
    if (thing.href === Constants.THINGS_PATH + '/' + thingId) {
      found = true;
    }
  }
  assert(found, 'should find thing in /new_things output');
});

it('should remove a thing', async () => {
  let thingId = 'test-6';

  let res = await chai.request(server)
    .delete(Constants.THINGS_PATH + '/' + thingId);
  res.should.have.status(204);

  res = await chai.request(server)
    .get(Constants.THINGS_PATH);
  res.should.have.status(200);
  res.body.should.be.a('array');
  let found = false;
  for (let thing of res.body) {
    if (thing.href === Constants.THINGS_PATH + '/' + thingId) {
      found = true;
    }
  }
  assert(!found, 'should not find thing in /things output');

  res = await chai.request(server)
    .get(Constants.NEW_THINGS_PATH);
  res.should.have.status(200);
  res.body.should.be.a('array');
  found = false;
  for (let thing of res.body) {
    if (thing.href === Constants.THINGS_PATH + '/' + thingId) {
      found = true;
    }
  }
  assert(found, 'should find thing in /new_things output');
});

it('should remove a device', async () => {
  let thingId = 'test-6';
  await mockAdapter().removeDevice(thingId);

  const res = await chai.request(server)
    .get(Constants.NEW_THINGS_PATH);
  res.should.have.status(200);
  res.body.should.be.a('array');
  let found = false;
  for (let thing of res.body) {
    if (thing.href === Constants.THINGS_PATH + '/' + thingId) {
      found = true;
    }
  }
  assert(!found, 'should not find thing in /new_things output');
});

it('should remove a device in response to unpair', async () => {
  let thingId = 'test-5';
  // The mock adapter requires knowing in advance that we're going to unpair
  // a specific device
  mockAdapter().unpairDevice(thingId);
  let res = await chai.request(server)
    .post(Constants.ACTIONS_PATH)
    .send({name: 'unpair', parameters: {id: thingId}});
  res.should.have.status(201);

  res = await chai.request(server)
    .get(Constants.NEW_THINGS_PATH)
  res.should.have.status(200);
  res.body.should.be.a('array');
  let found = false;
  for (let thing of res.body) {
    if (thing.href === Constants.THINGS_PATH + '/' + thingId) {
      found = true;
    }
  }

  assert.isNotOk(found, 'should not find thing in /new_things output');
});
