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
 *  When was <tag> last <boolean>
 *  Is <tag> <boolean>
 *  Is <tag> not <boolean>
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

function internalError(response) {
  response.status(400).json({
    message: 'Sorry, something went wrong.',
  });
}

function thingNotFound(response, name) {
  response.status(400).json({
    message: `Sorry, I couldn't find ${name}.`,
  });
}

function invalidForDevice(response) {
  response.status(400).json({
    message: 'Sorry, I\'m afraid I can\'t do that.',
  });
}

function propertyNotFound(response, thing, property) {
  response.status(400).json({
    message: `Sorry, that thing has no property named ${property}.`,
  });
}

function invalidCommand(response) {
  response.status(400).json({
    message: 'Sorry, I didn\'t understand that.',
  });
}

function failedToSet(response) {
  response.status(400).json({
    message: 'Sorry, that didn\'t work.',
  });
}

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

  let titles = await Things.getThingTitles();
  titles = titles.concat(Object.keys(CommandUtils.plurals));
  titles = titles.map((t) => t.toLowerCase());

  try {
    await IntentParser.train(titles);
  } catch (e) {
    console.log('Error training:', e);
    internalError(response);
    return;
  }

  let payload;
  try {
    payload = await IntentParser.query(request.body.text);
  } catch (e) {
    console.log('Error parsing intent:', e);
    invalidCommand(response);
    return;
  }

  const title = payload.thing;
  const thing = await Things.getThingByTitle(title);

  if (!thing) {
    thingNotFound(response, name);
    return;
  }

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

  for (const name in CommandUtils.booleans) {
    const bool = CommandUtils.booleans[name];
    if (!bool.hasOwnProperty('value') || !bool['@type']) {
      continue;
    }
    if (!properties[name]) {
      properties[name] = CommandUtils.findProperty(thing, bool['@type'], name);
    }
  }

  if (IntentParser.keywordsSet.includes(payload.keyword)) {
    await handleSet(payload, thing, properties, response);
  } else if (IntentParser.keywordsGet.includes(payload.keyword)) {
    await handleGet(payload, thing, properties, response);
  } else {
    invalidCommand(response);
  }
});

async function handleSet(payload, thing, properties, response) {
  let propertyName, value;

  if (['on', 'off'].includes(payload.value)) {
    if (!properties.on) {
      invalidForDevice(response);
      return;
    }

    propertyName = properties.on;
    value = payload.value === 'on';
  } else if (['warmer', 'cooler'].includes(payload.value)) {
    if (!properties.colorTemperature) {
      invalidForDevice(response);
      return;
    }

    propertyName = properties.colorTemperature;

    let current;
    try {
      current = await AddonManager.getProperty(thing.id, propertyName);
    } catch (e) {
      failedToSet(response);
      return;
    }

    value = payload.value === 'warmer' ? current - 100 : current + 100;
  } else if (['dim', 'brighten'].includes(payload.keyword) ||
             CommandUtils.percentages.hasOwnProperty(payload.value)) {
    if (!properties.brightness) {
      invalidForDevice(response);
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
        failedToSet(response);
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
      invalidForDevice(response);
      return;
    }

    propertyName = properties.color;
    value = CommandUtils.colors[payload.value];
  } else {
    invalidCommand(response);
    return;
  }

  try {
    await AddonManager.setProperty(thing.id, propertyName, value);
  } catch (e) {
    failedToSet(response);
    return;
  }

  // Returning 201 to signify that the command was mapped to an
  // intent and matched a 'thing' in our list. Return a response to
  // caller with this status before the command finishes execution
  // as the execution can take some time (e.g. blinds)
  response.status(201).json({
    payload: payload,
  });
}

async function handleGet(payload, thing, properties, response) {
  if (CommandUtils.booleans[payload.value]) {
    const bool = CommandUtils.booleans[payload.value];

    let prop = properties[payload.value];
    let negated = false;
    if (!prop && !bool.value) {
      prop = properties[bool.negation];
      negated = true;
    }

    if (!prop) {
      propertyNotFound(response, payload.thing, payload.value);
      return;
    }

    let value = await AddonManager.getProperty(thing.id, prop);
    if (negated) {
      value = !value;
    }

    const valueStr = value ? payload.value : bool.negation;
    const verb = bool.verb || 'is';
    const answer = value ? 'Yes' : 'No';
    response.status(201).json({
      message: `${answer}, the ${payload.thing} ${verb} ${valueStr}.`,
      payload: payload,
    });
    return;
  }
  response.status(400).json({
    message: `Sorry, that thing's property ${payload.value} is currently unsupported`,
  });
}

module.exports = CommandsController;
