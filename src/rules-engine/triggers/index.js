/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

const triggers = {
  BooleanTrigger: require('./BooleanTrigger'),
  LevelTrigger: require('./LevelTrigger'),
  PropertyTrigger: require('./PropertyTrigger'),
  Trigger: require('./Trigger')
};

/**
 * Produce an trigger from a serialized trigger description. Throws if `desc`
 * is invalid
 * @param {TriggerDescription} desc
 * @return {Trigger}
 */
function fromDescription(desc) {
  let TriggerClass = triggers[desc.type];
  if (!TriggerClass) {
    throw new Error('Unsupported or invalid trigger type:' + desc.type);
  }
  return new TriggerClass(desc);
}

module.exports = {
  triggers: triggers,
  fromDescription: fromDescription
};
