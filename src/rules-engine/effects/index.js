/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

const effects = {
  Effect: require('./Effect'),
  ActionEffect: require('./ActionEffect'),
  MultiEffect: require('./MultiEffect'),
  NotificationEffect: require('./NotificationEffect'),
  SetEffect: require('./SetEffect'),
  PulseEffect: require('./PulseEffect'),
};

/**
 * Produce an effect from a serialized effect description. Throws if `desc` is
 * invalid
 * @param {EffectDescription} desc
 * @return {Effect}
 */
function fromDescription(desc) {
  const EffectClass = effects[desc.type];
  if (!EffectClass) {
    throw new Error(`Unsupported or invalid effect type:${desc.type}`);
  }
  return new EffectClass(desc);
}

module.exports = {
  effects: effects,
  fromDescription: fromDescription,
};
