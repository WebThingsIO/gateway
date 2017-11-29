'use strict';

/* Tell jshint about mocha globals, and  */
/* globals it */

const {server} = require('../common');
const pFinal = require('../promise-final');
const {
  TEST_USER,
  TEST_USER_DIFFERENT,
  TEST_USER_UPDATE_1,
  TEST_USER_UPDATE_2,
  createUser,
  editUser,
  deleteUser,
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

it('edits an invalid user', async () => {
  const jwt = await createUser(server, TEST_USER);
  const rsp = await pFinal(
    editUser(server, jwt, Object.assign(TEST_USER_UPDATE_1, {id: 0})));
  expect(rsp.response.status).toEqual(404);
});

it('edits a user', async () => {
  const jwt = await createUser(server, TEST_USER);
  let info = await userInfo(server, jwt);
  await editUser(
    server, jwt, Object.assign(TEST_USER_UPDATE_1, {id: info.id}));
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
    server, jwt, Object.assign(TEST_USER_UPDATE_2, {id: info.id}));
  info = await userInfo(server, jwt);
  expect(info.name).toBe(TEST_USER_UPDATE_2.name);
  expect(info.email).toBe(TEST_USER_UPDATE_2.email);

  // Log out and log back in to verify.
  await logoutUser(server, jwt);
  await loginUser(server,
                  Object.assign(TEST_USER_UPDATE_2,
                                {password: TEST_USER_UPDATE_2.newPassword}));
});

it('deletes a user', async () => {
  const jwt = await createUser(server, TEST_USER);
  let info = await userInfo(server, jwt);
  await deleteUser(server, jwt, info.id);
  const rsp1 = await pFinal(userInfo(server, jwt));
  expect(rsp1.response.status).toBe(401);
  const rsp2 = await pFinal(loginUser(server, TEST_USER));
  expect(rsp2.response.status).toBe(401);
});
