'use strict';

var Thing = require('../thing.js').Thing;

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

class FooAdapter {
    constructor(adapter_manager) {
        this.manager = adapter_manager;

        adapter_manager.addThing(this, new FooThing(this, 'thing1'));
        adapter_manager.addThing(this, new FooThing(this, 'thing2'));
    }
}

exports = FooAdapter;

