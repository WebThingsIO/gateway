/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as Effects from './effects/index';
import Effect, {EffectDescription} from './effects/Effect';
import * as Triggers from './triggers/index';
import * as Events from './Events';
import Trigger, {TriggerDescription} from './triggers/Trigger';
import {State} from './State';

const DEBUG = false || (process.env.NODE_ENV === 'test');

export interface RuleDescription {
  enabled: boolean;
  trigger: TriggerDescription;
  effect: EffectDescription;
  id?: number;
  name?: string;
}

export default class Rule {
  private enabled: boolean;

  private trigger: Trigger;

  private effect: Effect;

  private id?: number;

  private name?: string;

  private _onTriggerStateChanged: (state: State) => void;

  /**
   * @param {boolean} enabled
   * @param {Trigger} trigger
   * @param {Effect} effect
   */
  constructor(enabled: boolean, trigger: Trigger, effect: Effect) {
    this.enabled = enabled;
    this.trigger = trigger;
    this.effect = effect;

    this._onTriggerStateChanged = this.onTriggerStateChanged.bind(this);
  }

  setId(id: number): void {
    this.id = id;
  }

  setName(name: string): void {
    this.name = name;
  }

  /**
   * Create a rule from a serialized description
   * @param {RuleDescription} desc
   * @return {Rule}
   */
  static fromDescription(desc: RuleDescription): Rule {
    const trigger = Triggers.fromDescription(desc.trigger);
    const effect = Effects.fromDescription(desc.effect);
    const rule = new Rule(desc.enabled, trigger, effect);

    if (desc.hasOwnProperty('id')) {
      rule.setId(desc.id!);
    }

    if (desc.hasOwnProperty('name')) {
      rule.setName(desc.name!);
    }

    return rule;
  }

  /**
   * Begin executing the rule
   */
  async start(): Promise<void> {
    this.trigger.on(Events.STATE_CHANGED, this._onTriggerStateChanged);
    await this.trigger.start();
    if (DEBUG) {
      console.debug('Rule.start', this.name);
    }
  }

  /**
   * On a state changed event, pass the state forward to the rule's effect
   * @param {State} state
   */
  onTriggerStateChanged(state: State): void {
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
  toDescription(): RuleDescription {
    const desc: RuleDescription = {
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
  stop(): void {
    this.trigger.removeListener(Events.STATE_CHANGED, this._onTriggerStateChanged);
    this.trigger.stop();
    if (DEBUG) {
      console.debug('Rule.stop', this.name);
    }
  }
}
