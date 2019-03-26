/**
 * JSONWebToken Model.
 *
 * Contains logic to create and verify JWT tokens.
 *
 * This file contains the logic to generate public/private key pairs and return
 * them in the format openssl/crypto expects.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const assert = require('assert');

const ec = require('../ec-crypto');
const Database = require('../db');
const Settings = require('./settings');

const ROLE_USER_TOKEN = 'user_token';

class JSONWebToken {

  /**
   * Verify a JWT by it's signature.
   *
   * @return {JSONWebToken|bool} false when invalid JSONWebToken when valid.
   */
  static async verifyJWT(sig) {
    const decoded = jwt.decode(sig, {
      complete: true,
    });

    if (!decoded || !decoded.header || !decoded.header.kid) {
      return false;
    }

    const {kid} = decoded.header;

    const tokenData = await Database.getJSONWebTokenByKeyId(kid);
    if (!tokenData) {
      return false;
    }

    const token = new JSONWebToken(tokenData);
    token.payload = token.verify(sig);
    if (token.payload) {
      return token;
    }

    return false;
  }

  /**
   * Issue a JWT token and store it in the database.
   *
   * @param {User} user to issue token for.
   * @return {string} the JWT token signature.
   */
  static async issueToken(user) {
    const {sig, token} = await this.create(user);
    await Database.createJSONWebToken(token);
    return sig;
  }

  /**
   * Issue a JWT token for an OAuth2 client and store it in the
   * database.
   *
   * @param {ClientRegistry} client to issue token for.
   * @param {number} user user id associated with token
   * @param {{role: String, scope: String}} payload of token
   * @return {string} the JWT token signature.
   */
  static async issueOAuthToken(client, user, payload) {
    const {sig, token} = await this.create(user, Object.assign({
      client_id: client.id,
    }, payload));
    await Database.createJSONWebToken(token);
    return sig;
  }

  /**
   * Remove a JWT token from the database by it's key id.
   *
   * @param {string} keyId of the record to remove.
   * @return bool true when a record was deleted.
   */
  static async revokeToken(keyId) {
    assert(typeof keyId === 'string');
    return Database.deleteJSONWebTokenByKeyId(keyId);
  }

  /**
   * @param number user id of the user to create a token for.
   * @return {Object} containing .sig (the jwt signature) and .token
   *  for storage in the database.
   */
  static async create(user, payload = {role: ROLE_USER_TOKEN}) {
    const pair = ec.generateKeyPair();

    const keyId = uuid.v4();
    const tunnelInfo = await Settings.getTunnelInfo();
    const issuer = tunnelInfo.tunnelDomain;
    const options = {
      algorithm: ec.JWT_ALGORITHM,
      keyid: keyId,
    };
    if (issuer) {
      options.issuer = issuer;
    }

    const sig = jwt.sign(payload, pair.private, options);

    const token = {
      user,
      issuedAt: new Date(),
      publicKey: pair.public,
      keyId,
      payload,
    };

    return {sig, token};
  }

  constructor(obj) {
    const {user, issuedAt, publicKey, keyId} = obj;
    assert(typeof user === 'number');
    assert(issuedAt);
    assert(typeof publicKey === 'string');
    assert(typeof keyId === 'string');
    this.user = user;
    this.issuedAt = issuedAt;
    this.publicKey = publicKey;
    this.keyId = keyId;
    this.payload = {};
  }

  /**
   * Verify that the given JWT matches this token.
   *
   * @param string sig jwt token.
   * @returns {Object|false} jwt payload if signature matches.
   */
  verify(sig) {
    try {
      return jwt.verify(sig, this.publicKey, {
        algorithms: [ec.JWT_ALGORITHM],
      });
    } catch (err) {
      // If this error is thrown we know the token is invalid.
      if (err.name === 'JsonWebTokenError') {
        return false;
      }
      throw err;
    }
  }

}

module.exports = JSONWebToken;
