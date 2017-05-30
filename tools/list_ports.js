#!/usr/bin/env node

'use strict';

var SerialPort = require('serialport');

function extraInfo(port) {
  var output = '';
  if (port.manufacturer) {
    output += ' Vendor: ' + port.manufacturer;
  }
  if (port.serialNumber) {
    output += ' Serial: ' + port.serialNumber;
  }
  return output;
}

SerialPort.list((error, ports) => {
  if (error) {
      console.log('Error:', error);
      return;
  }
  for (var port of ports) {
    if (port.vendorId) {
      var vidPid = port.vendorId.slice(2) + ':' + port.productId.slice(2);
      console.log('USB Serial Device', vidPid + extraInfo(port),
                  'found @', port.comName);
    } else {
      console.log('Serial Device found @', port.comName);
    }
  }
});