/**
 * Authentication manager.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

var bcrypt = require('bcrypt-nodejs');

var Authentication = {
  /**
   * @param {string} plaintext password.
   * @param {string} hash bcrypt hash.
   * @return {bool} true when password matches hash.
   */
  comparePassword(password, hash) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hash, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  },

  /**
   * Hash a password asynchronously
   * @param {String} password
   * @return {Promise<String>} hashed password
   */
  hashPassword: function(password) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, null, null, function(err, hash) {
        if (err) {
          reject(err);
        } else {
          resolve(hash);
        }
      });
    });
  }
};
module.exports = Authentication;
