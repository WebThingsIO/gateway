/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

/* global API */

/**
 * Model of a Rule loaded from the Rules Engine
 * @constructor
 * @param {Gateway} gateway - The remote gateway to which to talk
 * @param {RuleDescription?} desc - Description of the rule to load
 * @param {Function?} onUpdate - Listener for when update is called
 */
function Rule(gateway, desc, onUpdate) {
  this.gateway = gateway;
  this.onUpdate = onUpdate;

  if (desc) {
    this.id = desc.id;
    if (desc.name) {
      this.name = desc.name;
    } else {
      this.name = 'Rule Name';
    }
    this.trigger = desc.trigger;
    this.effect = desc.effect;
  }
}

/**
 * Validate and save the rule
 * @return {Promise}
 */
Rule.prototype.update = function() {
  if (this.onUpdate) {
    this.onUpdate();
  }
  let desc = this.toDescription();
  if (!desc) {
    return Promise.reject('invalid description');
  }

  let fetchOptions = {
    headers: API.headers(),
    method: 'PUT',
    body: JSON.stringify(desc)
  };
  fetchOptions.headers['Content-Type'] = 'application/json';

  let request = null;
  if (typeof(this.id) !== 'undefined') {
    request = fetch('/rules-engine/rules/' + this.id, fetchOptions);
  } else {
    fetchOptions.method = 'POST';
    request = fetch('/rules-engine/rules/', fetchOptions).then(res => {
      return res.json();
    }).then(rule => {
      this.id = rule.id;
    });
  }
  return request;
};

/**
 * Delete the rule
 * @return {Promise}
 */
Rule.prototype.delete = function() {
  let fetchOptions = {
    headers: API.headers(),
    method: 'DELETE'
  };

  if (typeof(this.id) === 'undefined') {
    return;
  }

  return fetch('/rules-engine/rules/' + this.id, fetchOptions);
};

/**
 * Convert this rule into a serialized description
 * @return {RuleDescription?} description or null if not a valid rule
 */
Rule.prototype.toDescription = function() {
  if (!this.trigger || !this.effect) {
    return null;
  }
  return {
    name: this.name,
    trigger: this.trigger,
    effect: this.effect
  };
};

// Helper function for selecting the thing corresponding to a property
const RuleUtils = {
  byProperty: function byProperty(property) {
    return function(option) {
      let optProp = option.properties[property.name];
      return optProp && (optProp.href === property.href);
    };
  }
};

/**
 * Convert the rule's trigger's description to a human-readable string
 * @return {String}
 */
Rule.prototype.toTriggerHumanDescription = function() {
  let triggerThing = this.gateway.things.filter(
    RuleUtils.byProperty(this.trigger.property)
  )[0];

  let triggerStr = `${triggerThing.name} ${this.trigger.property.name} is `;
  if (this.trigger.type === 'BooleanTrigger') {
    triggerStr += this.trigger.onValue;
  } else {
    if (this.trigger.levelType === 'LESS') {
      triggerStr += 'less than ';
    } else {
      triggerStr += 'greater than ';
    }
    triggerStr += this.trigger.level;
  }

  return triggerStr;
};

/**
 * Convert the rule's effect's description to a human-readable string
 * @return {String}
 */
Rule.prototype.toEffectHumanDescription = function() {
  let effectThing = this.gateway.things.filter(
    RuleUtils.byProperty(this.effect.property)
  )[0];

  let effectStr = '';

  if (this.effect.type === 'SET') {
    effectStr += 'set ';
  } else {
    effectStr += 'pulse ';
  }

  effectStr += `${effectThing.name} ${this.effect.property.name} to `;
  effectStr += this.effect.value;

  return effectStr;
};

/**
 * Convert the rule's description to a human-readable string
 * @return {String}
 */
Rule.prototype.toHumanDescription = function() {
  let triggerStr = '???';
  let effectStr = '???';

  if (this.trigger) {
    triggerStr = this.toTriggerHumanDescription();
  }
  if (this.effect) {
    effectStr = this.toEffectHumanDescription();
  }
  return 'If ' + triggerStr + ' then ' + effectStr;
};

/**
 * Set the trigger of the Rule, updating the server model if valid
 * @return {Promise}
 */
Rule.prototype.setTrigger = function(trigger) {
  this.trigger = trigger;
  return this.update();
};

/**
 * Set the effect of the Rule, updating the server model if valid
 * @return {Promise}
 */
Rule.prototype.setEffect = function(effect) {
  this.effect = effect;
  return this.update();
};

