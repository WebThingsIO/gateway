/**
 * Action Model.
 *
 * Manages Action data model and business logic.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const Actions = require('../models/actions');
const Constants = require('../constants');
const EventEmitter = require('events');
const {Utils} = require('gateway-addon');

class Action extends EventEmitter {
  /**
   * Create a new Action
   * @param {String} name
   * @param {Object} input
   * @param {Thing?} thing
   */
  constructor(name, input, thing) {
    super();

    this.id = Actions.generateId();
    this.name = name;
    this.input = input || {};
    if (thing) {
      this.href = `${thing.href}${Constants.ACTIONS_PATH}/${name}/${this.id}`;
      this.thingId = thing.id;
    } else {
      this.href = `${Constants.ACTIONS_PATH}/${name}/${this.id}`;
    }
    this.status = 'created';
    this.timeRequested = Utils.timestamp();
    this.timeCompleted = null;
    this.error = '';
  }

  getDescription() {
    const description = {
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
  updateStatus(newStatus) {
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
  update(action) {
    this.timeRequested = action.timeRequested;
    this.timeCompleted = action.timeCompleted;

    if (this.status !== action.status) {
      this.status = action.status;
      this.emit(Constants.ACTION_STATUS, this);
    }
  }
}

module.exports = Action;
