/**
 *
 * ZWaveAdapter - Adapter which manages ZWave nodes
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

var Adapter = require('../../adapter.js').Adapter;
var ZWaveNode = require('./zwave-node.js');
var SerialPort = require('serialport');
var ZWaveModule = require('openzwave-shared');

const DEBUG = false;

class ZWaveAdapter extends Adapter {
  constructor(adapterManager, port) {
    super(adapterManager);

    this.port = port;
    this.nodes = {};

    this.zwave = new ZWaveModule({
      ConsoleOutput: false
    });
    this.zwave.on('controller command', this.controllerCommand.bind(this));
    this.zwave.on('driver ready', this.driverReady.bind(this));
    this.zwave.on('driver failed', this.driverFailed.bind(this));
    this.zwave.on('scan complete', this.scanComplete.bind(this));
    this.zwave.on('node added', this.nodeAdded.bind(this));
    this.zwave.on('node event', this.nodeEvent.bind(this));
    this.zwave.on('node ready', this.nodeReady.bind(this));
    this.zwave.on('notification', this.nodeNotification.bind(this));
    this.zwave.on('value added', this.valueAdded.bind(this));
    this.zwave.on('value changed', this.valueChanged.bind(this));
    this.zwave.on('value removed', this.valueRemoved.bind(this));

    this.zwave.connect(port.comName);
  }

  dump() {
    console.log('Dump of Nodes')
    for (var nodeId in this.nodes) {
      let node = this.nodes[nodeId];
      console.log('node%d', nodeId, 'name=', node.name);
    }
    console.log('-----');
  }

  controllerCommand(nodeId, retVal, state, msg) {
    console.log('ZWave: Controller Command feedback: %s node%d retVal:%d state:%d',
                msg, nodeId, retVal, state)
  }

  driverReady(homeId) {
    console.log('ZWave: Driver Ready: HomeId:', homeId.toString(16));
    this.id = homeId;
    this.manager.addAdapter(this);
  }

  driverFailed() {
    console.log('ZWave: failed to start driver');
    zwave.disconnect();
  }

  scanComplete() {
    console.log('ZWave: Scan complete');
    this.zwave.requestAllConfigParams(3);
    if (DEBUG) {
      this.dump();
    }
  }

  nodeAdded(nodeId) {
    if (DEBUG) {
      console.log('ZWave: node%d added', nodeId);
    }

    // Pass in the empty string as a name here. Once the node is initialized
    // (i.e. nodeReady) then if the user has assigned a name, we'll get
    // that name.
    let deviceId = 'zwave-' + this.id.toString(16) + '-' + nodeId;
    let node = new ZWaveNode(this, deviceId, '');
    this.nodes[nodeId] = node;

    // We can't tell the adapter manager about this node yet, since we don't
    // know our attributes until we get the valueAdded calls.
    // So we defer telling the framework until nodeReady.
  }

  nodeEvent(nodeId, data) {
    console.log('ZWave: node%d event: Basic set %d', nodeId, data);
  }

  nodeReady(nodeId, nodeInfo) {
    var node = this.nodes[nodeId];
    if (node) {
      node.manufacturer = nodeInfo.manufacturer;
      node.manufacturerId = nodeInfo.manufacturerid;
      node.product = nodeInfo.product;
      node.productType = nodeInfo.producttype;
      node.productId = nodeInfo.productid;
      node.zwType = nodeInfo.type;
      if (nodeInfo.name) {
        // Use the assigned name, if it exists
        node.name = nodeInfo.name;
      } else if (node.defaultName) {
        // Otherwise use the constructed name
        node.name = node.defaultName;
      } else {
        // We don't have anything else, use the id
        node.name = node.id;
      }

      node.location = nodeInfo.loc;
      node.ready = true;

      console.log('ZWave: node%d: Ready',
                  nodeId,
                  node.manufacturer ? node.manufacturer : 'id=' + node.manufacturerId,
                  node.product ? node.product : 'product=' + node.productId + ', type=' + node.productType);
      console.log('ZWave: node%d: name="%s", type="%s", location="%s"',
                  nodeId, node.name, node.zwType, node.location);

      for (var comClass in node.classes) {
        switch (comClass) {
          case 0x25: // COMMAND_CLASS_SWITCH_BINARY
          case 0x26: // COMMAND_CLASS_SWITCH_MULTILEVEL
            this.zwave.enablePoll(nodeId, comClass);
            break;
        }
        if (DEBUG) {
          var values = node.classes[comClass];
          console.log('ZWave: node%d: class %d', nodeId, comClass);
          for (var idx in values)
            console.log('ZWave: node%d:   %s=%s',
                        nodeId, values[idx]['label'], values[idx]['value']);
        }
      }

      if (nodeId == 1) {
        // Node 1 corresponds to the Controller. Add a device which allows
        // for painr/unpairing commands.
        node.attributes['pair'] = {
          'name': 'pair',
          'type': 'bool',
          'value': false,
        };
        node.attributes['unpair'] = {
          'name': 'unpair',
          'type': 'bool',
          'value': false,
        };
        this.manager.addDevice(this, node);
      } else {
        this.manager.addDevice(this, node);
      }
    }
  }

  nodeNotification(nodeId, notif) {
    switch (notif) {
      case 0:
        console.log('ZWave: node%d: message complete', nodeId);
        break;
      case 1:
        console.log('ZWave: node%d: timeout', nodeId);
        break;
      case 2:
        if (DEBUG) {
          console.log('ZWave: node%d: nop', nodeId);
        }
        break;
      case 3:
        console.log('ZWave: node%d: node awake', nodeId);
        break;
      case 4:
        console.log('ZWave: node%d: node sleep', nodeId);
        break;
      case 5:
        console.log('ZWave: node%d: node dead', nodeId);
        break;
      case 6:
        console.log('ZWave: node%d: node alive', nodeId);
        break;
    }
  }

  valueAdded(nodeId, comClass, value) {
    if (value.genre === 'user' || DEBUG) {
      console.log('ZWave: node%d valueAdded: %d:%s -> %s',
                  nodeId, comClass, value['label'], value['value']);
    }
    var node = this.nodes[nodeId];
    if (node) {
      if (!node.classes[comClass]) {
        node.classes[comClass] = {};
      }
      node.classes[comClass][value.index] = value;

      if (value.genre === 'user') {
        node.attributes[value.value_id] = {
          'name': value.label,
          'type': value.type,
          'value': value.value,
          'zwValue': value,
        };
        // We use the label from the first 'user' value that we see to help
        // disambiguate different nodes.
        if (!node.defaultName) {
          node.defaultName = this.id.toString(16) + '-' + nodeId + '-' + value.label;
        }
      }
    }
  }

  valueChanged(nodeId, comClass, value) {
    var node = this.nodes[nodeId];
    if (node && node.ready) {
      console.log('ZWave: node%d valueChanged: %d:%s -> %s',
                  nodeId, comClass, value['label'], value['value']);
      node.classes[comClass][value.index] = value;
      if (node.attributes[value.value_id]) {
        node.attributes[value.value_id].value = value.value;
        node.attributes[value.value_id].zwValue = value;
      }
    }
  }

  valueRemoved(nodeId, comClass, value_index) {
    console.log('ZWave: node%d valueRemoved: %d',
                nodeId, comClass);
    var node = this.nodes[nodeId];
    if (node) {
      if (node.classes[comClass] && node.classes[comClass][value_index]) {
        let valueId = node.classes[comClass][value_index].value_id;
        delete node.classes[comClass][value_index];
      }
    }
  }

  unload() {
    this.zwave.disconnect(this.port.comName);
    super.unload();
  }
}

function isZWavePort(port) {
  return ((port.vendorId == "0x0658" && port.productId == "0x0200") ||  // Aeotech Z-Stick Gen-5
          (port.vendorId == "0x0658" && port.productId == "0x0280") ||  // UZB1
          (port.vendorId == "0x10c4" && port.productId == "0xea60"));   // Aeotech Z-Stick S2
}

// Scan the serial ports looking for an OpenZWave adapter.
//
//    callback(error, port)
//        Upon success, callback is invoked as callback(null, port) where `port`
//        is the port object from SerialPort.list().
//        Upon failure, callback is invoked as callback(err) instead.
//
function findZWavePort(callback) {
  SerialPort.list(function listPortsCallback (error, ports) {
    if (error) {
      callback(error);
    }
    for (var port of ports) {
      if (isZWavePort(port)) {
        callback(null, port);
        return;
      }
    }
    callback('No ZWave port found');
  });
}

function loadZWaveAdapters(adapterManager) {
  findZWavePort(function (error, port) {
    if (error) {
      console.error('Unable to find ZWave adapter');
      return;
    }

    console.log('Found ZWave port @', port.comName);
    adapterManager.addAdapter(new ZWaveAdapter(adapterManager, port));
  });
}

module.exports = loadZWaveAdapters;
