/**
 * Intent Parser Model
 *
 * Interface to the intent parser.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const CommandUtils = require('../command-utils');
const net = require('net');
const IntentParser = {

  keyword: [
    'turn',
    'switch',
    'make',
    'change',
    'set',
    'dim',
    'brighten',
  ].join(','),

  type: Object.keys(CommandUtils.colors).
    concat(Object.keys(CommandUtils.percentages)).
    concat([
      'on',
      'off',
      'red',
      'warmer',
      'cooler',
    ]).join(','),

  /**
  * Interface train the intent parser
  */
  train: function(things) {
    return new Promise((resolve, reject) => {
      const socket_client = new net.Socket();
      socket_client.connect(5555, '127.0.0.1', function() {
        console.log('Connected to intent parser server');

        socket_client.on('data', function(data) {
          console.log(`Training result:${data}`);
          resolve(data);
        });

        things = things.join(',');
        socket_client.write(
          `t:${IntentParser.keyword}|${IntentParser.type}|${things}`);
      });
      socket_client.on('error', function(data) {
        console.log(`Training error:${data}`);
        reject();
      });
    });
  },

  /**
  * Interface to query the intent parser
  */
  query: function(query) {
    return new Promise((resolve, reject) => {
      const socket_client = new net.Socket();
      socket_client.connect(5555, '127.0.0.1', function() {
        socket_client.on('data', function(data) {
          console.log(`Received: ${data}`);
          if (data == '-1') {
            reject();
          } else {
            const jsonBody = JSON.parse(data);
            resolve({
              cmd: 'IOT',
              href: '',
              thing: jsonBody.Location,
              keyword: jsonBody.Keyword,
              value: jsonBody.Type,
            });
          }
        });
        socket_client.write(`q:${query}`);
      });
      socket_client.on('error', function(data) {
        console.log(`Query error:${data}`);
        reject();
      });
    });
  },
};

module.exports = IntentParser;
