/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

const config = require('config');
const fetch = require('node-fetch');

const Effect = require('./Effect');

/**
 * An Effect which temporarily sets the target property to
 * a value before restoring its original value
 */
class IfThisThenThatEffect extends Effect {
  /**
   * @param {EffectDescription} desc
   */
  constructor(desc) {
    super(desc);
    this.event = desc.event;
  }

  /**
   * @return {EffectDescription}
   */
  toDescription() {
    return Object.assign(
      super.toDescription(),
      {event: this.event}
    );
  }

  /**
   * @param {State} state
   */
  setState(state) {
    let key = config.get('iftttKey');
    if (!key) {
      console.error('Error: Must specify iftttKey in config to use IFTTT');
      return;
    }
    if (!state.on) {
      return;
    }

    fetch(`https://maker.ifttt.com/trigger/${this.event}/with/key/${key}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        value1: this.event
      })
    }).catch(err => {
      console.error('IFTTT Error', err);
    });
  }
}

module.exports = IfThisThenThatEffect;

