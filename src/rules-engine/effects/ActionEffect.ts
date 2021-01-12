/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

import assert from 'assert';
import {AddonManager} from '../../addon-manager';
import Action from '../../models/action';
import Effect, {EffectDescription} from './Effect';

interface ActionEffectDescription extends EffectDescription{
  thing: string,
  action: string
  parameters: any
}

/**
 * An Effect which creates an action
 */
export default class ActionEffect extends Effect {
  /**
   * @param {EffectDescription} actionDescription
   */
  constructor(
    private addonManager: AddonManager, private actionDescription: ActionEffectDescription) {
    super(addonManager, actionDescription);

    assert(actionDescription.thing);
    assert(actionDescription.action);
  }

  /**
   * @return {EffectDescription}
   */
  toDescription(): any {
    return Object.assign(
      super.toDescription(),
      {
        thing: this.actionDescription.thing,
        action: this.actionDescription.action,
        parameters: this.actionDescription.parameters,
      }
    );
  }

  /**
   * @param {State} state
   */
  setState(state: any): void {
    if (!state.on) {
      return;
    }

    this.createAction();
  }

  async createAction(): Promise<void> {
    try {
      const thing =
      await this.addonManager.getThingsCollection().getThing(this.actionDescription.thing);
      const actionId = this.addonManager
        .getActionsCollection()
        .generateId();
      const action = new Action(
        actionId, this.actionDescription.action, this.actionDescription.parameters, thing);
      await this.addonManager
        .getActionsCollection().add(action);
      await this.addonManager.requestAction(this.actionDescription.thing, action.getId(),
                                            this.actionDescription.action,
                                            this.actionDescription.parameters);
    } catch (e) {
      console.warn('Unable to dispatch action', e);
    }
  }
}
