/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

const assert = require('assert');

const Action = require('../../models/action');
const Actions = require('../../models/actions');
const AddonManager = require('../../addon-manager');
const Effect = require('./Effect');
const Things = require('../../models/things');

/**
 * An Effect which creates an action
 */
class ActionEffect extends Effect {
  /**
   * @param {EffectDescription} desc
   */
  constructor(desc) {
    super(desc);

    assert(desc.thing);
    assert(desc.action);

    this.thing = desc.thing;
    this.action = desc.action;
    this.parameters = desc.parameters || {};
  }

  /**
   * @return {EffectDescription}
   */
  toDescription() {
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
  setState(state) {
    if (!state.on) {
      return;
    }

    this.createAction();
  }

  async createAction() {
    try {
      const thing = await Things.getThing(this.thing);

      const action = new Action(this.action, this.parameters, thing);
      await Actions.add(action);
      await AddonManager.requestAction(this.thing, action.id, this.action,
                                       this.parameters);
    } catch (e) {
      console.warn('Unable to dispatch action', e);
    }
  }
}

module.exports = ActionEffect;

