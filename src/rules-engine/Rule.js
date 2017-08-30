/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */
const actions = require('./actions');
const triggers = require('./triggers');
const Events = require('./Events');

class Rule {
  /**
   * @param {Trigger} trigger
   * @param {Action} action
   */
  constructor(trigger, action) {
    this.trigger = trigger;
    this.action = action;

    this.onTriggerStateChanged = this.onTriggerStateChanged.bind(this);
  }

  /**
   * Begin executing the rule
   */
  start() {
    this.trigger.start();
    this.trigger.on(Events.STATE_CHANGED, this.onTriggerStateChanged);
  }

  /**
   * On a state changed event, pass the state forwawrd to the rule's action
   * @param {State} state
   */
  onTriggerStateChanged(state) {
    this.action.setState(state);
  }

  /**
   * @return {RuleDescription}
   */
  toDescription() {
    let desc = {
      trigger: this.trigger.toDescription(),
      action: this.action.toDescription()
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
  }
}

/**
 * Create a rule from a serialized description
 * @param {RuleDescription} desc
 * @return {Rule}
 */
Rule.fromDescription = function(desc) {
  const trigger = triggers.fromDescription(desc.trigger);
  const action = actions.fromDescription(desc.action);
  let rule = new Rule(trigger, action);
  if (desc.hasOwnProperty('id')) {
    rule.id = desc.id;
  }
  if (desc.hasOwnProperty('name')) {
    rule.name = desc.name;
  }
  return rule;
};

module.exports = Rule;
