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

const Passwords = require('../passwords');

class User {
  constructor(id, email, password, name) {
    this.id = id;
    this.email = email;
    this.password = password; // Hashed
    this.name = name;
  }

  static async generate(email, rawPassword, name) {
    const hash = await Passwords.hash(rawPassword);
    return new User(null, email, hash, name);
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
    };
  }
}

module.exports = User;
