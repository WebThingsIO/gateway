#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var EventEmitter = require('events').EventEmitter;

class AdapterManager extends EventEmitter {

    constructor() {
        super();
        this.adapters = [];
        this.things = [];
    }

    addThing(adapter, thing) {
        //console.log('add_thing', thing);
        this.things.push(thing);
        this.emit('device-added', thing);
    }

    getThings() {
        return this.things;
    }

    loadAdapters() {
        var adapter_dir = './adapters';
        var adapter_manager = this;
        fs.readdir(adapter_dir, function file_list(err, filenames) {
            if (err) {
                console.error(err);
                return;
            }
            for (var filename of filenames) {
                if (path.extname(filename) !== '.js') {
                    continue;
                }
                let adapter_filename = adapter_dir + '/' + filename;
                console.log('Loading adapter', adapter_filename);

                let adapter = require(adapter_filename);
                adapter_manager.adapters.push(new adapter(adapter_manager));
            }
        });
    }
}

module.exports = new AdapterManager();
