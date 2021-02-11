/**
 * Action Model.
 *
 * Manages Action data model and business logic.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Actions from './actions';
import * as Constants from '../constants';
import { EventEmitter } from 'events';
import { Utils } from 'gateway-addon';
import { ActionDescription as AddonActionDescription, Any } from 'gateway-addon/lib/schema';
import Thing from './thing';

export interface ActionDescription {
  input: Any;
  href: string;
  status: string;
  timeRequested: string;
  timeCompleted?: string;
  error?: string;
}

export default class Action extends EventEmitter {
  private id: string;

  private name: string;

  private input: Any;

  private href: string;

  private thingId: string | null;

  private status: string;

  private timeRequested: string;

  private timeCompleted: string | null;

  private error: string;

  /**
   * Create a new Action
   * @param {String} name
   * @param {Object} input
   * @param {Thing?} thing
   */
  constructor(name: string, input?: Any, thing?: Thing) {
    super();

    this.id = Actions.generateId();
    this.name = name;
    this.input = input || {};
    if (thing) {
      this.href = `${thing.getHref()}${Constants.ACTIONS_PATH}/${name}/${this.id}`;
      this.thingId = thing.getId();
    } else {
      this.href = `${Constants.ACTIONS_PATH}/${name}/${this.id}`;
      this.thingId = null;
    }
    this.status = 'created';
    this.timeRequested = Utils.timestamp();
    this.timeCompleted = null;
    this.error = '';
  }

  getDescription(): ActionDescription {
    const description: ActionDescription = {
      input: this.input,
      href: this.href,
      status: this.status,
      timeRequested: this.timeRequested,
    };

    if (this.timeCompleted) {
      description.timeCompleted = this.timeCompleted;
    }

    if (this.error) {
      description.error = this.error;
    }

    return description;
  }

  /**
   * Update status and notify listeners
   * @param {String} newStatus
   */
  updateStatus(newStatus: string): void {
    if (this.status === newStatus) {
      return;
    }

    if (newStatus === 'completed') {
      this.timeCompleted = Utils.timestamp();
    }

    this.status = newStatus;
    this.emit(Constants.ACTION_STATUS, this);
  }

  /**
   * Update from another action.
   */
  update(action: AddonActionDescription): void {
    this.timeRequested = action.timeRequested;
    this.timeCompleted = action.timeCompleted || null;

    if (this.status !== action.status) {
      this.status = action.status;
      this.emit(Constants.ACTION_STATUS, this);
    }
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getInput(): Any {
    return this.input;
  }

  getThingId(): string | null {
    return this.thingId;
  }

  getStatus(): string {
    return this.status;
  }

  getTimeRequested(): string {
    return this.timeRequested;
  }

  getTimeCompleted(): string | null {
    return this.timeCompleted;
  }

  setError(error: string): void {
    this.error = error;
  }
}
