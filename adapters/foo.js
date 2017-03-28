/**
 *
 * FooAdapter - a dummy adapter
 *
 * This shows a dummy adapter and thing which is incorporated into
 * a single file.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

var Thing = require('../models/thing.js').Thing;
var Adapter = require('../models/adapter.js').Adapter;

class FooThing extends Thing {
  constructor(adapter, name) {
    let properties = {
      'temperature': {
        'type': 'integer',
        'unit': 'celsius',
        'description': 'An ambient temperature sensor',
        'value': 23,
      },
      'humidity': {
        'type': 'integer',
        'unit': 'percent',
        'value': 35,
      },
      'led': {
        'type': 'boolean',
        'description': 'A red LED',
        'value': false,
      },
    };
    super(adapter, 'FooThing', name, properties, [], []);
  }

  setPropertyValue(name, value) {
    // This function should propogate the value to the hardware
    // Calling super.setPropertyValue will update the value cache
    // and send a 'value-changed' event to any listeners.
    super.setPropertyValue(name, value);
  }
}

class FooAdapter extends Adapter {

  constructor(adapterManager) {
    super(adapterManager);

    adapterManager.addThing(this, new FooThing(this, 'thing1'));
    adapterManager.addThing(this, new FooThing(this, 'thing2'));
  }
}

module.exports = FooAdapter;
