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

  constructor(adapterManager, id) {
    this.manager = adapterManager;
    this.id = id;
    this.name = this.constructor.name;
    console.log('Adapter:', this.name, 'id', id, 'created');
  }

  getId() {
    return this.id;
  }

  pair() {
    console.log('Adapter:', this.name, 'id', id, 'pairing started');
  }

  cancelPairing() {
    console.log('Adapter:', this.name, 'id', id, 'pairing cancelled');
  }

  unpair() {
    console.log('Adapter:', this.name, 'id', id, 'unpairing started');
  }

  cancelUnpairing() {
    console.log('Adapter:', this.name, 'id', id, 'unpairing cancelled');
  }

  unload() {
    console.log('Adapter:', this.name, 'unloaded');
  }
}

exports.Adapter = Adapter;
