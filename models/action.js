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

var Actions = require('../models/actions');
var config = require('../config');

var Action = function(name) {
  this.id = Actions.generateId();
  this.name = name;
  this.href = config.ACTIONS_PATH + '/' + this.id;
};

Action.prototype.getDescription = function() {
  return {
    'name': this.name,
    'href': this.href
  };
};

module.exports = Action;
