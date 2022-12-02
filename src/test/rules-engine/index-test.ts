import { server, chai, mockAdapter } from '../common';
import { waitForExpect } from '../expect-utils';
import util from 'util';
import { TEST_USER, createUser, headerAuth } from '../user';
import * as Constants from '../../constants';
import Event from '../../models/event';
import Events from '../../models/events';
import { webSocketOpen, webSocketRead, webSocketClose } from '../websocket-util';

const thingLight1 = {
  id: 'light1',
  title: 'light1',
  type: 'onOffSwitch',
  '@context': 'https://webthings.io/schemas',
  '@type': ['OnOffSwitch'],
  properties: {
    on: { type: 'boolean', value: false },
    hue: { type: 'number', value: 0 },
    sat: { type: 'number', value: 0 },
    bri: { type: 'number', value: 100 },
  },
  actions: {
    blink: {
      description: 'Blink the switch on and off',
    },
  },
  events: {
    surge: {
      description: 'Surge in power detected',
    },
  },
};

const thingLight2 = {
  id: 'light2',
  title: 'light2',
  type: 'onOffSwitch',
  '@context': 'https://webthings.io/schemas',
  '@type': ['OnOffSwitch'],
  properties: {
    on: { type: 'boolean', value: false },
    hue: { type: 'number', value: 0 },
    sat: { type: 'number', value: 0 },
    bri: { type: 'number', value: 100 },
  },
};

const thingLight3 = {
  id: 'light3',
  title: 'light3',
  type: 'onOffSwitch',
  '@context': 'https://webthings.io/schemas',
  '@type': ['OnOffSwitch'],
  properties: {
    on: { type: 'boolean', value: false },
    hue: { type: 'number', value: 0 },
    sat: { type: 'number', value: 0 },
    bri: { type: 'number', value: 100 },
    color: { type: 'string', value: '#ff7700' },
  },
};

const testRule = {
  name: 'testRule',
  enabled: true,
  trigger: {
    property: {
      type: 'boolean',
      id: 'on',
      thing: 'light1',
    },
    type: 'BooleanTrigger',
    onValue: true,
  },
  effect: {
    property: {
      type: 'boolean',
      thing: 'light2',
      id: 'on',
    },
    type: 'PulseEffect',
    value: true,
  },
};

const offRule = {
  name: 'offRule',
  enabled: true,
  trigger: {
    property: {
      type: 'boolean',
      thing: 'light1',
      id: 'on',
    },
    type: 'BooleanTrigger',
    onValue: false,
  },
  effect: {
    property: {
      type: 'boolean',
      thing: 'light2',
      id: 'on',
    },
    type: 'PulseEffect',
    value: false,
  },
};

const numberTestRule = {
  enabled: true,
  name: 'Number Test Rule',
  trigger: {
    property: {
      type: 'number',
      thing: 'light2',
      id: 'hue',
    },
    type: 'LevelTrigger',
    levelType: 'GREATER',
    value: 120,
  },
  effect: {
    property: {
      type: 'number',
      thing: 'light3',
      id: 'bri',
    },
    type: 'PulseEffect',
    value: 30,
  },
};

const mixedTestRule = {
  enabled: true,
  name: 'Mixed Test Rule',
  trigger: {
    property: {
      type: 'number',
      thing: 'light3',
      id: 'bri',
    },
    type: 'LevelTrigger',
    levelType: 'LESS',
    value: 50,
  },
  effect: {
    property: {
      type: 'boolean',
      thing: 'light3',
      id: 'on',
    },
    type: 'SetEffect',
    value: true,
  },
};

const eventActionRule = {
  enabled: true,
  name: 'Event Action Rule',
  trigger: {
    type: 'EventTrigger',
    thing: 'light1',
    event: 'surge',
  },
  effect: {
    type: 'ActionEffect',
    thing: 'light1',
    action: 'blink',
  },
};

const equalityRule = {
  enabled: true,
  name: 'Equality Rule',
  trigger: {
    type: 'EqualityTrigger',
    property: {
      type: 'string',
      thing: 'light3',
      id: 'color',
    },
    value: '#00ff77',
  },
  effect: {
    property: {
      type: 'boolean',
      thing: 'light3',
      id: 'on',
    },
    type: 'SetEffect',
    value: true,
  },
};

const complexTriggerRule = {
  enabled: true,
  name: 'Complex Trigger Rule',
  trigger: {
    type: 'MultiTrigger',
    op: 'AND',
    triggers: [
      {
        type: 'BooleanTrigger',
        property: {
          type: 'boolean',
          thing: 'light1',
          id: 'on',
        },
        onValue: true,
      },
      {
        type: 'MultiTrigger',
        op: 'OR',
        triggers: [
          {
            type: 'BooleanTrigger',
            property: {
              type: 'boolean',
              thing: 'light1',
              id: 'on',
            },
            onValue: true,
          },
          {
            type: 'BooleanTrigger',
            property: {
              type: 'boolean',
              thing: 'light2',
              id: 'on',
            },
            onValue: true,
          },
        ],
      },
    ],
  },
  effect: {
    property: {
      type: 'boolean',
      thing: 'light3',
      id: 'on',
    },
    type: 'SetEffect',
    value: true,
  },
};

const multiRule = {
  enabled: true,
  trigger: {
    property: {
      type: 'boolean',
      thing: 'light1',
      id: 'on',
    },
    type: 'BooleanTrigger',
    onValue: true,
  },
  effect: {
    effects: [
      {
        property: {
          type: 'boolean',
          thing: 'light2',
          id: 'on',
        },
        type: 'PulseEffect',
        value: true,
      },
      {
        property: {
          type: 'boolean',
          thing: 'light3',
          id: 'on',
        },
        type: 'PulseEffect',
        value: true,
      },
    ],
    type: 'MultiEffect',
  },
};

describe('rules engine', () => {
  let ruleId: number | null = null;
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

  async function deleteRule(id: number): Promise<void> {
    const res = await chai
      .request(server)
      .delete(`${Constants.RULES_PATH}/${id}`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send();
    expect(res.status).toEqual(200);
  }

  beforeEach(async () => {
    jwt = await createUser(server, TEST_USER);
    await addDevice(thingLight1);
    await addDevice(thingLight2);
    await addDevice(thingLight3);
  });

  it('gets a list of 0 rules', async () => {
    const res = await chai
      .request(server)
      .get(Constants.RULES_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(0);
  });

  it('fails to create a rule', async () => {
    const err = await chai
      .request(server)
      .post(Constants.RULES_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({
        trigger: {
          property: null,
          type: 'Whatever',
        },
        effect: testRule.effect,
      });
    expect(err.status).toEqual(400);
  });

  it('creates a rule', async () => {
    let res = await chai
      .request(server)
      .post(Constants.RULES_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send(testRule);

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('id');
    ruleId = res.body.id;

    res = await chai
      .request(server)
      .get(Constants.RULES_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(1);
    expect(res.body[0]).toMatchObject(testRule);
  });

  it('gets this rule specifically', async () => {
    const res = await chai
      .request(server)
      .get(`${Constants.RULES_PATH}/${ruleId}`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(res.body).toMatchObject(testRule);
  });

  it('fails to get a nonexistent rule specifically', async () => {
    const err = await chai
      .request(server)
      .get(`${Constants.RULES_PATH}/1337`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(err.status).toEqual(404);
  });

  it('modifies this rule', async () => {
    let res = await chai
      .request(server)
      .put(`${Constants.RULES_PATH}/${ruleId}`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send(numberTestRule);
    expect(res.status).toEqual(200);

    res = await chai
      .request(server)
      .get(Constants.RULES_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(1);
    expect(res.body[0]).toMatchObject(numberTestRule);
  });

  it('deletes this rule', async () => {
    await deleteRule(ruleId!);

    const res = await chai
      .request(server)
      .get(Constants.RULES_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(0);
  });

  it('fails to delete a nonexistent rule', async () => {
    const err = await chai
      .request(server)
      .delete(`${Constants.RULES_PATH}/0`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send();
    expect(err.status).toEqual(404);
  });

  it('fails to modify a nonexistent rule', async () => {
    const err = await chai
      .request(server)
      .put(`${Constants.RULES_PATH}/0`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send(testRule);
    expect(err.status).toEqual(404);
  });

  it('creates and simulates a disabled rule', async () => {
    const disabledRule = Object.assign(testRule, { enabled: false });
    let res = await chai
      .request(server)
      .post(Constants.RULES_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send(disabledRule);

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('id');
    const ruleId = res.body.id;

    res = await chai
      .request(server)
      .put(`${Constants.THINGS_PATH}/${thingLight1.id}/properties/on`)
      .type('json')
      .set(...headerAuth(jwt))
      .send(JSON.stringify(true));

    res = await chai
      .request(server)
      .get(`${Constants.THINGS_PATH}/${thingLight2.id}/properties/on`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(res.body).toEqual(false);

    await deleteRule(ruleId);
  });

  it('creates and simulates two rules', async () => {
    let res = await chai
      .request(server)
      .post(Constants.RULES_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send(numberTestRule);

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('id');
    const numberTestRuleId = res.body.id;

    res = await chai
      .request(server)
      .post(Constants.RULES_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send(mixedTestRule);

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('id');
    const mixedTestRuleId = res.body.id;

    res = await chai
      .request(server)
      .get(Constants.RULES_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(2);
    expect(res.body[0]).toMatchObject(numberTestRule);
    expect(res.body[1]).toMatchObject(mixedTestRule);

    const ws = await webSocketOpen(`${Constants.THINGS_PATH}/${thingLight3.id}`, jwt);

    // The chain we're expecting is light2.hue > 120 sets light3.bri to 30
    // which sets light3.on to true
    let [resPut, messages] = await Promise.all([
      chai
        .request(server)
        .put(`${Constants.THINGS_PATH}/${thingLight2.id}/properties/hue`)
        .type('json')
        .set(...headerAuth(jwt))
        .send(JSON.stringify(150)),
      webSocketRead(ws, 7),
    ]);
    expect(resPut.status).toEqual(204);

    expect(Array.isArray(messages)).toBeTruthy();
    expect(messages.length).toEqual(7);
    expect(messages[5]).toMatchObject({
      messageType: Constants.PROPERTY_STATUS,
      data: { bri: 30 },
    });
    expect(messages[6]).toMatchObject({
      messageType: Constants.PROPERTY_STATUS,
      data: { on: true },
    });

    [resPut, messages] = await Promise.all([
      chai
        .request(server)
        .put(`${Constants.THINGS_PATH}/${thingLight2.id}/properties/hue`)
        .type('json')
        .set(...headerAuth(jwt))
        .send(JSON.stringify(0)),
      webSocketRead(ws, 1),
    ]);
    expect(resPut.status).toEqual(204);

    expect(Array.isArray(messages)).toBeTruthy();
    expect(messages.length).toEqual(1);
    expect(messages[0]).toMatchObject({
      messageType: Constants.PROPERTY_STATUS,
      data: { bri: 100 },
    });

    await deleteRule(numberTestRuleId);
    await deleteRule(mixedTestRuleId);
    await webSocketClose(ws);
  });

  async function getOn(lightId: string): Promise<boolean> {
    const res = await chai
      .request(server)
      .get(`${Constants.THINGS_PATH}/${lightId}/properties/on`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    return res.body;
  }

  async function setOn(lightId: string, on: boolean): Promise<void> {
    const res = await chai
      .request(server)
      .put(`${Constants.THINGS_PATH}/${lightId}/properties/on`)
      .type('json')
      .set(...headerAuth(jwt))
      .send(JSON.stringify(on));
    expect(res.status).toEqual(204);
  }

  it('creates and simulates an off rule', async () => {
    // Both lights are on, light1 is turned off, turning light2 off

    await setOn(thingLight1.id, true);
    await setOn(thingLight2.id, true);

    const res = await chai
      .request(server)
      .post(Constants.RULES_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send(offRule);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('id');
    const ruleId = res.body.id;

    await setOn(thingLight1.id, false);
    await waitForExpect(async () => {
      expect(await getOn(thingLight2.id)).toEqual(false);
    });

    await setOn(thingLight1.id, true);
    await waitForExpect(async () => {
      expect(await getOn(thingLight2.id)).toEqual(true);
    });

    await deleteRule(ruleId);
  });

  it('creates an event and action rule', async () => {
    let res = await chai
      .request(server)
      .post(Constants.RULES_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send(eventActionRule);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('id');
    const ruleId = res.body.id;

    // Since the rule-engin uses the websocket API "ADD_EVENT_SUBSCRIPTION"
    // for getting the Event, the websocket IO should process before add Event.
    const setImmediatePromise = util.promisify(setImmediate);
    await setImmediatePromise();

    Events.add(new Event('surge', 'oh no there is too much electricity', thingLight1.id));

    await waitForExpect(async () => {
      res = await chai
        .request(server)
        .get(`${Constants.THINGS_PATH}/${thingLight1.id}${Constants.ACTIONS_PATH}`)
        .set('Accept', 'application/json')
        .set(...headerAuth(jwt));
      expect(res.status).toEqual(200);
      expect(Object.keys(res.body).length).toEqual(1);
      expect(res.body).toHaveProperty('blink');
      expect(Array.isArray(res.body.blink));
    });

    // dispatch event get action
    await deleteRule(ruleId);
  });

  it('creates and simulates a multi-effect rule', async () => {
    const res = await chai
      .request(server)
      .post(Constants.RULES_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send(multiRule);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('id');
    const ruleId = res.body.id;

    await setOn(thingLight1.id, true);
    await waitForExpect(async () => {
      expect(await getOn(thingLight2.id)).toEqual(true);
      expect(await getOn(thingLight3.id)).toEqual(true);
    });

    await setOn(thingLight1.id, false);
    await waitForExpect(async () => {
      expect(await getOn(thingLight2.id)).toEqual(false);
      expect(await getOn(thingLight3.id)).toEqual(false);
    });

    await deleteRule(ruleId);
  });

  it('creates and simulates a string trigger rule', async () => {
    let res = await chai
      .request(server)
      .post(Constants.RULES_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send(equalityRule);

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('id');
    const ruleId = res.body.id;

    res = await chai
      .request(server)
      .put(`${Constants.THINGS_PATH}/light3/properties/color`)
      .type('json')
      .set(...headerAuth(jwt))
      .send(JSON.stringify('#00ff77'));
    expect(res.status).toEqual(204);

    await waitForExpect(async () => {
      expect(await getOn(thingLight3.id)).toEqual(true);
    });

    await deleteRule(ruleId);
  });

  it('creates and simulates a multi trigger rule', async () => {
    const res = await chai
      .request(server)
      .post(Constants.RULES_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send(complexTriggerRule);

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('id');
    const ruleId = res.body.id;

    await setOn(thingLight1.id, true);

    await waitForExpect(async () => {
      expect(await getOn(thingLight3.id)).toEqual(true);
    });

    await deleteRule(ruleId);
  });
});
