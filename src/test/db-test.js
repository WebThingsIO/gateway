const uuid = require('uuid');

const Database = require('../db');
const User = require('../models/user');
const JSONWebToken = require('../models/jsonwebtoken');

describe('db', () => {
  describe('jwt workflows', () => {
    let user;
    const password = 'password';

    beforeEach(async () => {
      const email = `test-${uuid.v4()}@example.com`;
      user = await User.generate(email, password, 'test');
      user.id = await Database.createUser(user);
    });

    afterEach(async () => {
      await Database.deleteUser(user.id);
    });

    it('should be able to insert and fetch a JWT', async () => {
      const {token} = await JSONWebToken.create(user.id);
      await Database.createJSONWebToken(token);
      const fromDb = await Database.getJSONWebTokenByKeyId(token.keyId);
      expect(fromDb.publicKey).toEqual(token.publicKey);

      const count = await Database.getUserCount();
      expect(count).toEqual(1);
    });

    it('should be unreachable after deleting user', async () => {
      const {token} = await JSONWebToken.create(user.id);
      await Database.createJSONWebToken(token);
      const fromDb = await Database.getJSONWebTokenByKeyId(token.keyId);
      expect(fromDb).toBeTruthy();

      await Database.deleteUser(user.id);
      const fromDbAfterDelete =
       await Database.getJSONWebTokenByKeyId(token.keyId);

      expect(fromDbAfterDelete).toBeFalsy();
    });

    it('should be able to cleanup single keys', async () => {
      const {token} = await JSONWebToken.create(user.id);
      await Database.createJSONWebToken(token);
      const fromDb = await Database.getJSONWebTokenByKeyId(token.keyId);
      expect(fromDb).toEqual(expect.objectContaining({
        keyId: token.keyId,
      }));

      await Database.deleteJSONWebTokenByKeyId(token.keyId);
      const fromDbAfterDelete =
       await Database.getJSONWebTokenByKeyId(token.keyId);

      expect(fromDbAfterDelete).toBeFalsy();
    });
  });
});
