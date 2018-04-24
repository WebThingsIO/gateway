'use strict';

const sinon = require('sinon');
const {JSDOM} = require('jsdom');
const {server, chai} = require('./common');
const {
  TEST_USER,
  createUser,
} = require('./user');
const {URL} = require('url');
const {w3cwebsocket} = require('websocket');

// Setup the jsdom environment
const {document} =
(new JSDOM('<!doctype html><html><body></body></html>',
           {url: 'https://localhost:4443/'})).window;
global.document = document;
global.window = document.defaultView;
global.navigator = global.window.navigator;
global.URL = URL;
// Since a test server dose not listen port, WebSocket always fails.
global.WebSocket = w3cwebsocket;
global.fetch = function(url, option) {
  const {body, headers} = option;
  const method = option.method ? option.method.toLowerCase() : 'get';

  return new Promise((resolve, reject) => {
    let request = chai.request(server)[method](url.pathname);
    Object.keys(headers).forEach(function(key) {
      request.set(key, headers[key]);
    });

    if (body) {
      try {
        request = request.send(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    }

    request.end((_err, res) => {
      res.json = () => {
        return Promise.resolve(res.body);
      };
      resolve(res);
    });
  });
};

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

beforeEach(async () => {
  const jwt = await createUser(server, TEST_USER);
  global.localStorage.setItem('jwt', jwt);
  global.window.API.jwt = jwt;
  global.sandbox = sinon.sandbox.create();
});

afterEach(() => {
  global.sandbox.restore();
});
