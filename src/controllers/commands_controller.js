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
const uuidv4 =  require('uuid/v4');
const CommandsController = express.Router();

const aiUrl = 'https://api.api.ai/api/query';
const aiOptions = {
  method: 'POST',
  body: '',
  headers: {
    'Authorization': 'Bearer af2bccd942c24fd68622efc6b4c8526c',
    'Content-Type': 'application/json'
  }
};

const thingsOptions = {
  body: '',
  method: 'GET',
  headers: {
    'Authorization': '',
    'Accept': 'application/json'
  }
};

const iotOptions = {
  method: 'PUT',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: ''
};

/**
 * Local Variables for the Gateway Href and the Web Token since the
 * CommandsController will be posting to itself.
 */
CommandsController.gatewayRef = '';
CommandsController.jwt = '';

/**
 * Called by the app.js to configure the auth header and the address of the GW
 *  since the CommandsController will be posting to itself.
 */
CommandsController.configure =  function(gatewayHref, jwt) {
  CommandsController.gatewayHref = gatewayHref;
  CommandsController.jwt = jwt;
};

/**
 * Helper function for converting fetch results to text
 */
function toText(res) {
  return res.text();
}

/**
 * Parses the intent for a text sentence and sends to the API.ai intent
 * parser to determine intent.  Then executes the intent as an action on the
 * thing API.
 */
CommandsController.post('/', function (request, response) {

  if(!request.body || request.body.text === undefined) {
    response.status(400).send(JSON.stringify(
      {'message': 'Text element not defined'}));
    return;
  }

  aiOptions.body = JSON.stringify(getAiBody(request.body.text));
  fetch(aiUrl, aiOptions).then(toText)
    .then(function(aiBody) {
      var payload = parseAIBody(aiBody);
      if (payload.cmd == 'IOT') {
        const thingsUrl = CommandsController.gatewayHref +
          Constants.THINGS_PATH;
        thingsOptions.headers.Authorization = 'Bearer ' +
          CommandsController.jwt;

        fetch(thingsUrl, thingsOptions).then(toText)
          .then(function(thingBody) {
            let jsonBody = JSON.parse(thingBody);
            let match = payload.param.toUpperCase();
            let thingfound = false; 
            for (var i = 0; i < jsonBody.length; i++) {
              var obj = jsonBody[i];
              let name = obj.name.toUpperCase();
              if (name == match) {
                thingfound = true;
                break;
              }
            }
            if (thingfound) {
              if ((payload.param3 != null) && 
                (payload.param3 != ''  && obj.properties.hue != '')) {
                var colorname_to_hue = {red:0, orange:8500, yellow:17000, 
                  green:25500, white:34000, blue:46920, purple:48000, 
                  magenta:54000, pink:60000};
                if (!colorname_to_hue[payload.param3]) {
                  response.status(404).json({'message': 'Hue color not found'});
                  return;
                } else {
                  iotOptions.body = JSON.stringify({'hue':
                   colorname_to_hue[payload.param3]}); 
                  payload.href = obj.properties.hue.href; 
                }
              } else if (payload.param2 == 'on' || payload.param2 == 'off') {
                iotOptions.body = JSON.stringify({'on': 
                (payload.param2 == 'on') ? true : false});
                payload.href = obj.properties.on.href;
              } else {
                response.status(404).json({'message': 'Command not found'});
                return;
              }
              const iotUrl = CommandsController.gatewayHref + payload.href;
              iotOptions.headers.Authorization = 
                'Bearer ' + CommandsController.jwt;
              // Returning 201 to signify that the command was mapped to an
              // intent and matched a 'thing' in our list.  Return a response to
              // caller with this status before the command finishes execution
              // as the execution can take some time (e.g. blinds)
              response.status(201).json({'message': 'Command Created'});
              fetch(iotUrl, iotOptions)
                .then(function() {
                  // In the future we may want to use WS to give a status of
                  // the disposition of the command execution..
                })
                .catch(function(err) {
                  // Future, give status via WS.
                  console.log('catch inside PUT:' + err);
                });
            } else {
              response.status(404).json({'message': 'Thing not found'});
            }
          })
          .catch(function(err) {
            console.log('error catch:' + err);
          });
      } else {
        response.status(406).json({'message': 'Unable to understand command'});
      }
    })
    .catch(function(err) {
      response.json('error: ' + err);
    });
});

/**
 * Formats the body for the request to API.ai and returns the String
 */
function getAiBody(text) {
  let body = {
    'v':'20150910',
    'query': '',
    'lang':'en',
    'sessionId': uuidv4()
  };
  body.query = text;
  return body;
}

/**
 * Parses the Response returned by the API.ai and returns a JSON object that
 * describes the command (in this case iot), the param (room), and the param2
 * (on/off).
 */
function parseAIBody(aiBody) {
  let jsonBody = JSON.parse(aiBody);
  var payload = {
    cmd: 'none',
    param: 'none',
    param2: 'none',
    param3: 'none',
    href: ''
  };
  //Determine the action from the API.AI intent parser
  switch (jsonBody.result.action) {
    case 'iot':
      payload.cmd = 'IOT';
      payload.param = jsonBody.result.parameters.rooms;
      payload.param2 = jsonBody.result.parameters.onoff;
      payload.param3 = jsonBody.result.parameters.color;
      break;
    case 'input.unknown':
      console.log('unable to parse the intent');
      break;
    default:
      console.log('No match');
      break;
  }
  return payload;
}

module.exports = CommandsController;
