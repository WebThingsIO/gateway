'use strict';

const {server} = require('../common');
const {
  TEST_USER,
  TEST_USER_DIFFERENT,
  TEST_USER_UPDATE_1,
  TEST_USER_UPDATE_2,
  createUser,
  addUser,
  editUser,
  enableMfa,
  disableMfa,
  deleteUser,
  loginUser,
  userInfo,
  userInfoById,
  userCount,
  logoutUser,
} = require('../user');
const speakeasy = require('speakeasy');

it('creates a user and get email', async () => {
  const jwt = await createUser(server, TEST_USER);
  const info = await userInfo(server, jwt);
  expect(info.email).toBe(TEST_USER.email);
});

it('ensures user login is case insensitive', async () => {
  await createUser(server, TEST_USER);
  const userCopy = Object.assign({}, TEST_USER);
  userCopy.email = userCopy.email.toUpperCase();
  const loginJWT = await loginUser(server, userCopy);
  expect(loginJWT).toBeTruthy();
});

it('gets user count', async () => {
  const count1 = await userCount(server);
  expect(count1.count).toBe(0);
  await createUser(server, TEST_USER);
  const count2 = await userCount(server);
  expect(count2.count).toBe(1);
});

it('gets invalid user info', async () => {
  const jwt = await createUser(server, TEST_USER);
  try {
    await userInfoById(server, jwt, 1000);
  } catch (err) {
    expect(err.status).toBe(404);
  }
});

it('gets user info by id', async () => {
  const jwt = await createUser(server, TEST_USER);
  const info1 = await userInfo(server, jwt);
  const info2 = await userInfoById(server, jwt, info1.id);
  expect(info2.id).toBe(info1.id);
  expect(info2.email).toBe(info1.email);
  expect(info2.name).toBe(info1.name);
});

it('fails to create a user when missing data', async () => {
  try {
    await createUser(server, {email: 'fake@test.com'});
  } catch (err) {
    expect(err.status).toEqual(400);
  }
});

it('fails to create another user when not logged in', async () => {
  await createUser(server, TEST_USER);
  try {
    await createUser(server, TEST_USER_DIFFERENT);
  } catch (diff) {
    expect(diff.status).toEqual(401);
  }
});

it('fails to create a duplicate user', async () => {
  const jwt = await createUser(server, TEST_USER);
  try {
    await addUser(server, jwt, TEST_USER);
  } catch (again) {
    expect(again.status).toEqual(400);
  }
});

it('creates a second user', async () => {
  const jwt = await createUser(server, TEST_USER);
  await addUser(server, jwt, TEST_USER_DIFFERENT);
});

it('logs in as a user', async () => {
  // Create the user but do not use the returning JWT.
  const createJWT = await createUser(server, TEST_USER);
  const loginJWT = await loginUser(server, TEST_USER);
  const info = await userInfo(server, loginJWT);
  expect(info.email).toBe(TEST_USER.email);

  // logout
  await logoutUser(server, loginJWT);

  // try to use an old, revoked jwt again.
  try {
    await userInfo(server, loginJWT);
  } catch (stale) {
    expect(stale.status).toEqual(401);
  }

  // try to use a non-revoked jwt again.
  const altInfo = await userInfo(server, createJWT);
  expect(altInfo.email).toBe(TEST_USER.email);
});

it('edits an invalid user', async () => {
  const jwt = await createUser(server, TEST_USER);
  try {
    await editUser(server, jwt, Object.assign({}, TEST_USER_UPDATE_1, {id: 0}));
  } catch (rsp) {
    expect(rsp.status).toEqual(404);
  }
});

it('fails to edit a user when missing data', async () => {
  const jwt = await createUser(server, TEST_USER);
  const info = await userInfo(server, jwt);
  try {
    await editUser(server, jwt, {id: info.id});
  } catch (err) {
    expect(err.status).toEqual(400);
  }
});

it('fails to edit user with incorrect password', async () => {
  const jwt = await createUser(server, TEST_USER);
  const info = await userInfo(server, jwt);
  try {
    await editUser(
      server,
      jwt,
      Object.assign({}, TEST_USER_UPDATE_1, {id: info.id, password: 'wrong'})
    );
  } catch (err) {
    expect(err.status).toEqual(400);
  }
});

it('edits a user', async () => {
  const jwt = await createUser(server, TEST_USER);
  let info = await userInfo(server, jwt);
  await editUser(
    server, jwt, Object.assign({}, TEST_USER_UPDATE_1, {id: info.id}));
  info = await userInfo(server, jwt);
  expect(info.name).toBe(TEST_USER_UPDATE_1.name);
  expect(info.email).toBe(TEST_USER_UPDATE_1.email);

  // Log out and log back in to verify.
  await logoutUser(server, jwt);
  await loginUser(server, TEST_USER_UPDATE_1);
});

it('edits a user, including password', async () => {
  const jwt = await createUser(server, TEST_USER);
  let info = await userInfo(server, jwt);
  await editUser(
    server, jwt, Object.assign({}, TEST_USER_UPDATE_2, {id: info.id}));
  info = await userInfo(server, jwt);
  expect(info.name).toBe(TEST_USER_UPDATE_2.name);
  expect(info.email).toBe(TEST_USER_UPDATE_2.email);

  // Log out and log back in to verify.
  await logoutUser(server, jwt);
  await loginUser(server,
                  Object.assign({}, TEST_USER_UPDATE_2,
                                {password: TEST_USER_UPDATE_2.newPassword}));
});

it('deletes a user', async () => {
  const jwt = await createUser(server, TEST_USER);
  const info = await userInfo(server, jwt);
  await deleteUser(server, jwt, info.id);
  try {
    await userInfo(server, jwt);
  } catch (rsp1) {
    expect(rsp1.status).toBe(401);
  }
  try {
    await loginUser(server, TEST_USER);
  } catch (rsp2) {
    expect(rsp2.status).toBe(401);
  }
});

it('fails to log in with missing data', async () => {
  await createUser(server, TEST_USER);
  try {
    await loginUser(server, {email: TEST_USER.email});
  } catch (err) {
    expect(err.status).toBe(400);
  }
});

it('fails to log in with incorrect password', async () => {
  await createUser(server, TEST_USER);
  try {
    await loginUser(server, Object.assign({}, TEST_USER, {password: 'wrong'}));
  } catch (err) {
    expect(err.status).toBe(401);
  }
});

it('fails to enable MFA with wrong token', async () => {
  await createUser(server, TEST_USER);
  const jwt = await loginUser(server, TEST_USER);
  const info = await userInfo(server, jwt);
  try {
    await enableMfa(
      server,
      jwt,
      Object.assign({}, TEST_USER, {id: info.id}),
      '000000'
    );
  } catch (err) {
    expect(err.status).toBe(401);
  }
});

it('fails to log in with missing MFA token', async () => {
  await createUser(server, TEST_USER);
  const jwt = await loginUser(server, TEST_USER);
  const info = await userInfo(server, jwt);
  await enableMfa(server, jwt, Object.assign({}, TEST_USER, {id: info.id}));
  await logoutUser(server, jwt);
  try {
    await loginUser(server, TEST_USER);
  } catch (err) {
    expect(err.status).toBe(401);
    expect(err.body.mfaRequired).toBe(true);
  }
});

it('fails to log in with incorrect MFA token', async () => {
  await createUser(server, TEST_USER);
  const jwt = await loginUser(server, TEST_USER);
  const info = await userInfo(server, jwt);
  await enableMfa(server, jwt, Object.assign({}, TEST_USER, {id: info.id}));
  await logoutUser(server, jwt);
  try {
    await loginUser(
      server,
      Object.assign({}, TEST_USER, {mfa: {totp: '000000'}})
    );
  } catch (err) {
    expect(err.status).toBe(401);
    expect(err.body.mfaRequired).toBe(true);
  }
});

it('logs in successfully with MFA token', async () => {
  await createUser(server, TEST_USER);
  const jwt = await loginUser(server, TEST_USER);
  const info = await userInfo(server, jwt);
  const params =
    await enableMfa(server, jwt, Object.assign({}, TEST_USER, {id: info.id}));
  await logoutUser(server, jwt);
  const totp = speakeasy.totp({
    secret: params.secret,
    encoding: 'base32',
  });
  await loginUser(server, Object.assign({}, TEST_USER, {mfa: {totp}}));
});

it('fails to log in with incorrect MFA backup code', async () => {
  await createUser(server, TEST_USER);
  const jwt = await loginUser(server, TEST_USER);
  const info = await userInfo(server, jwt);
  await enableMfa(server, jwt, Object.assign({}, TEST_USER, {id: info.id}));
  await logoutUser(server, jwt);
  try {
    const totp = '0123456789';
    await loginUser(server, Object.assign({}, TEST_USER, {mfa: {totp}}));
  } catch (err) {
    expect(err.status).toBe(401);
    expect(err.body.mfaRequired).toBe(true);
  }
});

it('logs in successfully with MFA backup code', async () => {
  await createUser(server, TEST_USER);
  const jwt = await loginUser(server, TEST_USER);
  const info = await userInfo(server, jwt);
  const params =
    await enableMfa(server, jwt, Object.assign({}, TEST_USER, {id: info.id}));
  await logoutUser(server, jwt);
  await loginUser(
    server,
    Object.assign({}, TEST_USER, {mfa: {totp: params.backupCodes[0]}})
  );
});

it('fails to log in twice with same MFA backup code', async () => {
  await createUser(server, TEST_USER);
  let jwt = await loginUser(server, TEST_USER);
  const info = await userInfo(server, jwt);
  const params =
    await enableMfa(server, jwt, Object.assign({}, TEST_USER, {id: info.id}));
  await logoutUser(server, jwt);
  jwt = await loginUser(
    server,
    Object.assign({}, TEST_USER, {mfa: {totp: params.backupCodes[0]}})
  );
  await logoutUser(server, jwt);
  try {
    await loginUser(
      server,
      Object.assign({}, TEST_USER, {mfa: {totp: params.backupCodes[0]}})
    );
  } catch (err) {
    expect(err.status).toBe(401);
    expect(err.body.mfaRequired).toBe(true);
  }
});

it('enables and disables MFA, then logs in', async () => {
  await createUser(server, TEST_USER);
  let jwt = await loginUser(server, TEST_USER);
  const info = await userInfo(server, jwt);
  const params =
    await enableMfa(server, jwt, Object.assign({}, TEST_USER, {id: info.id}));
  await logoutUser(server, jwt);
  const totp = speakeasy.totp({
    secret: params.secret,
    encoding: 'base32',
  });
  jwt = await loginUser(server, Object.assign({}, TEST_USER, {mfa: {totp}}));
  await disableMfa(server, jwt, Object.assign({}, TEST_USER, {id: info.id}));
  await logoutUser(server, jwt);
  await loginUser(server, TEST_USER);
});

it('enables, disables, and re-enables MFA, but gets new secret', async () => {
  await createUser(server, TEST_USER);
  let jwt = await loginUser(server, TEST_USER);
  const info = await userInfo(server, jwt);
  const params1 =
    await enableMfa(server, jwt, Object.assign({}, TEST_USER, {id: info.id}));
  await logoutUser(server, jwt);
  let totp = speakeasy.totp({
    secret: params1.secret,
    encoding: 'base32',
  });
  jwt = await loginUser(server, Object.assign({}, TEST_USER, {mfa: {totp}}));
  await disableMfa(server, jwt, Object.assign({}, TEST_USER, {id: info.id}));
  await logoutUser(server, jwt);
  jwt = await loginUser(server, TEST_USER);
  const params2 =
    await enableMfa(server, jwt, Object.assign({}, TEST_USER, {id: info.id}));
  expect(params2.secret).not.toBe(params1.secret);
  await logoutUser(server, jwt);
  totp = speakeasy.totp({
    secret: params2.secret,
    encoding: 'base32',
  });
  await loginUser(server, Object.assign({}, TEST_USER, {mfa: {totp}}));
});

it('resets rate limit after successful login', async () => {
  let jwt = await createUser(server, TEST_USER);
  jwt = await loginUser(server, TEST_USER);
  await logoutUser(server, jwt);

  for (let i = 0; i < 9; ++i) {
    try {
      await loginUser(
        server,
        Object.assign({}, TEST_USER, {password: 'wrong'})
      );
    } catch (err) {
      expect(err.status).toBe(401);
    }
  }

  jwt = await loginUser(server, TEST_USER);
  await logoutUser(server, jwt);

  for (let i = 0; i < 10; ++i) {
    try {
      await loginUser(
        server,
        Object.assign({}, TEST_USER, {password: 'wrong'})
      );
    } catch (err) {
      expect(err.status).toBe(401);
    }
  }

  try {
    await loginUser(
      server,
      Object.assign({}, TEST_USER, {password: 'wrong'})
    );
  } catch (err) {
    // rate limit hit
    expect(err.status).toBe(429);
  }
});
