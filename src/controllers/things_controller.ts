/**
 * Things Controller.
 *
 * Manages HTTP requests to /things.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Action, { ActionDescription } from '../models/action';
import Actions from '../models/actions';
import ActionsController from './actions_controller';
import * as Constants from '../constants';
import Event, { EventDescription } from '../models/event';
import EventsController from './events_controller';
import express from 'express';
import expressWs from 'express-ws';
import * as Settings from '../models/settings';
import WebSocket from 'ws';
import Thing from '../models/thing';
import Things from '../models/things';
import AddonManager from '../addon-manager';
import { WithJWT } from '../jwt-middleware';
import { Input, PropertyValue } from 'gateway-addon/lib/schema';
import { Property } from 'gateway-addon';

interface SetPropertyMessage {
  messageType: 'setProperty';
  id?: string;
  data: Record<string, PropertyValue>;
}

interface RequestActionMessage {
  messageType: 'requestAction';
  id?: string;
  data: Record<string, { input?: Input }>;
}

interface AddEventSubscriptionMessage {
  messageType: 'addEventSubscription';
  id?: string;
  data: Record<string, Record<string, never>>;
}

interface PropertyStatusMessage {
  messageType: 'propertyStatus';
  id: string;
  data: Record<string, PropertyValue>;
}

interface ActionStatusMessage {
  messageType: 'actionStatus';
  id?: string;
  data: Record<string, ActionDescription>;
}

interface EventMessage {
  messageType: 'event';
  id: string;
  data: Record<string, EventDescription>;
}

interface ConnectedMessage {
  messageType: 'connected';
  id: string;
  data: boolean;
}

interface ThingAddedMessage {
  messageType: 'thingAdded';
  id: string;
  data: Record<string, never>;
}

interface ThingModifiedMessage {
  messageType: 'thingModified';
  id: string;
  data: Record<string, never>;
}

interface ThingRemovedMessage {
  messageType: 'thingRemoved';
  id: string;
  data: Record<string, never>;
}

interface ErrorMessage {
  messageType: 'error';
  data: {
    code: number;
    status: string;
    message: string;
    request?: IncomingMessage;
  };
}

type IncomingMessage = SetPropertyMessage | RequestActionMessage | AddEventSubscriptionMessage;
type OutgoingMessage =
  | PropertyStatusMessage
  | ActionStatusMessage
  | EventMessage
  | ConnectedMessage
  | ThingAddedMessage
  | ThingModifiedMessage
  | ThingRemovedMessage
  | ErrorMessage;

function build(): express.Router {
  const controller: express.Router & expressWs.WithWebsocketMethod = express.Router();

  /**
   * Connect to receive messages from a Thing or all Things
   *
   * Note that these must precede the normal routes to allow express-ws to work
   */
  controller.ws('/:thingId/', websocketHandler);
  controller.ws('/', websocketHandler);

  /**
   * Get a list of Things.
   */
  controller.get('/', (req, response) => {
    const request = <express.Request & WithJWT>req;
    if (request.jwt.getPayload()!.role !== Constants.USER_TOKEN) {
      if (!request.jwt.getPayload()!.scope) {
        response.status(400).send('Token must contain scope');
      } else {
        const scope = request.jwt.getPayload()!.scope!;
        if (
          !scope.includes(' ') &&
          scope.indexOf('/') == 0 &&
          scope.split('/').length == 2 &&
          scope.split(':')[0] === Constants.THINGS_PATH
        ) {
          Things.getThingDescriptions(request.get('Host'), request.secure).then((things) => {
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
          Things.getListThingDescriptions(hrefs, request.get('Host'), request.secure).then(
            (things) => {
              response.status(200).json(things);
            }
          );
        }
      }
    } else {
      Things.getThingDescriptions(request.get('Host'), request.secure).then((things) => {
        response.status(200).json(things);
      });
    }
  });

  controller.patch('/', async (request, response) => {
    if (!request.body || !request.body.hasOwnProperty('thingId') || !request.body.thingId) {
      response.status(400).send('Invalid request');
      return;
    }

    const thingId = request.body.thingId;

    if (request.body.hasOwnProperty('pin') && request.body.pin.length > 0) {
      const pin = request.body.pin;

      try {
        const device = await AddonManager.setPin(thingId, pin);
        response.status(200).json(device);
      } catch (e) {
        console.error(`Failed to set PIN for ${thingId}: ${e}`);
        response.status(400).send(e);
      }
    } else if (
      request.body.hasOwnProperty('username') &&
      request.body.username.length > 0 &&
      request.body.hasOwnProperty('password') &&
      request.body.password.length > 0
    ) {
      const username = request.body.username;
      const password = request.body.password;

      try {
        const device = await AddonManager.setCredentials(thingId, username, password);
        response.status(200).json(device);
      } catch (e) {
        console.error(`Failed to set credentials for ${thingId}: ${e}`);
        response.status(400).send(e);
      }
    } else {
      response.status(400).send('Invalid request');
    }
  });

  /**
   * Handle creating a new thing.
   */
  controller.post('/', async (request, response) => {
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

      const key = 'addons.config.thing-url-adapter';
      try {
        const config = <Record<string, unknown>>await Settings.getSetting(key);
        if (typeof config === 'undefined') {
          throw new Error('Setting is undefined.');
        }

        (<string[]>config.urls).push(description.webthingUrl);
        await Settings.setSetting(key, config);
      } catch (e) {
        console.error('Failed to update settings for thing-url-adapter');
        console.error(e);
        response.status(400).send(e);
        return;
      }

      delete description.webthingUrl;
    }

    try {
      const thing = await Things.createThing(id, description);
      console.log(`Successfully created new thing ${thing.title}`);
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
  controller.get('/:thingId', (request, response) => {
    const id = request.params.thingId;
    Things.getThingDescription(id, request.get('Host'), request.secure)
      .then((thing) => {
        response.status(200).json(thing);
      })
      .catch((error: unknown) => {
        console.error(`Error getting thing description for thing with id ${id}:`, error);
        response.status(404).send(error);
      });
  });

  /**
   * Get the properties of a Thing.
   */
  controller.get('/:thingId/properties', async (request, response) => {
    const thingId = request.params.thingId;

    let thing;
    try {
      thing = await Things.getThing(thingId);
    } catch (e) {
      console.error('Failed to get thing:', e);
      response.status(404).send(e);
      return;
    }

    const result: Record<string, PropertyValue> = {};
    for (const name in thing.getProperties()) {
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
  controller.get('/:thingId/properties/:propertyName', async (request, response) => {
    const thingId = request.params.thingId;
    const propertyName = request.params.propertyName;
    try {
      const value = await Things.getThingProperty(thingId, propertyName);
      const result: Record<string, unknown> = {};
      result[propertyName] = value;
      response.status(200).json(result);
    } catch (err) {
      response.status(err.code).send(err.message);
    }
  });

  /**
   * Set a property of a Thing.
   */
  controller.put('/:thingId/properties/:propertyName', async (request, response) => {
    const thingId = request.params.thingId;
    const propertyName = request.params.propertyName;
    if (!request.body || typeof request.body[propertyName] === 'undefined') {
      response.status(400).send('Invalid property name');
      return;
    }
    const value = request.body[propertyName];
    try {
      const updatedValue = await Things.setThingProperty(thingId, propertyName, value);
      const result = {
        [propertyName]: updatedValue,
      };
      response.status(200).json(result);
    } catch (e) {
      console.error('Error setting property:', e);
      response.status(e.code || 500).send(e.message);
    }
  });

  /**
   * Use an ActionsController to handle each thing's actions.
   */
  controller.use(`/:thingId${Constants.ACTIONS_PATH}`, ActionsController());

  /**
   * Use an EventsController to handle each thing's events.
   */
  controller.use(`/:thingId${Constants.EVENTS_PATH}`, EventsController());

  /**
   * Modify a Thing's floorplan position or layout index.
   */
  controller.patch('/:thingId', async (request, response) => {
    const thingId = request.params.thingId;
    if (!request.body) {
      response.status(400).send('request body missing');
      return;
    }

    let thing;
    try {
      thing = await Things.getThing(thingId);
    } catch (e) {
      response.status(404).send('thing not found');
      return;
    }

    let description;
    try {
      if (request.body.hasOwnProperty('floorplanX') && request.body.hasOwnProperty('floorplanY')) {
        description = await thing.setCoordinates(request.body.floorplanX, request.body.floorplanY);
      } else if (request.body.hasOwnProperty('layoutIndex')) {
        description = await thing.setLayoutIndex(request.body.layoutIndex);
      } else {
        response.status(400).send('request body missing required parameters');
        return;
      }

      response.status(200).json(description);
    } catch (e) {
      response.status(500).send(`Failed to update thing ${thingId}: ${e}`);
    }
  });

  /**
   * Modify a Thing.
   */
  controller.put('/:thingId', async (request, response) => {
    const thingId = request.params.thingId;
    if (!request.body || !request.body.hasOwnProperty('title')) {
      response.status(400).send('title parameter required');
      return;
    }

    const title = request.body.title.trim();
    if (title.length === 0) {
      response.status(400).send('Invalid title');
      return;
    }

    let thing;
    try {
      thing = await Things.getThing(thingId);
    } catch (e) {
      response.status(500).send(`Failed to retrieve thing ${thingId}: ${e}`);
      return;
    }

    if (request.body.selectedCapability) {
      try {
        await thing.setSelectedCapability(request.body.selectedCapability);
      } catch (e) {
        response.status(500).send(`Failed to update thing ${thingId}: ${e}`);
        return;
      }
    }

    if (request.body.iconData) {
      try {
        await thing.setIcon(request.body.iconData, true);
      } catch (e) {
        response.status(500).send(`Failed to update thing ${thingId}: ${e}`);
        return;
      }
    }

    let description;
    try {
      description = await thing.setTitle(title);
    } catch (e) {
      response.status(500).send(`Failed to update thing ${thingId}: ${e}`);
      return;
    }

    response.status(200).json(description);
  });

  /**
   * Remove a Thing.
   */
  controller.delete('/:thingId', (request, response) => {
    const thingId = request.params.thingId;

    const _finally = (): void => {
      Things.removeThing(thingId)
        .then(() => {
          console.log(`Successfully deleted ${thingId} from database.`);
          response.sendStatus(204);
        })
        .catch((e: unknown) => {
          response.status(500).send(`Failed to remove thing ${thingId}: ${e}`);
        });
    };

    AddonManager.removeThing(thingId).then(_finally, _finally);
  });

  function websocketHandler(websocket: WebSocket, request: express.Request): void {
    // Since the Gateway have the asynchronous express middlewares, there is a
    // possibility that the WebSocket have been closed.
    if (websocket.readyState !== WebSocket.OPEN) {
      return;
    }

    const thingId = request.params.thingId;
    const subscribedEventNames: Record<string, boolean> = {};

    function sendMessage(message: OutgoingMessage): void {
      websocket.send(JSON.stringify(message), (err) => {
        if (err) {
          console.error(`WebSocket sendMessage failed: ${err}`);
        }
      });
    }

    function onPropertyChanged(property: Property<PropertyValue>): void {
      if (typeof thingId !== 'undefined' && property.getDevice().getId() !== thingId) {
        return;
      }

      property.getValue().then((value) => {
        sendMessage({
          id: property.getDevice().getId(),
          messageType: Constants.PROPERTY_STATUS,
          data: {
            [property.getName()]: value,
          },
        });
      });
    }

    function onActionStatus(action: Action): void {
      if (
        action.hasOwnProperty('thingId') &&
        action.getThingId() !== null &&
        action.getThingId() !== thingId
      ) {
        return;
      }

      const message: ActionStatusMessage = {
        messageType: Constants.ACTION_STATUS,
        data: {
          [action.getName()]: action.getDescription(),
        },
      };

      if (action.getThingId() !== null) {
        message.id = action.getThingId()!;
      }

      sendMessage(message);
    }

    function onEvent(event: Event): void {
      if (typeof thingId !== 'undefined' && event.getThingId() !== thingId) {
        return;
      }

      if (!subscribedEventNames[event.getName()]) {
        return;
      }

      sendMessage({
        id: event.getThingId(),
        messageType: Constants.EVENT,
        data: {
          [event.getName()]: event.getDescription(),
        },
      });
    }

    let thingCleanups: Record<string, () => void> = {};
    function addThing(thing: Thing): void {
      thing.addEventSubscription(onEvent);

      function onConnected(connected: boolean): void {
        sendMessage({
          id: thing.getId(),
          messageType: Constants.CONNECTED,
          data: connected,
        });
      }
      thing.addConnectedSubscription(onConnected);

      const onRemoved = (): void => {
        if (thingCleanups[thing.getId()]) {
          thingCleanups[thing.getId()]();
          delete thingCleanups[thing.getId()];
        }

        if (
          typeof thingId !== 'undefined' &&
          (websocket.readyState === WebSocket.OPEN || websocket.readyState === WebSocket.CONNECTING)
        ) {
          websocket.close();
        } else {
          sendMessage({
            id: thing.getId(),
            messageType: Constants.THING_REMOVED,
            data: {},
          });
        }
      };
      thing.addRemovedSubscription(onRemoved);

      const onModified = (): void => {
        sendMessage({
          id: thing.getId(),
          messageType: Constants.THING_MODIFIED,
          data: {},
        });
      };
      thing.addModifiedSubscription(onModified);

      const thingCleanup = (): void => {
        thing.removeEventSubscription(onEvent);
        thing.removeConnectedSubscription(onConnected);
        thing.removeRemovedSubscription(onRemoved);
        thing.removeModifiedSubscription(onModified);
      };
      thingCleanups[thing.getId()] = thingCleanup;

      // send initial property values
      for (const name in thing.getProperties()) {
        AddonManager.getProperty(thing.getId(), name)
          .then((value) => {
            sendMessage({
              id: thing.getId(),
              messageType: Constants.PROPERTY_STATUS,
              data: {
                [name]: value,
              },
            });
          })
          .catch((e: unknown) => {
            console.error(`Failed to get property ${name}:`, e);
          });
      }
    }

    function onThingAdded(thing: Thing): void {
      sendMessage({
        id: thing.getId(),
        messageType: Constants.THING_ADDED,
        data: {},
      });

      addThing(thing);
    }

    if (typeof thingId !== 'undefined') {
      Things.getThing(thingId)
        .then((thing) => {
          addThing(thing);
        })
        .catch(() => {
          console.error('WebSocket opened on nonexistent thing', thingId);
          sendMessage({
            messageType: Constants.ERROR,
            data: {
              code: 404,
              status: '404 Not Found',
              message: `Thing ${thingId} not found`,
            },
          });
          websocket.close();
        });
    } else {
      Things.getThings().then((things: Map<string, Thing>) => {
        things.forEach(addThing);
      });
      Things.on(Constants.THING_ADDED, onThingAdded);
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

    const cleanup = (): void => {
      Things.removeListener(Constants.THING_ADDED, onThingAdded);
      AddonManager.removeListener(Constants.PROPERTY_CHANGED, onPropertyChanged);
      Actions.removeListener(Constants.ACTION_STATUS, onActionStatus);
      for (const id in thingCleanups) {
        thingCleanups[id]();
      }
      thingCleanups = {};
      clearInterval(heartbeatInterval);
    };

    websocket.on('error', cleanup);
    websocket.on('close', cleanup);

    websocket.on('message', (requestText: string) => {
      let request: IncomingMessage;
      try {
        request = JSON.parse(requestText);
      } catch (e) {
        sendMessage({
          messageType: Constants.ERROR,
          data: {
            code: 400,
            status: '400 Bad Request',
            message: 'Parsing request failed',
          },
        });
        return;
      }

      const id = request.id || thingId;
      if (typeof id === 'undefined') {
        sendMessage({
          messageType: Constants.ERROR,
          data: {
            code: 400,
            status: '400 Bad Request',
            message: 'Missing thing id',
            request,
          },
        });
        return;
      }

      const device = AddonManager.getDevice(<string>id);
      if (!device) {
        sendMessage({
          messageType: Constants.ERROR,
          data: {
            code: 400,
            status: '400 Bad Request',
            message: `Thing ${id} not found`,
            request,
          },
        });
        return;
      }

      switch (request.messageType) {
        case Constants.SET_PROPERTY: {
          const setRequests = Object.keys((<SetPropertyMessage>request).data).map((property) => {
            const value = (<SetPropertyMessage>request).data[property];
            return device.setProperty(property, value);
          });
          Promise.all(setRequests).catch((err) => {
            // If any set fails, send an error
            sendMessage({
              messageType: Constants.ERROR,
              data: {
                code: 400,
                status: '400 Bad Request',
                message: err,
                request,
              },
            });
          });
          break;
        }

        case Constants.ADD_EVENT_SUBSCRIPTION: {
          for (const eventName in (<AddEventSubscriptionMessage>request).data) {
            subscribedEventNames[eventName] = true;
          }
          break;
        }

        case Constants.REQUEST_ACTION: {
          for (const actionName in (<RequestActionMessage>request).data) {
            const actionParams = (<RequestActionMessage>request).data[actionName].input;
            Things.getThing(<string>id)
              .then((thing) => {
                const action = new Action(actionName, actionParams, thing);
                return Actions.add(action).then(() => {
                  return AddonManager.requestAction(
                    <string>id,
                    action.getId(),
                    actionName,
                    actionParams ?? null
                  );
                });
              })
              .catch((err: Error) => {
                sendMessage({
                  messageType: Constants.ERROR,
                  data: {
                    code: 400,
                    status: '400 Bad Request',
                    message: err.message,
                    request,
                  },
                });
              });
          }
          break;
        }

        default: {
          sendMessage({
            messageType: Constants.ERROR,
            data: {
              code: 400,
              status: '400 Bad Request',
              message: `Unknown messageType: ${(<IncomingMessage>request).messageType}`,
              request,
            },
          });
          break;
        }
      }
    });
  }

  return controller;
}

export default build;
