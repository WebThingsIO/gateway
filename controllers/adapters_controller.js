/**
 * Adapter Controller.
 *
 * Manages HTTP requests to /adapters. 
 *  
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
var express = require('express');
var adapterManager = require('../adapter-manager');

var AdaptersController = express.Router();

AdaptersController.get('/', function (request, response) {
  adapterManager.discoverAdapters().then(function(adapters) {
    var adapterList = [];
    for (var adapter of adapters) {
      adapterList.push(adapter.asDict());
    }
    response.json(adapterList);
  });
});

AdaptersController.get('/:adapterId/', function (request, response) {
  var adapterId = request.params['adapterId'];
  var adapter = adapterManager.getAdapter(adapterId);
  if (adapter) {
    response.json(adapter.asDict());
    return;
  }
  response.status(404).send('Adapter "' + adapterId + '" not found.');
});

AdaptersController.get('/:adapterId/devices/', function (request, response) {
  var adapterId = request.params['adapterId'];
  var adapter = adapterManager.getAdapter(adapterId);
  if (adapter) {
    adapter.discoverDevices().then(function(devices) {
      var deviceList = [];
      for (var deviceId in adapter.devices) {
        var device = adapter.devices[deviceId];
        deviceList.push(device.asDict());
      }
      response.json(deviceList);
    });
    return;
  }
  response.status(404).send('Adapter "' + adapterId + '" not found.');
});

AdaptersController.get('/:adapterId/devices/:deviceId/', function (request, response) {
  var adapterId = request.params['adapterId'];
  var deviceId = request.params['deviceId'];
  var adapter = adapterManager.getAdapter(adapterId);
  if (adapter) {
    var device = adapter.getDevice(deviceId);
    if (device) {
      response.json(device.asDict());
      return;
    }
    response.status(404).send('Adapter "' + adapterId + '" device "' + deviceId + '" not found.');
    return;
  }
  response.status(404).send('Adapter "' + adapterId + '" not found.');
});

module.exports = AdaptersController;
