const uuid = require('uuid');

const {assert} = require('./common');
const testConfig = require('../config/test');
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
      const {sig, token} = JSONWebToken.create(user.id);
      await Database.createJSONWebToken(token);
      const fromDb = await Database.getJSONWebTokenByKeyId(token.keyId);
      assert.equal(fromDb.publicKey, token.publicKey);
    });

    it('should be unreachable after deleting user', async () => {
      const {sig, token} = JSONWebToken.create(user.id);
      await Database.createJSONWebToken(token);
      const fromDb = await Database.getJSONWebTokenByKeyId(token.keyId);
      assert(fromDb);

      await Database.deleteUser(user.id);
      const fromDbAfterDelete =
       await Database.getJSONWebTokenByKeyId(token.keyId);
      assert(!fromDbAfterDelete);
    });

    it('should be able to cleanup single keys', async () => {
      const {sig, token} = JSONWebToken.create(user.id);
      await Database.createJSONWebToken(token);
      const fromDb = await Database.getJSONWebTokenByKeyId(token.keyId);
      assert(fromDb);

      await Database.deleteJSONWebTokenByKeyId(token.keyId);
      const fromDbAfterDelete =
       await Database.getJSONWebTokenByKeyId(token.keyId);
      assert(!fromDbAfterDelete);
    });

  });

})
