/**
 * Thing Model.
 *
 * Manages Thing data model and business logic.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

class Thing {

    constructor(adapter, type, name, properties, actions, events) {
        this.adapter = adapter;
        this.type = type;
        this.name = name;
        this.properties = properties;
        this.actions = actions;
        this.events = events;

        console.log('Thing', name, 'of type', type, 'created');
    }

    getName() {
        return this.name;
    }

    getType() {
        return this.type;
    }

    getActions() {
        return this.actions;
    }

    getEvents() {
        return this.events;
    }

    getPropertyNames() {
        return Object.keys(this.properties);
    }

    getPropertyDescription(name) {
        return this.properties[name];
    }

    getProperty(name) {
        return this.properties[name].value;
    }

    setProperty(name, value) {
        this.properties[name].value = value;
        this.adapter.manager.emit('value-changed', {
           'thing': this,
           'property': name,
           'value': value
        });
    }
}

exports.Thing = Thing;
