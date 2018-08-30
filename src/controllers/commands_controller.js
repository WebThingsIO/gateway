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
 * Parses the intent for a text sentence and sends to the intent parser to
 * determine intent. Then executes the intent as an action on the thing API.
 */
CommandsController.post('/', async (request, response) => {
  if (!request.body || !request.body.hasOwnProperty('text')) {
    response.status(400).json({
      message: 'Text element not defined',
    });
    return;
  }

  let names = await Things.getThingNames();
  names = names.map((n) => n.toLowerCase());

  const internalError = () => {
    response.status(400).json({
      message: 'Sorry, something went wrong.',
    });
  };

  const thingNotFound = () => {
    response.status(400).json({
      message: 'Sorry, that thing wasn\'t found.',
    });
  };

  const invalidForDevice = () => {
    response.status(400).json({
      message: 'Sorry, I\'m afraid I can\'t do that.',
    });
  };

  const invalidCommand = () => {
    response.status(400).json({
      message: 'Sorry, I didn\'t understand that.',
    });
  };

  const failedToSet = () => {
    response.status(400).json({
      message: 'Sorry, that didn\'t work.',
    });
  };

  try {
    await IntentParser.train(names);
  } catch (e) {
    console.log('Error training:', e);
    internalError();
    return;
  }

  let payload;
  try {
    payload = await IntentParser.query(request.body.text);
  } catch (e) {
    console.log('Error parsing intent:', e);
    invalidCommand();
    return;
  }

  const name = payload.thing;
  const thing = await Things.getThingByName(name);

  if (!thing) {
    thingNotFound();
    return;
  }

  let propertyName, value;

  const properties = {
    on: CommandUtils.findProperty(thing, 'OnOffProperty', 'on'),
    color: CommandUtils.findProperty(thing, 'ColorProperty', 'color'),
    colorTemperature: CommandUtils.findProperty(thing,
                                                'ColorTemperatureProperty',
                                                'colorTemperature'),
    level: CommandUtils.findProperty(thing, 'LevelProperty', 'level'),
    brightness: CommandUtils.findProperty(thing,
                                          'BrightnessProperty',
                                          'level'),
  };

  if (['on', 'off'].includes(payload.value)) {
    if (!properties.on) {
      invalidForDevice();
      return;
    }

    propertyName = properties.on;
    value = payload.value === 'on';
  } else if (['warmer', 'cooler'].includes(payload.value)) {
    if (!properties.colorTemperature) {
      invalidForDevice();
      return;
    }

    propertyName = properties.colorTemperature;

    let current;
    try {
      current = await AddonManager.getProperty(thing.id, propertyName);
    } catch (e) {
      failedToSet();
      return;
    }

    value = payload.value === 'warmer' ? current - 100 : current + 100;
  } else if (['dim', 'brighten'].includes(payload.keyword) ||
             CommandUtils.percentages.hasOwnProperty(payload.value)) {
    if (!properties.brightness) {
      invalidForDevice();
      return;
    }

    propertyName = properties.brightness;

    const percent =
      payload.value ? CommandUtils.percentages[payload.value] : 10;

    if (payload.keyword === 'set') {
      value = percent;
    } else if (payload.keyword === 'dim' || payload.keyword === 'brighten') {
      let current;
      try {
        current = await AddonManager.getProperty(thing.id, propertyName);
      } catch (e) {
        failedToSet();
        return;
      }

      if (payload.keyword === 'dim') {
        value = current - percent;
      } else {
        value = current + percent;
      }
    }
  } else if (CommandUtils.colors.hasOwnProperty(payload.value)) {
    if (!properties.color) {
      invalidForDevice();
      return;
    }

    propertyName = properties.color;
    value = CommandUtils.colors[payload.value];
  } else {
    invalidCommand();
    return;
  }

  try {
    await AddonManager.setProperty(thing.id, propertyName, value);
  } catch (e) {
    failedToSet();
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
});

module.exports = CommandsController;
