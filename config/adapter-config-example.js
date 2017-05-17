'use strict';

module.exports = {
  gpio: {
    enabled: false,
    path: './adapters/gpio'
  },
  zigbee: {
    enabled: true,
    path: './adapters/zigbee'
  },
  zwave: {
    enabled: true,
    path: './adapters/zwave'
  },
};