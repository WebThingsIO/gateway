/**
 * Debug Controller.
 *
 * Manages HTTP requests to /debug/adapters. 
 *  
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
var express = require('express');
var adapterManager = require('../adapter-manager');

var debugController = express.Router();

/**
 * Add a new device
 */
debugController.get('/addNewDevice', (request, response) => {
  adapterManager.addNewDevice().then((device) => {
    console.log('addSomeDevice added id', device.getId(), 'name', device.getName());
  }, (str) => {
    console.log('addSomeDevice cancelled');
  });
  response.status(204).send();
});

/**
 * Cancel adding a new device
 */
debugController.get('/cancelAddNewDevice', (request, response) => {
  adapterManager.cancelAddNewDevice();
  response.status(204).send();
});

/**
 * Cancel removing a device;
 */
debugController.get('/cancelRemoveSomeDevice', (request, response) => {
  adapterManager.cancelRemoveSomeDevice();
  response.status(204).send();
});

/**
 * Get a list of the devices registered with the adapter manager.
 */
debugController.get('/devices', (request, response) => {
  var devices = adapterManager.getDevices();
  var deviceList = [];
  for (var deviceId in devices) {
    var device = adapterManager.devices[deviceId];
    deviceList.push(device.asDict());
  }
  response.json(deviceList);
});

/**
 * Get a particular device registered with the adapter manager.
 */
debugController.get('/device/:deviceId', (request, response) => {
  var deviceId = request.params['deviceId'];
  var device = adapterManager.getDevice(deviceId);
  if (device) {
    response.json(device.asDict());
  } else {
    response.status(404).send('Device "' + deviceId + '" not found.');
  }
});

/**
 * Gets an attribute from a device.
 */
debugController.get('/device/:deviceId/:attributeId', (request, response) => {
  var deviceId = request.params['deviceId'];
  var attributeId = request.params['attributeId'];
  var device = adapterManager.getDevice(deviceId);
  if (device) {
    var attribute = device.getAttribute(attributeId);
    if (attribute) {
      console.log('attributeId =', attributeId);
      valueDict = {};
      valueDict[attributeId] = device.getAttributeValue(attributeId);
      response.json(valueDict);
      return;
    }
    response.status(404).send('Device "' + deviceId +
                              '" attribute "' + attributeId +
                              '" not found.');
    return;
  }
  response.status(404).send('Device "' + deviceId + '" not found.');
});

/**
 * Sets an attribute associated with a device.
 */
debugController.put('/device/:deviceId/:attributeId', (request, response) => {
  var deviceId = request.params['deviceId'];
  var attributeId = request.params['attributeId'];
  var device = adapterManager.getDevice(deviceId);
  if (device) {
    var attribute = device.getAttribute(attributeId);
    if (attribute) {
      var attributeValue = request.body[attributeId];
      if (attributeValue !== undefined) {
        device.setAttributeValue(attributeId, attributeValue);
        response.send();
        return;
      }
      response.status(404).send('Device "' + deviceId +
                                '" attribute "' + attributeId +
                                '" not found in request.');
      return;
    }
    response.status(404).send('Device "' + deviceId +
                              '" attribute "' + attributeId +
                              '" not found.');
    return;
  }
  response.status(404).send('Device "' + deviceId + '" not found.');
});

/**
 * Remove an existing device.
 */
debugController.get('/removeSomeDevice', (request, response) => {
  adapterManager.removeSomeDevice().then((device) => {
    console.log('removeSomeDevice removed id', device.getId(), 'name', device.getName());
  }, (str) => {
    console.log('removeSomeDevice cancelled');
  });
  response.status(204).send();
});

module.exports = debugController;
