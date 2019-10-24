'use strict';

const fetch = require('node-fetch');
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
  getItem: (key) => {
    const value = storage[key];
    return typeof value === 'undefined' ? null : value;
  },
  setItem: (key, value) => {
    storage[key] = value;
  },
  removeItem: (key) => delete storage[key],
};
global.fetch = fetch;

beforeEach(() => {
  global.sandbox = sinon.createSandbox();
});

afterEach(() => {
  global.sandbox.restore();
});
