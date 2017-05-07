#!/usr/bin/env node
/*
 * MozIoT Gateway App.
 *
 * Back end main script.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

var Thing = require('./thing');
var Client = require('node-rest-client').Client;

var DEBUG = false;

class Gateway {
  constructor(url) {
    if (url.slice(-1) === '/') {
      // Remove trailing /
      url = url.slice(0, -1);
    }
    this.server_url = url;
    if (DEBUG) {
      console.log('Gateway: server_url =', this.server_url);
    }

    this.rest_client = new Client({
      mimetypes: {
        json: ['application/json', 'application/json; charset=utf-8'],
      }
    });
    // Setting rejectUnauthorized to false is needed if the
    // server is using a self-signed certificate.
    this.rest_client.connection.rejectUnauthorized = false;
  }

  setDebug(debug) {
    DEBUG = debug;
  }

  get(path) {
    return new Promise((resolve, reject) => {
      var url = this.server_url + path;
      this.rest_client.get(url, function(data, response) {
        var json = JSON.parse(data.toString());
        if (DEBUG) {
          console.log('GET', url, 'returned', json);
        }
        resolve(json);
      });
    });
  }

  put(path, data) {
    return new Promise((resolve, reject) => {
      var url = this.server_url + path;
      var args = {
        data: data,
        headers: { 'Content-Type': 'application/json' }
      };
      if (DEBUG) {
        console.log('PUT', url, 'data', data);
      }
      this.rest_client.put(url, args, (data, response) => {
        resolve('');
      });
    });
  }

  getThings() {
    return new Promise((resolve, reject) => {
      this.get('/things').then((thingDescriptions) => {
        resolve(thingDescriptions.map((thingDescription, index, arr) => {
          return new Thing(this, thingDescription);
        }));
      });
    });
  }
}

module.exports = Gateway;