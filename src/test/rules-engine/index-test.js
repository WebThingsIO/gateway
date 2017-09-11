const {server, chai} = require('../common');
const pFinal = require('../promise-final');
const {
  TEST_USER,
  createUser,
  headerAuth,
} = require('../user');

const Constants = require('../../constants');

const testRule = {
  trigger: {
    property: {
      name: 'on',
      type: 'boolean',
      href:
        '/things/light1/properties/on'
    },
    type: 'BooleanTrigger',
    onValue: true
  },
  effect: {
    property: {
      name: 'on',
      type: 'boolean',
      href: '/things/light1/properties/on'
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
    levelType: 'LESS',
    level: 120
  },
  effect: {
    property: {
      name: 'sat',
      type: 'number',
      href: '/things/light2/properties/sat'
    },
    type: 'SetEffect',
    value: 30
  }
};

describe('index router', function() {
  let ruleId = null, jwt;

  beforeEach(async () => {
    jwt = await createUser(server, TEST_USER);
  });

  it('gets a list of 0 rules', async () => {
    const res = await chai.request(server)
      .get(Constants.RULES_ENGINE_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(0);
  });

  it('fails to create a rule', async () => {
    const err = await pFinal(chai.request(server)
      .post(Constants.RULES_ENGINE_PATH)
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
      .post(Constants.RULES_ENGINE_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send(testRule);

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('id');
    ruleId = res.body.id;

    res = await chai.request(server)
      .get(Constants.RULES_ENGINE_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(1);
    expect(res.body[0]).toMatchObject(testRule);
  });

  it('gets this rule specifically', async () => {
    let res = await chai.request(server)
      .get(Constants.RULES_ENGINE_PATH + '/' + ruleId)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(res.body).toMatchObject(testRule);
  });

  it('fails to get a nonexistent rule specifically', async () => {
    const err = await pFinal(chai.request(server)
      .get(Constants.RULES_ENGINE_PATH + '/1337')
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt)));
    expect(err.response.status).toEqual(404);
  });


  it('modifies this rule', async () => {
    let res = await chai.request(server)
      .put(Constants.RULES_ENGINE_PATH + '/' + ruleId)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send(numberTestRule);
    expect(res.status).toEqual(200);

    res = await chai.request(server)
      .get(Constants.RULES_ENGINE_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(1);
    expect(res.body[0]).toMatchObject(numberTestRule);

  });

  it('deletes this rule', async () => {
    let res = await chai.request(server)
      .delete(Constants.RULES_ENGINE_PATH + '/' + ruleId)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send();
    expect(res.status).toEqual(200);

    res = await chai.request(server)
      .get(Constants.RULES_ENGINE_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(0);
  });

  it('fails to delete a nonexistent rule', async () => {
    const err = await pFinal(chai.request(server)
      .delete(Constants.RULES_ENGINE_PATH + '/0')
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send());
    expect(err.response.status).toEqual(404);
  });

  it('fails to modify a nonexistent rule', async () => {
    const err = await pFinal(chai.request(server)
      .put(Constants.RULES_ENGINE_PATH + '/0')
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send(testRule));
    expect(err.response.status).toEqual(404);
  });

});
