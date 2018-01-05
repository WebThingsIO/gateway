/**
 * This module contains test helpers for interacting with users and credentials.
 */

const Constants = require('../constants');
const chai = require('./chai');

const TEST_USER = {
  email: 'test@example.com',
  name: 'Test User',
  password: 'rhubarb'
};

const TEST_USER_DIFFERENT = {
  email: 'test@evil.com',
  name: 'Evil Test User',
  password: 'shoebarb'
};

const TEST_USER_UPDATE_1 = {
  email: 'test@other.com',
  name: 'Other User',
  password: 'rhubarb'
};

const TEST_USER_UPDATE_2 = {
  email: 'test@other.com',
  name: 'Other User',
  password: 'rhubarb',
  newPassword: 'strawberry'
};

async function getJWT(path, server, user) {
  const res = await chai.request(server).
    post(path).
    set('Accept', 'application/json').
    send(user);
  expect(res.status).toEqual(200);
  expect(typeof res.body.jwt).toBe('string');
  return res.body.jwt;
}

async function loginUser(server, user) {
  return getJWT(Constants.LOGIN_PATH, server, user);
}

async function createUser(server, user) {
  return getJWT(Constants.USERS_PATH, server, user);
}

async function editUser(server, jwt, user) {
  const res = await chai.request(server).
    put(`${Constants.USERS_PATH}/${user.id}`).
    set(...headerAuth(jwt)).
    set('Accept', 'application/json').
    send(user);
  expect(res.status).toEqual(200);
  return res;
}

async function deleteUser(server, jwt, userId) {
  const res = await chai.request(server).
    delete(`${Constants.USERS_PATH}/${userId}`).
    set(...headerAuth(jwt)).
    set('Accept', 'application/json').
    send();
  expect(res.status).toEqual(200);
  return res;
}

async function userInfo(server, jwt) {
  const res = await chai.request(server).
    get(`${Constants.USERS_PATH}/info`).
    set(...headerAuth(jwt)).
    set('Accept', 'application/json').
    send();
  expect(res.status).toEqual(200);
  expect(typeof res.body).toBe('object');
  return res.body;
}

async function logoutUser(server, jwt) {
  const res = await chai.request(server).
    post(Constants.LOG_OUT_PATH).
    set(...headerAuth(jwt)).
    set('Accept', 'application/json').
    send();
  expect(res.status).toEqual(200);
  return res;
}

function headerAuth(jwt) {
  return ['Authorization', `Bearer ${jwt}`];
}

module.exports = {
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
  headerAuth,
};
