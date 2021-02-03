/**
 * This module contains test helpers for interacting with users and credentials.
 */

import * as Constants from '../constants';
import chai from './chai';
import speakeasy from 'speakeasy';
import http from 'http';
import https from 'https';
import { UserDescription } from '../models/user';

export const TEST_USER = {
  email: 'test@example.com',
  name: 'Test User',
  password: 'rhubarb',
};

export const TEST_USER_DIFFERENT = {
  email: 'test@evil.com',
  name: 'Evil Test User',
  password: 'shoebarb',
};

export const TEST_USER_UPDATE_1 = {
  email: 'test@other.com',
  name: 'Other User',
  password: 'rhubarb',
};

export const TEST_USER_UPDATE_2 = {
  email: 'test@other.com',
  name: 'Other User',
  password: 'rhubarb',
  newPassword: 'strawberry',
};

async function getJWT(
  path: string,
  server: http.Server | https.Server,
  user: Record<string, unknown>
): Promise<string> {
  const res = await chai
    .request(server)
    .keepOpen()
    .post(path)
    .set('Accept', 'application/json')
    .send(user);
  if (res.status !== 200) {
    throw res;
  }
  expect(typeof res.body.jwt).toBe('string');
  return res.body.jwt;
}

export async function loginUser(
  server: http.Server | https.Server,
  user: Record<string, unknown>
): Promise<string> {
  return getJWT(Constants.LOGIN_PATH, server, user);
}

export async function createUser(
  server: http.Server | https.Server,
  user: Record<string, unknown>
): Promise<string> {
  return getJWT(Constants.USERS_PATH, server, user);
}

export async function addUser(
  server: http.Server | https.Server,
  jwt: string,
  user: Record<string, unknown>
): Promise<ChaiHttp.Response> {
  const res = await chai
    .request(server)
    .keepOpen()
    .post(Constants.USERS_PATH)
    .set(...headerAuth(jwt))
    .set('Accept', 'application/json')
    .send(user);
  if (res.status !== 200) {
    throw res;
  }
  return res;
}

export async function editUser(
  server: http.Server | https.Server,
  jwt: string,
  user: Record<string, unknown>
): Promise<ChaiHttp.Response> {
  const res = await chai
    .request(server)
    .keepOpen()
    .put(`${Constants.USERS_PATH}/${user.id}`)
    .set(...headerAuth(jwt))
    .set('Accept', 'application/json')
    .send(user);
  if (res.status !== 200) {
    throw res;
  }
  return res;
}

export async function enableMfa(
  server: http.Server | https.Server,
  jwt: string,
  user: Record<string, unknown>,
  totp?: string
): Promise<{ secret: string; url: string; backupCodes: string[] }> {
  const res1 = await chai
    .request(server)
    .keepOpen()
    .post(`${Constants.USERS_PATH}/${user.id}/mfa`)
    .set(...headerAuth(jwt))
    .set('Accept', 'application/json')
    .send({ enable: true });
  if (res1.status !== 200) {
    throw res1;
  }

  if (!totp) {
    totp = speakeasy.totp({
      secret: res1.body.secret,
      encoding: 'base32',
    });
  }

  const res2 = await chai
    .request(server)
    .keepOpen()
    .post(`${Constants.USERS_PATH}/${user.id}/mfa`)
    .set(...headerAuth(jwt))
    .set('Accept', 'application/json')
    .send({ enable: true, mfa: { totp } });
  if (res2.status !== 200) {
    throw res2;
  }

  // return the combined parameters
  return Object.assign({}, res1.body, res2.body);
}

export async function disableMfa(
  server: http.Server | https.Server,
  jwt: string,
  user: Record<string, unknown>
): Promise<ChaiHttp.Response> {
  const res = await chai
    .request(server)
    .keepOpen()
    .post(`${Constants.USERS_PATH}/${user.id}/mfa`)
    .set(...headerAuth(jwt))
    .set('Accept', 'application/json')
    .send({ enable: false });
  if (res.status !== 204) {
    throw res;
  }
  return res;
}

export async function deleteUser(
  server: http.Server | https.Server,
  jwt: string,
  userId: number
): Promise<ChaiHttp.Response> {
  const res = await chai
    .request(server)
    .keepOpen()
    .delete(`${Constants.USERS_PATH}/${userId}`)
    .set(...headerAuth(jwt))
    .set('Accept', 'application/json')
    .send();
  if (res.status !== 204) {
    throw res;
  }
  return res;
}

export async function userInfo(
  server: http.Server | https.Server,
  jwt: string
): Promise<UserDescription | null> {
  const res = await chai
    .request(server)
    .keepOpen()
    .get(`${Constants.USERS_PATH}/info`)
    .set(...headerAuth(jwt))
    .set('Accept', 'application/json')
    .send();
  if (res.status !== 200) {
    throw res;
  }
  expect(Array.isArray(res.body)).toBe(true);
  for (const user of res.body) {
    if (user.loggedIn) {
      return user;
    }
  }

  return null;
}

export async function userInfoById(
  server: http.Server | https.Server,
  jwt: string,
  userId: number
): Promise<UserDescription> {
  const res = await chai
    .request(server)
    .keepOpen()
    .get(`${Constants.USERS_PATH}/${userId}`)
    .set(...headerAuth(jwt))
    .set('Accept', 'application/json')
    .send();
  if (res.status !== 200) {
    throw res;
  }
  expect(typeof res.body).toBe('object');
  return res.body;
}

export async function userCount(server: http.Server | https.Server): Promise<{ count: number }> {
  const res = await chai
    .request(server)
    .keepOpen()
    .get(`${Constants.USERS_PATH}/count`)
    .set('Accept', 'application/json')
    .send();
  if (res.status !== 200) {
    throw res;
  }
  expect(typeof res.body).toBe('object');
  return res.body;
}

export async function logoutUser(
  server: http.Server | https.Server,
  jwt: string
): Promise<ChaiHttp.Response> {
  const res = await chai
    .request(server)
    .keepOpen()
    .post(Constants.LOG_OUT_PATH)
    .set(...headerAuth(jwt))
    .set('Accept', 'application/json')
    .send();
  if (res.status !== 200) {
    throw res;
  }
  return res;
}

export function headerAuth(jwt: string): [string, string] {
  return ['Authorization', `Bearer ${jwt}`];
}
