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
    // We don't know our id yet. So we set it to ??? and once we get the
    // driverReady notification, which will then set the id based on the homeId.
    super(adapterManager, '???');
    this.ready = false;
    this.named = false;

    this.port = port;
    this.nodes = {};

    this.zwave = new ZWaveModule({
      SaveConfiguration: true,
      ConsoleOutput: false,
      UserPath: '.',
    });
    this.zwave.on('controller command', this.controllerCommand.bind(this));
    this.zwave.on('driver ready', this.driverReady.bind(this));
    this.zwave.on('driver failed', this.driverFailed.bind(this));
    this.zwave.on('scan complete', this.scanComplete.bind(this));
    this.zwave.on('node added', this.nodeAdded.bind(this));
    this.zwave.on('node naming', this.nodeNaming.bind(this));
    this.zwave.on('node removed', this.nodeRemoved.bind(this));
    this.zwave.on('node event', this.nodeEvent.bind(this));
    this.zwave.on('node ready', this.nodeReady.bind(this));
    this.zwave.on('notification', this.nodeNotification.bind(this));
    this.zwave.on('value added', this.valueAdded.bind(this));
    this.zwave.on('value changed', this.valueChanged.bind(this));
    this.zwave.on('value removed', this.valueRemoved.bind(this));

    this.zwave.connect(port.comName);
  }

  asDict() {
    var dict = super.asDict();
    for (var attr of ['port', 'manufacturer', 'manufacturerId', 'product', 'productType', 'productId', 'location']) {
      dict[attr] = this[attr];
    }
    return dict;
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
    this.id = 'zwave-' + homeId.toString(16);

    this.manager.addAdapter(this);
  }

  driverFailed() {
    console.log('ZWave: failed to start driver');
    zwave.disconnect();
  }

  scanComplete() {
    console.log('ZWave: Scan complete');
    this.ready = true;
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
    let deviceId = this.id.toString(16) + '-' + nodeId;
    let node = new ZWaveNode(this, deviceId, '');
    this.nodes[nodeId] = node;

    if (nodeId > 1) {
      this.handleDeviceAdded(node);
    }
  }

  nodeNaming(nodeId, nodeInfo) {
    var node;
    if (nodeId == 1) {
      node = this;
    } else {
      node = this.nodes[nodeId];
    }
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
      } else if (nodeId > 1) {
        // We don't have anything else, use the id
        node.name = node.id;
      }
      node.location = nodeInfo.loc;

      if (DEBUG || !node.named) {
        console.log('ZWave: node%d: Named',
                    nodeId,
                    node.manufacturer ? node.manufacturer : 'id=' + node.manufacturerId,
                    node.product ? node.product : 'product=' + node.productId + ', type=' + node.productType);
        console.log('ZWave: node%d: name="%s", type="%s", location="%s"',
                    nodeId, node.name, node.zwType, node.location);
      }
      node.named = true;

      if (DEBUG) {
        for (var comClass in node.classes) {
          var values = node.classes[comClass];
          console.log('ZWave: node%d: class %d', nodeId, comClass);
          for (var idx in values) {
            console.log('ZWave: node%d:   %s=%s',
                        nodeId, values[idx]['label'], values[idx]['value']);
          }
        }
      }
    }
  }

  nodeRemoved(nodeId) {
    if (DEBUG) {
      console.log('ZWave: node%d removed', nodeId);
    }

    var node = this.nodes[nodeId];
    if (node) {
      delete this.nodes[nodeId];
      this.handleDeviceRemoved(node);
    }
  }

  nodeEvent(nodeId, data) {
    console.log('ZWave: node%d event: Basic set %d', nodeId, data);
  }

  nodeReady(nodeId, nodeInfo) {
    var node = this.nodes[nodeId];
    if (node) {
      node.ready = true;

      for (var comClass in node.classes) {
        switch (comClass) {
          case 0x25: // COMMAND_CLASS_SWITCH_BINARY
          case 0x26: // COMMAND_CLASS_SWITCH_MULTILEVEL
            this.zwave.enablePoll(nodeId, comClass);
            break;
        }
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
      node.values[value.value_id] = value;

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
        delete node.values[value_id];
        delete node.attributes[value_id];
      }
    }
  }

  startPairing() {
    console.log('ZWave: Press the Inclusion button on the device to add');
    this.zwave.addNode();
  }

  cancelPairing() {
    console.log('ZWave: Cancelling pairing mode');
    this.zwave.cancelControllerCommand();
  }

  startUnpairing() {
    console.log('Press the Exclusion button on the device to remove');
    this.zwave.removeNode();
  }

  cancelUnpairing() {
    console.log('ZWave: Cancelling unpairing mode');
    this.zwave.cancelControllerCommand();
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

    var zwaveAdapter = new ZWaveAdapter(adapterManager, port);

    // The zwave adapter will be added when it's driverReady method is called.
    // Prior to that we don't know what the homeID of the adapter is.
  });
}

module.exports = loadZWaveAdapters;
