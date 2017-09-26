const storage = jest.genMockFromModule('node-persist');

let data = {};

storage.init = function() {
  return Promise.resolve();
};

storage.clear = function() {
  data = {};
  return Promise.resolve();
};

storage.getItem = function(key) {
  if (!data.hasOwnProperty(key)) {
    return Promise.resolve();
  }
  // Duplicate node-persist's copying logic
  let copiedValue = JSON.parse(JSON.stringify(data[key]));
  return Promise.resolve(copiedValue);
};

storage.setItem = function(key, value) {
  data[key] = value;
  return Promise.resolve();
};

storage.removeItem = function(key) {
  delete data[key];
  return Promise.resolve();
};

module.exports = storage;
