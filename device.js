/**
 * Device Model.
 *
 * Abstract base class for devices managed by an adapter.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

class Device {

    constructor(adapter, type, id, name, attributes) {
        this.adapter = adapter;
        this.id = id;
        this.type = type;
        this.name = name;
        this.attributes = attributes;
    }

    getId() {
      return this.id;
    }

    getName() {
        return this.name;
    }

    getType() {
        return this.type;
    }

    getAttributeNames() {
        return Object.keys(this.attributes);
    }

    getAttribute(name) {
        return this.attributes[name];
    }

    getAttributeValue(name) {
        return this.attributes[name].value;
    }

    setAttributeValue(name, value) {
        this.attributes[name].value = value;
        this.adapter.manager.emit('value-changed', {
           'device': this,
           'attribute': name,
           'value': value
        });
    }
}

exports.Device = Device;
