
const {httpServer, chai} = require('../common');
const pFinal = require('../promise-final');
const {TEST_USER, headerAuth} = require('../user');
const Constants = require('../../constants');

describe('http redirector', function() {
  it('should redirect GET /', async () => {
    const res  = await chai.request(httpServer)
      .get('/');
    expect(res.status).toBe(200);
    // chai.request appears to not allow passing followRedirect: false, so
    // this slight hack is necessary
    expect(res.request._redirects).toBe(1);
  });
  it('should not redirect an authorization-bearing request', async () => {
    const fakeJwt = 'fakeJwt';
    const err = await pFinal(chai.request(httpServer)
      .get(Constants.THINGS_PATH)
      .set(...headerAuth(fakeJwt)));
    expect(err.response.status).toBe(403);
  });
  it('should not redirect a login POST', async () => {
    const err = await pFinal(chai.request(httpServer)
      .post(Constants.LOGIN_PATH)
      .send(TEST_USER));
    expect(err.response.status).toBe(403);
  });
});
