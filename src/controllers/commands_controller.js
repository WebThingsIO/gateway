/**
 * Commands Controller.
 *
 * Manages HTTP requests to /commands.
 *
 * Grammar that the parser understands:
 *  Turn the <tag> light <on|off>
 *  Turn <tag> <on|off>
 *  Shut <tag> <on|off>
 *  Shut the <tag> light <on|off>
 *
 * <tag> must match the .name property of one of the /things objects
 *  in order for the command to be executed.
 *
 * Sample curl command to test from the command line:
 * curl -H 'Authorization:Bearer '<JSONWebToken>'
 *        -H "Content-Type: application/json"
 *        -H "Accept: application/json"
 *        -d '{"text":"turn the kitchen light on"}'
 *        https://localhost:4443/commands
 *        -k
 *
 * HTTP Response Codes        Status message
 *              201           Command Created
 *              400           Text element not defined
 *              404           Thing Not Found
 *              406           Unable to understand command
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const express = require('express');
const fetch = require('node-fetch');
const Constants = require('../constants.js');
const CommandsController = express.Router();
const IntentParser = require('../models/intentparser');

const thingsOptions = {
  method: 'GET',
  headers: {
    Authorization: '',
    Accept: 'application/json',
  },
};

const iotOptions = {
  method: 'PUT',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: '',
};

/**
 * Local Variables for the Gateway Href and the Web Token since the
 * CommandsController will be posting to itself.
 */
CommandsController.gatewayHref = '';

/**
 * Called by the app.js to configure the auth header and the address of the GW
 *  and the python interface since the CommandsController
 *  will be posting to itself.
 */
CommandsController.configure = function(gatewayHref) {
  CommandsController.gatewayHref = gatewayHref;
};

/**
 * Helper function for converting fetch results to text
 */
function toText(res) {
  if (!res.ok) {
    throw new Error(`${res.status}: ${res.statusText}`);
  }
  return res.text();
}

/**
 * Parses the intent for a text sentence and sends to the API.ai intent
 * parser to determine intent.  Then executes the intent as an action on the
 * thing API.
 */
CommandsController.post('/', function(request, response) {
  if (!request.body || !request.body.hasOwnProperty('text')) {
    response.status(400).send(JSON.stringify(
      {message: 'Text element not defined'}));
    return;
  }

  const thingsUrl = CommandsController.gatewayHref +
  Constants.THINGS_PATH;
  thingsOptions.headers.Authorization = `Bearer ${
    request.jwt}`;

  fetch(thingsUrl, thingsOptions).then(toText)
    .then(function(thingBody) {
      const jsonBody = JSON.parse(thingBody);
      IntentParser.train(jsonBody).then(() => {
        IntentParser.query(request.body.text).then((payload) => {
          const match = payload.param.toUpperCase();
          let thingfound = false;
          let obj;
          for (let i = 0; i < jsonBody.length; i++) {
            obj = jsonBody[i];
            const name = obj.name.toUpperCase();
            if (name == match) {
              thingfound = true;
              break;
            }
          }
          if (thingfound) {
            if (payload.param2 == 'on' || payload.param2 == 'off') {
              iotOptions.body = JSON.stringify({on:
              (payload.param2 == 'on') ? true : false});
              payload.href = obj.properties.on.href;
            } else if ((payload.param3 != null) &&
              (payload.param3 != '' && obj.properties.color != '')) {
              const colorname_to_hue = {
                red: '#FF0000',
                orange: '#FFB300',
                yellow: '#FFF700',
                green: '#47f837',
                white: '#FCFBEA',
                blue: '#1100FF',
                purple: '#971AC4',
                magenta: '#75009F',
                pink: '#FFC0CB',
              };
              if (!colorname_to_hue[payload.param3]) {
                response.status(404).json({message: 'Hue color not found'});
                return;
              } else {
                iotOptions.body = JSON.stringify({color:
                 colorname_to_hue[payload.param3]});
                payload.href = obj.properties.color.href;
              }
            } else {
              response.status(404).json({message: 'Command not found'});
              return;
            }
            const iotUrl = CommandsController.gatewayHref + payload.href;
            iotOptions.headers.Authorization =
              `Bearer ${request.jwt}`;
            // Returning 201 to signify that the command was mapped to an
            // intent and matched a 'thing' in our list.  Return a response to
            // caller with this status before the command finishes execution
            // as the execution can take some time (e.g. blinds)
            response.status(201).json({message: 'Command Created'});
            fetch(iotUrl, iotOptions)
              .then(function() {
                // In the future we may want to use WS to give a status of
                // the disposition of the command execution..
              })
              .catch(function(err) {
                // Future, give status via WS.
                console.log(`catch inside PUT:${err}`);
              });
          } else {
            response.status(404).json({message: 'Thing not found'});
          }
        }).catch(function(error) {
          console.log('Error parsing intent:', error);
          response.status(404).json({message:
            'Internal error determining intent'});
        });
      }).catch(function(error) {
        console.log('Error parsing intent:', error);
        response.status(404).json({message:
          'Internal error determining intent'});
      });
    }).catch(function(err) {
      console.log(`error catch:${err}`);
      response.status(500).send({
        message: err,
      });
    });
});

module.exports = CommandsController;
