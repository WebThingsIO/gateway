const JSONWebToken = require('../models/jsonwebtoken');

describe('Json Web Token', () => {
  const id = 12345

  it('should generate a token', async () => {
    const jwt = await JSONWebToken.create(id)
    expect(jwt.token.user).toEqual(id)
  });
})
