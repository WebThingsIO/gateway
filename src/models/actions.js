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
   * Get only the actions which are not associated with a specific thing
   */
  getUnassociated() {
    return this.getAll().filter(action => {
      return !action.thingId;
    });
  }


  /**
   * Get only the actions which are associated with a specific thing
   */
  getByThing(thingId) {
    return this.getAll().filter(action => {
      return action.thingId === thingId
    });
  }

  /**
   * Add a new action.
   *
   * @param {Action} action An Action object.
   * @return {Promise} resolved when action added or rejected if failed
   */
  add(action) {
    var id = action.id;
    this.actions[id] = action;
    action.on(Constants.ACTION_STATUS, this.onActionStatus);

    action.updateStatus('pending');

    if (action.thingId) {
      return Things.getThing(action.thingId).then(thing => {
        let success = thing.addAction(action);
        if (!success) {
          delete this.actions[id];
          throw new Error('Invalid thing action name: "' + action.name + '"');
        }
      });
    }

    switch(action.name) {
      case 'pair':
        AdapterManager.addNewThing().then(function() {
          action.updateStatus('completed');
        }).catch(function(error) {
          action.error = error;
          action.updateStatus('error');
          console.error('Thing was not added');
          console.error(error);
        });
        break;
      case 'unpair':
        if (action.parameters.id) {
          AdapterManager.removeThing(action.parameters.id)
            .then(function(thingIdUnpaired) {
              console.log('unpair: thing:', thingIdUnpaired, 'was unpaired');
              Things.removeThing(thingIdUnpaired);
              action.updateStatus('completed');
            }).catch(function(error) {
              action.error = error;
              action.updateStatus('error');
              console.error('unpair of thing:',
                            action.parameters.id, 'failed.');
              console.error(error);
            });
        } else {
          var msg = 'unpair missing "id" parameter.';
          action.error = msg;
          action.updateStatus('error');
          console.error(msg);
        }
        break;
      default:
        delete this.actions[id];
        return Promise.reject(
          new Error('Invalid action name: "' + action.name + '"'));
    }
    return Promise.resolve();
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
      if (action.thingId) {
        Things.getThing(action.thingId).then(thing => {
          if (!thing.removeAction(action)) {
            throw 'Invalid thing action name: "' + action.name + '"';
          }
        }).catch(err => {
          console.error('Error removing thing action', err);
        });
      } else {
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
    }

    action.updateStatus('deleted');
    action.removeListener(Constants.ACTION_STATUS, this.onActionStatus);
    delete this.actions[id];
  }
}

module.exports = new Actions();
