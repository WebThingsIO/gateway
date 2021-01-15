/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Database from '../db';
import * as DatabaseMigrate from './DatabaseMigrate';
import {RuleDescription} from './Rule';

class RulesDatabase {
  constructor() {
    Database.open();
    this.open();
  }

  /**
   * Open the database
   */
  open(): Promise<any> {
    const rulesTableSQL = `CREATE TABLE IF NOT EXISTS rules (
      id INTEGER PRIMARY KEY,
      description TEXT
    );`;
    return Database.run(rulesTableSQL, []);
  }

  /**
   * Get all rules
   * @return {Promise<Map<number, RuleDescription>>} resolves to a map of rule
   * id to rule
   */
  getRules(): Promise<Record<number, RuleDescription>> {
    return new Promise((resolve, reject) => {
      Database.all(
        'SELECT id, description FROM rules',
        [],
        (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          const rules: Record<number, RuleDescription> = {};
          const updatePromises = [];
          for (const row of rows) {
            let desc = JSON.parse(row.description);
            const updatedDesc = DatabaseMigrate.migrate(desc);
            if (updatedDesc) {
              desc = updatedDesc;
              updatePromises.push(this.updateRule(row.id, desc));
            }
            rules[(row as Record<string, any>).id] = desc;
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
  createRule(desc: RuleDescription): Promise<number> {
    return Database.run(
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
  updateRule(id: number, desc: RuleDescription): Promise<any> {
    return Database.run(
      'UPDATE rules SET description = ? WHERE id = ?',
      [JSON.stringify(desc), id]
    );
  }

  /**
   * Delete an existing rule
   * @param {number} id
   * @return {Promise}
   */
  deleteRule(id: number): Promise<any> {
    return Database.run('DELETE FROM rules WHERE id = ?', [id]);
  }
}

const db = new RulesDatabase();
export default db;
