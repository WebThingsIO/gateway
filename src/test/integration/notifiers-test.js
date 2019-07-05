'use strict';

const {server, chai} = require('../common');
const {
  TEST_USER,
  createUser,
  headerAuth,
} = require('../user');
const Constants = require('../../constants');

describe('notifiers/', () => {
  let jwt;
  beforeEach(async () => {
    jwt = await createUser(server, TEST_USER);
  });

  it('gets a list of all notifiers', async () => {
    const res = await chai.request(server)
      .get(Constants.NOTIFIERS_PATH)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toEqual(0);
    // Testing ends here because debugging why mock-adapter couldn't load a
    // notifier instance was taking up too much time
  });

  it('fails to get a nonexistent notifier', async () => {
    const res = await chai.request(server)
      .get(`${Constants.NOTIFIERS_PATH}/fake-notifier`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(404);
  });

  it('fails to get outlets of a nonexistent notifier', async () => {
    const res = await chai.request(server)
      .get(`${Constants.NOTIFIERS_PATH}/fake-notifier/outlets`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt));

    expect(res.status).toEqual(404);
  });

  it('fails to notify using a nonexistent notifier', async () => {
    const res = await chai.request(server)
      .post(`${Constants.NOTIFIERS_PATH}/fake-notifier/outlets/fake-outlet/notify`)
      .set('Accept', 'application/json')
      .set(...headerAuth(jwt))
      .send({title: 'Hello', message: 'World', level: 0});

    expect(res.status).toEqual(404);
  });
});

