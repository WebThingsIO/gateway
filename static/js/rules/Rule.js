/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const API = require('../api');
const RuleUtils = require('./RuleUtils');
const Units = require('../units');

class Rule {
  /**
   * Model of a Rule loaded from the Rules Engine
   * @constructor
   * @param {Gateway} gateway - The remote gateway to which to talk
   * @param {RuleDescription?} desc - Description of the rule to load
   * @param {Function?} onUpdate - Listener for when update is called
   */
  constructor(gateway, desc, onUpdate) {
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
  update() {
    if (this.onUpdate) {
      this.onUpdate();
    }

    const desc = this.toDescription();
    if (!desc) {
      return Promise.reject('invalid description');
    }

    let request = null;
    if (typeof this.id !== 'undefined') {
      request = API.updateRule(this.id, desc);
    } else {
      request = API.addRule(desc).then((rule) => {
        this.id = rule.id;
      });
    }
    return request;
  }

  /**
   * Delete the rule
   * @return {Promise}
   */
  delete() {
    if (typeof this.id === 'undefined') {
      return;
    }

    return API.deleteRule(this.id);
  }

  /**
   * Convert this rule into a serialized description
   * @return {RuleDescription?} description or null if not a valid rule
   */
  toDescription() {
    if (!this.trigger || !this.effect) {
      return null;
    }
    return {
      enabled: this.enabled,
      name: this.name,
      trigger: this.trigger,
      effect: this.effect,
    };
  }

  /**
   * Convert a trigger's decsription to a human-readable string
   * @param {Trigger} trigger
   * @param {boolean} html - whether to generate an interface
   * @return {String?}
   */
  singleTriggerToHumanRepresentation(trigger, html) {
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
            if (html) {
              const andSelected = trigger.op === 'AND' ? 'selected' : '';
              const orSelected = trigger.op === 'OR' ? 'selected' : '';

              const selectHTML = `
                <span class="triangle-select-container">
                  <select class="triangle-select rule-trigger-select">
                    <option ${andSelected}>and</option>
                    <option ${orSelected}>or</option>
                  </select>
                </span>
              `;
              triggerStr += selectHTML;
            } else {
              triggerStr += trigger.op === 'AND' ? 'and ' : 'or ';
            }
          }
        }
        const singleStr =
          this.singleTriggerToHumanRepresentation(trigger.triggers[i], html);
        if (!singleStr) {
          return null;
        }
        triggerStr += singleStr;
      }
      return triggerStr;
    }

    if (trigger.type === 'TimeTrigger') {
      return `the time of day is ${trigger.time}`;
    }

    if (trigger.type === 'EventTrigger') {
      const triggerThing = this.gateway.things.filter(
        RuleUtils.byThing(trigger.thing)
      )[0];
      if (!triggerThing) {
        return null;
      }
      return `${triggerThing.title} event "${trigger.label}" occurs`;
    }

    const triggerThing = this.gateway.things.filter(
      RuleUtils.byProperty(trigger.property)
    )[0];
    if (!triggerThing) {
      return null;
    }

    const triggerProp = triggerThing.properties[trigger.property.id];
    if (!triggerProp) {
      return null;
    }

    let convertedValue;
    if (trigger.hasOwnProperty('value')) {
      convertedValue = Units.convert(trigger.value, triggerProp.unit).value;
    }

    let triggerStr = `${triggerThing.title} `;
    if (trigger.type === 'BooleanTrigger') {
      triggerStr += 'is ';
      if (!trigger.onValue) {
        triggerStr += 'not ';
      }

      if (trigger.property.id === 'on' || triggerProp.name === 'on') {
        triggerStr += 'on';
      } else {
        triggerStr += trigger.label;
      }
    } else if (trigger.type === 'LevelTrigger') {
      triggerStr += `${trigger.label} is `;
      if (trigger.levelType === 'LESS') {
        triggerStr += 'less than ';
      } else if (trigger.levelType === 'EQUAL') {
        triggerStr += 'equal to ';
      } else {
        triggerStr += 'greater than ';
      }
      triggerStr += `${convertedValue}`;
    } else if (trigger.type === 'EqualityTrigger') {
      triggerStr += `${trigger.label} is ${convertedValue}`;
    } else {
      console.error('Unknown trigger type', trigger);
      return null;
    }

    return triggerStr;
  }

  /**
   * Convert an effect's description to a human-readable string
   * @param {Effect} effect
   * @return {String?}
   */
  singleEffectToHumanRepresentation(effect) {
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
        const singleStr =
          this.singleEffectToHumanRepresentation(effect.effects[i]);
        if (!singleStr) {
          return null;
        }
        effectStr += singleStr;
      }
      return effectStr;
    }

    if (effect.type === 'NotificationEffect') {
      return `send a browser notification`;
    }
    if (effect.type === 'NotifierOutletEffect') {
      const notifier = this.gateway.notifiers
        .filter((notifier) => notifier.id === effect.notifier)[0];
      if (!notifier) {
        return null;
      }
      const outlet = notifier.outlets
        .filter((outlet) => outlet.id === effect.outlet)[0];
      if (!outlet) {
        return null;
      }
      return `send a notification through ${outlet.name}`;
    }
    if (effect.type === 'ActionEffect') {
      const effectThing = this.gateway.things.filter(
        RuleUtils.byThing(effect.thing)
      )[0];
      if (!effectThing) {
        return null;
      }
      return `do ${effectThing.title} action "${effect.label}"`;
    }

    const effectThing = this.gateway.things.filter(
      RuleUtils.byProperty(effect.property)
    )[0];
    if (!effectThing) {
      return null;
    }

    const effectProp = effectThing.properties[effect.property.id];
    if (!effectProp) {
      return null;
    }

    let effectStr = '';
    if (effectProp.name === 'on' || effect.property.id === 'on') {
      effectStr = `turn ${effectThing.title} `;
      if (effect.value) {
        effectStr += 'on';
      } else {
        effectStr += 'off';
      }
    } else {
      effectStr += `set ${effectThing.title} ${effect.label} to `;
      effectStr += `${Units.convert(effect.value, effectProp.unit).value}`;
    }
    return effectStr;
  }

  /**
   * Convert the rule's description to human-readable plain text
   * @return {String}
   */
  toHumanDescription() {
    return this.toHumanRepresentation(false);
  }

  /**
   * Convert the rule's description to a human-readable interface
   * @return {String}
   */
  toHumanInterface() {
    return this.toHumanRepresentation(true);
  }

  /**
   * Convert the rule's description to a human-readable string
   * @param {boolean} html - whether an html interface
   * @return {String}
   */
  toHumanRepresentation(html) {
    let triggerStr = '???';
    let effectStr = '???';

    if (this.trigger) {
      triggerStr =
        this.singleTriggerToHumanRepresentation(this.trigger, html) ||
        triggerStr;
    }
    if (this.effect) {
      effectStr =
        this.singleEffectToHumanRepresentation(this.effect) ||
        effectStr;
    }

    const effectExists = this.effect && this.effect.effects &&
      this.effect.effects.length > 0;
    let permanent = true; // Default to permanent
    if (effectExists) {
      for (const effect of this.effect.effects) {
        if (effect.type === 'SetEffect') {
          permanent = true;
          break;
        }
        if (effect.type === 'PulseEffect') {
          permanent = false;
          break;
        }
      }
    }
    let predicate = permanent ? 'If' : 'While';
    if (html) {
      const permSelected = permanent ? 'selected' : '';
      const tempSelected = permanent ? '' : 'selected';
      predicate = `<span class="triangle-select-container">
        <select class="triangle-select rule-effect-select">
          <option ${permSelected}>If</option>
          <option ${tempSelected}>While</option>
        </select>
      </span>`;
    }

    return `${predicate} ${triggerStr}, ${effectStr}`;
  }

  /**
   * Set the trigger of the Rule, updating the server model if valid
   * @return {Promise}
   */
  setTrigger(trigger) {
    this.trigger = trigger;
    return this.update();
  }

  /**
   * Set the effect of the Rule, updating the server model if valid
   * @return {Promise}
   */
  setEffect(effect) {
    this.effect = effect;
    return this.update();
  }

  /**
   * Whether the rule is a valid, functioning rule
   * @return {boolean}
   */
  valid() {
    return !!(this.singleTriggerToHumanRepresentation(this.trigger, false) &&
      this.singleEffectToHumanRepresentation(this.effect, false));
  }
}

module.exports = Rule;
