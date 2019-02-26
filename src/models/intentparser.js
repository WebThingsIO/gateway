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
  keywords: [
    'turn',
    'switch',
    'make',
    'change',
    'set',
    'dim',
    'brighten',
  ],

  types: Object.keys(CommandUtils.colors).
    concat(Object.keys(CommandUtils.percentages)).
    concat([
      'on',
      'off',
      'red',
      'warmer',
      'cooler',
    ]),

  buildMessage: function(data) {
    data = Buffer.from(JSON.stringify(data));
    const buffer = Buffer.alloc(4 + data.length);
    buffer.writeUInt32BE(data.length, 0);
    data.copy(buffer, 4);
    return buffer;
  },

  /**
  * Interface train the intent parser
  */
  train: function(things) {
    return new Promise((resolve, reject) => {
      const socket_client = new net.Socket();
      socket_client.connect(5555, '127.0.0.1', function() {
        console.log('Connected to intent parser server');

        socket_client.on('data', function(data) {
          console.log(`Training result: ${data}`);
          try {
            const response = JSON.parse(data);
            if (response.hasOwnProperty('status')) {
              if (response.status === 'success') {
                resolve();
              } else {
                reject(response.error);
              }
            } else {
              reject('Failed to train intent parser.');
            }
          } catch (e) {
            reject('Failed to train intent parser.');
          }
        });

        socket_client.write(IntentParser.buildMessage({
          command: 'train',
          data: {
            keywords: IntentParser.keywords,
            types: IntentParser.types,
            locations: things,
          },
        }));
      });
      socket_client.on('error', function(data) {
        console.log(`Training error: ${data}`);
        reject('Failed to train intent parser.');
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
          console.log(`Query result: ${data}`);
          try {
            const response = JSON.parse(data);
            if (response.hasOwnProperty('status') &&
                response.hasOwnProperty('data')) {
              if (response.status === 'success') {
                resolve({
                  cmd: 'IOT',
                  href: '',
                  thing: response.data.Location,
                  keyword: response.data.Keyword,
                  value: response.data.Type,
                });
              } else {
                reject(response.error);
              }
            } else {
              reject('Failed to query intent parser.');
            }
          } catch (e) {
            reject('Failed to query intent parser.');
          }
        });
        socket_client.write(IntentParser.buildMessage({
          command: 'query',
          data: query,
        }));
      });
      socket_client.on('error', function(data) {
        console.log(`Query error: ${data}`);
        reject('Failed to query intent parser.');
      });
    });
  },
};

module.exports = IntentParser;
