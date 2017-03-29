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
  var things = adapterManager.getThings();
  var thingNames = [];
  for (var thing of things) {
    thingNames.push(thing.getName());
  }
  res.json(thingNames);
});

var server = app.listen(8088, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);

  adapterManager.loadAdapters();
});

adapterManager.on('device-added', function deviceAdded(thing) {
  var thing_uri = ROOT + '/' + thing.getName();
  var property_names = thing.getPropertyNames();

  app.get(thing_uri, function (req, res) {
    let properties = [];
    for (let property_name of property_names) {
      let property = thing.getProperty(property_name);
      let property_description = {
        'name': property_name,
        'type': property.type,
        'href': thing_uri + '/' + property_name,
      };
      if (property.unit) {
        property_description.unit = property.unit;
      }
      if (property.description) {
        property_description.description = property.description;
      }
      properties.push(property_description);
    }
    var description = {
        'name': thing.getName(),
        'type': thing.getType(),
        'properties': properties,
        'actions': thing.getActions(),
        'events': thing.getEvents(),
    };
    res.json(description);
  });

  for (let property_name of property_names) {
    let property_uri = thing_uri + '/' + property_name;
    console.log('device-added: adding property_uri =', property_uri);
    app.get(property_uri, function (req, res) {
      let value = thing.getPropertyValue(property_name);
      console.log('GET: get of', property_uri,
                  'name', property_name,
                  'value', value);
      res.json(value);
    });
    app.put(property_uri, function (req, res) {
      let value = JSON.parse(req.body.value);
      console.log('PUT: set of', property_uri, 'to', value);
      thing.setPropertyValue(property_name, value);
      return res.send('set');
    });
    app.post(property_uri, function (req, res) {
      let value = JSON.parse(req.body.value);
      console.log('POST: set of', property_uri, 'to', value);
      thing.setPropertyValue(property_name, value);
      return res.send('set');
    });
  }
});

adapterManager.on('value-changed', function valueChanged(info) {
  console.log('Value of', info.thing.getName(),
              'property', info.property,
              'changed to', info.value);
});

process.on('SIGINT', function() {
  console.log('Control-C: disconnecting adapters...');
  adapterManager.unloadAdapters();
  process.exit();
});
