/**
 * Debug Controller.
 *
 * Manages HTTP requests to /debug/adapters.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

var express = require('express');
var adapterManager = require('../adapter-manager');

var debugController = express.Router();

/**
 * Add a new device
 */
debugController.get('/addNewThing', (request, response) => {
  adapterManager.addNewThing().then((thing) => {
    console.log('debugController: addNewThing added thing', thing);
  }, (str) => {
    console.log('debugController: addNewThing cancelled');
  });
  response.status(204).send();
});

/**
 * Cancel adding a new device
 */
debugController.get('/cancelAddNewThing', (request, response) => {
  adapterManager.cancelAddNewThing();
  response.status(204).send();
});

/**
 * Cancel removing a device;
 */
debugController.get('/cancelRemoveSomeThing', (request, response) => {
  adapterManager.cancelRemoveSomeThing();
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
  var deviceId = request.params.deviceId;
  var device = adapterManager.getDevice(deviceId);
  if (device) {
    response.json(device.asDict());
  } else {
    response.status(404).send('Device "' + deviceId + '" not found.');
  }
});

/**
 * Gets an property from a device.
 */
debugController.get('/device/:deviceId/:propertyName', (request, response) => {
  var deviceId = request.params.deviceId;
  var propertyName = request.params.propertyName;
  var device = adapterManager.getDevice(deviceId);
  if (device) {
    var property = device.getProperty(propertyName);
    if (property) {
      var valueDict = {};
      valueDict[propertyName] = device.getPropertyValue(propertyName);
      response.json(valueDict);
      return;
    }
    response.status(404).send('Device "' + deviceId +
                              '" property "' + propertyName +
                              '" not found.');
    return;
  }
  response.status(404).send('Device "' + deviceId + '" not found.');
});

/**
 * Sets an property associated with a device.
 */
debugController.put('/device/:deviceId/:propertyName', (request, response) => {
  var deviceId = request.params.deviceId;
  var propertyName = request.params.propertyName;
  var device = adapterManager.getDevice(deviceId);
  if (device) {
    var property = device.getProperty(propertyName);
    if (property) {
      var propertyValue = request.body[propertyName];
      if (propertyValue !== undefined) {
        device.setPropertyValue(propertyName, propertyValue);
        response.send();
        return;
      }
      response.status(404).send('Device "' + deviceId +
                                '" property "' + propertyName +
                                '" not found in request.');
      return;
    }
    response.status(404).send('Device "' + deviceId +
                              '" property "' + propertyName +
                              '" not found.');
    return;
  }
  response.status(404).send('Device "' + deviceId + '" not found.');
});

/**
 * Get a list of the things registered with the adapter manager.
 */
debugController.get('/things', (request, response) => {
  response.json(adapterManager.getThings());
});

/**
 * Get a particular thing registered with the adapter manager.
 */
debugController.get('/thing/:thingId', (request, response) => {
  var thingId = request.params.thingId;
  var thing = adapterManager.getThing(thingId);
  if (thing) {
    response.json(thing);
  } else {
    response.status(404).send('Thing "' + thingId + '" not found.');
  }
});

/**
 * Gets an property from a thing.
 */
debugController.get('/thing/:thingId/:propertyName', (request, response) => {
  var thingId = request.params.thingId;
  var propertyName = request.params.propertyName;
  var thing = adapterManager.getThing(thingId);
  if (thing) {
    var property = adapterManager.getProperty(thing.id, propertyName);
    if (property) {
      var valueDict = {};
      valueDict[propertyName] = adapterManager.getPropertyValue(thing.id, propertyName);
      response.json(valueDict);
      return;
    }
    response.status(404).send('Thing "' + thingId +
                              '" property "' + propertyName +
                              '" not found.');
    return;
  }
  response.status(404).send('Thing "' + thingId + '" not found.');
});

/**
 * Sets an property associated with a thing.
 */
debugController.put('/thing/:thingId/:propertyName', (request, response) => {
  var thingId = request.params.thingId;
  var propertyName = request.params.propertyName;
  var thing = adapterManager.getThing(thingId);
  if (thing) {
    var property = adapterManager.getProperty(thing.id, propertyName);
    if (property) {
      var propertyValue = request.body[propertyName];
      if (propertyValue !== undefined) {
        adapterManager.setPropertyValue(thing.id, propertyName, propertyValue);
        response.send();
        return;
      }
      response.status(404).send('Thing "' + thingId +
                                '" property "' + propertyName +
                                '" not found in request.');
      return;
    }
    response.status(404).send('Thing "' + thingId +
                              '" property "' + propertyName +
                              '" not found.');
    return;
  }
  response.status(404).send('Thing "' + thingId + '" not found.');
});

/**
 * Remove an existing device.
 */
debugController.get('/removeSomeThing', (request, response) => {
  adapterManager.removeSomeThing().then((thing) => {
    console.log('debugController: removeSomeThing removed', thing);
  }, (str) => {
    console.log('debugController: removeSomeThing cancelled');
  });
  response.status(204).send();
});

module.exports = debugController;
