const JSONWebToken = require('../../models/jsonwebtoken');
const {assert} = require('../common');

describe('JSONWebToken', function() {

  it('should be able to round trip', () => {
    const userId = 1;
    const {sig, token} = JSONWebToken.create(userId);
    const subject = new JSONWebToken(token);

    const {sig: sig2} = JSONWebToken.create(userId);

    assert(subject.verify(sig));
    assert(!subject.verify(sig2));
  });

});
