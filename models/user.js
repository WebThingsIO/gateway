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

var bcrypt = require('bcrypt-nodejs');

var User = function(id, email, password, name) {
  this.id = id;
  this.email = email;
  this.password = password; // Hashed
  this.name = name;
};

User.generate = async function(email, rawPassword, name) {
  // TODO: Make async.
  const hash = bcrypt.hashSync(rawPassword);
  return new User(null, email, hash, name);
}

/**
 * Check stored password against provided password.
 *
 * @param {String} password Password provided.
 * @return {Boolean} True is matches, false if not.
 */
User.prototype.checkPassword = function(password) {
  if (bcrypt.compareSync(password, this.password)) {
    return true;
  } else {
    return false;
  }
};

/**
 * Get a JSON description for this user.
 *
 * @return {Object} JSON description of user.
 */
User.prototype.getDescription = function() {
  return {
    'email': this.email,
    'name': this.name
  };
};

module.exports = User;
