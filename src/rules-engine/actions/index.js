/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

const actions = {
  Action: require('./Action'),
  SetAction: require('./SetAction'),
  PulseAction: require('./PulseAction')
};

/**
 * Produce an action from a serialized action description. Throws if `desc` is
 * invalid
 * @param {ActionDescription} desc
 * @return {Action}
 */
function fromDescription(desc) {
  let ActionClass = actions[desc.type];
  if (!ActionClass) {
    throw new Error('Unsupported or invalid action type:' + desc.type);
  }
  return new ActionClass(desc);
}

module.exports = {
  actions: actions,
  fromDescription: fromDescription
};
