import { server, httpServer, chai, mockAdapter } from '../common';
import EventSource from 'eventsource';
import { AddressInfo } from 'net';
import * as Constants from '../../constants';
import { TEST_USER, createUser, headerAuth } from '../user';
import e2p from 'event-to-promise';
import Event from '../../models/event';
import Events from '../../models/events';

const TEST_THING = {
  id: 'test-1',
  title: 'test-1',
  '@context': ['https://www.w3.org/2022/wot/td/v1.1', 'https://webthings.io/schemas'],
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

const EVENT_THING = {
  id: 'event-thing1',
  title: 'Event Thing',
  '@context': ['https://www.w3.org/2022/wot/td/v1.1', 'https://webthings.io/schemas'],
  events: {
    overheated: {
      type: 'number',
      unit: 'degree celsius',
    },
  },
};

describe('events/', function () {
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

  it('should be able to retrieve events', async () => {
    await addDevice();

    let res = await chai
      .request(server)
      .get(Constants.EVENTS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(0);

    res = await chai
      .request(server)
      .get(`${Constants.EVENTS_PATH}/a`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(0);

    const thingBase = `${Constants.THINGS_PATH}/${TEST_THING.id}`;

    res = await chai
      .request(server)
      .get(thingBase + Constants.EVENTS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(0);

    res = await chai
      .request(server)
      .get(`${thingBase}${Constants.EVENTS_PATH}/a`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(0);

    const eventA = new Event('a', 'just a cool event', TEST_THING.id);
    const eventB = new Event('b', 'just a boring event', TEST_THING.id);
    await Events.add(eventA);
    await Events.add(eventB);

    res = await chai
      .request(server)
      .get(thingBase + Constants.EVENTS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(2);
    expect(res.body[0]).toHaveProperty('a');
    expect(res.body[0].a).toHaveProperty('data');
    expect(res.body[0].a.data).toBe('just a cool event');
    expect(res.body[0].a).toHaveProperty('timestamp');
    expect(res.body[1]).toHaveProperty('b');
    expect(res.body[1].b).toHaveProperty('data');
    expect(res.body[1].b.data).toBe('just a boring event');
    expect(res.body[1].b).toHaveProperty('timestamp');

    res = await chai
      .request(server)
      .get(`${thingBase}${Constants.EVENTS_PATH}/a`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(1);
    expect(res.body[0]).toHaveProperty('a');
    expect(res.body[0].a).toHaveProperty('data');
    expect(res.body[0].a.data).toBe('just a cool event');
    expect(res.body[0].a).toHaveProperty('timestamp');
  });

  it('should be able to subscribe to an event using EventSource', async () => {
    await addDevice(EVENT_THING);
    const address = <AddressInfo>httpServer.address();

    const eventSourceURL =
      `http://127.0.0.1:${address.port}${Constants.THINGS_PATH}/` +
      `${EVENT_THING.id}/events/overheated?jwt=${jwt}`;
    const eventSource = new EventSource(eventSourceURL) as EventTarget & EventSource;
    await e2p(eventSource, 'open');
    const overheatedEvent = new Event('overheated', 101, EVENT_THING.id);
    const [, event] = await Promise.all([
      Events.add(overheatedEvent),
      e2p(eventSource, 'overheated'),
    ]);
    expect(event.type).toEqual('overheated');
    expect(JSON.parse(event.data)).toEqual(101);
    eventSource.close();
  });

  it('should be able to subscribe to all events on a thing using EventSource', async () => {
    await addDevice(EVENT_THING);
    const address = <AddressInfo>httpServer.address();

    const eventSourceURL =
      `http://127.0.0.1:${address.port}${Constants.THINGS_PATH}/` +
      `${EVENT_THING.id}/events?jwt=${jwt}`;
    const eventsSource = new EventSource(eventSourceURL) as EventTarget & EventSource;
    await e2p(eventsSource, 'open');
    const overheatedEvent2 = new Event('overheated', 101, EVENT_THING.id);
    const [, event2] = await Promise.all([
      Events.add(overheatedEvent2),
      e2p(eventsSource, 'overheated'),
    ]);
    expect(event2.type).toEqual('overheated');
    expect(JSON.parse(event2.data)).toEqual(101);
    eventsSource.close();
  });

  it('should not be able to subscribe events on a thing that doesnt exist', async () => {
    await addDevice(EVENT_THING);
    const address = <AddressInfo>httpServer.address();

    const eventSourceURL =
      `http://127.0.0.1:${address.port}${Constants.THINGS_PATH}` +
      `/non-existent-thing/events/overheated?jwt=${jwt}`;
    const thinglessEventSource = new EventSource(eventSourceURL) as EventTarget & EventSource;
    thinglessEventSource.onerror = jest.fn();
    thinglessEventSource.onopen = jest.fn();
    await e2p(thinglessEventSource, 'error');
    expect(thinglessEventSource.onopen).not.toBeCalled();
    expect(thinglessEventSource.onerror).toBeCalled();
  });

  it('should not be able to subscribe to an event that doesnt exist', async () => {
    await addDevice(EVENT_THING);
    const address = <AddressInfo>httpServer.address();

    const eventSourceURL =
      `http://127.0.0.1:${address.port}${Constants.THINGS_PATH}` +
      `${EVENT_THING.id}/events/non-existentevent?jwt=${jwt}`;
    const eventlessEventSource = new EventSource(eventSourceURL) as EventTarget & EventSource;
    eventlessEventSource.onerror = jest.fn();
    eventlessEventSource.onopen = jest.fn();
    await e2p(eventlessEventSource, 'error');
    expect(eventlessEventSource.onopen).not.toBeCalled();
    expect(eventlessEventSource.onerror).toBeCalled();
  });
});
