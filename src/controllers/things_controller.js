/**
 * Things Controller.
 *
 * Manages HTTP requests to /things.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const PromiseRouter = require('express-promise-router');
const WebSocket = require('ws');
const Action = require('../models/action');
const Actions = require('../models/actions');
const ActionsController = require('./actions_controller');
const AddonManager = require('../addon-manager');
const Constants = require('../constants');
const EventsController = require('./events_controller');
const Things = require('../models/things');
const Settings = require('../models/settings');

const ThingsController = PromiseRouter();

/**
 * Get a list of Things.
 */
ThingsController.get('/', (request, response) => {
  if (request.jwt.payload.role !== Constants.USER_TOKEN) {
    if (!request.jwt.payload.scope) {
      response.status(400).send('Token must contain scope');
    } else {
      const scope = request.jwt.payload.scope;
      if (scope.indexOf(' ') === -1 && scope.indexOf('/') == 0 &&
        scope.split('/').length == 2 &&
        scope.split(':')[0] === Constants.THINGS_PATH) {
        Things.getThingDescriptions(request.get('Host'), request.secure)
          .then((things) => {
            response.status(200).json(things);
          });
      } else {
        // Get hrefs of things in scope
        const paths = scope.split(' ');
        const hrefs = new Array(0);
        for (const path of paths) {
          const parts = path.split(':');
          hrefs.push(parts[0]);
        }
        Things.getListThingDescriptions(hrefs,
                                        request.get('Host'),
                                        request.secure)
          .then((things) => {
            response.status(200).json(things);
          });
      }
    }
  } else {
    Things.getThingDescriptions(request.get('Host'), request.secure)
      .then((things) => {
        response.status(200).json(things);
      });
  }
});

ThingsController.patch('/', async (request, response) => {
  if (!request.body ||
      !request.body.hasOwnProperty('thingId') ||
      !request.body.hasOwnProperty('pin') ||
      !request.body.thingId ||
      request.body.pin.trim().length === 0) {
    response.status(400).send('Invalid request');
    return;
  }

  const thingId = request.body.thingId;
  const pin = request.body.pin.trim();

  try {
    const device = await AddonManager.setPin(thingId, pin);
    response.status(200).json(device);
  } catch (e) {
    console.error(`Failed to set PIN for ${thingId}: ${e}`);
    response.status(400).send(e);
  }
});

/**
 * Handle creating a new thing.
 */
ThingsController.post('/', async (request, response) => {
  if (!request.body || !request.body.hasOwnProperty('id')) {
    response.status(400).send('No id in thing description');
    return;
  }
  const description = request.body;
  const id = description.id;
  delete description.id;

  try {
    // If the thing already exists, bail out.
    await Things.getThing(id);
    const err = 'Web thing already added';
    console.log(err, id);
    response.status(400).send(err);
    return;
  } catch (_e) {
    // Do nothing, this is what we want.
  }

  // If we're adding a native webthing, we need to update the config for
  // thing-url-adapter so that it knows about it.
  let webthing = false;
  if (description.hasOwnProperty('webthingUrl')) {
    webthing = true;

    const key = 'addons.thing-url-adapter';
    try {
      const current = await Settings.get(key);
      if (typeof current === 'undefined') {
        throw new Error('Setting is undefined.');
      }

      current.moziot.config.urls.push(description.webthingUrl);
      await Settings.set(key, current);
    } catch (e) {
      console.error('Failed to update settings for thing-url-adapter');
      console.error(e);
      response.status(400).send(e);
      return;
    }

    delete description.webthingUrl;
  }

  try {
    const thing = await Things.createThing(id, description, webthing);
    console.log(`Successfully created new thing ${thing.name}`);
    response.status(201).send(thing);
  } catch (error) {
    console.error('Error saving new thing', id, description);
    console.error(error);
    response.status(500).send(error);
  }

  // If this is a web thing, we need to restart thing-url-adapter.
  if (webthing) {
    try {
      await AddonManager.unloadAddon('thing-url-adapter', true);
      await AddonManager.loadAddon('thing-url-adapter');
    } catch (e) {
      console.error('Failed to restart thing-url-adapter');
      console.error(e);
    }
  }
});

/**
 * Get a Thing.
 */
ThingsController.get('/:thingId', (request, response) => {
  const id = request.params.thingId;
  Things.getThingDescription(id, request.get('Host'), request.secure)
    .then((thing) => {
      response.status(200).json(thing);
    })
    .catch((error) => {
      console.error(`Error getting thing description for thing with id ${id}`);
      console.error(`Error: ${error}`);
      response.status(404).send(error);
    });
});

/**
 * Get the properties of a Thing.
 */
ThingsController.get('/:thingId/properties', async (request, response) => {
  const thingId = request.params.thingId;

  let thing;
  try {
    thing = await Things.getThing(thingId);
  } catch (e) {
    console.error('Failed to get thing:', e);
    response.status(404).send(e);
    return;
  }

  const result = {};
  for (const name in thing.properties) {
    try {
      const value = await AddonManager.getProperty(thingId, name);
      result[name] = value;
    } catch (e) {
      console.error(`Failed to get property ${name}:`, e);
    }
  }

  response.status(200).json(result);
});

/**
 * Get a property of a Thing.
 */
ThingsController.get(
  '/:thingId/properties/:propertyName',
  (request, response) => {
    const thingId = request.params.thingId;
    const propertyName = request.params.propertyName;
    AddonManager.getProperty(thingId, propertyName).then((value) => {
      const result = {};
      result[propertyName] = value;
      response.status(200).json(result);
    }).catch((error) => {
      console.error('Error getting value for thingId:', thingId,
                    'property:', propertyName);
      console.error(error);
      response.status(500).send(error);
    });
  });

/**
 * Set a property of a Thing.
 */
ThingsController.put(
  '/:thingId/properties/:propertyName',
  (request, response) => {
    const thingId = request.params.thingId;
    const propertyName = request.params.propertyName;
    if (!request.body || typeof request.body[propertyName] === 'undefined') {
      response.status(400).send('Invalid property name');
      return;
    }
    const value = request.body[propertyName];
    AddonManager.setProperty(thingId, propertyName, value)
      .then((updatedValue) => {
        // Note: it's possible that updatedValue doesn't match value.
        const result = {};
        result[propertyName] = updatedValue;
        response.status(200).json(result);
      }).catch((error) => {
        console.error('Error setting value for thingId:', thingId,
                      'property:', propertyName,
                      'value:', value);
        response.status(500).send(error);
      });
  });

/**
 * Use an ActionsController to handle each thing's actions.
 */
ThingsController.use(`/:thingId${Constants.ACTIONS_PATH}`, ActionsController);

/**
 * Use an EventsController to handle each thing's events.
 */
ThingsController.use(`/:thingId${Constants.EVENTS_PATH}`, EventsController);

/**
 * Modify a Thing's floorplan position.
 */
ThingsController.patch('/:thingId', (request, response) => {
  const thingId = request.params.thingId;
  if (!request.body ||
      !request.body.hasOwnProperty('floorplanX') ||
      !request.body.hasOwnProperty('floorplanY')) {
    response.status(400).send('x and y properties needed to position Thing');
    return;
  }
  Things.getThing(thingId).then((thing) => {
    // return
    return thing.setCoordinates(
      request.body.floorplanX, request.body.floorplanY);
  }).then((description) => {
    response.status(200).json(description);
  }).catch((e) => {
    response.status(500).send(`Failed to update thing ${thingId}: ${e}`);
  });
});

/**
 * Modify a Thing.
 */
ThingsController.put('/:thingId', async (request, response) => {
  const thingId = request.params.thingId;
  if (!request.body || !request.body.hasOwnProperty('name')) {
    response.status(400).send('name parameter required');
    return;
  }

  const name = request.body.name.trim();
  if (name.length === 0) {
    response.status(400).send('Invalid name');
    return;
  }

  let thing;
  try {
    thing = await Things.getThing(thingId);
  } catch (e) {
    response.status(500).send(`Failed to retrieve thing ${thingId}: ${e}`);
  }

  if (request.body.selectedCapability) {
    try {
      await thing.setSelectedCapability(request.body.selectedCapability);
    } catch (e) {
      response.status(500).send(`Failed to update thing ${thingId}: ${e}`);
    }
  }

  if (request.body.iconData) {
    try {
      await thing.setIcon(request.body.iconData, true);
    } catch (e) {
      response.status(500).send(`Failed to update thing ${thingId}: ${e}`);
    }
  }

  let description;
  try {
    description = await thing.setName(name);
  } catch (e) {
    response.status(500).send(`Failed to update thing ${thingId}: ${e}`);
  }

  response.status(200).json(description);
});

/**
 * Remove a Thing.
 */
ThingsController.delete('/:thingId', (request, response) => {
  const thingId = request.params.thingId;
  AddonManager.removeThing(thingId).
    then(() => {
      Things.removeThing(thingId).then(() => {
        console.log(`Successfully deleted ${thingId} from database.`);
        response.status(204).send();
      }).catch((e) => {
        response.status(500).send(`Failed to remove thing ${thingId}: ${e}`);
      });
    }).catch((e) => {
      response.status(500).send(`Failed to remove thing ${thingId}: ${e}`);
    });
});

/**
 * Connect to receive messages from a Thing
 */
ThingsController.ws('/:thingId/', (websocket, request) => {
  // Since the Gateway have the asynchronous express middlewares, there is a
  // possibility that the WebSocket have been closed.
  if (websocket.readyState !== WebSocket.OPEN) {
    return;
  }
  const thingId = request.params.thingId;
  const subscribedEventNames = {};

  function sendMessage(message) {
    websocket.send(message, (err) => {
      if (err) {
        console.error('WebSocket sendMessage failed', err);
      }
    });
  }

  Things.getThing(thingId).then((thing) => {
    thing.registerWebsocket(websocket);
    thing.addEventSubscription(onEvent);

    websocket.on('close', () => {
      thing.removeEventSubscription(onEvent);
    });
  }).catch(() => {
    console.error('WebSocket opened on nonexistent thing', thingId);
    sendMessage(JSON.stringify({
      messageType: Constants.ERROR,
      data: {
        status: '404 Not Found',
        message: `Thing ${thingId} not found`,
      },
    }));
    websocket.close();
  });

  function onPropertyChanged(property) {
    if (property.device.id !== thingId) {
      return;
    }
    sendMessage(JSON.stringify({
      messageType: Constants.PROPERTY_STATUS,
      data: {
        [property.name]: property.value,
      },
    }));
  }

  function onActionStatus(action) {
    sendMessage(JSON.stringify({
      messageType: Constants.ACTION_STATUS,
      data: {
        [action.name]: action.getDescription(),
      },
    }));
  }

  function onEvent(event) {
    if (!subscribedEventNames[event.name]) {
      return;
    }
    sendMessage(JSON.stringify({
      messageType: Constants.EVENT,
      data: {
        [event.name]: event.getDescription(),
      },
    }));
  }

  AddonManager.on(Constants.PROPERTY_CHANGED, onPropertyChanged);
  Actions.on(Constants.ACTION_STATUS, onActionStatus);

  const heartbeatInterval = setInterval(() => {
    try {
      websocket.ping();
    } catch (e) {
      // Do nothing. Let cleanup() handle things if necessary.
      websocket.terminate();
    }
  }, 30 * 1000);

  const cleanup = () => {
    AddonManager.removeListener(Constants.PROPERTY_CHANGED, onPropertyChanged);
    Actions.removeListener(Constants.ACTION_STATUS, onActionStatus);
    clearInterval(heartbeatInterval);
  };

  websocket.on('error', cleanup);
  websocket.on('close', cleanup);

  websocket.on('message', (requestText) => {
    let request = null;
    try {
      request = JSON.parse(requestText);
    } catch (e) {
      sendMessage(JSON.stringify({
        messageType: Constants.ERROR,
        data: {
          status: '400 Bad Request',
          message: 'Parsing request failed',
        },
      }));
      return;
    }

    const device = AddonManager.getDevice(thingId);
    if (!device) {
      sendMessage(JSON.stringify({
        messageType: Constants.ERROR,
        data: {
          status: '400 Bad Request',
          message: `Thing ${thingId} not found`,
          request: request,
        },
      }));
      return;
    }

    switch (request.messageType) {
      case Constants.SET_PROPERTY: {
        const setRequests = Object.keys(request.data).map((property) => {
          const value = request.data[property];
          return device.setProperty(property, value);
        });
        Promise.all(setRequests).catch((err) => {
          // If any set fails, send an error
          sendMessage(JSON.stringify({
            messageType: Constants.ERROR,
            data: {
              status: '400 Bad Request',
              message: err,
              request: request,
            },
          }));
        });
        break;
      }

      case Constants.ADD_EVENT_SUBSCRIPTION: {
        for (const eventName in request.data) {
          subscribedEventNames[eventName] = true;
        }
        break;
      }

      case Constants.REQUEST_ACTION: {
        for (const actionName in request.data) {
          const actionParams = request.data[actionName].input;
          Things.getThing(thingId).then((thing) => {
            const action = new Action(actionName, actionParams, thing);
            return Actions.add(action).then(() => {
              return AddonManager.requestAction(
                thingId, action.id, actionName, actionParams);
            });
          }).catch((err) => {
            sendMessage(JSON.stringify({
              messageType: Constants.ERROR,
              data: {
                status: '400 Bad Request',
                message: err.message,
                request: request,
              },
            }));
          });
        }
        break;
      }

      default: {
        sendMessage(JSON.stringify({
          messageType: Constants.ERROR,
          data: {
            status: '400 Bad Request',
            message: `Unknown messageType: ${request.messageType}`,
            request: request,
          },
        }));
        break;
      }
    }
  });
});

module.exports = ThingsController;
