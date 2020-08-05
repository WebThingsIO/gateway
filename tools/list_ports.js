#!/usr/bin/env node

'use strict';

const SerialPort = require('serialport');

function extraInfo(port) {
  let output = '';
  if (port.manufacturer) {
    output += ` Vendor: ${port.manufacturer}`;
  }
  if (port.serialNumber) {
    output += ` Serial: ${port.serialNumber}`;
  }
  return output;
}

SerialPort.list().then((ports) => {
  for (const port of ports) {
    if (port.vendorId) {
      const vidPid = `${port.vendorId}:${port.productId}`;
      console.log('USB Serial Device', vidPid + extraInfo(port),
                  'found @', port.path);
    } else {
      console.log('Serial Device found @', port.path);
    }
  }
});
