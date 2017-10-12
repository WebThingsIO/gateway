/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

const EventEmitter = require('events');
const Events = require('../Events');
const Router = require('express').Router;

class IfThisThenThatListener extends EventEmitter {
  constructor() {
    super();

    this.router = Router();
    this.router.post('/', (req, res) => {
      // TODO(hobinjk): do something with IFTTT data?
      this.emit(Events.VALUE_CHANGED, {});
      res.sendStatus(200);
    });
  }
}

module.exports = new IfThisThenThatListener();
