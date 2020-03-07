/**
 * User Model.
 *
 * Represents a user.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const crypto = require('crypto');
const Database = require('../db');
const Passwords = require('../passwords');
const speakeasy = require('speakeasy');

class User {
  constructor(id, email, password, name, mfaSharedSecret, mfaEnrolled,
              mfaBackupCodes) {
    this.id = id;
    this.email = email;
    this.password = password; // Hashed
    this.mfaSharedSecret = mfaSharedSecret;
    this.mfaEnrolled =
      typeof mfaEnrolled === 'number' ? mfaEnrolled === 1 : mfaEnrolled;
    this.mfaBackupCodes = mfaBackupCodes ? JSON.parse(mfaBackupCodes) : [];
    this.name = name;
  }

  static async generate(email, rawPassword, name) {
    const hash = await Passwords.hash(rawPassword);
    return new User(null, email, hash, name, '', false, '');
  }

  /**
   * Get a JSON description for this user.
   *
   * @return {Object} JSON description of user.
   */
  getDescription() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      mfaEnrolled: this.mfaEnrolled,
    };
  }

  async generateMfaParams() {
    const secret = speakeasy.generateSecret({
      issuer: 'WebThings Gateway',
      name: `WebThings:${this.email}`,
      length: 64,
    });

    this.mfaSharedSecret = secret.base32;
    await Database.editUser(this);

    return {
      secret: this.mfaSharedSecret,
      url: secret.otpauth_url,
    };
  }

  async generateMfaBackupCodes() {
    const codes = new Set();
    while (codes.size !== 10) {
      codes.add(crypto.randomBytes(6).toString('hex'));
    }

    this.mfaBackupCodes = [];
    for (const code of codes) {
      this.mfaBackupCodes.push(await Passwords.hash(code));
    }

    await Database.editUser(this);

    return Array.from(codes);
  }
}

module.exports = User;
