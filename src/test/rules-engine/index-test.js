const storage = require('../../storage');

const {server, chai, mockAdapter} = require('../common');

const pFinal = require('../promise-final');
const {
  TEST_USER,
  createUser,
  headerAuth,
} = require('../user');

const Constants = require('../../constants');

const {
  webSocketOpen,
  webSocketRead,
  webSocketClose
} = require('../websocket-util');

const thingLight1 = {
  id: 'light1',
  name: 'light1',
  type: 'onOffSwitch',
  properties: {
    on: {type: 'boolean', value: false},
    hue: {type: 'number', value: 0},
    sat: {type: 'number', value: 0},
    bri: {type: 'number', value: 100}
  }
};

const thingLight2 = {
  id: 'light2',
  name: 'light2',
  type: 'onOffSwitch',
  properties: {
    on: {type: 'boolean', value: false},
    hue: {type: 'number', value: 0},
    sat: {type: 'number', value: 0},
    bri: {type: 'number', value: 100}
  }
};

const thingLight3 = {
  id: 'light3',
  name: 'light3',
  type: 'onOffSwitch',
  properties: {
    on: {type: 'boolean', value: false},
    hue: {type: 'number', value: 0},
    sat: {type: 'number', value: 0},
    bri: {type: 'number', value: 100}
  }
};

const testRule = {
  trigger: {
    property: {
      name: 'on',
      type: 'boolean',
      href: '/things/light1/properties/on'
    },
    type: 'BooleanTrigger',
    onValue: true
  },
  effect: {
    property: {
      name: 'on',
      type: 'boolean',
      href: '/things/light2/properties/on'
    },
    type: 'PulseEffect',
    value: true
  }
};

const numberTestRule = {
  name: 'Number Test Rule',
  trigger: {
    property: {
      name: 'hue',
      type: 'number',
      href:
        '/things/light2/properties/hue'
    },
    type: 'LevelTrigger',
    levelType: 'GREATER',
    level: 120
  },
  effect: {
    property: {
      name: 'bri',
      type: 'number',
      href: '/things/light3/properties/bri'
    },
    type: 'SetEffect',
    value: 30
  }
};

const mixedTestRule = {
  name: 'Mixed Test Rule',
  trigger: {
    property: {
      name: 'bri',
      type: 'number',
      href:
        '/things/light3/properties/bri'
    },
    type: 'LevelTrigger',
    levelType: 'LESS',
    level: 50
  },
  effect: {
    property: {
      name: 'on',
      type: 'boolean',
      href: '/things/light3/properties/on'
    },
    type: 'PulseEffect',
    value: true
  }
};

describe('rules engine', function() {
  let ruleId = null, jwt;

  async function addDevice(desc) {
    const {id} = desc;
    const res = await chai.request(server)
      .post(Constants.THINGS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send(desc);
    await mockAdapter().addDevice(id, desc);
    return res;
  }

  async function deleteRule(id) {
    let res = await chai.request(server)
      .delete(Constants.RULES_PATH + '/' + id)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send();
    expect(res.status).toEqual(200);
  }

  beforeEach(async () => {
    jwt = await createUser(server, TEST_USER);
    // jest's lifecycle is weird and invalidates the engine's first JWT
    await storage.setItem('RulesEngine.jwt', jwt);
    await addDevice(thingLight1);
    await addDevice(thingLight2);
    await addDevice(thingLight3);
  });

  it('gets a list of 0 rules', async () => {
    const res = await chai.request(server)
      .get(Constants.RULES_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(0);
  });

  it('fails to create a rule', async () => {
    const err = await pFinal(chai.request(server)
      .post(Constants.RULES_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({
        trigger: {
          property: null,
          type: 'Whatever'
        },
        effect: testRule.effect
      }));
    expect(err.response.status).toEqual(400);
  });

  it('creates a rule', async () => {
    let res = await chai.request(server)
      .post(Constants.RULES_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send(testRule);

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('id');
    ruleId = res.body.id;

    res = await chai.request(server)
      .get(Constants.RULES_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(1);
    expect(res.body[0]).toMatchObject(testRule);
  });

  it('gets this rule specifically', async () => {
    let res = await chai.request(server)
      .get(Constants.RULES_PATH + '/' + ruleId)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(res.body).toMatchObject(testRule);
  });

  it('fails to get a nonexistent rule specifically', async () => {
    const err = await pFinal(chai.request(server)
      .get(Constants.RULES_PATH + '/1337')
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt)));
    expect(err.response.status).toEqual(404);
  });


  it('modifies this rule', async () => {
    let res = await chai.request(server)
      .put(Constants.RULES_PATH + '/' + ruleId)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send(numberTestRule);
    expect(res.status).toEqual(200);

    res = await chai.request(server)
      .get(Constants.RULES_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(1);
    expect(res.body[0]).toMatchObject(numberTestRule);

  });

  it('deletes this rule', async () => {
    await deleteRule(ruleId);

    let res = await chai.request(server)
      .get(Constants.RULES_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(0);
  });

  it('fails to delete a nonexistent rule', async () => {
    const err = await pFinal(chai.request(server)
      .delete(Constants.RULES_PATH + '/0')
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send());
    expect(err.response.status).toEqual(404);
  });

  it('fails to modify a nonexistent rule', async () => {
    const err = await pFinal(chai.request(server)
      .put(Constants.RULES_PATH + '/0')
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send(testRule));
    expect(err.response.status).toEqual(404);
  });

  it('creates and simulates two rules', async () => {
    let res = await chai.request(server)
      .post(Constants.RULES_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send(numberTestRule);

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('id');
    let numberTestRuleId = res.body.id;

    res = await chai.request(server)
      .post(Constants.RULES_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send(mixedTestRule);

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('id');
    let mixedTestRuleId = res.body.id;

    res = await chai.request(server)
      .get(Constants.RULES_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(2);
    expect(res.body[0]).toMatchObject(numberTestRule);
    expect(res.body[1]).toMatchObject(mixedTestRule);

    let ws = await webSocketOpen(Constants.THINGS_PATH + `/${thingLight3.id}`,
      jwt);

    // The chain we're expecting is light2.hue > 120 sets light3.bri to 30
    // which sets light3.on to true
    let [resPut, messages] = await Promise.all([
      chai.request(server)
        .put(Constants.THINGS_PATH + '/' + thingLight2.id + '/properties/hue')
        .set('Accept', 'application/json')
        .set(...headerAuth(jwt))
        .send({hue: 150}),
      webSocketRead(ws, 2)
    ]);
    expect(resPut.status).toEqual(200);

    expect(Array.isArray(messages)).toBeTruthy();
    expect(messages.length).toEqual(2);
    expect(messages[0]).toMatchObject({
      messageType: Constants.PROPERTY_STATUS,
      data: {bri: 30}
    });
    expect(messages[1]).toMatchObject({
      messageType: Constants.PROPERTY_STATUS,
      data: {on: true}
    });

    await deleteRule(numberTestRuleId);
    await deleteRule(mixedTestRuleId);
    await webSocketClose(ws);
 });
});
