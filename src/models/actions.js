/**
 * Actions.
 *
 * Manages a collection of Actions.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

var Things = require('../models/things');
var AdapterManager = require('../adapter-manager');
const Constants = require('../constants');
const EventEmitter = require('events');

class Actions extends EventEmitter {

  constructor() {
    super();

    /**
     * A map of action requests.
     */
    this.actions = {};

    /**
     * A counter to generate action IDs.
     */
    this.nextId = 0;

    this.onActionStatus = this.onActionStatus.bind(this);
  }

  /**
   * Reset actions state.
   */
  clearState() {
    this.nextId = 0;
    for (let id in this.actions) {
      this.remove(id);
    }
  }

  /**
   * Generate an ID for a new action.
   *
   * @returns {integer} An id.
   */
  generateId() {
    return ++this.nextId;
  }

  /**
   * Get a particular action.
   *
   * @returns {Object} The specified action, or udefined if the action
   * doesn't exist.
   */
  get(id) {
    return this.actions[id];
  }

  /**
   * Get a list of all current actions.
   *
   * @returns {Array} A list of current actions.
   */
  getAll() {
    return Object.keys(this.actions).map(id => {
      return this.actions[id];
    });
  }

  /**
   * Add a new action.
   *
   * @param {Action} action An Action object.
   */
  add(action) {
    var id = action.id;
    this.actions[id] = action;
    action.status = 'pending';
    switch(action.name) {
      case 'pair':
        AdapterManager.addNewThing().then(function() {
          action.status = 'completed';
        }).catch(function(error) {
          action.status = 'error';
          action.error = error;
          console.error('Thing was not added');
          console.error(error);
        });
        break;
      case 'unpair':
        if (action.parameters.id) {
          AdapterManager.removeThing(action.parameters.id)
            .then(function(thingIdUnpaired) {
              console.log('unpair: thing:', thingIdUnpaired, 'was unpaired');
              Things.handleRemovedThing(thingIdUnpaired);
              action.status = 'completed';
            }).catch(function(error) {
              action.status = 'error';
              action.error = error;
              console.error('unpair of thing:',
                            action.parameters.id, 'failed.');
              console.error(error);
            });
        } else {
          var msg = 'unpair missing "id" parameter.';
          action.status = 'error';
          action.error = msg;
          console.error(msg);
        }
        break;
      default:
        delete this.actions[id];
        throw 'Invalid action name: "' + action.name + '"';
    }
  }

  /**
   * Forward the actionStatus event
   */
  onActionStatus(action) {
    this.emit(Constants.ACTION_STATUS, action);
  }

  /**
   * Remove an action from the action list.
   *
   * @param integer id Action ID.
   *
   * If the action has not yet been completed, it is cancelled.
   */
  remove(id) {
    var action = this.actions[id];
    if(!action) {
      throw 'Invalid action id: ' + id;
    }

    if (action.status === 'pending') {
      switch(action.name) {
        case 'pair':
          AdapterManager.cancelAddNewThing();
          break;
        case 'unpair':
          AdapterManager.cancelRemoveThing(action.parameters.id);
          break;
        default:
          throw 'Invalid action name: "' + action.name + '"';
      }
    }

    action.status = 'deleted';
    delete this.actions[id];
  }
}

module.exports = new Actions();
