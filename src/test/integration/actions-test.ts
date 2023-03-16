import { server, chai, mockAdapter } from '../common';
import { TEST_USER, createUser, headerAuth } from '../user';
import * as Constants from '../../constants';

describe('actions/', () => {
  let jwt: string;

  const thingLight = {
    id: 'light',
    title: 'light',
    '@context': ['https://www.w3.org/2022/wot/td/v1.1', 'https://webthings.io/schemas'],
    '@type': ['OnOffSwitch', 'Light'],
    properties: {
      power: {
        '@type': 'OnOffProperty',
        type: 'boolean',
        value: false,
      },
    },
    actions: {
      blink: {
        description: 'Blink the switch on and off',
      },
      rejectRequest: {
        description: 'Reject when call requestAction',
      },
      rejectRemove: {
        description: 'Reject when call removeAction',
      },
    },
  };

  const piDescr = {
    id: 'pi-1',
    title: 'pi-1',
    '@context': 'https://webthings.io/schemas',
    '@type': ['OnOffSwitch'],
    properties: {
      power: {
        '@type': 'OnOffProperty',
        type: 'boolean',
        value: true,
        forms: [
          {
            href: '/properties/power',
            proxy: true,
          },
          {
            href: '/properties/power',
            op: ['observeproperty', 'unobserveproperty'],
            subprotocol: 'sse',
            proxy: true,
          },
        ],
      },
    },
    actions: {
      reboot: {
        description: 'Reboot the device',
        forms: [
          {
            href: '/actions/reboot',
            proxy: true,
          },
        ],
      },
    },
    events: {
      reboot: {
        description: 'Going down for reboot',
        forms: [
          {
            href: '/events/reboot',
            proxy: true,
          },
        ],
      },
    },
  };

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

  beforeEach(async () => {
    jwt = await createUser(server, TEST_USER);
  });

  it('GET with no actions', async () => {
    let res = await chai
      .request(server)
      .get(Constants.ACTIONS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(Object.keys(res.body).length).toEqual(0);

    res = await chai
      .request(server)
      .get(`${Constants.ACTIONS_PATH}/pair`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(0);
  });

  it('should fail to create a new action (empty body)', async () => {
    const err = await chai
      .request(server)
      .post(Constants.ACTIONS_PATH)
      .set(...headerAuth(jwt))
      .set('Accept', 'application/json')
      .send();
    expect(err.status).toEqual(400);
  });

  it('should fail to create a new action (unknown name)', async () => {
    const descr = {
      potato: {},
    };
    const err = await chai
      .request(server)
      .post(Constants.ACTIONS_PATH)
      .set(...headerAuth(jwt))
      .set('Accept', 'application/json')
      .send(descr);
    expect(err.status).toEqual(400);
  });

  it('should fail when plugin rejects requestAction', async () => {
    const { id } = thingLight;
    await addDevice(thingLight);
    const descr = {
      rejectRequest: {},
    };
    const err = await chai
      .request(server)
      .post(`${Constants.THINGS_PATH}/${id}${Constants.ACTIONS_PATH}`)
      .set(...headerAuth(jwt))
      .set('Accept', 'application/json')
      .send(descr);
    expect(err.status).toEqual(400);
  });

  it('should list and retrieve the new action', async () => {
    const descr = {
      pair: {
        input: {
          timeout: 60,
        },
      },
    };

    const pair = await chai
      .request(server)
      .post(Constants.ACTIONS_PATH)
      .set(...headerAuth(jwt))
      .set('Accept', 'application/json')
      .send(descr);

    expect(pair.status).toEqual(201);

    let res = await chai
      .request(server)
      .get(Constants.ACTIONS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);

    expect(Object.keys(res.body).length).toEqual(1);
    expect(res.body).toHaveProperty('pair');
    expect(Array.isArray(res.body.pair));
    expect(res.body.pair[0]).toHaveProperty('href');
    expect(res.body.pair[0]).toHaveProperty('status');
    expect(res.body.pair[0]).toHaveProperty('timeRequested');

    res = await chai
      .request(server)
      .get(`${Constants.ACTIONS_PATH}/pair`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(1);
    expect(res.body[0]).toHaveProperty('pair');
    expect(res.body[0].pair).toHaveProperty('href');
    expect(res.body[0].pair).toHaveProperty('status');
    expect(res.body[0].pair).toHaveProperty('timeRequested');

    const actionHref = res.body[0].pair.href;
    res = await chai
      .request(server)
      .get(actionHref)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('href');
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('timeRequested');
  });

  it('should list and retrieve the new action by name', async () => {
    const descr = {
      timeout: 60,
    };

    const pair = await chai
      .request(server)
      .post(`${Constants.ACTIONS_PATH}/pair`)
      .set(...headerAuth(jwt))
      .set('Accept', 'application/json')
      .send(descr);

    expect(pair.status).toEqual(201);

    let res = await chai
      .request(server)
      .get(Constants.ACTIONS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(Object.keys(res.body).length).toEqual(1);
    expect(res.body).toHaveProperty('pair');
    expect(Array.isArray(res.body.pair));
    expect(res.body.pair[0]).toHaveProperty('href');
    expect(res.body.pair[0]).toHaveProperty('status');
    expect(res.body.pair[0]).toHaveProperty('timeRequested');

    res = await chai
      .request(server)
      .get(`${Constants.ACTIONS_PATH}/pair`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(1);
    expect(res.body[0]).toHaveProperty('pair');
    expect(res.body[0].pair).toHaveProperty('href');
    expect(res.body[0].pair).toHaveProperty('status');
    expect(res.body[0].pair).toHaveProperty('timeRequested');

    const actionHref = res.body[0].pair.href;
    res = await chai
      .request(server)
      .get(actionHref)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('href');
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('timeRequested');
  });

  it('should error retrieving a nonexistent action', async () => {
    const actionId = 'foobarmissing';
    const err = await chai
      .request(server)
      .get(`${Constants.ACTIONS_PATH}/pair/${actionId}`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(err.status).toEqual(404);
  });

  it('should remove an action', async () => {
    const descr = {
      pair: {
        input: {
          timeout: 60,
        },
      },
    };

    await chai
      .request(server)
      .post(Constants.ACTIONS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send(descr);

    let res = await chai
      .request(server)
      .get(Constants.ACTIONS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(Object.keys(res.body).length).toEqual(1);

    const actionHref = res.body.pair[0].href;
    res = await chai
      .request(server)
      .delete(actionHref)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(204);

    res = await chai
      .request(server)
      .get(Constants.ACTIONS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(Object.keys(res.body).length).toEqual(0);
  });

  it('should error removing a nonexistent action', async () => {
    const actionId = 555;
    const err = await chai
      .request(server)
      .delete(`${Constants.ACTIONS_PATH}/pair/${actionId}`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(err.status).toEqual(404);
  });

  it('should fail when plugin rejects removeAction', async () => {
    const { id } = thingLight;
    await addDevice(thingLight);
    const descr = {
      rejectRemove: {
        input: {},
      },
    };

    const basePath = `${Constants.THINGS_PATH}/${id}${Constants.ACTIONS_PATH}`;
    await chai
      .request(server)
      .post(basePath)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send(descr);

    let res = await chai
      .request(server)
      .get(basePath)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(Object.keys(res.body).length).toEqual(1);

    res = await chai
      .request(server)
      .get(`${basePath}/rejectRemove`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(1);

    const actionHref = res.body[0].rejectRemove.href;

    const err = await chai
      .request(server)
      .delete(actionHref)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(err.status).toEqual(400);
  });

  it('should succeed on an unpair of a nonexistent device', async () => {
    const thingId = 'test-nonexistent';
    // The mock adapter requires knowing in advance that we're going to unpair
    // a specific device
    mockAdapter().unpairDevice(thingId);

    let res = await chai
      .request(server)
      .post(`${Constants.ACTIONS_PATH}/unpair`)
      .set(...headerAuth(jwt))
      .set('Accept', 'application/json')
      .send({ id: thingId });
    expect(res.status).toEqual(201);

    res = await chai
      .request(server)
      .get(Constants.ACTIONS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(Object.keys(res.body).length).toEqual(1);
    expect(res.body).toHaveProperty('unpair');
    expect(Array.isArray(res.body.unpair));
    expect(res.body.unpair[0]).toHaveProperty('href');
    expect(res.body.unpair[0]).toHaveProperty('status');
    expect(res.body.unpair[0].status).toEqual('completed');
  });

  it('fails to create an action on a nonexistent thing', async () => {
    const thingBase = `${Constants.THINGS_PATH}/nonexistent-thing`;

    const input = {
      timeout: 60,
    };

    const err = await chai
      .request(server)
      .post(`${thingBase}${Constants.ACTIONS_PATH}/pair`)
      .set(...headerAuth(jwt))
      .set('Accept', 'application/json')
      .send(input);
    expect(err.status).toEqual(404);
  });

  it('fails to create thing action which does not exist', async () => {
    await addDevice(piDescr);

    const thingBase = `${Constants.THINGS_PATH}/${piDescr.id}`;

    const res = await chai
      .request(server)
      .get(thingBase)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);

    const input = {
      timeout: 60,
    };

    const err = await chai
      .request(server)
      .post(`${thingBase}${Constants.ACTIONS_PATH}/pair`)
      .set(...headerAuth(jwt))
      .set('Accept', 'application/json')
      .send(input);
    expect(err.status).toEqual(400);
  });
});
