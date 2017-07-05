'use strict';

/* Tell jshint about mocha globals, and  */
/* globals it */

const {server} = require('../common');
const pFinal = require('../promise-final');
const {
  TEST_USER,
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

it('fails to create a user when a user exists', async () => {
  await createUser(server, TEST_USER);
  const again = await pFinal(createUser(server, TEST_USER));
  expect(again.response.status).toEqual(400);
});

it('logs in as a user', async () => {
  const user = {
    email: 'test-login1@example.com',
    name: 'Test User',
    password: 'TEST_USERwow'
  };

  // Create the user but do not use the returning JWT.
  const createJWT = await createUser(server, user);
  const loginJWT = await loginUser(server, user);
  const info = await userInfo(server, loginJWT);
  expect(info.email).toBe(user.email);

  // logout
  await logoutUser(server, loginJWT);

  // try to use an old jwt again.
  const stale = await pFinal(userInfo(server, loginJWT));
  expect(stale.response.status).toEqual(401);

  // try to use an old jwt again.
  const altJWT = await userInfo(server, createJWT);
  expect(altJWT.email).toBe(user.email);
});
