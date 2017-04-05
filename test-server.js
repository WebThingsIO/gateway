#!/usr/bin/env node
/**
 * test-server.js - a simple server just for testing purposes.
 *
 * This file will disappear as soon as the gateway itself is capable
 * of performing this functionality. This test server is primarily
 * intended for testing the adapter layer code.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */
'use strict';

var express = require('express');
var app = express();
var adapterManager = require('./adapter-manager.js');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const ROOT = '/things';

app.get(ROOT, function (req, res) {
  var devices = adapterManager.getDevices();
  var deviceIds = [];
  for (var deviceId in devices) {
    deviceIds.push(deviceId);
  }
  res.json(deviceIds);
});

app.put('/foobar', function (request, response) {
  console.log('addSomeDevice');
  res.send('/foobar put');
});

adapterManager.on('device-added', function deviceAdded(device) {
  var thing_uri = ROOT + '/' + device.getId();
  var attribute_names = device.getAttributeNames();

  app.get(thing_uri, function (req, res) {
    let properties = [];
    for (let attribute_name of attribute_names) {
      let attribute = device.getAttribute(attribute_name);
      let property_description = {
        'name': attribute_name,
        'type': attribute.type,
        'href': thing_uri + '/' + attribute_name,
      };
      if (attribute.unit) {
        property_description.unit = attribute.unit;
      }
      if (attribute.description) {
        property_description.description = attribute.description;
      }
      properties.push(property_description);
    }
    var description = {
        'name': device.getName(),
        'type': device.getType(),
        'properties': properties,
        'actions': [],
        'events': [],
    };
    res.json(description);
  });

  for (let property_name of attribute_names) {
    let property_uri = thing_uri + '/' + property_name;
    console.log('device-added: adding property_uri =', property_uri);
    app.get(property_uri, function (req, res) {
      let value = device.getAttributeValue(property_name);
      console.log('GET: get of', property_uri,
                  'name', property_name,
                  'value', value);
      res.json(value);
    });
    app.put(property_uri, function (req, res) {
      let value = JSON.parse(req.body.value);
      console.log('PUT: set of', property_uri, 'to', value);
      device.setAttributeValue(property_name, value);
      return res.send('set');
    });
    app.post(property_uri, function (req, res) {
      let value = JSON.parse(req.body.value);
      console.log('POST: set of', property_uri, 'to', value);
      device.setAttributeValue(property_name, value);
      return res.send('set');
    });
  }
});

adapterManager.on('value-changed', function valueChanged(info) {
  console.log('Value of', info.device.getName(),
              'property', info.property,
              'changed to', info.value);
});

process.on('SIGINT', function() {
  console.log('Control-C: disconnecting adapters...');
  adapterManager.unloadAdapters();
  process.exit();
});

process.on('unhandledRejection', (reason) => {
  console.error(reason);
  process.exit(1);
});

var server = app.listen(8088, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);

  adapterManager.loadAdapters();
});

