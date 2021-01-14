/**
 * Debug Controller.
 *
 * Manages HTTP requests to /debug/adapters.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import express from 'express';
import * as Constants from '../constants';

const addonManager = require('../addon-manager');

function build(): express.Router {
  const controller = express.Router();

  addonManager.on(Constants.ADAPTER_ADDED, (adapter: any) => {
    console.log('debug: Got:', Constants.ADAPTER_ADDED,
                'notification for', adapter.id, adapter.name);
  });

  addonManager.on(Constants.THING_ADDED, (thing: any) => {
    console.log('debug: Got:', Constants.THING_ADDED,
                'notification for', thing.title);
  });

  addonManager.on(Constants.THING_REMOVED, (thing: any) => {
    console.log('debug: Got:', Constants.THING_REMOVED,
                'notification for', thing.title);
  });

  addonManager.on(Constants.PROPERTY_CHANGED, (property: any) => {
    console.log('debug: Got:', Constants.PROPERTY_CHANGED,
                'notification for:', property.device.title,
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
  controller.get('/adapters', (_request, response) => {
    const adapters = addonManager.getAdapters();
    response.status(200).json(Array.from(adapters.values()).map((adapter: any) => {
      return adapter.asDict();
    }));
  });

  /**
   * Add a new device
   */
  controller.get('/addNewThing', (_request, response) => {
    addonManager.addNewThing(60).then(() => {
      console.log('DebugController: addNewThing added thing');
    }, () => {
      console.log('DebugController: addNewThing cancelled');
    });
    response.sendStatus(204);
  });

  /**
   * Cancel adding a new device
   */
  controller.get('/cancelAddNewThing', (_request, response) => {
    addonManager.cancelAddNewThing();
    response.sendStatus(204);
  });

  /**
   * Cancel removing a device;
   */
  controller.get('/cancelRemoveThing/:thingId', (request, response) => {
    const thingId = request.params.thingId;
    addonManager.cancelRemoveThing(thingId);
    response.sendStatus(204);
  });

  /**
   * Get a list of devices ids registered with the add-on manager.
   */
  controller.get('/deviceIds', (_request, response) => {
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
  controller.get('/devices', (_request, response) => {
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
  controller.get('/device/:deviceId', (request, response) => {
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
  controller.get('/device/:deviceId/:propertyName', (request, response) => {
    const deviceId = request.params.deviceId;
    const propertyName = request.params.propertyName;
    const device = addonManager.getDevice(deviceId);
    if (device) {
      device.getProperty(propertyName).then((value: any) => {
        const valueDict: Record<string, any> = {};
        valueDict[propertyName] = value;
        response.status(200).json(valueDict);
      }).catch((error: any) => {
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
  controller.put('/device/:deviceId/cmd/:cmd', (request, response) => {
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
  controller.put('/device/:deviceId/:propertyName', (request, response) => {
    const deviceId = request.params.deviceId;
    const propertyName = request.params.propertyName;
    const device = addonManager.getDevice(deviceId);
    if (device) {
      const propertyValue = request.body[propertyName];
      if (typeof propertyValue !== 'undefined') {
        device.setProperty(propertyName, propertyValue).then((updatedValue: any) => {
          const valueDict: Record<string, any> = {};
          valueDict[propertyName] = updatedValue;
          response.status(200).json(valueDict);
        }).catch((error: any) => {
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
  controller.get('/plugins', (_request, response) => {
    const plugins = Array.from(addonManager.pluginServer.plugins.values());
    response.status(200).json(plugins.map((plugin: any) => {
      return plugin.asDict();
    }));
  });

  /**
   * Get a list of the things registered with the add-on manager.
   */
  controller.get('/things', (_request, response) => {
    response.status(200).json(addonManager.getThings());
  });

  /**
   * Get a particular thing registered with the add-on manager.
   */
  controller.get('/thing/:thingId', (request, response) => {
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
  controller.get('/thing/:thingId/:propertyName', (request, response) => {
    const thingId = request.params.thingId;
    const propertyName = request.params.propertyName;
    const thing = addonManager.getThing(thingId);
    if (thing) {
      addonManager.getProperty(thing.id, propertyName).then((value: any) => {
        const valueDict: Record<string, any> = {};
        valueDict[propertyName] = value;
        response.status(200).json(valueDict);
      }).catch((error: any) => {
        response.status(404).send(`Thing "${thingId} ${error}`);
      });
    } else {
      response.status(404).send(`Thing "${thingId}" not found.`);
    }
  });

  /**
   * Sets a property associated with a thing.
   */
  controller.put('/thing/:thingId/:propertyName', (request, response) => {
    const thingId = request.params.thingId;
    const propertyName = request.params.propertyName;
    const thing = addonManager.getThing(thingId);
    if (thing) {
      const propertyValue = request.body[propertyName];
      if (typeof propertyValue !== 'undefined') {
        addonManager.setProperty(propertyName, propertyValue).then((value: any) => {
          const valueDict: Record<string, any> = {};
          valueDict[propertyName] = value;
          response.status(200).json(valueDict);
        }).catch((error: any) => {
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
  controller.get('/removeThing/:thingId', (request, response) => {
    const thingId = request.params.thingId;
    addonManager.removeThing(thingId).then((thingIdRemoved: string) => {
      console.log('DebugController: removed', thingIdRemoved);
      if (thingId != thingIdRemoved) {
        console.log('DebugController: Actually removed', thingIdRemoved,
                    'even though request was for:', thingId);
      }
      response.status(200).json({removed: thingIdRemoved});
    }, (str: string) => {
      console.log('DebugController: remove failed:', str);
      response.status(500).send(`remove of ${thingId} failed: ${str}`);
    });
  });

  /**
   * Unload add-ons
   */
  controller.get('/unloadAddons', (_request, response) => {
    console.log('DebugController: Unloading Add-ons');
    addonManager.unloadAddons();
    response.status(200).send('');
  });

  return controller;
}

export = build;
