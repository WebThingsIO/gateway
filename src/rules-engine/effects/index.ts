/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Effect, { EffectDescription } from './Effect';
import ActionEffect from './ActionEffect';
import MultiEffect from './MultiEffect';
import NotificationEffect from './NotificationEffect';
import NotifierOutletEffect from './NotifierOutletEffect';
import SetEffect from './SetEffect';
import PulseEffect from './PulseEffect';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EffectClass = { new (desc: any): Effect };

export const effects: Record<string, EffectClass> = {
  Effect,
  ActionEffect,
  MultiEffect,
  NotificationEffect,
  NotifierOutletEffect,
  SetEffect,
  PulseEffect,
};

/**
 * Produce an effect from a serialized effect description. Throws if `desc` is
 * invalid
 * @param {EffectDescription} desc
 * @return {Effect}
 */
export function fromDescription(desc: EffectDescription): Effect {
  const EffectClass = effects[desc.type];
  if (!EffectClass) {
    throw new Error(`Unsupported or invalid effect type:${desc.type}`);
  }
  return new EffectClass(desc);
}
