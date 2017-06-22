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
      return new User(result.id, result.email, result.password, result.name);
    });
  },

  /**
   * Get a user from the database.
   *
   * @param {number}  id primary key.
   * @return {Promise} Promise which resolves to user object
   *   or false if user doesn't exist.
   */
  getUserById: async function (id) {
    const row = await Database.getUserById(id);
    if (!row) {
      return row;
    }
    return new User(row.id, row.email, row.password, row.name);
  },

  /**
   * Get all Users stored in the database
   * @return {Promise<Array<User>>}
   */
  getUsers: function() {
    return Database.getUsers().then(userRows => {
      return userRows.map(row => {
        return new User(row.id, row.email, row.password, row.name);
      });
    });
  },

  /**
   * Create a new User
   * @param {String} email
   * @param {String} password
   * @param {String?} name - optional name of user
   * @return {User} user object.
   */
  createUser: async function(email, password, name) {
    const user = new User(null, email, password, name);
    user.id = await Database.createUser(user);
    return user;
  }
};

module.exports = Users;
