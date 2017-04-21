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

    constructor(adapter, type, id, name, properties) {
        this.adapter = adapter;
        this.id = id;
        this.type = type;
        this.name = name;
        this.properties = properties;
    }

    asDict() {
        return {
            'id': this.id,
            'name': this.name,
            'type': this.type,
            'properties': this.properties,
        };
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

    getPropertyIds() {
        return Object.keys(this.properties);
    }

    getProperty(id) {
        return this.properties[id];
    }

    getPropertyValue(id) {
        return this.properties[id].value;
    }

    setName(name) {
        this.name = name;
        this.adapter.manager.emit('device-name-changed', this);
    }

    setPropertyValue(id, value) {
        this.properties[id].value = value;
        this.adapter.manager.emit('value-changed', {
           'device': this,
           'property': id,
           'value': value
        });
    }
}

exports.Device = Device;
