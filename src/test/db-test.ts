import {v4 as uuidv4} from 'uuid';
import Database from '../db';
import User from '../models/user';
import JSONWebToken from '../models/jsonwebtoken';

describe('db', () => {
  describe('jwt workflows', () => {
    let user: User;
    const password = 'password';

    beforeEach(async () => {
      const email = `test-${uuidv4()}@example.com`;
      user = await User.generate(email, password, 'test');
      user.setId(await Database.createUser(user));
    });

    afterEach(async () => {
      await Database.deleteUser(user.getId()!);
    });

    it('should be able to insert and fetch a JWT', async () => {
      const {token} = await JSONWebToken.create(user.getId()!);
      await Database.createJSONWebToken(token);
      const fromDb = await Database.getJSONWebTokenByKeyId(token.keyId);
      expect(fromDb.publicKey).toEqual(token.publicKey);

      const count = await Database.getUserCount();
      expect(count).toEqual(1);
    });

    it('should be unreachable after deleting user', async () => {
      const {token} = await JSONWebToken.create(user.getId()!);
      await Database.createJSONWebToken(token);
      const fromDb = await Database.getJSONWebTokenByKeyId(token.keyId);
      expect(fromDb).toBeTruthy();

      await Database.deleteUser(user.getId()!);
      const fromDbAfterDelete = await Database.getJSONWebTokenByKeyId(token.keyId);

      expect(fromDbAfterDelete).toBeFalsy();
    });

    it('should be able to cleanup single keys', async () => {
      const {token} = await JSONWebToken.create(user.getId()!);
      await Database.createJSONWebToken(token);
      const fromDb = await Database.getJSONWebTokenByKeyId(token.keyId);
      expect(fromDb).toEqual(expect.objectContaining({
        keyId: token.keyId,
      }));

      await Database.deleteJSONWebTokenByKeyId(token.keyId);
      const fromDbAfterDelete = await Database.getJSONWebTokenByKeyId(token.keyId);

      expect(fromDbAfterDelete).toBeFalsy();
    });
  });
});
