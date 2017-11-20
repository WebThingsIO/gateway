/**
 * Things Gateway Database.
 *
 * Stores a list of Things connected to the gateway.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const config = require('config');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const Passwords = require('./passwords');
const assert = require('assert');

// Imported as a module so we use a relative path.
const ThingsData = require('../static/things.json');

const TABLES = [
  'users',
  'jsonwebtoken_to_user',
  'things',
  'settings',
];

var Database = {
  /**
   * SQLite3 Database object.
   */
  db: null,

  /**
   * Open the database.
   */
  open: function() {
    var filename = config.get('database.filename');
    var removeBeforeOpen = config.get('database.removeBeforeOpen');
    // Check if database already exists
    var exists = fs.existsSync(filename);
    if (exists && removeBeforeOpen) {
      fs.unlinkSync(filename);
      exists = false;
    }
    console.log(exists ? 'Opening' : 'Creating', 'database:', filename);
    // Open database or create it if it doesn't exist
    this.db = new sqlite3.Database(filename);
    this.db.serialize(() => {
      this.createTables();
      // If database newly created, populate with default data
      if (!exists) {
        this.populate();
      }
    });
  },

  createTables: function() {
    // Create Things table
    this.db.run('CREATE TABLE IF NOT EXISTS things (' +
      'id TEXT PRIMARY KEY,' +
      'description TEXT' +
    ');');

    // Create Users table
    this.db.run('CREATE TABLE IF NOT EXISTS users (' +
      'id INTEGER PRIMARY KEY ASC,' +
      'email TEXT UNIQUE,' +
      'password TEXT,' +
      'name TEXT' +
    ');');

    /**
     * This really should have a foreign key constraint but it does not work
     * with our version of node-sqlite / sqlite.
     *
     * https://github.com/mapbox/node-sqlite3/pull/660
     *
     * Instead, the INTEGER user is either the id of the user or -1 if NULL
     */
    this.db.run('CREATE TABLE IF NOT EXISTS jsonwebtoken_to_user (' +
      'id INTEGER PRIMARY KEY ASC,' +
      'keyId TEXT UNIQUE,' + // public id (kid in JWT terms).
      'user INTEGER,' +
      'issuedAt DATE,' +
      'publicKey TEXT' +
    ');');

    // Create Settings table
    this.db.run('CREATE TABLE IF NOT EXISTS settings (' +
      'key TEXT PRIMARY KEY,' +
      'value TEXT' +
    ');');
  },

  /**
   * Populate the database with default data.
   */
  populate: function() {
    console.log('Populating database with default things...');
    // Populate Things table
    var insertSQL = this.db.prepare(
      'INSERT INTO things (id, description) VALUES (?, ?)');
    for (var thing of ThingsData) {
      var thingId = thing.id;
      delete thing.id;
      insertSQL.run(thingId, JSON.stringify(thing));
    }
    insertSQL.finalize();

    // Add default user if provided
    var defaultUser = config.get('authentication.defaultUser');
    if (defaultUser) {
      var passwordHash = Passwords.hashSync(defaultUser.password);
      this.db.run(
        'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
        [defaultUser.email, passwordHash, defaultUser.name],
        function(error) {
          if (error) {
            console.error('Failed to save default user.');
          } else {
            console.log('Saved default user ' + defaultUser.email);
          }
        });
    }

    // Add any settings provided.
    var generateSettings = function(obj, baseKey) {
      const settings = [];
      
      for (const key in obj) {
        let newKey;
        if (baseKey !== '') {
          newKey = baseKey + '.' + key;
        } else {
          newKey = key;
        }
        
        if (typeof obj[key] === 'object') {
          settings.push(...generateSettings(obj[key], newKey));
        } else {
          settings.push([newKey, obj[key]]);
        }
      }
      return settings;
    };

    var settings = generateSettings(config.get('settings.defaults'), '');
    for (const setting of settings) {
      this.db.run(
        'INSERT INTO settings (key, value) VALUES (?, ?)',
        [setting[0], setting[1]],
        function(error) {
          if (error) {
            console.error('Failed to insert setting ' +
                          setting[0]);
          } else {
            console.log('Saved setting ' + setting[0] + ' = ' +
                        setting[1]);
          }
        });
    }
  },

  /**
   * Get all Things stored in the database.
   *
   * @return Promise which resolves with a list of Thing objects.
   */
  getThings: function() {
    return new Promise((function(resolve, reject) {
      this.db.all('SELECT id, description FROM things',
        (function(err, rows) {
        if (err) {
          reject(err);
        } else {
          var things = [];
          for (var row of rows) {
            var thing = JSON.parse(row.description);
            thing.id = row.id;
            things.push(thing);
          }
          resolve(things);
        }
      }));
    }).bind(this));
  },

  /**
   * Add a new Thing to the Database.
   *
   * @param String id The ID to give the new Thing.
   * @param String description A serialised Thing description.
   */
  createThing: function(id, description) {
    return new Promise((function(resolve, reject) {
      var db = this.db;
      db.run('INSERT INTO things (id, description) VALUES (?, ?)',
        [id, JSON.stringify(description)], function(error) {
          if (error) {
            reject(error);
          } else {
            resolve(description);
          }
        });
    }).bind(this));
  },

  /**
   * Update a Thing in the Database.
   *
   * @param String id ID of the thing to update.
   * @param String description A serialised Thing description.
   */
  updateThing: function(id, description) {
    return new Promise((function(resolve, reject) {
      var db = this.db;
      db.run('UPDATE things SET description=? WHERE id=?',
        [JSON.stringify(description), id], function(error) {
          if (error) {
            reject(error);
          } else {
            resolve(description);
          }
        });
    }).bind(this));
  },

  /**
   * Remove a Thing from the Database.
   *
   * @param String id The ID of the Thing to remove.
   */
  removeThing: function(id) {
    return new Promise((function(resolve, reject) {
      var db = this.db;
      db.run('DELETE FROM things WHERE id = ?', id, function(error) {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    }).bind(this));
  },

  /**
   * Get a user by their email address.
   */
  getUser: function(email) {
    return new Promise((function(resolve, reject) {
      var db = this.db;
      db.get('SELECT * FROM users WHERE email = ?', email,
        function(error, row) {
        if (error) {
          reject(error);
        } else {
          resolve(row);
        }
      });
    }).bind(this));
  },

  /**
   * Get a user by it's primary key (id).
   */
  getUserById: async function(id) {
    return await this.get(
      'SELECT * FROM users WHERE id = ?',
      id
    );
  },

  /**
   * Get all Users stored in the database.
   *
   * @return {Promise<Array<User>>} resolves with a list of User objects
   */
  getUsers: function() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM users', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },

  getUserCount: async function() {
    const {count} = await this.get('SELECT count(*) as count FROM users');
    return count;
  },

  /**
   * Get a setting or return undefined
   * @param {String} key
   * @return {Promise<Object?>} value
   */
  getSetting: async function(key) {
    const res = await this.get('SELECT value FROM settings WHERE key=?', key);
    console.log('getSetting', res);

    if (!res) {
      return;
    }

    const {value} = res;
    if (typeof value === 'undefined') {
      return value;
    } else {
      return JSON.parse(value);
    }
  },

  /**
   * Set a setting. Assumes that the only access to the database is
   * single-threaded.
   *
   * @param {String} key
   * @param {Object} value
   * @return {Promise}
   */
  setSetting: async function(key, value) {
    value = JSON.stringify(value);
    let currentValue = await this.getSetting(key);
    if (typeof currentValue === 'undefined') {
      return this.run('INSERT INTO settings (key, value) VALUES (?, ?)',
                      [key, value]);
    } else {
      return this.run('UPDATE settings SET value=? WHERE key=?', [value, key]);
    }
  },

  /**
   * Remove a setting. Assumes that the only access to the database is
   * single-threaded.
   *
   * @param {String} key
   * @return {Promise}
   */
  deleteSetting: async function(key) {
    this.run('DELETE FROM settings WHERE key = ?', [key]);
  },

  /**
   * Get a list of add-on-related settings.
   *
   * @return {Promise<Array<Setting>>} resolves with a list of setting objects
   */
  getAddonSettings: async function() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM settings WHERE key LIKE "addons.%"',
                  (err, rows) => {
                    if (err) {
                      reject(err);
                    } else {
                      resolve(rows);
                    }
                  });
    });
  },

  /**
   * Create a user
   * @param {User} user
   * @return {Promise<User>}
   */
  createUser: async function(user) {
    const result = await this.run(
      'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
      [user.email, user.password, user.name]
    );
    assert(typeof result.lastID === 'number');
    return result.lastID;
  },

  deleteUser: function(userId) {
    assert(typeof userId === 'number');
    const deleteUser = this.run(
      'DELETE FROM users WHERE id = ?',
      [userId]
    );
    const deleteTokens = this.deleteJSONWebTokensForUser(userId);
    /**
     * XXX: This is a terrible hack until we get foreign key constraint support
     * turned on with node-sqlite. As is this could leave junk around in the db.
     */
    return Promise.all([deleteTokens, deleteUser]);
  },

  /**
   * Delete all jsonwebtoken's for a given user.
   */
  deleteJSONWebTokensForUser: function(userId) {
    assert(typeof userId === 'number');
    return this.run(
      'DELETE FROM jsonwebtoken_to_user WHERE user = ?',
      [userId]
    );
  },

  /**
   * Insert a JSONWebToken into the database and return it's primary key.
   */
  createJSONWebToken: async function(token) {
    const {keyId, user, publicKey, issuedAt} = token;
    const result = await this.run(
      'INSERT INTO jsonwebtoken_to_user (keyId, user, issuedAt, publicKey) ' +
      'VALUES (?, ?, ?, ?)',
      [keyId, user, issuedAt, publicKey]
    );
    assert(typeof result.lastID === 'number');
    return result.lastID;
  },

  /**
   * Get a JWT by it's key id.
   */
  getJSONWebTokenByKeyId: function(keyId) {
    assert(typeof keyId === 'string');
    return this.get(
      'SELECT * FROM jsonwebtoken_to_user WHERE keyId = ?',
      keyId
    );
  },

  /**
   * Delete a JWT by it's key id.
   */
  deleteJSONWebTokenByKeyId: async function(keyId) {
    assert(typeof keyId === 'string');
    const result = await this.run(
      'DELETE FROM jsonwebtoken_to_user WHERE keyId = ?',
      keyId
    );
    return result.changes !== 0;
  },

  /**
   * ONLY for tests (clears all tables).
   */
  deleteEverything: async function() {
    return Promise.all(TABLES.map((t) => {
      return this.run(`DELETE FROM ${t}`);
    }));
  },

  get: function(sql, ...params) {
    return new Promise((accept, reject) => {
      params.push(function(err, row) {
        if (err) {
          reject(err);
          return;
        }
        accept(row);
      });

      try {
        this.db.get(sql, ...params);
      } catch (err) {
        reject(err);
        return;
      }
    });
  },

  /**
   * Run a SQL statement
   * @param {String} sql
   * @param {Array<any>} values
   * @return {Promise<Object>} promise resolved to `this` of statement result
   */
  run: function(sql, values) {
    return new Promise((accept, reject) => {
      try {
        this.db.run(sql, values, function (err) {
          if (err) {
            reject(err);
            return;
          }
          // node-sqlite puts results on "this" so avoid arrrow fn.
          accept(this);
        });
      } catch (err) {
        reject(err);
      }
    });
  }
};

module.exports = Database;
