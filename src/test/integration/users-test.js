'use strict';

/* Tell jshint about mocha globals, and  */
/* globals it */

const {server} = require('../common');
const pFinal = require('../promise-final');
const {
  TEST_USER,
  TEST_USER_DIFFERENT,
  createUser,
  loginUser,
  userInfo,
  logoutUser,
} = require('../user');

it('creates a user and get email', async () => {
  const jwt = await createUser(server, TEST_USER);
  const info = await userInfo(server, jwt);
  expect(info.email).toBe(TEST_USER.email);
});

it('fails to create a duplicate user when a user exists', async () => {
  await pFinal(createUser(server, TEST_USER));
  const again = await pFinal(createUser(server, TEST_USER));
  expect(again.response.status).toEqual(400);
});

it('fails to create another user when a user exists', async () => {
  await pFinal(createUser(server, TEST_USER));
  const diff = await pFinal(createUser(server, TEST_USER_DIFFERENT));
  expect(diff.response.status).toEqual(400);
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
  const stale = await pFinal(userInfo(server, loginJWT));
  expect(stale.response.status).toEqual(401);

  // try to use a non-revoked jwt again.
  const altInfo = await userInfo(server, createJWT);
  expect(altInfo.email).toBe(TEST_USER.email);
});
