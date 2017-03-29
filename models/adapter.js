/**
 * Adapter Model.
 *
 * Manages Adapter data model and business logic.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

class Adapter {

  constructor(adapterManager) {
    console.log('Created Adapter', this.constructor.name);
    this.manager = adapterManager;
  }

  unload() {
    console.log('Unloading Adapter', this.constructor.name);
  }
}

exports.Adapter = Adapter;
