/**
 * This module contains test helpers for interacting with users and credentials.
 */

const Constants = require('../constants');
const chai = require('./chai');
const {expect} = chai;

const TEST_USER = {
  email: 'test@example.com',
  name: 'Test User',
  password: 'rhubarb'
};

async function getJWT(path, server, user) {
  const res = await chai.request(server).
    post(path).
    send(user);
  expect(res).to.have.status(200)
  expect(res.body.jwt).to.be.a('string');
  return res.body.jwt;
}

async function loginUser(server, user) {
  return getJWT(Constants.LOGIN_PATH, server, user);
}

async function createUser(server, user) {
  return getJWT(Constants.USERS_PATH, server, user);
}

async function userInfo(server, jwt) {
  const res = await chai.request(server).
    get(Constants.USERS_PATH + '/info').
    set(...headerAuth(jwt)).
    send();
  expect(res).to.have.status(200)
  expect(res.body).to.be.a('object');
  return res.body;
}

async function logoutUser(server, jwt) {
  const res = await chai.request(server).
    post(Constants.LOG_OUT_PATH).
    set(...headerAuth(jwt)).
    send();
  expect(res).to.have.status(200)
  return res;
}

function headerAuth(jwt) {
  return ['Authorization', `Bearer ${jwt}`];
}

module.exports = {
  TEST_USER,
  createUser,
  loginUser,
  userInfo,
  logoutUser,
  headerAuth,
};
