'use strict';

const sinon = require('sinon');
const {JSDOM} = require('jsdom');

// Setup the jsdom environment
const {document} =
(new JSDOM('<!doctype html><html><body></body></html>')).window;
global.document = document;
global.window = document.defaultView;
global.navigator = global.window.navigator;

const strage = {};
global.localStorage = {
  getItem: function(key) {
    const value = strage[key];
    return typeof value === 'undefined' ? null : value;
  },
  setItem: function(key, value) {
    strage[key] = value;
  },
  removeItem: function(key) {
    return delete strage[key];
  },
};

expect.extend({
  assert(value, message = 'expected condition to be truthy') {
    const pass = !!value;
    return {
      pass,
      message,
    };
  },
});

beforeEach(() => {
  global.sandbox = sinon.sandbox.create();
});

afterEach(() => {
  global.sandbox.restore();
});
