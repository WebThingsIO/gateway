/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const db = require('../db.js');
const DatabaseMigrate = require('./DatabaseMigrate');

class Database {
  constructor() {
    if (!db.db) {
      db.open();
    }
    this.open();
  }

  /**
   * Open the database
   */
  open() {
    const rulesTableSQL = `CREATE TABLE IF NOT EXISTS rules (
      id INTEGER PRIMARY KEY,
      description TEXT
    );`;
    return db.run(rulesTableSQL, []);
  }

  /**
   * Get all rules
   * @return {Promise<Map<number, RuleDescription>>} resolves to a map of rule
   * id to rule
   */
  getRules() {
    return new Promise((resolve, reject) => {
      db.db.all(
        'SELECT id, description FROM rules',
        [],
        (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          const rules = {};
          const updatePromises = [];
          for (const row of rows) {
            let desc = JSON.parse(row.description);
            const updatedDesc = DatabaseMigrate.migrate(desc);
            if (updatedDesc) {
              desc = updatedDesc;
              updatePromises.push(this.updateRule(row.id, desc));
            }
            rules[row.id] = desc;
          }
          Promise.all(updatePromises).then(() => {
            resolve(rules);
          });
        }
      );
    });
  }

  /**
   * Create a new rule
   * @param {RuleDescription} desc
   * @return {Promise<number>} resolves to rule id
   */
  createRule(desc) {
    return db.run(
      'INSERT INTO rules (description) VALUES (?)',
      [JSON.stringify(desc)]
    ).then((res) => {
      return parseInt(res.lastID);
    });
  }

  /**
   * Update an existing rule
   * @param {number} id
   * @param {RuleDescription} desc
   * @return {Promise}
   */
  updateRule(id, desc) {
    return db.run(
      'UPDATE rules SET description = ? WHERE id = ?',
      [JSON.stringify(desc), id]
    );
  }

  /**
   * Delete an existing rule
   * @param {number} id
   * @return {Promise}
   */
  deleteRule(id) {
    return db.run('DELETE FROM rules WHERE id = ?', [id]);
  }
}

module.exports = new Database();
