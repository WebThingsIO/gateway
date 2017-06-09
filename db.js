/**
 * MozIoT Gateway Database.
 *
 * Stores a list of Things connected to the gateway.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

var config = require('config');
var sqlite3 = require('sqlite3').verbose();
var fs = require('fs');
var bcrypt = require('bcrypt-nodejs');

var Database = {
  /**
   * Filename to use for default list of Things.
   */
  DATA_FILENAME: 'static/things.json',

  /**
   * SQLLite3 Database object.
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
    // If database newly created, populate with default data
    if (!exists) {
      this.populate();
    }
  },

  /**
   * Populate the database with default data.
   */
  populate: function() {
    console.log('Populating database with default things...');
    var things = require('./' + this.DATA_FILENAME);
    var db = this.db;

    // Create Things table
    var thingsTableSQL = 'CREATE TABLE IF NOT EXISTS things (' +
      'id TEXT PRIMARY KEY,' +
      'description TEXT' +
    ');';
    db.serialize(function() {
      db.run(thingsTableSQL);
      // Populate Things table
      var insertSQL = db.prepare(
        'INSERT INTO things (id, description) VALUES (?, ?)');
      for (var thing of things) {
        var thingId = thing.id;
        delete thing.id;
        insertSQL.run(thingId, JSON.stringify(thing));
      }
      insertSQL.finalize();
    });

    // Create Users table
    var usersTableSQL = 'CREATE TABLE IF NOT EXISTS users (' +
      'id INTEGER PRIMARY KEY ASC,' +
      'email TEXT,' +
      'password TEXT,' +
      'name TEXT' +
    ');';
    db.serialize(function() {
      db.run(usersTableSQL);
      // Add default user if provided
      var defaultUser = config.get('authentication.defaultUser');
      if(!defaultUser) {
        return;
      }
      var passwordHash = bcrypt.hashSync(defaultUser.password);
      db.run('INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
        [defaultUser.email, passwordHash, defaultUser.name],
        function(error) {
        if (error) {
          console.error('Failed to save default user.');
        } else {
          console.log('Saved default user ' + defaultUser.email);
        }
      });
    });
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
  }
};

module.exports = Database;
