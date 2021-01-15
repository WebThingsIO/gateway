/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import BooleanTrigger from './BooleanTrigger';
import EqualityTrigger from './EqualityTrigger';
import EventTrigger from './EventTrigger';
import LevelTrigger from './LevelTrigger';
import MultiTrigger from './MultiTrigger';
import PropertyTrigger from './PropertyTrigger';
import TimeTrigger from './TimeTrigger';
import Trigger, {TriggerDescription} from './Trigger';

type TriggerClass = { new(desc: any): Trigger; };

export const triggers: Record<string, TriggerClass> = {
  BooleanTrigger,
  EqualityTrigger,
  EventTrigger,
  LevelTrigger,
  MultiTrigger,
  PropertyTrigger,
  TimeTrigger,
  Trigger,
};

/**
 * Produce an trigger from a serialized trigger description. Throws if `desc`
 * is invalid
 * @param {TriggerDescription} desc
 * @return {Trigger}
 */
export function fromDescription(desc: TriggerDescription): Trigger {
  const TriggerClass = triggers[desc.type];
  if (!TriggerClass) {
    throw new Error(`Unsupported or invalid trigger type:${desc.type}`);
  }
  return new TriggerClass(desc);
}
