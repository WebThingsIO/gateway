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
class SetEffect extends Effect {
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
      {value: this.value}
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
    let descr = {
      name: this.action,
      parameters: this.parameters
    };

    let href = await Settings.get('RulesEngine.gateway') + this.thing.href;

    let res = await fetch(href + this.thing.href + '/actions', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + await Settings.get('RulesEngine.jwt'),
        'Content-Type': 'appication/json',
      },
      body: JSON.stringify(descr)
    });
    if (!res.ok) {
      console.warn('Unable to dispatch action', res);
    }
  }
}

module.exports = SetEffect;

