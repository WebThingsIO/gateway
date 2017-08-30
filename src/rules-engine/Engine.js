/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

const Database = require('./Database');
const Rule = require('./Rule');

/**
 * An engine for running and managing list of rules
 */
class Engine {
  constructor() {
  }

  /**
   * Get a list of all current rules
   * @return {Array<Rule>} rules
   */
  getRules() {
    let rulesPromise = Promise.resolve(this.rules);

    if (!this.rules) {
      rulesPromise = Database.getRules().then(ruleDescs => {
        this.rules = {};
        for (let ruleId in ruleDescs) {
          ruleDescs[ruleId].id = parseInt(ruleId);
          this.rules[ruleId] = Rule.fromDescription(ruleDescs[ruleId]);
          this.rules[ruleId].start();
        }
        console.log('loaded rules', this.rules);
        return this.rules;
      });
    }

    return rulesPromise.then(rules => {
      return Object.keys(rules).map(ruleId => {
        return rules[ruleId];
      });
    });
  }

  /**
   * Get a rule by id
   * @param {number} id
   * @return {Promise<Rule>}
   */
  getRule(id) {
    const rule = this.rules[id];
    if (!rule) {
      return Promise.reject(new Error('Rule ' + id + ' does not exist'));
    }
    return Promise.resolve(rule);
  }

  /**
   * Add a new rule to the engine's list
   * @param {Rule} rule
   * @return {Promise<number>} rule id
   */
  addRule(rule) {
    return Database.createRule(rule.toDescription()).then(id => {
      rule.id = id;
      this.rules[id] = rule;
      rule.start();
      return id;
    });
  }

  /**
   * Update an existing rule
   * @param {number} rule id
   * @param {Rule} rule
   * @return {Promise}
   */
  updateRule(ruleId, rule) {
    if (!this.rules[ruleId]) {
      return Promise.reject(new Error('Rule ' + ruleId + ' does not exist'));
    }
    rule.id = ruleId;
    return Database.updateRule(ruleId, rule.toDescription()).then(() => {
      this.rules[ruleId].stop();
      this.rules[ruleId] = rule;
      rule.start();
    });
  }

  /**
   * Delete an existing rule
   * @param {number} rule id
   * @return {Promise}
   */
  deleteRule(ruleId) {
    if (!this.rules[ruleId]) {
      return Promise.reject(
        new Error('Rule ' + ruleId + ' already does not exist'));
    }
    return Database.deleteRule(ruleId).then(() => {
      this.rules[ruleId].stop();
      delete this.rules[ruleId];
    });
  }
}

module.exports = Engine;
