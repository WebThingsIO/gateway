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

    getProperty(name) {
        return this.properties[name];
    }

    getPropertyValue(name) {
        return this.properties[name].value;
    }

    setPropertyValue(name, value) {
        this.properties[name].value = value;
        this.adapter.manager.emit('value-changed', {
           'thing': this,
           'property': name,
           'value': value
        });
    }
}

exports.Thing = Thing;
