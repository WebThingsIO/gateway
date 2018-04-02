/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

const assert = require('assert');
const fetch = require('node-fetch');
const Effect = require('./Effect');
const Settings = require('../../models/settings');

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
    const descr = {
      [this.action]: {
        input: this.parameters,
      },
    };

    const href = `${await Settings.get('RulesEngine.gateway') + this.thing.href
    }/actions`;
    const jwt = await Settings.get('RulesEngine.jwt');

    const res = await fetch(href, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(descr),
    });
    if (!res.ok) {
      console.warn('Unable to dispatch action', res);
    }
  }
}

module.exports = ActionEffect;

