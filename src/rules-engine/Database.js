/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const config = require('config');
const sqlite3 = require('sqlite3').verbose();

function Database() {
  this.db = null;
  this.open();
}

/**
 * Open the database
 */
Database.prototype.open = function() {
  let filename = config.get('database.filename');
  this.db = new sqlite3.Database(filename);

  let rulesTableSQL = `CREATE TABLE IF NOT EXISTS rules (
    id INTEGER PRIMARY KEY,
    description TEXT
  );`;
  return this.run(rulesTableSQL, []);
};

/**
 * Get all rules
 * @return {Promise<Map<number, RuleDescription>>} resolves to a map of rule id
 * to rule
 */
Database.prototype.getRules = function() {
  return new Promise((resolve, reject) => {
    this.db.all(
      'SELECT id, description FROM rules',
      [],
      function(err, rows) {
        if (err) {
          reject(err);
          return;
        }
        let rules = {};
        for (let row of rows) {
          let desc = JSON.parse(row.description);
          rules[row.id] = desc;
        }
        resolve(rules);
      }
    );
  });
};

/**
 * Create a new rule
 * @param {RuleDescription} desc
 * @return {Promise<number>} resolves to rule id
 */
Database.prototype.createRule = function(desc) {
  return this.run(
    'INSERT INTO rules (description) VALUES (?)',
    [JSON.stringify(desc)]
  ).then(res => {
    return parseInt(res.lastID);
  });
};

/**
 * Update an existing rule
 * @param {number} id
 * @param {RuleDescription} desc
 * @return {Promise}
 */
Database.prototype.updateRule = function(id, desc) {
  return this.run(
    'UPDATE rules SET description = ? WHERE id = ?',
    [JSON.stringify(desc), id]
  );
};

/**
 * Delete an existing rule
 * @param {number} id
 * @return {Promise}
 */
Database.prototype.deleteRule = function(id) {
  return this.run('DELETE FROM rules WHERE id = ?', [id]);
};

/**
 * Run a SQL statement
 * @param {String} sql
 * @param {Array<any>} values
 * @return {Promise<Object>} promise resolved to `this` of statement result
 */
Database.prototype.run = function(sql, values) {
  return new Promise((resolve, reject) => {
    this.db.run(
      sql,
      values,
      function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      }
    );
  });
};

module.exports = new Database();
