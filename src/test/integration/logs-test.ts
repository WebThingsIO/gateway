import { server, chai, mockAdapter } from '../common';
import { TEST_USER, createUser, headerAuth } from '../user';
import * as Constants from '../../constants';
import Logs from '../../models/logs';
import sleep from '../../sleep';

const thingLight1 = {
  id: 'light1',
  title: 'light1',
  '@context': 'https://webthings.io/schemas',
  '@type': ['OnOffSwitch'],
  properties: {
    on: {
      '@type': 'OnOffProperty',
      type: 'boolean',
      value: false,
    },
    color: {
      '@type': 'ColorProperty',
      type: 'string',
      value: '#ff7700',
    },
    brightness: {
      '@type': 'BrightnessProperty',
      type: 'number',
      value: 100,
    },
  },
};

const thingLight2 = JSON.parse(JSON.stringify(thingLight1).replace(/light1/g, 'light2'));

describe('logs/', function () {
  let jwt: string;

  async function addDevice(desc: Record<string, unknown>): Promise<ChaiHttp.Response> {
    const { id } = desc;
    const res = await chai
      .request(server)
      .post(Constants.THINGS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send(desc);
    await mockAdapter().addDevice(<string>id, desc);
    return res;
  }

  async function createLog(thing: string, property: string): Promise<void> {
    const body = {
      descr: {
        type: 'property',
        thing: thing,
        property: property,
      },
      maxAge: 60 * 60 * 1000,
    };

    const res = await chai
      .request(server)
      .post(`${Constants.LOGS_PATH}`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .set('Content-Type', 'application/json')
      .send(body);
    expect(res.status).toEqual(200);
  }

  async function createAllLogs(): Promise<void> {
    for (const prop in thingLight1.properties) {
      await createLog(thingLight1.id, prop);
    }
    for (const prop in thingLight2.properties) {
      await createLog(thingLight2.id, prop);
    }
  }

  async function setProp(thingId: string, propId: string, value: unknown): Promise<void> {
    const res = await chai
      .request(server)
      .put(`${Constants.THINGS_PATH}/${thingId}/properties/${propId}`)
      .set('Accept', 'application/json')
      .type('json')
      .set(...headerAuth(jwt))
      .send(JSON.stringify(value));
    expect(res.status).toEqual(204);

    // sleep just a bit to allow events to fire in the gateway
    await sleep(200);
  }

  beforeEach(async () => {
    Logs.clear();

    jwt = await createUser(server, TEST_USER);
    await createAllLogs();
    await addDevice(thingLight1);
    await addDevice(thingLight2);
    await populatePropertyData();
  });

  const light1OnValues = [false, true, false, true, false];
  const light1BriValues = [100, 12, 34];
  const light2BriValues = [100, 0, 31];

  async function populatePropertyData(): Promise<void> {
    for (const value of light1OnValues.slice(1, light1OnValues.length - 1)) {
      await setProp('light1', 'on', value);
    }

    for (const value of light1BriValues.slice(1)) {
      await setProp('light1', 'brightness', value);
    }

    for (const value of light2BriValues.slice(1)) {
      await setProp('light2', 'brightness', value);
    }

    await setProp('light1', 'on', light1OnValues[light1OnValues.length - 1]);
  }

  function value(data: Record<string, unknown>): unknown {
    return data.value;
  }

  it('gets all logs', async () => {
    const res = await chai
      .request(server)
      .get(Constants.LOGS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    const logs = res.body;

    expect(logs.light1.on.map(value)).toEqual(light1OnValues);

    expect(logs.light1.brightness.map(value)).toEqual(light1BriValues);

    expect(logs.light2.brightness.map(value)).toEqual(light2BriValues);
  });

  // eslint-disable-next-line @typescript-eslint/quotes
  it("gets one device's logs", async () => {
    const res = await chai
      .request(server)
      .get(`${Constants.LOGS_PATH}/things/light1`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    const logs = res.body;

    expect(logs.on.map(value)).toEqual(light1OnValues);

    expect(logs.brightness.map(value)).toEqual(light1BriValues);
  });

  it('deletes a log', async () => {
    let res = await chai
      .request(server)
      .delete(`${Constants.LOGS_PATH}/things/light1/properties/on`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);

    res = await chai
      .request(server)
      .get(Constants.LOGS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    const logs = res.body;

    expect(logs.light1.on).toBeFalsy();

    expect(logs.light1.brightness.map(value)).toEqual(light1BriValues);

    expect(logs.light2.brightness.map(value)).toEqual(light2BriValues);
  });
});
