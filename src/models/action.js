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

class Action extends EventEmitter {
  /**
   * Create a new Action
   * @param {String} name
   * @param {Object} parameters
   */
  constructor(name, parameters) {
    super();

    this.id = Actions.generateId();
    this.name = name;
    this.parameters = parameters || {};
    this.href = Constants.ACTIONS_PATH + '/' + this.id;
    this.status = 'created';
    this.error = '';
  }

  getDescription() {
    return {
      'name': this.name,
      'parameters': this.parameters,
      'href': this.href,
      'status': this.status,
      'error': this.error,
    };
  }

  /**
   * Update status and notify listeners
   * @param {String} newStatus
   */
  updateStatus(newStatus) {
    this.status = newStatus;
    this.emit(Constants.ACTION_STATUS, this);
  }
}

module.exports = Action;
