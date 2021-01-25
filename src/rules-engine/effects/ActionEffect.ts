/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import assert from 'assert';
import Action from '../../models/action';
import Actions from '../../models/actions';
import AddonManager from '../../addon-manager';
import Effect, {EffectDescription} from './Effect';
import Things from '../../models/things';
import {State} from '../State';
import {Input} from 'gateway-addon/lib/schema';

export interface ActionEffectDescription extends EffectDescription {
  thing: string;
  action: string;
  parameters: unknown;
}

/**
 * An Effect which creates an action
 */
export default class ActionEffect extends Effect {
  parameters: Input;

  thing: string;

  action: string;

  /**
   * @param {EffectDescription} desc
   */
  constructor(desc: ActionEffectDescription) {
    super(desc);

    assert(desc.thing);
    assert(desc.action);

    this.thing = desc.thing;
    this.action = desc.action;
    this.parameters = <Input>desc.parameters || {};
  }

  /**
   * @return {EffectDescription}
   */
  toDescription(): ActionEffectDescription {
    return Object.assign(
      super.toDescription(),
      {
        thing: this.thing,
        action: this.action,
        parameters: this.parameters,
      }
    );
  }

  /**
   * @param {State} state
   */
  setState(state: State): void {
    if (!state.on) {
      return;
    }

    this.createAction();
  }

  async createAction(): Promise<void> {
    try {
      const thing = await Things.getThing(this.thing);

      const action = new Action(this.action, this.parameters, thing);
      await Actions.add(action);
      await AddonManager.requestAction(this.thing, action.getId(), this.action,
                                       this.parameters);
    } catch (e) {
      console.warn('Unable to dispatch action', e);
    }
  }
}
