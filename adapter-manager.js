/**
 * AdapterManager.
 *
 * Manages Adapter data model and business logic.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

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
    this.things.push(thing);
    this.emit('device-added', thing);
  }

  getAdapters() {
    return this.adapters;
  }

  getThings() {
    return this.things;
  }

  loadAdapters() {
    var adapterDir = './adapters';
    var adapterManager = this;
    fs.readdir(adapterDir, function fileList(err, filenames) {
      if (err) {
        console.error(err);
        return;
      }
      for (var filename of filenames) {
        let adapterFilename = adapterDir + '/' + filename;
        if (!fs.lstatSync(adapterFilename).isDirectory() &&
          path.extname(filename) !== '.js') {
          continue;
        }
        console.log('Loading Adapter', adapterFilename);

        let Adapter = require(adapterFilename);
        let adapter = new Adapter(adapterManager);
        adapter.filename = adapterFilename;
        adapter.name = adapter.constructor.name;
        adapterManager.adapters.push(adapter);

        adapterManager.emit('adapter-added', adapter);
      }
    });
  }

  unloadAdapters() {
    for (var adapter of this.adapters) {
      console.log('Unloading', adapter.name);
      adapter.unload();
    }
  }
}

module.exports = new AdapterManager();
