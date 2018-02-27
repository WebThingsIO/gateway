const {server, chai, mockAdapter} = require('../common');
const Settings = require('../../models/settings');

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
  },
  actions: {
    blink: {
      description: 'Blink the switch on and off'
    }
  },
  events: {
    surge: {
      description: 'Surge in power detected'
    }
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
  enabled: true,
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

const offRule = {
  enabled: true,
  trigger: {
    property: {
      name: 'on',
      type: 'boolean',
      href: '/things/light1/properties/on'
    },
    type: 'BooleanTrigger',
    onValue: false
  },
  effect: {
    property: {
      name: 'on',
      type: 'boolean',
      href: '/things/light2/properties/on'
    },
    type: 'PulseEffect',
    value: false
  }
};

const numberTestRule = {
  enabled: true,
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
    type: 'PulseEffect',
    value: 30
  }
};

const mixedTestRule = {
  enabled: true,
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
    type: 'SetEffect',
    value: true
  }
};

const eventActionRule = {
  enabled: true,
  name: 'Event Action Rule',
  trigger: {
    type: 'EventTrigger',
    event: 'surge',
    thing: {
      href: '/things/light1'
    }
  },
  effect: {
    type: 'ActionEffect',
    action: 'blink',
    thing: {
      href: '/things/light1'
    }
  }
};

describe('rules engine', function() {
  let ruleId = null, jwt, gatewayHref;

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
    // common.js clears settings after every test so we need to restore the
    // rules engine's
    await Settings.set('RulesEngine.jwt', jwt);
    if (!gatewayHref) {
      gatewayHref = await Settings.get('RulesEngine.gateway');
    }
    await Settings.set('RulesEngine.gateway', gatewayHref);
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

  it('creates and simulates a disabled rule', async () => {
    const disabledRule = Object.assign(testRule, {enabled: false});
    let res = await chai.request(server)
      .post(Constants.RULES_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send(disabledRule);

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('id');
    const ruleId = res.body.id;

    res = await chai.request(server)
      .put(Constants.THINGS_PATH + '/' + thingLight1.id + '/properties/on')
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({on: true});

    res = await chai.request(server)
      .get(Constants.THINGS_PATH + '/' + thingLight2.id + '/properties/on')
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(res.body.on).toEqual(false);

    await deleteRule(ruleId);
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

    [resPut, messages] = await Promise.all([
      chai.request(server)
        .put(Constants.THINGS_PATH + '/' + thingLight2.id + '/properties/hue')
        .set('Accept', 'application/json')
        .set(...headerAuth(jwt))
        .send({hue: 0}),
      webSocketRead(ws, 1)
    ]);
    expect(resPut.status).toEqual(200);

    expect(Array.isArray(messages)).toBeTruthy();
    expect(messages.length).toEqual(1);
    expect(messages[0]).toMatchObject({
      messageType: Constants.PROPERTY_STATUS,
      data: {bri: 100}
    });

    await deleteRule(numberTestRuleId);
    await deleteRule(mixedTestRuleId);
    await webSocketClose(ws);
  });

  function sleep(ms) {
    return new Promise(res => {
      setTimeout(res, ms);
    });
  }

  it('creates and simulates an off rule', async () => {
    // Both lights are on, light1 is turned off, turning light2 off. light2 is
    // turned on, light1 is turned off (double activation), turning light2 off.
    // light1 is turned on, turning light2 on.

    async function getOn(lightId) {
      let res = await chai.request(server)
        .get(Constants.THINGS_PATH + '/' + lightId + '/properties/on')
        .set('Accept', 'application/json')
        .set(...headerAuth(jwt));
      expect(res.status).toEqual(200);
      return res.body.on;
    }

    async function setOn(lightId, on) {
      let res = await chai.request(server)
        .put(Constants.THINGS_PATH + '/' + lightId + '/properties/on')
        .set('Accept', 'application/json')
        .set(...headerAuth(jwt))
        .send({on: on});
      expect(res.status).toEqual(200);
    }

    await setOn(thingLight1.id, true);
    await setOn(thingLight2.id, true);

    let res = await chai.request(server)
      .post(Constants.RULES_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send(offRule);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('id');
    const ruleId = res.body.id;

    await setOn(thingLight1.id, false);
    await sleep(200);
    expect(await getOn(thingLight2.id)).toEqual(false);

    await setOn(thingLight2.id, true);
    expect(await getOn(thingLight2.id)).toEqual(true);

    await setOn(thingLight1.id, false);
    await sleep(200);
    expect(await getOn(thingLight2.id)).toEqual(false);

    await setOn(thingLight1.id, true);
    await sleep(200);
    expect(await getOn(thingLight2.id)).toEqual(true);

    await deleteRule(ruleId);
  });

  it('creates an event and action rule', async () => {
    let res = await chai.request(server)
      .post(Constants.RULES_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send(eventActionRule);
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('id');
    const ruleId = res.body.id;

    await sleep(200);

    const Things = require('../../models/things');
    const Event = require('../../models/event');

    let thing = await Things.getThing(thingLight1.id);
    thing.dispatchEvent(new Event('surge',
                                  'oh no there is too much electricity'));

    await sleep(200);

    res = await chai.request(server)
      .get(Constants.THINGS_PATH + '/' + thingLight1.id +
           Constants.ACTIONS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(1);
    expect(res.body[0].name).toEqual('blink');

    // dispatch event get action
    await deleteRule(ruleId);
  });
});
