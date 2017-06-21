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
const assert = require('assert');
const ec = require('../ec-crypto');
const jwt = require('jsonwebtoken');

class JSONWebToken {

  /**
   * @param number user id of the user to create a token for.
   * @return {Object} containing .sig (the jwt signature) and .token
   *  for storage in the database.
   */
  static create(user) {
    const pair = ec.generateKeyPair();

    // Nothing yet ...
    const payload = {
    };

    const sig = jwt.sign(payload, pair.private, {
      algorithm: ec.JWT_ALGORITHM,
    });

    const token = {
      user,
      issuedAt: new Date(),
      publicKey: pair.public,
    };

    return { sig, token };
  }

  constructor(obj) {
    const {user, issuedAt, publicKey} = obj;
    assert(typeof user === 'number');
    assert(issuedAt);
    assert(typeof publicKey === 'string');
    this.user = user;
    this.issuedAt = issuedAt;
    this.publicKey = publicKey;
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
