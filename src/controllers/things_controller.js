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

const express = require('express');
const Action = require('../models/action');
const Actions = require('../models/actions');
const ActionsController = require('./actions_controller');
const AddonManager = require('../addon-manager');
const Constants = require('../constants.js');
const Things = require('../models/things');

const ThingsController = express.Router();

/**
 * Get a list of Things.
 */
ThingsController.get('/', function (request, response) {
  Things.getThingDescriptions().then(function(things) {
    response.status(200).json(things);
  });
});

/**
 * Handle creating a new thing.
 */
ThingsController.post('/', function (request, response) {
  if (!request.body || !request.body.id) {
    response.status(400).send('No id in thing description');
    return;
  }
  var description = request.body;
  var id = description.id;
  delete description.id;
  Things.createThing(id, description).then(function(thing) {
    console.log('Successfully created new thing ' + thing.name);
    response.status(201).send(thing);
  }).catch(function(error) {
    console.error('Error saving new thing', id, description);
    console.error(error);
    response.status(500).send(error);
  });
});

/**
 * Get a Thing.
 */
 ThingsController.get('/:thingId', function(request, response) {
   var id = request.params.thingId;
   Things.getThingDescription(id).then(function(thing) {
     response.status(200).json(thing);
   }).catch(function(error) {
     console.error('Error getting thing description for thing with id ' + id);
     console.error('Error: ' + error);
     response.status(404).send(error);
   });
 });

/**
 * Get a property of a Thing.
 */
ThingsController.get('/:thingId/properties/:propertyName',
  function(request, response) {
  var thingId = request.params.thingId;
  var propertyName = request.params.propertyName;
  AddonManager.getProperty(thingId, propertyName).then((value) => {
    var result = {};
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
ThingsController.put('/:thingId/properties/:propertyName',
  function(request, response) {
  var thingId = request.params.thingId;
  var propertyName = request.params.propertyName;
  if(!request.body || request.body[propertyName] === undefined) {
    response.status(400).send('Invalid property name');
    return;
  }
  var value = request.body[propertyName];
  AddonManager.setProperty(thingId, propertyName, value)
    .then((updatedValue) => {
      // Note: it's possible that updatedValue doesn't match value.
      var result = {};
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
 * Use an ActionsController to handle each thing's
 * actions
 */
ThingsController.use('/:thingId' + Constants.ACTIONS_PATH, ActionsController);

/**
 * Modify a Thing.
 */
ThingsController.patch('/:thingId', function(request, response) {
  var thingId = request.params.thingId;
  if(!request.body ||
    !request.body['floorplanX'] || !request.body['floorplanY']) {
    response.status(400).send('x and y properties needed to position Thing');
    return;
  }
  Things.getThing(thingId).then((thing) => {
    // return
    return thing.setCoordinates(
      request.body['floorplanX'], request.body['floorplanY']);
  }).then((description) => {
    response.status(200).json(description);
  }).catch(function(e) {
    response.status(500).send('Failed to update thing ' + thingId + ' ' + e);
  });

});

/**
 * Remove a Thing.
 */
ThingsController.delete('/:thingId', function(request, response) {
  var thingId = request.params.thingId;
  try {
    Things.removeThing(thingId).then(function() {
      console.log('Successfully deleted ' + thingId + ' from database.');
      response.status(204).send();
    });
  } catch(e) {
    response.status(500).send('Failed to remove thing ' + thingId);
  }
});

/**
 * Connect to receive messages from a Thing
 */
ThingsController.ws('/:thingId/', function(websocket, request) {
  let thingId = request.params.thingId;
  let subscribedEventNames = {};

  Things.getThing(thingId).then(function(thing) {
    thing.registerWebsocket(websocket);
    thing.addEventSubscription(onEvent);

    websocket.on('close', function() {
      thing.removeEventSubscription(onEvent);
    });
  }).catch(function() {
    console.error('WebSocket opened on nonexistent thing', thingId);
    websocket.send(JSON.stringify({
      messageType: Constants.ERROR,
      data: {
        status: '404 Not Found',
        message: 'Thing ' + thingId + ' not found',
      }
    }));
    websocket.close();
  });

  function onPropertyChanged(property) {
    if (property.device.id !== thingId) {
      return;
    }
    websocket.send(JSON.stringify({
      messageType: Constants.PROPERTY_STATUS,
      data: {
        [property.name]: property.value
      }
    }));
  }

  function onActionStatus(action) {
    websocket.send(JSON.stringify({
      messageType: Constants.ACTION_STATUS,
      data: action.getDescription()
    }));
  }

  function onEvent(event) {
    if (!subscribedEventNames[event.name]) {
      return;
    }

    websocket.send(JSON.stringify({
      messageType: Constants.EVENT,
      data: event.getDescription()
    }));
  }

  AddonManager.on(Constants.PROPERTY_CHANGED, onPropertyChanged);
  Actions.on(Constants.ACTION_STATUS, onActionStatus);

  websocket.on('error', function() {
    AddonManager.removeListener(Constants.PROPERTY_CHANGED, onPropertyChanged);
    Actions.removeListener(Constants.ACTION_STATUS, onActionStatus);
  });

  websocket.on('close', function() {
    AddonManager.removeListener(Constants.PROPERTY_CHANGED, onPropertyChanged);
    Actions.removeListener(Constants.ACTION_STATUS, onActionStatus);
  });

  websocket.on('message', function(requestText) {
    let request = null;
    try {
      request = JSON.parse(requestText);
    } catch(e) {
      websocket.send(JSON.stringify({
        messageType: Constants.ERROR,
        data: {
          status: '400 Bad Request',
          message: 'Parsing request failed',
        }
      }));
      return;
    }

    let device = AddonManager.getDevice(thingId);
    if (!device) {
      websocket.send(JSON.stringify({
        messageType: Constants.ERROR,
        data: {
          status: '400 Bad Request',
          message: `Thing ${thingId} not found`,
          request: request
        }
      }));
      return;
    }

    switch (request.messageType) {
      case Constants.SET_PROPERTY: {
        let setRequests = Object.keys(request.data).map(property => {
          let value = request.data[property];
          return device.setProperty(property, value);
        });
        Promise.all(setRequests).catch(err => {
          // If any set fails, send an error
          websocket.send(JSON.stringify({
            messageType: Constants.ERROR,
            data: {
              status: '400 Bad Request',
              message: err,
              request: request
            }
          }));
        });
        break;
      }

      case Constants.ADD_EVENT_SUBSCRIPTION: {
        subscribedEventNames[request.data.name] = true;
        break;
      }

      case Constants.REQUEST_ACTION: {
        Things.getThing(thingId).then(thing => {
          let action = new Action(request.data.name,
                                  request.data.parameters, thing);

          return Actions.add(action);
        }).catch(err => {
          websocket.send(JSON.stringify({
            messageType: Constants.ERROR,
            data: {
              status: '400 Bad Request',
              message: err.message,
              request: request
            }
          }));
        });
        break;
      }

      default: {
        websocket.send(JSON.stringify({
          messageType: Constants.ERROR,
          data: {
            status: '400 Bad Request',
            message: `Unknown messageType: ${request.messageType}`,
            request: request
          }
        }));
        break;
      }
    }
  });
});

module.exports = ThingsController;
