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

const Constants = require('../constants');
const express = require('express');
const addonManager = require('../addon-manager');

const debugController = express.Router();

addonManager.on(Constants.ADAPTER_ADDED, (adapter) => {
  console.log('debug: Got:', Constants.ADAPTER_ADDED,
              'notification for', adapter.id, adapter.name);
});

addonManager.on(Constants.THING_ADDED, (thing) => {
  console.log('debug: Got:', Constants.THING_ADDED,
              'notification for', thing.name);
});

addonManager.on(Constants.THING_REMOVED, (thing) => {
  console.log('debug: Got:', Constants.THING_REMOVED,
              'notification for', thing.name);
});

addonManager.on(Constants.PROPERTY_CHANGED, (property) => {
  console.log('debug: Got:', Constants.PROPERTY_CHANGED,
              'notification for:', property.device.name,
              'property:', property.name,
              'value:', property.value);
});

addonManager.on(Constants.PAIRING_TIMEOUT, () => {
  console.log('debug: Got:', Constants.PAIRING_TIMEOUT,
              'notification');
});

/**
 * List all known adapters
 */
debugController.get('/adapters', (request, response) => {
  const adapters = addonManager.getAdapters();
  response.status(200).json(Array.from(adapters.values()).map((adapter) => {
    return adapter.asDict();
  }));
});

/**
 * Add a new device
 */
debugController.get('/addNewThing', (request, response) => {
  addonManager.addNewThing(60).then((thing) => {
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
  addonManager.cancelAddNewThing();
  response.status(204).send();
});

/**
 * Cancel removing a device;
 */
debugController.get('/cancelRemoveThing/:thingId', (request, response) => {
  const thingId = request.params.thingId;
  addonManager.cancelRemoveThing(thingId);
  response.status(204).send();
});

/**
 * Get a list of devices ids registered with the add-on manager.
 */
debugController.get('/deviceIds', (request, response) => {
  const devices = addonManager.getDevices();
  const deviceList = [];
  for (const deviceId in devices) {
    const device = addonManager.devices[deviceId];
    deviceList.push(device.id);
  }
  response.status(200).json(deviceList);
});

/**
 * Get a list of the devices registered with the add-on manager.
 */
debugController.get('/devices', (request, response) => {
  const devices = addonManager.getDevices();
  const deviceList = [];
  for (const deviceId in devices) {
    const device = addonManager.devices[deviceId];
    deviceList.push(device.asDict());
  }
  response.status(200).json(deviceList);
});

/**
 * Get a particular device registered with the add-on manager.
 */
debugController.get('/device/:deviceId', (request, response) => {
  const deviceId = request.params.deviceId;
  const device = addonManager.getDevice(deviceId);
  if (device) {
    response.status(200).json(device.asDict());
  } else {
    response.status(404).send(`Device "${deviceId}" not found.`);
  }
});

/**
 * Gets an property from a device.
 */
debugController.get('/device/:deviceId/:propertyName', (request, response) => {
  const deviceId = request.params.deviceId;
  const propertyName = request.params.propertyName;
  const device = addonManager.getDevice(deviceId);
  if (device) {
    device.getProperty(propertyName).then((value) => {
      const valueDict = {};
      valueDict[propertyName] = value;
      response.status(200).json(valueDict);
    }).catch((error) => {
      console.log(`Device "${deviceId}"`);
      console.log(error);
      response.status(404).send(`Device "${deviceId}${error}`);
    });
  } else {
    response.status(404).send(`Device "${deviceId}" not found.`);
  }
});

/**
 * Sends a debug command to a particular device.
 */
debugController.put('/device/:deviceId/cmd/:cmd', (request, response) => {
  const deviceId = request.params.deviceId;
  const device = addonManager.getDevice(deviceId);
  if (device) {
    device.debugCmd(request.params.cmd, request.body);
    response.status(200).json(request.body);
  } else {
    response.status(404).send(`Device "${deviceId}" not found.`);
  }
});

/**
 * Sets an property associated with a device.
 */
debugController.put('/device/:deviceId/:propertyName', (request, response) => {
  const deviceId = request.params.deviceId;
  const propertyName = request.params.propertyName;
  const device = addonManager.getDevice(deviceId);
  if (device) {
    const propertyValue = request.body[propertyName];
    if (typeof propertyValue !== 'undefined') {
      device.setProperty(propertyName, propertyValue).then((updatedValue) => {
        const valueDict = {};
        valueDict[propertyName] = updatedValue;
        response.status(200).json(valueDict);
      }).catch((error) => {
        console.log(`Device "${deviceId}"`);
        console.log(error);
        response.status(404).send(`Device "${deviceId}" ${error}`);
      });
    } else {
      response.status(404).send(`Device "${deviceId
      }" property "${propertyName
      }" not found in request.`);
    }
  } else {
    response.status(404).send(`Device "${deviceId}" not found.`);
  }
});

/**
 * Get a list of plugins
 */
debugController.get('/plugins', (request, response) => {
  const plugins = Array.from(addonManager.pluginServer.plugins.values());
  response.status(200).json(plugins.map((plugin) => {
    return plugin.asDict();
  }));
});

/**
 * Get a list of the things registered with the add-on manager.
 */
debugController.get('/things', (request, response) => {
  response.status(200).json(addonManager.getThings());
});

/**
 * Get a particular thing registered with the add-on manager.
 */
debugController.get('/thing/:thingId', (request, response) => {
  const thingId = request.params.thingId;
  const thing = addonManager.getThing(thingId);
  if (thing) {
    response.status(200).json(thing);
  } else {
    response.status(404).send(`Thing "${thingId}" not found.`);
  }
});

/**
 * Gets a property associated with a thing.
 */
debugController.get('/thing/:thingId/:propertyName', (request, response) => {
  const thingId = request.params.thingId;
  const propertyName = request.params.propertyName;
  const thing = addonManager.getThing(thingId);
  if (thing) {
    addonManager.getProperty(thing.id, propertyName).then((value) => {
      const valueDict = {};
      valueDict[propertyName] = value;
      response.status(200).json(valueDict);
    }).catch((error) => {
      response.status(404).send(`Thing "${thingId} ${error}`);
    });
  } else {
    response.status(404).send(`Thing "${thingId}" not found.`);
  }
});

/**
 * Sets a property associated with a thing.
 */
debugController.put('/thing/:thingId/:propertyName', (request, response) => {
  const thingId = request.params.thingId;
  const propertyName = request.params.propertyName;
  const thing = addonManager.getThing(thingId);
  if (thing) {
    const propertyValue = request.body[propertyName];
    if (typeof propertyValue !== 'undefined') {
      addonManager.setProperty(propertyName, propertyValue).then((value) => {
        const valueDict = {};
        valueDict[propertyName] = value;
        response.status(200).json(valueDict);
      }).catch((error) => {
        console.log(`Thing "${thingId}`);
        console.log(error);
        response.status(404).send(`Thing "${thingId} ${error}`);
      });
    } else {
      response.status(404).send(`Thing "${thingId
      }" property "${propertyName
      }" not found in request.`);
    }
  } else {
    response.status(404).send(`Thing "${thingId}" not found.`);
  }
});

/**
 * Remove an existing Thing.
 */
debugController.get('/removeThing/:thingId', (request, response) => {
  const thingId = request.params.thingId;
  addonManager.removeThing(thingId).then((thingIdRemoved) => {
    console.log('debugController: removed', thingIdRemoved);
    if (thingId != thingIdRemoved) {
      console.log('debugController: Actually removed', thingIdRemoved,
                  'even though request was for:', thingId);
    }
    response.status(200).json({removed: thingIdRemoved});
  }, (str) => {
    console.log('debugController: remove failed:', str);
    response.status(500).send(`remove of ${thingId} failed: ${str}`);
  });
});

/**
 * Unload add-ons
 */
debugController.get('/unloadAddons', (request, response) => {
  console.log('debugController: Unloading Add-ons');
  addonManager.unloadAddons();
  response.status(200).send('');
});

module.exports = debugController;
