/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

const effects = require('./effects');
const triggers = require('./triggers');
const Events = require('./Events');

const DEBUG = false || (process.env.NODE_ENV === 'test');

class Rule {
  /**
   * @param {boolean} enabled
   * @param {Trigger} trigger
   * @param {Effect} effect
   */
  constructor(enabled, trigger, effect) {
    this.enabled = enabled;
    this.trigger = trigger;
    this.effect = effect;

    this.onTriggerStateChanged = this.onTriggerStateChanged.bind(this);
  }

  /**
   * Begin executing the rule
   */
  async start() {
    this.trigger.on(Events.STATE_CHANGED, this.onTriggerStateChanged);
    await this.trigger.start();
    if (DEBUG) {
      console.debug('Rule.start', this.name);
    }
  }

  /**
   * On a state changed event, pass the state forward to the rule's effect
   * @param {State} state
   */
  onTriggerStateChanged(state) {
    if (!this.enabled) {
      return;
    }
    if (DEBUG) {
      console.debug('Rule.onTriggerStateChanged', this.name, state);
    }
    this.effect.setState(state);
  }

  /**
   * @return {RuleDescription}
   */
  toDescription() {
    const desc = {
      enabled: this.enabled,
      trigger: this.trigger.toDescription(),
      effect: this.effect.toDescription(),
    };
    if (this.hasOwnProperty('id')) {
      desc.id = this.id;
    }
    if (this.hasOwnProperty('name')) {
      desc.name = this.name;
    }
    return desc;
  }

  /**
   * Stop executing the rule
   */
  stop() {
    this.trigger.removeListener(Events.STATE_CHANGED,
                                this.onTriggerStateChanged);
    this.trigger.stop();
    if (DEBUG) {
      console.debug('Rule.stop', this.name);
    }
  }
}

/**
 * Create a rule from a serialized description
 * @param {RuleDescription} desc
 * @return {Rule}
 */
Rule.fromDescription = (desc) => {
  const trigger = triggers.fromDescription(desc.trigger);
  const effect = effects.fromDescription(desc.effect);
  const rule = new Rule(desc.enabled, trigger, effect);
  if (desc.hasOwnProperty('id')) {
    rule.id = desc.id;
  }
  if (desc.hasOwnProperty('name')) {
    rule.name = desc.name;
  }
  return rule;
};

module.exports = Rule;
