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

var Actions = {

  /**
   * A map of action requests.
   */
  actions: {},

  /**
   * A counter to generate action IDs.
   */
  nextId: 0,

  /**
   * Generate an ID for a new action.
   *
   * @returns {integer} An id.
   */
  generateId: function() {
    return ++this.nextId;
  },

  /**
   * Get a list of all current actions.
   *
   * @returns {Object} A map of current actions.
   */
  getAll: function() {
    return this.actions;
  },

  /**
   * Add a new action.
   *
   * @param {Action} action An Action object.
   */
  add: function(action) {
    var id = action.id;
    this.actions[id] = action;
    switch(action.name) {
      case 'pair':
        AdapterManager.addNewThing().then(function(thing) {
          Things.handleNewThing(thing);
        }).catch(function(error) {
          console.error('Thing was not added ' + error);
        });
        break;
      default:
        throw 'Invalid action name';
    }
  },

  /**
   * Remove an action from the action list.
   *
   * @param integer id Action ID.
   *
   * If the action has not yet been completed, it is cancelled.
   */
  remove: function(id) {
    if(!this.actions[id]) {
      throw 'Invalid action id';
    }
    switch(this.actions[id].name) {
      case 'pair':
        AdapterManager.cancelAddNewThing();
        break;
    }
    delete this.actions[id];
    return;
  }
};

module.exports = Actions;
