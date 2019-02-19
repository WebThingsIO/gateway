'use strict';

const sinon = require('sinon');
const {JSDOM} = require('jsdom');

// Setup the jsdom environment
const {document} =
  (new JSDOM('<!doctype html><html><body></body></html>')).window;
global.document = document;
global.window = document.defaultView;
global.navigator = global.window.navigator;

const storage = {};
global.localStorage = {
  getItem: function(key) {
    const value = storage[key];
    return typeof value === 'undefined' ? null : value;
  },
  setItem: function(key, value) {
    storage[key] = value;
  },
  removeItem: function(key) {
    return delete storage[key];
  },
};

beforeEach(() => {
  global.sandbox = sinon.createSandbox();
});

afterEach(() => {
  global.sandbox.restore();
});
