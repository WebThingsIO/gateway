const config = require('config');
const nock = require('nock');
const storage = require('node-persist');

const {server, chai} = require('../common');

const {
  TEST_USER,
  createUser,
  headerAuth,
} = require('../user');

const Constants = require('../../constants');

const testRule = {
  enabled: true,
  trigger: {
    type: 'IfThisThenThatTrigger'
  },
  effect: {
    type: 'IfThisThenThatEffect',
    event: 'gateway'
  }
};

describe('rules engine ifttt integration', function() {
  let jwt;

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
  });

  it('creates and simulates an ifttt rule', async () => {
    let res = await chai.request(server)
      .post(Constants.RULES_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send(testRule);

    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('id');
    const ruleId = res.body.id;

    const key = config.get('iftttKey');
    const url = `/trigger/${testRule.effect.event}/with/key/${key}`;

    let nockCalled = new Promise((resolve, reject) => {
      nock('https://maker.ifttt.com')
        .post(url)
        .reply(200, (uri, request) => {
          try {
            expect(request.value1).toEqual(testRule.effect.event);
            resolve(true);
          } catch(err) {
            reject(err);
          }
        });
    });

    let [nockResult, iftttRes] = await Promise.all([
      nockCalled,
      chai.request(server)
        .post(Constants.RULES_IFTTT_PATH)
        .set('Accept', 'application/json')
        .set(...headerAuth(jwt))
        .send({})
    ]);

    expect(nockResult).toBeTruthy();
    expect(iftttRes.status).toEqual(200);

    await deleteRule(ruleId);
  });
});
