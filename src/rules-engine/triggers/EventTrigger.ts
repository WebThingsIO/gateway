/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import assert from 'assert';
import * as Events from '../Events';
import Trigger, {TriggerDescription} from './Trigger';
import Things from '../../models/things';

export interface EventTriggerDescription extends TriggerDescription {
  thing: string;
  event: string;
}

/**
 * A trigger activated when an event occurs
 */
export default class EventTrigger extends Trigger {
  private thing: string;

  private event: string;

  private stopped: boolean;

  private _onEvent: (event: any) => void;

  constructor(desc: EventTriggerDescription) {
    super(desc);
    assert(desc.thing);
    this.thing = desc.thing;
    this.event = desc.event;
    this.stopped = true;
    this._onEvent = this.onEvent.bind(this);
  }

  /**
   * @return {TriggerDescription}
   */
  toDescription(): EventTriggerDescription {
    return Object.assign(
      super.toDescription(),
      {
        thing: this.thing,
        event: this.event,
      }
    );
  }

  async start(): Promise<void> {
    this.stopped = false;
    const thing = await Things.getThing(this.thing);
    if (this.stopped) {
      return;
    }
    thing.addEventSubscription(this._onEvent);
  }

  onEvent(event: any): void {
    if (this.event !== event.getName()) {
      return;
    }

    this.emit(Events.STATE_CHANGED, {on: true, value: Date.now()});
    this.emit(Events.STATE_CHANGED, {on: false, value: Date.now()});
  }

  stop(): void {
    this.stopped = true;
    Things.getThing(this.thing).then((thing: any) => {
      thing.removeEventSubscription(this._onEvent);
    });
  }
}
