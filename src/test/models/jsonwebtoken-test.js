const JSONWebToken = require('../../models/jsonwebtoken');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const ec = require('../../ec-crypto');

describe('JSONWebToken', function() {

  it('should be able to round trip', () => {
    const userId = 1;
    const {sig, token} = JSONWebToken.create(userId);
    const subject = new JSONWebToken(token);

    const {sig: sig2} = JSONWebToken.create(userId);

    expect(subject.verify(sig)).toBeTruthy();
    expect(subject.verify(sig2)).toEqual(false);
  });

  it('should fail to verify with a missing key id', async () => {
    const pair = ec.generateKeyPair();
    const sig = jwt.sign({}, pair.private, {
      algorithm: ec.JWT_ALGORITHM
    });
    expect(await JSONWebToken.verifyJWT(sig)).toEqual(false);
  });

  it('should fail to verify with an incorrect key id', async () => {
    const pair = ec.generateKeyPair();
    const sig = jwt.sign({}, pair.private, {
      algorithm: ec.JWT_ALGORITHM,
      keyid: 'tomato'
    });
    expect(await JSONWebToken.verifyJWT(sig)).toEqual(false);
  });

  it('should fail to verify a JWT with the "none" alg', async () => {
    const pair = ec.generateKeyPair();
    const sig = jwt.sign({}, pair.private, {
      algorithm: 'none',
      keyid: uuid.v4()
    });
    expect(await JSONWebToken.verifyJWT(sig)).toEqual(false);
  });

});
