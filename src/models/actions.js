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

const Things = require('../models/things');
const AddonManager = require('../addon-manager');
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
    for (const id in this.actions) {
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
   * @returns {Object} The specified action, or undefined if the action
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
    return Object.keys(this.actions).map((id) => {
      return this.actions[id];
    });
  }

  /**
   * Get only the actions which are not associated with a specific thing and
   * therefore belong to the root Gateway
   */
  getGatewayActions(actionName) {
    return this.getAll().filter((action) => {
      return !action.thingId;
    }).filter((action) => {
      if (actionName) {
        return actionName === action.name;
      }

      return true;
    }).map((action) => {
      return {[action.name]: action.getDescription()};
    });
  }


  /**
   * Get only the actions which are associated with a specific thing
   */
  getByThing(thingId, actionName) {
    return this.getAll().filter((action) => {
      return action.thingId === thingId;
    }).filter((action) => {
      if (actionName) {
        return actionName === action.name;
      }

      return true;
    }).map((action) => {
      return {[action.name]: action.getDescription()};
    });
  }

  /**
   * Add a new action.
   *
   * @param {Action} action An Action object.
   * @return {Promise} resolved when action added or rejected if failed
   */
  add(action) {
    const id = action.id;
    this.actions[id] = action;

    // Call this initially for the 'created' status.
    this.onActionStatus(action);

    action.on(Constants.ACTION_STATUS, this.onActionStatus);

    if (action.thingId) {
      return Things.getThing(action.thingId).then((thing) => {
        const success = thing.addAction(action);
        if (!success) {
          delete this.actions[id];
          throw new Error(`Invalid thing action name: "${action.name}"`);
        }
      });
    }

    // Only update the action status if it's being handled internally
    action.updateStatus('pending');

    switch (action.name) {
      case 'pair':
        AddonManager.addNewThing(action.input.timeout).then(function() {
          action.updateStatus('completed');
        }).catch(function(error) {
          action.error = error;
          action.updateStatus('error');
          console.error('Thing was not added');
          console.error(error);
        });
        break;
      case 'unpair':
        if (action.input.id) {
          AddonManager.removeThing(action.input.id)
            .then(function(thingIdUnpaired) {
              console.log('unpair: thing:', thingIdUnpaired, 'was unpaired');
              Things.removeThing(thingIdUnpaired);
              action.updateStatus('completed');
            }).catch(function(error) {
              action.error = error;
              action.updateStatus('error');
              console.error('unpair of thing:',
                            action.input.id, 'failed.');
              console.error(error);
            });
        } else {
          const msg = 'unpair missing "id" parameter.';
          action.error = msg;
          action.updateStatus('error');
          console.error(msg);
        }
        break;
      default:
        delete this.actions[id];
        return Promise.reject(
          new Error(`Invalid action name: "${action.name}"`));
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
    const action = this.actions[id];
    if (!action) {
      throw `Invalid action id: ${id}`;
    }

    if (action.status === 'pending') {
      if (action.thingId) {
        Things.getThing(action.thingId).then((thing) => {
          if (!thing.removeAction(action)) {
            throw `Invalid thing action name: "${action.name}"`;
          }
        }).catch((err) => {
          console.error('Error removing thing action', err);
        });
      } else {
        switch (action.name) {
          case 'pair':
            AddonManager.cancelAddNewThing();
            break;
          case 'unpair':
            AddonManager.cancelRemoveThing(action.input.id);
            break;
          default:
            throw `Invalid action name: "${action.name}"`;
        }
      }
    }

    action.updateStatus('deleted');
    action.removeListener(Constants.ACTION_STATUS, this.onActionStatus);
    delete this.actions[id];
  }
}

module.exports = new Actions();
