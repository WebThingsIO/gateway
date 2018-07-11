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

const PromiseRouter = require('express-promise-router');
const AddonManager = require('../addon-manager');
const CommandUtils = require('../command-utils');
const IntentParser = require('../models/intentparser');
const Things = require('../models/things');

const CommandsController = PromiseRouter();

/**
 * Parses the intent for a text sentence and sends to the API.ai intent
 * parser to determine intent.  Then executes the intent as an action on the
 * thing API.
 */
CommandsController.post('/', async (request, response) => {
  if (!request.body || !request.body.hasOwnProperty('text')) {
    response.status(400).send(JSON.stringify(
      {message: 'Text element not defined'}));
    return;
  }

  let names = await Things.getThingNames();
  names = names.map((n) => n.toLowerCase());

  try {
    await IntentParser.train(names);
  } catch (e) {
    console.log('Error training:', e);
    response.status(400).json({message: 'Internal error determining intent'});
    return;
  }

  let payload;
  try {
    payload = await IntentParser.query(request.body.text);
  } catch (e) {
    console.log('Error parsing intent:', e);
    response.status(400).json({message: 'Internal error determining intent'});
    return;
  }

  const name = payload.thing;
  const thing = await Things.getThingByName(name);

  if (thing) {
    let propertyName, value;

    if (payload.value === 'on' || payload.value === 'off') {
      propertyName = 'on';
      value = payload.value === 'on';
    } else if ((payload.value === 'warmer' ||
                payload.value === 'cooler') &&
               thing.properties.colorTemperature) {
      let current;
      try {
        current = await AddonManager.getProperty(thing.id, 'colorTemperature');
      } catch (e) {
        response.status(400).json({message: 'Failed to set property'});
        return;
      }

      propertyName = 'colorTemperature';
      value = payload.value === 'warmer' ? current - 100 : current + 100;
    } else if (((payload.keyword === 'dim' || payload.keyword === 'brighten') ||
                CommandUtils.percentages.hasOwnProperty(payload.value)) &&
               thing.properties.level) {
      propertyName = 'level';

      const percent =
        payload.value ? CommandUtils.percentages[payload.value] : 10;

      if (payload.keyword === 'set') {
        value = percent;
      } else if (payload.keyword === 'dim' || payload.keyword === 'brighten') {
        let current;
        try {
          current = await AddonManager.getProperty(thing.id, 'level');
        } catch (e) {
          response.status(400).json({message: 'Failed to set property'});
          return;
        }

        if (payload.keyword === 'dim') {
          value = current - percent;
        } else {
          value = current + percent;
        }
      }
    } else if (CommandUtils.colors.hasOwnProperty(payload.value) &&
               thing.properties.color) {
      propertyName = 'color';
      value = CommandUtils.colors[payload.value];
    } else {
      response.status(400).json({message: 'Command not found'});
      return;
    }

    try {
      await AddonManager.setProperty(thing.id, propertyName, value);
    } catch (e) {
      response.status(400).json({message: 'Failed to set property'});
      return;
    }

    // Returning 201 to signify that the command was mapped to an
    // intent and matched a 'thing' in our list. Return a response to
    // caller with this status before the command finishes execution
    // as the execution can take some time (e.g. blinds)
    response.status(201).json({
      message: 'Command Created',
      payload: payload,
    });
  } else {
    response.status(400).json({message: 'Thing not found'});
  }
});

module.exports = CommandsController;
