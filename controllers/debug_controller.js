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

adapterManager.on('adapter-added', (adapter) => {
  console.log('debug: Got "adapter-added" notification for', adapter.name);
});

adapterManager.on('thing-added', (thing) => {
  console.log('debug: Got "thing-added" notification for', thing.name);
});

adapterManager.on('thing-removed', (thing) => {
  console.log('debug: Got "thing-removed" notification for', thing.name);
});

adapterManager.on('property-changed', (property) => {
  console.log('debug: Got "property-changed" notification for', property.name,
              'value:', property.value);
});

adapterManager.on('pairing-timeout', () => {
  console.log('debug: Got "pairing-timeout" notification');
});

/**
 * Add a new device
 */
debugController.get('/addNewThing', (request, response) => {
  adapterManager.addNewThing().then((thing) => {
    console.log('debugController: addNewThing added thing', thing);
  }, () => {
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
debugController.get('/cancelRemoveThing/:thingId', (request, response) => {
  var thingId = request.params.thingId;
  adapterManager.cancelRemoveThing(thingId);
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
  response.status(200).json(deviceList);
});

/**
 * Get a particular device registered with the adapter manager.
 */
debugController.get('/device/:deviceId', (request, response) => {
  var deviceId = request.params.deviceId;
  var device = adapterManager.getDevice(deviceId);
  if (device) {
    response.status(200).json(device.asDict());
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
    device.getProperty(propertyName).then((value) => {
      var valueDict = {};
      valueDict[propertyName] = value;
      response.status(200).json(valueDict);
    }).catch((error) => {
      console.log('Device "' + deviceId + '"');
      console.log(error);
      response.status(404).send('Device "' + deviceId + error);
    });
  } else {
    response.status(404).send('Device "' + deviceId + '" not found.');
  }
});

/**
 * Sets an property associated with a device.
 */
debugController.put('/device/:deviceId/:propertyName', (request, response) => {
  var deviceId = request.params.deviceId;
  var propertyName = request.params.propertyName;
  var device = adapterManager.getDevice(deviceId);
  if (device) {
    var propertyValue = request.body[propertyName];
    if (propertyValue !== undefined) {
      device.setProperty(propertyName, propertyValue).then(() => {
        var valueDict = {};
        valueDict[propertyName] = propertyValue;
        response.status(200).json(valueDict);
      }).catch((error) => {
        console.log('Device "' + deviceId + '"');
        console.log(error);
        response.status(404).send('Device "' + deviceId + '" ' + error);
      });
    } else {
      response.status(404).send('Device "' + deviceId +
                                '" property "' + propertyName +
                                '" not found in request.');
    }
  } else {
    response.status(404).send('Device "' + deviceId + '" not found.');
  }
});

/**
 * Get a list of the things registered with the adapter manager.
 */
debugController.get('/things', (request, response) => {
  response.status(200).json(adapterManager.getThings());
});

/**
 * Get a particular thing registered with the adapter manager.
 */
debugController.get('/thing/:thingId', (request, response) => {
  var thingId = request.params.thingId;
  var thing = adapterManager.getThing(thingId);
  if (thing) {
    response.status(200).json(thing);
  } else {
    response.status(404).send('Thing "' + thingId + '" not found.');
  }
});

/**
 * Gets a property associated with a thing.
 */
debugController.get('/thing/:thingId/:propertyName', (request, response) => {
  var thingId = request.params.thingId;
  var propertyName = request.params.propertyName;
  var thing = adapterManager.getThing(thingId);
  if (thing) {
    adapterManager.getProperty(thing.id, propertyName).then((value) => {
      var valueDict = {};
      valueDict[propertyName] = value;
      response.status(200).json(valueDict);
    }).catch((error) => {
      response.status(404).send('Thing "' + thingId + ' ' + error);
    });
  } else {
    response.status(404).send('Thing "' + thingId + '" not found.');
  }
});

/**
 * Sets a property associated with a thing.
 */
debugController.put('/thing/:thingId/:propertyName', (request, response) => {
  var thingId = request.params.thingId;
  var propertyName = request.params.propertyName;
  var thing = adapterManager.getThing(thingId);
  if (thing) {
    var propertyValue = request.body[propertyName];
    if (propertyValue !== undefined) {
      adapterManager.setProperty(propertyName, propertyValue).then((value) => {
        var valueDict = {};
        valueDict[propertyName] = value;
        response.status(200).json(valueDict);
      }).catch((error) => {
        console.log('Thing "' + thingId);
        console.log(error);
        response.status(404).send('Thing "' + thingId + ' ' + error);
      });
    } else {
      response.status(404).send('Thing "' + thingId +
                                '" property "' + propertyName +
                                '" not found in request.');
    }
  } else {
    response.status(404).send('Thing "' + thingId + '" not found.');
  }
});

/**
 * Remove an existing Thing.
 */
debugController.get('/removeThing/:thingId', (request, response) => {
  var thingId = request.params.thingId;
  adapterManager.removeThing(thingId).then((thingIdRemoved) => {
    console.log('debugController: removed', thingIdRemoved);
    if (thingId != thingIdRemoved) {
      console.log('debugController: Actually removed', thingIdRemoved,
                  'even though request was for:', thingId);
    }
    response.status(200).json({removed: thingIdRemoved});
  }, (str) => {
    console.log('debugController: remove failed:', str);
    response.status(500).send('remove of ' + thingId + ' failed: ' + str);
  });
});

module.exports = debugController;
