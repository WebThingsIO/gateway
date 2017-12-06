/**
 *
 * ZWaveAdapter - Adapter which manages ZWave nodes
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

var Adapter = require('../adapter');
var ZWaveNode = require('./zwave-node');
var SerialPort = require('serialport');
var zwaveClassifier = require('./zwave-classifier');
var ZWaveModule;

const DEBUG = false;

class ZWaveAdapter extends Adapter {
  constructor(addonManager, packageName, port) {
    // The ZWave adapter supports multiple dongles and
    // will create an adapter object for each dongle.
    // We don't know the actual adapter id until we
    // retrieve the home id from the dongle. So we set the
    // adapter id to zwave-unknown here and fix things up
    // later just before we call addAdapter.
    super(addonManager, 'zwave-unknown', packageName);
    this.ready = false;
    this.named = false;

    this.port = port;
    this.nodes = {};
    this.nodesBeingAdded = {};

    // Use debugFlow if you need to debug the flow of the program. This causes
    // prints at the beginning of many functions to print some info.
    this.debugFlow = false;

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
    this.zwave.on('scene event', this.sceneEvent.bind(this));

    this.zwave.connect(port.comName);
  }

  asDict() {
    var dict = super.asDict();
    var node1 = this.nodes[1];
    if (node1) {
      this.node1 = node1.asDict();
    }
    return dict;
  }

  dump() {
    console.log(this.oneLineSummary());
    console.log(ZWaveNode.oneLineHeader(0));
    console.log(ZWaveNode.oneLineHeader(1));
    for (var nodeId in this.nodes) {
      let node = this.nodes[nodeId];
      console.log(node.oneLineSummary());
    }
    console.log('----');
  }

  controllerCommand(nodeId, retVal, state, msg) {
    console.log('Controller Command feedback: %s node%d retVal:%d ' +
                'state:%d', msg, nodeId, retVal, state);


  }

  driverReady(homeId) {
    console.log('Driver Ready: HomeId:', homeId.toString(16));
    this.id = 'zwave-' + homeId.toString(16);

    this.manager.addAdapter(this);
  }

  driverFailed() {
    console.log('failed to start driver');
    this.zwave.disconnect(this.port.comName);
  }

  handleDeviceAdded(node) {
    if (this.debugFlow) {
      console.log('handleDeviceAdded:', node.nodeId);
    }
    delete this.nodesBeingAdded[node.zwInfo.nodeId];

    if (node.nodeId > 1) {
      zwaveClassifier.classify(node);
      super.handleDeviceAdded(node);
    }
  }

  handleDeviceRemoved(node) {
    if (this.debugFlow) {
      console.log('handleDeviceRemoved:', node.nodeId);
    }
    delete this.nodes[node.zwInfo.nodeId];
    delete this.nodesBeingAdded[node.zwInfo.nodeId];
    super.handleDeviceRemoved(node);
  }

  scanComplete() {
    // Add any nodes which otherwise aren't responding. This typically
    // corresponds to devices which are sleeping and only check in periodically.
    for (var nodeId in this.nodesBeingAdded) {
      this.handleDeviceAdded(this.nodesBeingAdded[nodeId]);
    }
    console.log('Scan complete');
    this.ready = true;
    this.zwave.requestAllConfigParams(3);
    this.dump();
  }

  nodeAdded(nodeId) {
    if (DEBUG) {
      console.log('node%d added', nodeId);
    }

    // Pass in the empty string as a name here. Once the node is initialized
    // (i.e. nodeReady) then if the user has assigned a name, we'll get
    // that name.
    let node = new ZWaveNode(this, nodeId, '');
    this.nodes[nodeId] = node;
    this.nodesBeingAdded[nodeId] = node;
    node.lastStatus = 'added';
  }

  nodeNaming(nodeId, nodeInfo) {
    var node = this.nodes[nodeId];
    if (node) {
      node.lastStatus = 'named';
      var zwInfo = node.zwInfo;
      zwInfo.location = nodeInfo.loc;
      zwInfo.manufacturer = nodeInfo.manufacturer;
      zwInfo.manufacturerId = nodeInfo.manufacturerid;
      zwInfo.product = nodeInfo.product;
      zwInfo.productType = nodeInfo.producttype;
      zwInfo.productId = nodeInfo.productid;
      zwInfo.type = nodeInfo.type;

      if (zwInfo.product.startsWith('Unknown: ')) {
        zwInfo.product = zwInfo.manufacturer + ' ' + zwInfo.product;
      }

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

      if (DEBUG || !node.named) {
        console.log('node%d: Named',
                    nodeId,
                    zwInfo.manufacturer ? zwInfo.manufacturer :
                                          'id=' + zwInfo.manufacturerId,
                    zwInfo.product ? zwInfo.product :
                                   'product=' + zwInfo.productId +
                                   ', type=' + zwInfo.productType);
        console.log('node%d: name="%s", type="%s", location="%s"',
                    zwInfo.nodeId, node.name, zwInfo.type, zwInfo.location);
      }
      node.named = true;

      if (DEBUG) {
        for (var comClass in node.zwClasses) {
          var zwClass = node.zwClasses[comClass];
          console.log('node%d: class %d', nodeId, comClass);
          for (var idx in zwClass) {
            console.log('node%d:   %s=%s',
                        nodeId, zwClass[idx].label, zwClass[idx].value);
          }
        }
      }
    }
  }

  nodeRemoved(nodeId) {
    if (DEBUG) {
      console.log('node%d removed', nodeId);
    }

    var node = this.nodes[nodeId];
    if (node) {
      node.lastStatus = 'removed';
      this.handleDeviceRemoved(node);
    }
  }

  nodeEvent(nodeId, data) {
    console.log('node%d event: Basic set %d', nodeId, data);
  }

  // eslint-disable-next-line no-unused-vars
  nodeReady(nodeId, nodeInfo) {
    var node = this.nodes[nodeId];
    if (node) {
      node.lastStatus = 'ready';
      node.ready = true;

      for (var comClass in node.zwClasses) {
        switch (comClass) {
          case 0x25: // COMMAND_CLASS_SWITCH_BINARY
          case 0x26: // COMMAND_CLASS_SWITCH_MULTILEVEL
            this.zwave.enablePoll(nodeId, comClass);
            break;
        }
      }
      if (nodeId in this.nodesBeingAdded) {
        this.handleDeviceAdded(node);
      }
    }
  }

  // eslint-disable-next-line no-unused-vars
  nodeNotification(nodeId, notif, help) {
    var node = this.nodes[nodeId];
    var lastStatus;
    switch (notif) {
      case 0:
        console.log('node%d: message complete', nodeId);
        lastStatus = 'msgCmplt';
        break;
      case 1:
        console.log('node%d: timeout', nodeId);
        lastStatus = 'timeout';
        break;
      case 2:
        if (DEBUG) {
          console.log('node%d: nop', nodeId);
        }
        lastStatus = 'nop';
        break;
      case 3:
        console.log('node%d: node awake', nodeId);
        lastStatus = 'awake';
        break;
      case 4:
        console.log('node%d: node sleep', nodeId);
        lastStatus = 'sleeping';
        break;
      case 5:
        console.log('node%d: node dead', nodeId);
        lastStatus = 'dead';
        break;
      case 6:
        console.log('node%d: node alive', nodeId);
        lastStatus = 'alive';
        break;
    }
    if (node && lastStatus) {
      node.lastStatus = lastStatus;
    }
  }

  oneLineSummary() {
    return 'Controller: ' + this.id + ' Path: ' + this.port.comName;
  }

  sceneEvent(nodeId, sceneId) {
    console.log('scene event: nodeId:', nodeId, 'sceneId', sceneId);
  }

  valueAdded(nodeId, comClass, value) {
    var node = this.nodes[nodeId];
    if (node) {
      node.zwValueAdded(comClass, value);
    }
  }

  valueChanged(nodeId, comClass, value) {
    var node = this.nodes[nodeId];
    if (node) {
      node.zwValueChanged(comClass, value);
    }
  }

  valueRemoved(nodeId, comClass, valueInstance, valueIndex) {
    var node = this.nodes[nodeId];
    if (node) {
      node.zwValueRemoved(comClass, valueInstance, valueIndex);
    }
  }

  // eslint-disable-next-line no-unused-vars
  startPairing(timeoutSeconds) {
    console.log('===============================================');
    console.log('Press the Inclusion button on the device to add');
    console.log('===============================================');
    this.zwave.addNode();
  }

  cancelPairing() {
    console.log('Cancelling pairing mode');
    this.zwave.cancelControllerCommand();
  }

  // eslint-disable-next-line no-unused-vars
  removeThing(node) {
    // ZWave can't really remove a particular thing.
    console.log('==================================================');
    console.log('Press the Exclusion button on the device to remove');
    console.log('==================================================');
    this.zwave.removeNode();
  }

  // eslint-disable-next-line no-unused-vars
  cancelRemoveThing(node) {
    console.log('Cancelling remove mode');
    this.zwave.cancelControllerCommand();
  }

  unload() {
    // Wrap in setTimeout to resolve issues with disconnect() hanging.
    // See: https://github.com/OpenZWave/node-openzwave-shared/issues/182
    setTimeout(() => {
      this.zwave.disconnect(this.port.comName);
    }).ref();

    return super.unload();
  }
}

function isZWavePort(port) {
  return ((port.vendorId == '0658' &&
           port.productId == '0200') ||  // Aeotech Z-Stick Gen-5
          (port.vendorId == '0658' &&
           port.productId == '0280') ||  // UZB1
          (port.vendorId == '10c4' &&
           port.productId == 'ea60'));   // Aeotech Z-Stick S2
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
      // Under OSX, SerialPort.list returns the /dev/tty.usbXXX instead
      // /dev/cu.usbXXX. tty.usbXXX requires DCD to be asserted which
      // isn't necessarily the case for ZWave dongles. The cu.usbXXX
      // doesn't care about DCD.
      if (port.comName.startsWith('/dev/tty.usb')) {
        port.comName = port.comName.replace('/dev/tty', '/dev/cu');
      }
      if (isZWavePort(port)) {
        callback(null, port);
        return;
      }
    }
    callback('No ZWave port found');
  });
}

function loadZWaveAdapters(addonManager, manifest, errorCallback) {
  try {
    ZWaveModule = require('openzwave-shared');
  } catch (err) {
    errorCallback(manifest.name, `Failed to load openzwave-shared: ${err}`);
    return;
  }

  findZWavePort(function (error, port) {
    if (error) {
      errorCallback(manifest.name, 'Unable to find ZWave adapter');
      return;
    }

    console.log('Found ZWave port @', port.comName);

    new ZWaveAdapter(addonManager, manifest.name, port);

    // The zwave adapter will be added when it's driverReady method is called.
    // Prior to that we don't know what the homeID of the adapter is.
  });
}

module.exports = loadZWaveAdapters;
