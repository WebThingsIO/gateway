/**
 * User Manager.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

var User = require('./user.js');
var Database = require('../db.js');

var Users = {
  /**
   * Get a user from the database.
   *
   * @param {String} email Email address of user to look up.
   * @return {Promise} Promise which resolves to user object
   *   or false if user doesn't exist.
   */
  getUser: function(email) {
    return Database.getUser(email).then((result) => {
      if (!result) {
        return false;
      }
      return new User(result.email, result.password, result.name);
    });
  }
};

module.exports = Users;
