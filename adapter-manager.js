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
    this.devices = {};
  }

  addAdapter(adapter) {
    adapter.name = adapter.constructor.name;
    this.adapters.push(adapter);
    this.emit('adapter-added', adapter);
  }

  addDevice(adapter, device) {
    this.devices[device.id] = device;
    this.emit('device-added', device);
  }

  getAdapters() {
    return this.adapters;
  }

  getDevice(id) {
    return this.devices[id];
  }

  getDevices() {
    return this.devices;
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
        console.log('Loading Adapters from', adapterFilename);

        let loadAdapters = require(adapterFilename);
        loadAdapters(adapterManager);
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
