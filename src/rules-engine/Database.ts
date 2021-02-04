/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Database from '../db';
import * as DatabaseMigrate from './DatabaseMigrate';
import { RuleDescription } from './Rule';
import { RunResult } from 'sqlite3';

class RulesDatabase {
  constructor() {
    Database.open();
    this.open();
  }

  /**
   * Open the database
   */
  open(): Promise<RunResult> {
    const rulesTableSQL = `CREATE TABLE IF NOT EXISTS rules (
      id INTEGER PRIMARY KEY,
      description TEXT
    );`;
    return Database.run(rulesTableSQL);
  }

  /**
   * Get all rules
   * @return {Promise<Map<number, RuleDescription>>} resolves to a map of rule
   * id to rule
   */
  getRules(): Promise<Record<number, RuleDescription>> {
    const rules: Record<number, RuleDescription> = {};

    return Database.all('SELECT id, description FROM rules')
      .then((rows) => {
        const updatePromises = [];
        for (const row of rows) {
          let desc = JSON.parse(<string>row.description);
          const updatedDesc = DatabaseMigrate.migrate(desc);
          if (updatedDesc) {
            desc = updatedDesc;
            updatePromises.push(this.updateRule(<number>row.id, desc));
          }

          rules[<number>row.id] = desc;
        }

        return Promise.all(updatePromises);
      })
      .then(() => {
        return rules;
      });
  }

  /**
   * Create a new rule
   * @param {RuleDescription} desc
   * @return {Promise<number>} resolves to rule id
   */
  createRule(desc: RuleDescription): Promise<number> {
    return Database.run('INSERT INTO rules (description) VALUES (?)', JSON.stringify(desc)).then(
      (res) => {
        return res.lastID;
      }
    );
  }

  /**
   * Update an existing rule
   * @param {number} id
   * @param {RuleDescription} desc
   * @return {Promise}
   */
  updateRule(id: number, desc: RuleDescription): Promise<RunResult> {
    return Database.run('UPDATE rules SET description = ? WHERE id = ?', JSON.stringify(desc), id);
  }

  /**
   * Delete an existing rule
   * @param {number} id
   * @return {Promise}
   */
  deleteRule(id: number): Promise<RunResult> {
    return Database.run('DELETE FROM rules WHERE id = ?', id);
  }
}

export default new RulesDatabase();
