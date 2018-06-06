/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

const API = require('../api');
const TimeTriggerBlock = require('./TimeTriggerBlock');

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
    this.enabled = desc.enabled;
    if (desc.name) {
      this.name = desc.name;
    } else {
      this.name = 'Rule Name';
    }
    this.trigger = desc.trigger;
    this.effect = desc.effect;
  } else {
    this.enabled = true;
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
  const desc = this.toDescription();
  if (!desc) {
    return Promise.reject('invalid description');
  }

  const fetchOptions = {
    headers: API.headers(),
    method: 'PUT',
    body: JSON.stringify(desc),
  };
  fetchOptions.headers['Content-Type'] = 'application/json';

  let request = null;
  if (typeof this.id !== 'undefined') {
    request = fetch(`/rules/${encodeURIComponent(this.id)}`, fetchOptions);
  } else {
    fetchOptions.method = 'POST';
    request = fetch('/rules/', fetchOptions).then((res) => {
      return res.json();
    }).then((rule) => {
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
  const fetchOptions = {
    headers: API.headers(),
    method: 'DELETE',
  };

  if (typeof this.id === 'undefined') {
    return;
  }

  return fetch(`/rules/${encodeURIComponent(this.id)}`, fetchOptions);
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
    enabled: this.enabled,
    name: this.name,
    trigger: this.trigger,
    effect: this.effect,
  };
};

// Helper function for selecting the thing corresponding to a property
const RuleUtils = {
  byProperty: function byProperty(property) {
    return function(option) {
      const optProp = option.properties[property.name];
      return optProp && (optProp.href === property.href);
    };
  },
  byHref: function byHref(href) {
    return function(thing) {
      return thing.href === href;
    };
  },
};

/**
 * Convert the rule's trigger's description to a human-readable string
 * @return {String?}
 */
Rule.prototype.toTriggerHumanDescription = function() {
  return this.singleTriggerToHumanDescription(this.trigger);
};

/**
 * Convert a trigger's decsription to a human-readable string
 * @param {Trigger} trigger
 * @return {String?}
 */
Rule.prototype.singleTriggerToHumanDescription = function(trigger) {
  if (!trigger) {
    return null;
  }

  if (trigger.type === 'MultiTrigger') {
    let triggerStr = '';
    for (let i = 0; i < trigger.triggers.length; i++) {
      if (i > 0) {
        if (trigger.triggers.length > 2) {
          triggerStr += ',';
        }
        triggerStr += ' ';
        if (i === trigger.triggers.length - 1) {
          if (trigger.op === 'AND') {
            triggerStr += 'and ';
          } else {
            triggerStr += 'or ';
          }
        }
      }
      const singleStr =
        this.singleTriggerToHumanDescription(trigger.triggers[i]);
      if (!singleStr) {
        return null;
      }
      triggerStr += singleStr;
    }
    return triggerStr;
  }

  if (trigger.type === 'TimeTrigger') {
    return `the time of day is ${
      TimeTriggerBlock.utcToLocal(trigger.time)}`;
  }

  if (trigger.type === 'EventTrigger') {
    const triggerThing = this.gateway.things.filter(
      RuleUtils.byHref(trigger.thing.href)
    )[0];
    if (!triggerThing) {
      return null;
    }
    return `${triggerThing.name} event "${trigger.event}" occurs`;
  }

  const triggerThing = this.gateway.things.filter(
    RuleUtils.byProperty(trigger.property)
  )[0];
  if (!triggerThing) {
    return null;
  }

  let triggerStr = `${triggerThing.name} `;
  if (trigger.type === 'BooleanTrigger') {
    triggerStr += 'is ';
    if (!trigger.onValue) {
      triggerStr += 'not ';
    }
    triggerStr += trigger.property.name;
  } else if (trigger.type === 'LevelTrigger') {
    triggerStr += `${trigger.property.name} is `;
    if (trigger.levelType === 'LESS') {
      triggerStr += 'less than ';
    } else {
      triggerStr += 'greater than ';
    }
    triggerStr += trigger.value;
  } else if (trigger.type === 'EqualityTrigger') {
    triggerStr += `${trigger.property.name} is ${trigger.value}`;
  } else {
    console.error('Unknown trigger type', trigger);
    return null;
  }

  return triggerStr;
};

/**
 * Convert the rule's effect's description to a human-readable string
 * @return {String?}
 */
Rule.prototype.toEffectHumanDescription = function() {
  return this.singleEffectToHumanDescription(this.effect);
};

/**
 * Convert an effect's description to a human-readable string
 * @return {String?}
 */
Rule.prototype.singleEffectToHumanDescription = function(effect) {
  if (!effect) {
    return null;
  }
  if (effect.type === 'MultiEffect') {
    let effectStr = '';
    for (let i = 0; i < effect.effects.length; i++) {
      if (i > 0) {
        if (effect.effects.length > 2) {
          effectStr += ',';
        }
        effectStr += ' ';
        if (i === effect.effects.length - 1) {
          effectStr += 'and ';
        }
      }
      const singleStr = this.singleEffectToHumanDescription(effect.effects[i]);
      if (!singleStr) {
        return null;
      }
      effectStr += singleStr;
    }
    return effectStr;
  }

  if (effect.type === 'ActionEffect') {
    const effectThing = this.gateway.things.filter(
      RuleUtils.byHref(effect.thing.href)
    )[0];
    if (!effectThing) {
      return null;
    }
    return `do ${effectThing.name} action "${effect.action}"`;
  }

  const effectThing = this.gateway.things.filter(
    RuleUtils.byProperty(effect.property)
  )[0];
  if (!effectThing) {
    return null;
  }

  let effectStr = '';
  if (effect.property.name === 'on') {
    effectStr = `turn ${effectThing.name} `;
    if (effect.value) {
      effectStr += 'on';
    } else {
      effectStr += 'off';
    }
    if (effect.type === 'SET') {
      effectStr += ' permanently';
    }
    return effectStr;
  }
  if (effect.type === 'SET') {
    effectStr += 'set ';
  } else {
    effectStr += 'pulse ';
  }

  effectStr += `${effectThing.name} ${effect.property.name} to `;
  effectStr += effect.value;

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
    triggerStr = this.toTriggerHumanDescription() || triggerStr;
  }
  if (this.effect) {
    effectStr = this.toEffectHumanDescription() || effectStr;
  }
  return `If ${triggerStr} then ${effectStr}`;
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

/**
 * Whether the rule is a valid, functioning rule
 * @return {boolean}
 */
Rule.prototype.valid = function() {
  return !!(this.toTriggerHumanDescription() &&
    this.toEffectHumanDescription());
};

module.exports = {Rule, RuleUtils};
