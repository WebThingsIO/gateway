
const {httpServer, chai} = require('../common');
const {TEST_USER, headerAuth} = require('../user');
const Constants = require('../../constants');

describe('http redirector', () => {
  it('should redirect GET /', async () => {
    const res = await chai.request(httpServer)
      .get('/');
    expect(res.status).toBe(200);
    // chai.request appears to not allow passing followRedirect: false, so
    // this slight hack is necessary
    expect(res.request._redirects).toBe(1);
  });
  it('should not redirect an authorization-bearing request', async () => {
    const fakeJwt = 'fakeJwt';
    const err = await chai.request(httpServer)
      .get(Constants.THINGS_PATH)
      .set(...headerAuth(fakeJwt));
    expect(err.status).toBe(403);
  });
  it('should not redirect a login POST', async () => {
    const err = await chai.request(httpServer)
      .post(Constants.LOGIN_PATH)
      .send(TEST_USER);
    expect(err.status).toBe(403);
  });
});
