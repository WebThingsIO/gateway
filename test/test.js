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

var Gateway = require('./gateway');
var Thing = require('./thing');
var GetOpt = require('node-getopt');
var utils = require('../utils');

// Command line arguments
var getopt = new GetOpt([
  ['d', 'debug',    'Enable debug features'],
  ['h', 'help',     'Display help' ],
  ['v', 'verbose',  'Show verbose output' ],
  ['l', 'list',     'List all things'],
  ['',  'toggle',   'Toggle all onOff devices'],
  ['', 'thing=NAME',     'Filter things that match NAME'],
  ['', 'set=PROPERTY=value', 'Set all properties to a value'],
]);

getopt.bindHelp(
  'Usage: node toggle.js SERVER\n' +
  '\n' +
  '[[OPTIONS]]'
);
var opt = getopt.parseSystem();
const VERBOSE = opt.options.verbose;
const DEBUG = opt.options.debug;

if (VERBOSE) {
  console.log(opt);
}

if (opt.argv.length != 1) {
  console.log('Must specify exactly one server\n');
  getopt.showHelp();
  process.exit(1);
}

var server_url = opt.argv[0];

// Get some decent error messages for unhandled rejections. This is
// often just errors in the code.
process.on('unhandledRejection', (reason) => {
  console.log('Unhandled Rejection');
  console.error(reason);
});

function toggleThing(thing, propertyName) {
  thing.getProperty(propertyName).then((value) => {
    thing.setProperty(propertyName, !value);
  });
}

function setAll(things, propertyName, value) {
  for (var thing of things) {
    if (thing.hasProperty(propertyName)) {
      thing.setProperty(propertyName, value);
    }
  }
}

function toggleAllThings(things) {
  for (var thing of things) {
    if (thing.hasProperty('on')) {
      toggleThing(thing, 'on');
    }
  }
  setTimeout(() => {
    for (var thing of things) {
      if (thing.hasProperty('on')) {
        toggleThing(thing, 'on');
      }
    }
  }, 1000);
}

function listAllThings(things) {
  var lines = [
    ['URL', 'Name', 'Type', 'Properties'],
    '='
  ];
  for (var thing of things) {
    var properties = [];
    for (var property of thing.properties) {
      properties.push(property.name);
    }
    lines.push([thing.href, thing.name, thing.type, properties.join(', ')]);
  }
  utils.printTable('', lines);
  console.log('');
}

function thingMatches(thing) {
  return thing.name.indexOf(opt.options.thing) >= 0;
}

var gateway = new Gateway(server_url);
gateway.setDebug(opt.options.debug);

gateway.getThings().then((things) => {
  if (opt.options.thing) {
    things = things.filter(thingMatches);
  }
  if (things.length == 0) {
    console.log('No things found');
    return;
  }
  if (opt.options.list) {
    listAllThings(things);
  }
  if (opt.options.toggle) {
    toggleAllThings(things);
  }
  if (opt.options.set) {
    var set = opt.options.set.split('=');
    if (set.length != 2) {
      console.error('Expecting property=value to be passed to --set');
    } else {
      var propertyName = set[0];
      var value = JSON.parse(set[1]);
      setAll(things, propertyName, value);
    }
  }
});