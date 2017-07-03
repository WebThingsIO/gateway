const JSONWebToken = require('../../models/jsonwebtoken');

describe('JSONWebToken', function() {

  it('should be able to round trip', () => {
    const userId = 1;
    const {sig, token} = JSONWebToken.create(userId);
    const subject = new JSONWebToken(token);

    const {sig: sig2} = JSONWebToken.create(userId);

    expect(subject.verify(sig)).toBeTruthy();
    expect(subject.verify(sig2)).toEqual(false);
  });

});
