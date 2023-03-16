import { server, httpServer, chai, mockAdapter } from '../common';
import EventSource from 'eventsource';
import { AddressInfo } from 'net';
import { TEST_USER, createUser, headerAuth } from '../user';
import e2p from 'event-to-promise';
import * as Constants from '../../constants';
import Things from '../../models/things';

const TEST_THING = {
  id: 'test-1',
  title: 'test-1',
  '@context': 'https://webthings.io/schemas',
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

const VALIDATION_THING = {
  id: 'validation-1',
  title: 'validation-1',
  '@context': 'https://webthings.io/schemas',
  properties: {
    readOnlyProp: {
      type: 'boolean',
      readOnly: true,
      value: true,
    },
    minMaxProp: {
      type: 'number',
      minimum: 10,
      maximum: 20,
      value: 15,
    },
    enumProp: {
      type: 'string',
      enum: ['val1', 'val2', 'val3'],
      value: 'val2',
    },
    multipleProp: {
      type: 'integer',
      minimum: 0,
      maximum: 600,
      value: 10,
      multipleOf: 5,
    },
  },
};

describe('properties/', function () {
  let jwt: string;
  beforeEach(async () => {
    jwt = await createUser(server, TEST_USER);
  });

  async function addDevice(desc: Record<string, unknown> = TEST_THING): Promise<ChaiHttp.Response> {
    const { id } = desc;
    const res = await chai
      .request(server)
      .post(Constants.THINGS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send(desc);
    if (res.status !== 201) {
      throw res;
    }
    await mockAdapter().addDevice(<string>id, desc);
    return res;
  }

  it('GET all properties of a thing', async () => {
    await addDevice();
    const res = await chai
      .request(server)
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
    const res = await chai
      .request(server)
      .get(`${Constants.THINGS_PATH}/test-1/properties/power`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(res.body).toEqual(false);
  });

  it('fail to GET a nonexistent property of a thing', async () => {
    await addDevice();
    const err = await chai
      .request(server)
      .get(`${Constants.THINGS_PATH}/test-1/properties/xyz`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(err.status).toEqual(500);
  });

  it('fail to GET a property of a nonexistent thing', async () => {
    const err = await chai
      .request(server)
      .get(`${Constants.THINGS_PATH}/test-1a/properties/power`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(err.status).toEqual(500);
  });

  it('fail to set a property of a thing', async () => {
    await addDevice();
    const err = await chai
      .request(server)
      .put(`${Constants.THINGS_PATH}/test-1/properties/power`)
      .type('json')
      .set(...headerAuth(jwt))
      .send();
    expect(err.status).toEqual(400);
  });

  it('fail to set a property of a thing', async () => {
    const err = await chai
      .request(server)
      .put(`${Constants.THINGS_PATH}/test-1/properties/power`)
      .type('json')
      .set(...headerAuth(jwt))
      .send('foo');
    expect(err.status).toEqual(400);
  });

  it('set a property of a thing', async () => {
    // Set it to true
    await addDevice();
    const on = await chai
      .request(server)
      .put(`${Constants.THINGS_PATH}/test-1/properties/power`)
      .type('json')
      .set(...headerAuth(jwt))
      .send(JSON.stringify(true));

    expect(on.status).toEqual(204);

    // Check that it was set to true
    const readOn = await chai
      .request(server)
      .get(`${Constants.THINGS_PATH}/test-1/properties/power`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(readOn.status).toEqual(200);
    expect(readOn.body).toEqual(true);

    // Set it back to false
    const off = await chai
      .request(server)
      .put(`${Constants.THINGS_PATH}/test-1/properties/power`)
      .type('json')
      .set(...headerAuth(jwt))
      .send(JSON.stringify(false));

    expect(off.status).toEqual(204);

    // Check that it was set to false
    const readOff = await chai
      .request(server)
      .get(`${Constants.THINGS_PATH}/test-1/properties/power`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(readOff.status).toEqual(200);
    expect(readOff.body).toEqual(false);
  });

  it('set multiple properties of a thing', async () => {
    // Set properties
    await addDevice();
    const setProperties = await chai
      .request(server)
      .put(`${Constants.THINGS_PATH}/test-1/properties`)
      .type('json')
      .set(...headerAuth(jwt))
      .send(
        JSON.stringify({
          power: true,
          percent: 42,
        })
      );

    expect(setProperties.status).toEqual(204);

    // Check that the properties were set
    const getProperties = await chai
      .request(server)
      .get(`${Constants.THINGS_PATH}/test-1/properties`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(getProperties.status).toEqual(200);
    expect(getProperties.body.power).toEqual(true);
    expect(getProperties.body.percent).toEqual(42);
  });

  it('fail to set multiple properties of a thing', async () => {
    // Set properties
    await addDevice();
    const setProperties = await chai
      .request(server)
      .put(`${Constants.THINGS_PATH}/test-1/properties`)
      .type('json')
      .set(...headerAuth(jwt))
      .send(
        JSON.stringify({
          power: true,
          percent: 42,
          invalidpropertyname: true,
        })
      );

    expect(setProperties.status).toEqual(500);
  });

  it('fail to set read-only property', async () => {
    await addDevice(VALIDATION_THING);

    let res = await chai
      .request(server)
      .get(`${Constants.THINGS_PATH}/validation-1/properties/readOnlyProp`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(res.body).toEqual(true);

    const err = await chai
      .request(server)
      .put(`${Constants.THINGS_PATH}/validation-1/properties/readOnlyProp`)
      .type('json')
      .set(...headerAuth(jwt))
      .send(JSON.stringify(false));
    expect(err.status).toEqual(400);

    res = await chai
      .request(server)
      .get(`${Constants.THINGS_PATH}/validation-1/properties/readOnlyProp`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(res.body).toEqual(true);
  });

  it('fail to set invalid number property value', async () => {
    await addDevice(VALIDATION_THING);

    let res = await chai
      .request(server)
      .get(`${Constants.THINGS_PATH}/validation-1/properties/minMaxProp`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(res.body).toEqual(15);

    let err = await chai
      .request(server)
      .put(`${Constants.THINGS_PATH}/validation-1/properties/minMaxProp`)
      .type('json')
      .set(...headerAuth(jwt))
      .send(JSON.stringify(0));
    expect(err.status).toEqual(400);

    res = await chai
      .request(server)
      .get(`${Constants.THINGS_PATH}/validation-1/properties/minMaxProp`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(res.body).toEqual(15);

    err = await chai
      .request(server)
      .put(`${Constants.THINGS_PATH}/validation-1/properties/minMaxProp`)
      .type('json')
      .set(...headerAuth(jwt))
      .send(JSON.stringify(30));
    expect(err.status).toEqual(400);

    res = await chai
      .request(server)
      .get(`${Constants.THINGS_PATH}/validation-1/properties/minMaxProp`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(res.body).toEqual(15);

    res = await chai
      .request(server)
      .get(`${Constants.THINGS_PATH}/validation-1/properties/multipleProp`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(res.body).toEqual(10);

    err = await chai
      .request(server)
      .put(`${Constants.THINGS_PATH}/validation-1/properties/multipleProp`)
      .type('json')
      .set(...headerAuth(jwt))
      .send(JSON.stringify(3));
    expect(err.status).toEqual(400);

    res = await chai
      .request(server)
      .get(`${Constants.THINGS_PATH}/validation-1/properties/multipleProp`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(res.body).toEqual(10);

    res = await chai
      .request(server)
      .put(`${Constants.THINGS_PATH}/validation-1/properties/multipleProp`)
      .type('json')
      .set(...headerAuth(jwt))
      .send(JSON.stringify(30));
    expect(res.status).toEqual(204);

    res = await chai
      .request(server)
      .get(`${Constants.THINGS_PATH}/validation-1/properties/multipleProp`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(res.body).toEqual(30);
  });

  it('fail to set invalid enum property value', async () => {
    await addDevice(VALIDATION_THING);

    let res = await chai
      .request(server)
      .get(`${Constants.THINGS_PATH}/validation-1/properties/enumProp`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(res.body).toEqual('val2');

    const err = await chai
      .request(server)
      .put(`${Constants.THINGS_PATH}/validation-1/properties/enumProp`)
      .type('json')
      .set(...headerAuth(jwt))
      .send(JSON.stringify('val0'));
    expect(err.status).toEqual(400);

    res = await chai
      .request(server)
      .get(`${Constants.THINGS_PATH}/validation-1/properties/enumProp`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(res.body).toEqual('val2');
  });

  it('should be able to observe a property using EventSource', async () => {
    await addDevice(TEST_THING);
    const address = <AddressInfo>httpServer.address();

    const propertyURL =
      `http://127.0.0.1:${address.port}${Constants.THINGS_PATH}/` +
      `${TEST_THING.id}/properties/percent?jwt=${jwt}`;
    const eventSource = new EventSource(propertyURL) as EventTarget & EventSource;
    await e2p(eventSource, 'open');

    const [, event] = await Promise.all([
      Things.setThingProperty(TEST_THING.id, 'percent', 50),
      e2p(eventSource, 'percent'),
    ]);
    expect(event.type).toEqual('percent');
    expect(JSON.parse(event.data)).toEqual(50);
    eventSource.close();
  });

  it('should be able to observe to all properties on a thing using EventSource', async () => {
    await addDevice(TEST_THING);
    const address = <AddressInfo>httpServer.address();

    const propertyURL =
      `http://127.0.0.1:${address.port}${Constants.THINGS_PATH}/` +
      `${TEST_THING.id}/properties?jwt=${jwt}`;
    const eventsSource = new EventSource(propertyURL) as EventTarget & EventSource;
    await e2p(eventsSource, 'open');

    const [, event] = await Promise.all([
      Things.setThingProperty(TEST_THING.id, 'percent', 52),
      e2p(eventsSource, 'percent'),
    ]);

    expect(event.type).toEqual('percent');
    expect(JSON.parse(event.data)).toEqual(52);
    eventsSource.close();
  });

  it('should not be able to observe properties on a thing that doesnt exist', async () => {
    await addDevice(TEST_THING);
    const address = <AddressInfo>httpServer.address();

    const propertyURL =
      `http://127.0.0.1:${address.port}${Constants.THINGS_PATH}` +
      `/non-existent-thing/properties/percent?jwt=${jwt}`;
    const thinglessEventSource = new EventSource(propertyURL) as EventTarget & EventSource;
    thinglessEventSource.onerror = jest.fn();
    thinglessEventSource.onopen = jest.fn();
    await e2p(thinglessEventSource, 'error');
    expect(thinglessEventSource.onopen).not.toBeCalled();
    expect(thinglessEventSource.onerror).toBeCalled();
  });

  it('should not be able to observe a property that doesnt exist', async () => {
    await addDevice(TEST_THING);
    const address = <AddressInfo>httpServer.address();

    const eventSourceURL =
      `http://127.0.0.1:${address.port}${Constants.THINGS_PATH}` +
      `${TEST_THING.id}/properties/non-existentevent?jwt=${jwt}`;
    const propertylessEventSource = new EventSource(eventSourceURL) as EventTarget & EventSource;
    propertylessEventSource.onerror = jest.fn();
    propertylessEventSource.onopen = jest.fn();
    await e2p(propertylessEventSource, 'error');
    expect(propertylessEventSource.onopen).not.toBeCalled();
    expect(propertylessEventSource.onerror).toBeCalled();
  });
});
