/**
 *
 * ZigBeeAdapter - Adapter which manages ZigBee devices.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

var Adapter = require('../../adapter').Adapter;
var ZigBeeNode = require('./zb-node');
var SerialPort = require('serialport');
var xbeeApi = require('xbee-api');
var at = require('./zb-at');
var util = require('util');
var utils = require('../../utils');
var zdo = require('./zb-zdo');
var zcl = require('zcl-packet');
var zclId = require('zcl-id');
var zigBeeClassifier = require('./zb-classifier');

var C = xbeeApi.constants;
var AT_CMD = at.AT_CMD;

const ZHA_PROFILE_ID = zclId.profile('HA').value;
const ZHA_PROFILE_ID_HEX = utils.hexStr(ZHA_PROFILE_ID, 4);

const DEVICE_TYPE = {
  0x30001: 'ConnectPort X8 Gateway',
  0x30002: 'ConnectPort X4 Gateway',
  0x30003: 'ConnectPort X2 Gateway',
  0x30005: 'RS-232 Adapter',
  0x30006: 'RS-485 Adapter',
  0x30007: 'XBee Sensor Adapter',
  0x30008: 'Wall Router',
  0x3000A: 'Digital I/O Adapter',
  0x3000B: 'Analog I/O Adapter',
  0x3000C: 'XStick',
  0x3000F: 'Smart Plug',
  0x30011: 'XBee Large Display',
  0x30012: 'XBee Small Display',
};

// Function which will convert endianess of hex strings.
// i.e. '12345678'.swapHex() returns '78563412'
String.prototype.swapHex = function() {
  return this.match(/.{2}/g).reverse().join('');
};

function serialWriteError(error) {
  if (error) {
    console.log('ZigBee: SerialPort.write error:', error);
    throw(error);
  }
}

const SEND_FRAME = 0x01;
const WAIT_FRAME = 0x02;
const EXEC_FUNC = 0x03;

class Command {
  constructor(cmdType, cmdData) {
    this.cmdType = cmdType;
    this.cmdData = cmdData;
  }
}

function FUNC(ths, func, args) {
  return new Command(EXEC_FUNC, [ths, func, args]);
}

class ZigBeeAdapter extends Adapter {
  constructor(adapterManager, port) {
    // We don't know our id yet. So we set it to ??? and once we can
    // communicate with the controller.
    //
    // The id will be the serial number of the controller.
    super(adapterManager, '???');

    this.port = port;

    // debugRawFrames causes the raw serial frames to/from the dongle
    // to be reported.
    this.debugRawFrames = false;

    // debugFrames causes a 1-line summary to be printed for each frame
    // which is sent or received.
    this.debugFrames = false;

    // debugFrameDetail causes detailed information about each frame to be
    // printed.
    this.debugDumpFrameDetail = false;

    // Use debugFlow if you need to debug the flow of the program. This causes
    // prints at the beginning of many functions to print some info.
    this.debugFlow = false;

    // debugFrameParsing causes frame detail about the initial frame, before
    // we do any parsing of the data to be printed. This is useful to enable
    // if the frame parsing code is crashing.
    this.debugFrameParsing = false;

    this.xb = new xbeeApi.XBeeAPI({
      api_mode: 1,
      raw_frames: this.debugRawFrames,
    });

    this.atAttr = {};
    this.nodes = {};
    this.cmdQueue = [];
    this.running = false;
    this.waitFrame = null;

    this.serialNumber = '0000000000000000';
    this.nextStartIndex = -1;

    this.zdo = new zdo.ZdoApi(this.xb);
    this.at = new at.AtApi();

    if (this.debugRawFrames) {
      this.xb.on('frame_raw', (rawFrame) => {
        console.log('Rcvd:', rawFrame);
        if (this.xb.canParse(rawFrame)) {
          var frame = this.xb.parseFrame(rawFrame);
          this.handleFrame(frame);
        }
      });
    } else {
      this.xb.on('frame_object', (frame) => {
        this.handleFrame(frame);
      });
    }

    console.log('ZigBee: Opening serial port', port.comName);
    this.serialport = new SerialPort(port.comName, {
      baudrate: 9600,
      parser: this.xb.rawParser(),
    }, (err) => {
      if (err) {
        console.error('ZigBee: SerialPort open err =', err);
      }

      this.queueCommands([
        this.AT(AT_CMD.DEVICE_TYPE_IDENTIFIER),
        this.AT(AT_CMD.CONFIGURED_64_BIT_PAN_ID),
        this.AT(AT_CMD.SERIAL_NUMBER_HIGH),
        this.AT(AT_CMD.SERIAL_NUMBER_LOW),
        this.AT(AT_CMD.NETWORK_ADDR_16_BIT),
        this.AT(AT_CMD.OPERATING_64_BIT_PAN_ID),
        this.AT(AT_CMD.OPERATING_16_BIT_PAN_ID),
        this.AT(AT_CMD.OPERATING_CHANNEL),
        this.AT(AT_CMD.SCAN_CHANNELS),
        this.AT(AT_CMD.NODE_IDENTIFIER),
        this.AT(AT_CMD.NUM_REMAINING_CHILDREN),
        this.AT(AT_CMD.NODE_JOIN_TIME),
        this.AT(AT_CMD.ZIGBEE_STACK_PROFILE),
        this.AT(AT_CMD.API_OPTIONS),
        this.AT(AT_CMD.ENCRYPTION_ENABLED),
        this.AT(AT_CMD.ENCRYPTION_OPTIONS),
        FUNC(this, this.configureIfNeeded, []),
        FUNC(this, this.adapterInitialized, []),
      ]);
    });
  }

  // This function is called once the Xbee controller has been initialized.
  adapterInitialized() {
    if (this.debugFlow) {
      console.log('ZigBee: adapter initialized');
    }
    this.dumpInfo();
    this.id = 'zb-' + this.serialNumber;
    this.manager.addAdapter(this);

    // Use this opertunity to create the node for the Coordinator.

    var coordinator = this.nodes[this.serialNumber] =
      new ZigBeeNode(this, this.serialNumber, this.networkAddr16);

    // Go find out what devices are on the network.
    this.queueCommands(
      this.getManagementLqiCommands(coordinator)
        .concat(this.getManagementRtgCommands(coordinator))
        .concat([
          FUNC(this, this.enumerateAllNodes, [this.populateNodeInfo]),
          FUNC(this, this.dumpNodes, []),
          FUNC(this, this.print, ['ZigBee: ----- Scan Complete -----']),
        ]));
  }

  AT(command, frame) {
    return [
      new Command(SEND_FRAME, this.at.makeFrame(command, frame)),
      new Command(WAIT_FRAME, {
        type: C.FRAME_TYPE.AT_COMMAND_RESPONSE,
        command: command
      })
    ];
  }

  configureIfNeeded() {
    if (this.debugFlow) {
      console.log('configureIfNeeded');
    }
    var configCommands = [];
    if (this.configuredPanId64 === '0000000000000000') {
      configCommands.push(this.AT(AT_CMD.CONFIGURED_64_BIT_PAN_ID,
                                  {configuredPanId: this.operatingPanId64}));
      configCommands.push(this.AT(AT_CMD.CONFIGURED_64_BIT_PAN_ID));
    }
    if (this.zigBeeStackProfile != 2) {
      configCommands.push(this.AT(AT_CMD.ZIGBEE_STACK_PROFILE,
                                  {zigBeeStackProfile: 2}));
      configCommands.push(this.AT(AT_CMD.ZIGBEE_STACK_PROFILE));
    }
    if (this.apiOptions != 1) {
      configCommands.push(this.AT(AT_CMD.API_OPTIONS,
                                  {apiOptions: 1}));
      configCommands.push(this.AT(AT_CMD.API_OPTIONS));
    }
    if (this.encryptionEnabled != 1) {
      configCommands.push(this.AT(AT_CMD.ENCRYPTION_ENABLED,
                                  {encryptionEnabled: 1}));
      configCommands.push(this.AT(AT_CMD.ENCRYPTION_ENABLED));
    }
    if (this.encryptionOptions != 2) {
      configCommands.push(this.AT(AT_CMD.ENCRYPTION_OPTIONS,
                                  {encryptionOptions: 2}));
      configCommands.push(this.AT(AT_CMD.ENCRYPTION_OPTIONS));
    }
    if (configCommands.length > 0) {
      // We're going to change something, so we might as well set the link
      // key, since it's write only and we can't tell if its been set before.
      configCommands.push(this.AT(AT_CMD.LINK_KEY,
                                  {linkKey: 'ZigBeeAlliance09'}));
      configCommands.push(this.AT(AT_CMD.WRITE_PARAMETERS));

      // TODO: It sends a modem status, but only the first time after the
      //       dongle powers up. So I'm not sure if we need to wait on anything
      // adter doing the WR command.
      //configCommands.push(new Command(WAIT_FRAME, {
      //  type: C.FRAME_TYPE.MODEM_STATUS
      //}));
      this.queueCommandsAtFront(configCommands);
    } else {
      console.log('ZigBee: No configuration requried');
    }
  }

  dumpFrame(label, frame) {
    var frameTypeStr = C.FRAME_TYPE[frame.type];
    if (!frameTypeStr) {
      frameTypeStr = 'Unknown(0x' + frame.type.toString(16) + ')';
    }
    var atCmdStr;

    switch (frame.type) {
      case C.FRAME_TYPE.AT_COMMAND:
        if (frame.command in AT_CMD) {
          atCmdStr = AT_CMD[frame.command];
        } else {
          atCmdStr = frame.command;
        }
        if (frame.commandParameter.length > 0) {
          console.log(label, frameTypeStr, 'Set', atCmdStr);
          if (this.debugDumpFrameDetail) {
            console.log(label, frame);
          }
        } else {
          console.log(label, frameTypeStr, 'Get', atCmdStr);
        }
        break;

      case C.FRAME_TYPE.AT_COMMAND_RESPONSE:
        if (frame.command in AT_CMD) {
          atCmdStr = AT_CMD[frame.command];
        } else {
          atCmdStr = frame.command;
        }
        console.log(label, frameTypeStr, atCmdStr);
        if (this.debugDumpFrameDetail) {
          console.log(label, frame);
        }
        break;

      case C.FRAME_TYPE.EXPLICIT_ADDRESSING_ZIGBEE_COMMAND_FRAME:
        if (this.zdo.isZdoFrame(frame)) {
          console.log(label, 'Explicit Tx', frame.destination64, 'ZDO',
                      this.zdo.getClusterIdAsString(frame.clusterId),
                      this.zdo.getClusterIdDescription(frame.clusterId));
        } else if (this.isZhaFrame(frame)) {
          console.log(label, 'Explicit Tx', frame.destination64,
                      'ZHA', frame.clusterId,
                      zclId.cluster(parseInt(frame.clusterId, 16)).key,
                      frame.zcl.cmd);
        } else {
          console.log(label, frame.destination64, frame.clusterId);
        }
        if (this.debugDumpFrameDetail) {
          console.log(label, util.inspect(frame, {depth: null}));
        }
        break;

      case C.FRAME_TYPE.ZIGBEE_EXPLICIT_RX:
        if (this.zdo.isZdoFrame(frame)) {
          console.log(label, 'Explicit Rx', frame.remote64,
                      'ZDO', frame.clusterId,
                      this.zdo.getClusterIdDescription(frame.clusterId));
        } else if (this.isZhaFrame(frame)) {
          console.log(label, 'Explicit Rx', frame.remote64,
                      'ZHA', frame.clusterId,
                      zclId.cluster(parseInt(frame.clusterId, 16)).key,
                      frame.zcl.cmdId);
        } else {
          console.log(label, frame.remote64, frame.clusterId);
        }
        if (this.debugDumpFrameDetail) {
          console.log(label, util.inspect(frame, {depth: null}));
        }
        break;

      case C.FRAME_TYPE.ZIGBEE_TRANSMIT_STATUS:
        if (this.debugDumpFrameDetail || frame.deliveryStatus !== 0) {
          console.log(label, frameTypeStr,
                      'Remote16:', frame.remote16,
                      'Retries:', frame.transmitRetryCount,
                      'Delivery:',
                      this.getDeliveryStatusAsString(frame.deliveryStatus),
                      'Discovery:',
                      this.getDiscoveryStatusAsString(frame.discoveryStatus));
        }
        break;

      case C.FRAME_TYPE.MODEM_STATUS:
        console.log(label, frameTypeStr, 'modemStatus:',
                    this.getModemStatusAsString(frame.modemStatus));
        break;

      case C.FRAME_TYPE.ROUTE_RECORD:
        if (this.debugDumpFrameDetail) {
          console.log(label, frameTypeStr);
          console.log(label, frame);
        }
        break;

      default:
        console.log(label, frameTypeStr);
        if (this.debugDumpFrameDetail) {
          console.log(label, frame);
        }
    }
  }

  dumpInfo() {
    var deviceTypeString = DEVICE_TYPE[this.deviceTypeIdentifier];
    if (!deviceTypeString) {
      deviceTypeString = '??? Unknown ???';
    }
    console.log('ZigBee:        Device Type:',
                '0x' + this.deviceTypeIdentifier.toString(16) +
                ' - ' + deviceTypeString);
    console.log('ZigBee:    Network Address:', this.serialNumber,
                                               this.networkAddr16);
    console.log('ZigBee:    Node Identifier:', this.nodeIdentifier);
    console.log('ZigBee:  Configured PAN Id:', this.configuredPanId64);
    console.log('ZigBee:   Operating PAN Id:', this.operatingPanId64,
                                               this.operatingPanId16);
    console.log('ZigBee:  Operating Channel:', this.operatingChannel);
    console.log('ZigBee:  Channel Scan Mask:', this.scanChannels.toString(16));
    console.log('ZigBee:          Join Time:', this.networkJoinTime);
    console.log('ZigBee: Remaining Children:', this.numRemainingChildren);
    console.log('ZigBee:      Stack Profile:', this.zigBeeStackProfile);
    console.log('ZigBee:        API Options:', this.apiOptions);
    console.log('ZigBee: Encryption Enabled:', this.encryptionEnabled);
    console.log('ZigBee: Encryption Options:', this.encryptionOptions);
  }

  dumpNodes() {
    var deviceType = ['Coord ',
                      'Router',
                      'EndDev',
                      '???   '];
    var relationship = ['Parent  ',
                        'Child   ',
                        'Sibling ',
                        'None    ',
                        'Previous'];
    var permitJoins = ['Y', 'N', '?', '?'];

    console.log('ZigBee: ----- Nodes -----');
    for (var nodeId in this.nodes) {
      var node = this.nodes[nodeId];
      var name = utils.padRight(node.name, 32);
      console.log('ZigBee: Node:', node.addr64, node.addr16,
                  'Name:', name,
                  'endpoints:', Object.keys(node.activeEndpoints));
      for (var neighbor of node.neighbors) {
        console.log('ZigBee:   Neighbor: %s %s DT: %s R: %s PJ: %s D: %s ' +
                    'LQI: %s',
                    neighbor.addr64,
                    neighbor.addr16,
                    deviceType[neighbor.deviceType],
                    relationship[neighbor.relationship],
                    permitJoins[neighbor.permitJoining],
                    ('   ' + neighbor.depth).slice(-3),
                    ('   ' + neighbor.lqi).slice(-3));
      }
    }
    console.log('ZigBee: -----------------');
  }

  enumerateAllNodes(iterCb, doneCb) {
    if (this.debugFlow) {
      console.log('enumerateAllNodes');
    }
    this.enumerateIterCb = iterCb;
    this.enumerateDoneCb = doneCb;
    this.enumerateNodes = [];
    for (var nodeId in this.nodes) {
      var node = this.nodes[nodeId];
      this.enumerateNodes.push(node);
    }
    this.enumerateNextNode();
  }

  enumerateNextNode() {
    if (this.debugFlow) {
      console.log('enumerateNextNode');
    }
    var node = this.enumerateNodes.shift();
    if (node) {
      // Note that iterCb should queue it's commands in front of the
      //
      this.queueCommandsAtFront([
        FUNC(this, this.enumerateNextNode, []),
      ]);
      this.enumerateIterCb(node);
    } else {
      if (this.enumerateDonCb) {
        this.enumerateDoneCb(node);
      }
    }
  }

  flattenCommands(cmdSeq) {
    var cmds = [];
    for (var cmd of cmdSeq) {
      if (cmd.constructor === Array) {
        for (var cmd2 of cmd) {
          cmds.push(cmd2);
        }
      } else {
        cmds.push(cmd);
      }
    }
    return cmds;
  }

  getDeliveryStatusAsString(deliveryStatus) {
    if (deliveryStatus in C.DELIVERY_STATUS) {
      return C.DELIVERY_STATUS[deliveryStatus];
    }
    return '??? 0x' + deliveryStatus.toString(16) + ' ???';
  }

  getDiscoveryStatusAsString(discoveryStatus) {
    if (discoveryStatus in C.DISCOVERY_STATUS) {
      return C.DISCOVERY_STATUS[discoveryStatus];
    }
    return '??? 0x' + discoveryStatus.toString(16) + ' ???';
  }

  getModemStatusAsString(modemStatus) {
    if (modemStatus in C.MODEM_STATUS) {
      return C.MODEM_STATUS[modemStatus];
    }
    return '??? 0x' + modemStatus.toString(16) + ' ???';
  }

  //----- Misc Commands -----------------------------------------------------

  handleExplicitRx(frame) {
    if (this.zdo.isZdoFrame(frame)) {
      this.zdo.parseZdoFrame(frame);
      var clusterId = parseInt(frame.clusterId, 16);
      if (clusterId in ZigBeeAdapter.zdoClusterHandler) {
        ZigBeeAdapter.zdoClusterHandler[clusterId].call(this, frame);
      }
    } else if (this.isZhaFrame(frame)) {
      zcl.parse(frame.data, parseInt(frame.clusterId, 16), (error, data) => {
        if (error) {
          console.log('Error parsing ZHA frame:', frame);
          console.log(error);
        } else {
          frame.zcl = data;
          var node = this.nodes[frame.remote64];
          if (node) {
            node.handleZhaResponse(frame);
          }
        }
      });
    }
  }

  handleTransmitStatus(frame) {
    if (frame.deliveryStatus !== 0) {
      console.error('Transmit Status ERROR:', '0x' +
                    frame.deliveryStatus.toString(16));
    }
  }

  handleRouteRecord(frame) {
    if (this.debugFlow) {
      console.log('Processing ROUTE_RECORD');
    }
  }

  sendFrames(frames) {
    var commands = [];
    for (var frame of frames) {
      commands = commands.concat([
        new Command(SEND_FRAME, frame),
        new Command(WAIT_FRAME, {
          type: C.FRAME_TYPE.ZIGBEE_TRANSMIT_STATUS,
          id: frame.id,
        }),
      ]);
    }
    this.queueCommandsAtFront(commands);
  }

  //----- AT Commands -------------------------------------------------------

  handleAtResponse(frame) {
    if (frame.commandData.length) {
      this.at.parseFrame(frame);
      if (frame.command in ZigBeeAdapter.atCommandMap) {
        var varName = ZigBeeAdapter.atCommandMap[frame.command];
        this[varName] = frame[varName];
      } else {
        if (frame.command in ZigBeeAdapter.atResponseHandler) {
          ZigBeeAdapter.atResponseHandler[frame.command].call(this, frame);
        }
      }
    }
  }

  handleAtSerialNumberHigh(frame) {
    this.serialNumber =
      frame.serialNumberHigh + this.serialNumber.slice(8, 8);
  }

  handleAtSerialNumberLow(frame) {
    this.serialNumber = this.serialNumber.slice(0, 8) + frame.serialNumberLow;
  }

  //----- GET ACTIVE ENDPOINTS ----------------------------------------------

  getActiveEndpoint(node) {
    if (this.debugFlow) {
      console.log('getActiveEndpoint node.addr64 =', node.addr64);
    }
    this.queueCommandsAtFront(this.getActiveEndpointCommands(node));
  }

  getActiveEndpointCommands(node) {
    if (this.debugFlow) {
      console.log('getActiveEndpointCommands node.addr64 =', node.addr64);
    }
    this.activeEndpointResponseCount = 0;
    this.activeEndpointRetryCount = 0;
    return this.getActiveEndpointCommandsOnly(node);
  }

  getActiveEndpointCommandsOnly(node) {
    if (this.debugFlow) {
      console.log('getActiveEndpointCommandsOnly node.addr64 =', node.addr64);
    }
    var nodeDescFrame = this.zdo.makeFrame({
      destination64: node.addr64,
      destination16: node.addr16,
      clusterId: zdo.CLUSTER_ID.ACTIVE_ENDPOINTS_REQUEST,
    });
    return [
      new Command(SEND_FRAME, nodeDescFrame),
      new Command(WAIT_FRAME, {
        type: C.FRAME_TYPE.ZIGBEE_TRANSMIT_STATUS,
        id: nodeDescFrame.id,
      }),
      FUNC(this, this.retryGetActiveEndpointIfNeeded, [node]),
    ];
  }

  retryGetActiveEndpointIfNeeded(node) {
    if (this.debugFlow) {
      console.log('retryGetActiveEndpointIfNeeded node.addr64 =', node.addr64,
                  'responseCount =', this.activeEndpointResponseCount,
                  'retryCount =', this.activeEndpointRetryCount);
    }
    if (this.activeEndpointResponseCount > 0) {
      return;
    }
    this.activeEndpointRetryCount++;
    if (this.activeEndpointRetryCount < 5) {
      this.queueCommandsAtFront(this.getActiveEndpointCommandsOnly(node));
    }
  }

  handleActiveEndpointsResponse(frame) {
    if (this.debugFlow) {
      console.log('Processing ACTIVE_ENDPOINTS_RESPONSE');
    }
    this.activeEndpointResponseCount++;
    var node = this.nodes[frame.remote64];
    if (node) {
      for (var endpoint of frame.activeEndpoints) {
        if (!(endpoint in node.activeEndpoints)) {
          node.activeEndpoints[endpoint] = {};
        }
      }
    }
  }

  //----- GET MANAGEMENT LQI ------------------------------------------------

  getManagementLqi(node, startIndex) {
    if (!startIndex) {
      startIndex = 0;
    }
    if (this.debugFlow) {
      console.log('getManagementLqi node.addr64 =', node.addr64,
                  'startIndex:', startIndex);
    }

    this.queueCommandsAtFront(this.getManagementLqiCommands(node, startIndex));
  }

  getManagementLqiCommands(node, startIndex) {
    if (!startIndex) {
      startIndex = 0;
    }
    if (this.debugFlow) {
      console.log('getManagementLqiCommands node.addr64 =', node.addr64,
                  'startIndex:', startIndex);
    }
    var lqiFrame = this.zdo.makeFrame({
      destination64: node.addr64,
      destination16: node.addr16,
      clusterId: zdo.CLUSTER_ID.MANAGEMENT_LQI_REQUEST,
      startIndex: startIndex,
    });
    return [
      new Command(SEND_FRAME, lqiFrame),
      new Command(WAIT_FRAME, {
        type: C.FRAME_TYPE.ZIGBEE_TRANSMIT_STATUS,
        id: lqiFrame.id,
      }),
      FUNC(this, this.getManagementLqiNext, [node]),
    ];
  }

  getManagementLqiNext(node) {
     if (this.nextStartIndex >= 0) {
       var nextStartIndex = this.nextStartIndex;
       this.nextStartIndex = -1;
       this.queueCommandsAtFront(
           this.getManagementLqiCommands(node, nextStartIndex));
     }
  }

  handleManagementLqiResponse(frame) {
    if (this.debugFlow) {
      console.log('Processing CLUSTER_ID.MANAGEMENT_LQI_RESPONSE');
    }
    var node = this.nodes[frame.remote64];
    if (!node) {
      node = this.nodes[frame.remote64] = new ZigBeeNode(this,
                                                          frame.remote64,
                                                          frame.remote16);
    }

    for (var i = 0; i < frame.numEntriesThisResponse; i++) {
      var neighborIndex = frame.startIndex + i;
      var neighbor = frame.neighbors[i];
      node.neighbors[neighborIndex] = neighbor;
      if (this.debugFlow) {
        console.log('Added neighbor', neighbor.addr64);
      }
      var neighborNode = this.nodes[neighbor.addr64];
      if (!neighborNode) {
        this.nodes[neighbor.addr64] = new ZigBeeNode(this,
                                                      neighbor.addr64,
                                                      neighbor.addr16);
        neighborNode = this.nodes[neighbor.addr64];
      }
      if (neighborNode.addr16 == 'fffe') {
        neighborNode.addr16 = neighbor.addr16;
      }
    }

    if (frame.startIndex + frame.numEntriesThisResponse <
        frame.numEntries) {
      this.nextStartIndex =
        frame.startIndex + frame.numEntriesThisResponse;
    } else {
      this.nextStartIndex = -1;
    }
  }

  //----- GET MANAGEMENT RTG ------------------------------------------------

  getManagementRtgCommands(node, startIndex) {
    if (!startIndex) {
      startIndex = 0;
    }
    if (this.debugFlow) {
      console.log('getManagementRtgCommands node.addr64 =', node.addr64,
                  'startIndex:', startIndex);
    }
    var rtgFrame = this.zdo.makeFrame({
      destination64: node.addr64,
      destination16: node.addr16,
      clusterId: zdo.CLUSTER_ID.MANAGEMENT_RTG_REQUEST,
      startIndex: startIndex,
    });
    return [
      new Command(SEND_FRAME, rtgFrame),
      new Command(WAIT_FRAME, {
        type: C.FRAME_TYPE.ZIGBEE_TRANSMIT_STATUS,
        id: rtgFrame.id,
      }),
      FUNC(this, this.getManagementRtgNext, [node]),
    ];
  }

  getManagementRtgNext(node) {
     if (this.nextStartIndex >= 0) {
       var nextStartIndex = this.nextStartIndex;
       this.nextStartIndex = -1;
       this.queueCommandsAtFront(
           this.getManagementRtgCommands(node, nextStartIndex));
     }
  }

  handleManagementRtgResponse(frame) {
    if (frame.startIndex + frame.numEntriesThisResponse <
        frame.numEntries) {
      this.nextStartIndex = frame.startIndex +
                            frame.numEntriesThisResponse;
    } else {
      this.nextStartIndex = -1;
    }
  }

  //----- GET NODE DESCRIPTOR -----------------------------------------------

  getNodeDescriptors() {
    if (this.debugFlow) {
      console.log('getNodeDescriptors');
    }
    this.enumerateAllNodes(this.getNodeDescriptor);
  }

  getNodeDescriptor(node) {
    if (this.debugFlow) {
      console.log('getNodeDescriptor node.addr64 =', node.addr64);
    }
    var nodeDescFrame = this.zdo.makeFrame({
      destination64: node.addr64,
      destination16: node.addr16,
      clusterId: zdo.CLUSTER_ID.NODE_DESCRIPTOR_REQUEST,
    });
    this.queueCommandsAtFront([
      new Command(SEND_FRAME, nodeDescFrame),
      new Command(WAIT_FRAME, {
        type: C.FRAME_TYPE.ZIGBEE_TRANSMIT_STATUS,
        id: nodeDescFrame.id,
      }),
    ]);
  }

  //----- GET SIMPLE DESCRIPTOR ---------------------------------------------

  getSimpleDescriptors(node) {
    if (this.debugFlow) {
      console.log('getSimpleDescriptors node.addr64 =', node.addr64);
    }
    var commands = [];
    for (var endpoint in node.activeEndpoints) {
      commands = commands.concat(
        this.getSimpleDescriptorCommands(node, endpoint));
    }
    this.queueCommandsAtFront(commands);
  }

  getSimpleDescriptor(node, endpoint) {
    if (this.debugFlow) {
      console.log('getSimpleDescriptor node.addr64 =', node.addr64,
                  'endpoint =', endpoint);
    }
    this.queueCommandsAtFront(this.getSimpleDescriptorCommands(node, endpoint));
  }

  getSimpleDescriptorCommands(node, endpoint) {
    if (this.debugFlow) {
      console.log('getSimpleDescriptorCommands: node.addr64 =', node.addr64,
                  'endpoint =', endpoint);
    }
    var nodeDescFrame = this.zdo.makeFrame({
      destination64: node.addr64,
      destination16: node.addr16,
      clusterId: zdo.CLUSTER_ID.SIMPLE_DESCRIPTOR_REQUEST,
      endpoint: endpoint,
    });
    return [
      new Command(SEND_FRAME, nodeDescFrame),
      new Command(WAIT_FRAME, {
        type: C.FRAME_TYPE.ZIGBEE_TRANSMIT_STATUS,
        id: nodeDescFrame.id,
      }),
    ];
  }

  handleSimpleDescriptorResponse(frame) {
    if (this.debugFlow) {
      console.log('Processing SIMPLE_DESCRIPTOR_RESPONSE');
    }
    var node = this.nodes[frame.remote64];
    if (node) {
      var endpoint = node.activeEndpoints[frame.endpoint];
      if (endpoint) {
        endpoint.profileId = frame.appProfileId;
        endpoint.deviceId = frame.appDeviceId;
        endpoint.deviceVersion = frame.appDeviceVersion;
        endpoint.inputClusters = frame.inputClusters.slice(0);
        endpoint.outputClusters = frame.outputClusters.slice(0);
      }
    }
  }

  //-------------------------------------------------------------------------

  sendFrame(frame) {
    this.queueCommands([new Command(SEND_FRAME, frame),
                        new Command(WAIT_FRAME, {
                          type: C.FRAME_TYPE.ZIGBEE_TRANSMIT_STATUS,
                          id: frame.id,
                        }),
                      ]);
  }

  //-------------------------------------------------------------------------

  handleDeviceAdded(node) {
    if (this.debugFlow) {
      console.log('ZigBeeAdapter: handleDeviceAdded: ', node.addr64);
    }
    if (node.isCoordinator) {
      node.name = node.defaultName;
    } else {
      zigBeeClassifier.classify(node);
      super.handleDeviceAdded(node);
    }
  }

  handleFrame(frame) {
    if (this.debugFrameParsing) {
      this.dumpFrame('Rcvd (before parsing):', frame);
    }
    var frameHandler = ZigBeeAdapter.frameHandler[frame.type];
    if (frameHandler) {
      frameHandler.call(this, frame);
    }
    if (this.debugFrames) {
      this.dumpFrame('Rcvd:', frame);
    }

    if (this.waitFrame) {
      if (this.debugFlow) {
        console.log('Waiting for', this.waitFrame);
      }
      var match = true;
      for (var propertyName in this.waitFrame) {
        if (this.waitFrame[propertyName] != frame[propertyName]) {
          match = false;
          break;
        }
      }
      if (match) {
        if (this.debugFlow) {
          console.log('Wait satisified');
        }
        this.waitFrame = null;
      }
    }
    this.run();
  }

  isZhaFrame(frame) {
    if (typeof(frame.profileId) === 'number') {
      return frame.profileId === ZHA_PROFILE_ID;
    }
    return frame.profileId === ZHA_PROFILE_ID_HEX;
  }

  populateNodeInfo(node) {
    if (this.debugFlow) {
      console.log('populateNodeInfo node.addr64 =', node.addr64);
    }
    var commands = this.getActiveEndpointCommands(node);
    commands = commands.concat([
      FUNC(this, this.populateNodeInfoEndpoints, [node]),
      FUNC(this, this.handleDeviceAdded, [node])
    ]);
    this.queueCommandsAtFront(commands);
  }

  populateNodeInfoEndpoints(node) {
    if (this.debugFlow) {
      console.log('populateNodeInfoEndpoints node.addr64 =', node.addr64);
    }
    this.getSimpleDescriptors(node);
  }

  print(str) {
    console.log(str);
  }

  queueCommands(cmdSeq) {
    if (this.debugFlow) {
      console.log('queueCommands');
    }
    this.cmdQueue = this.cmdQueue.concat(this.flattenCommands(cmdSeq));
    if (!this.running) {
      this.run();
    }
  }

  queueCommandsAtFront(cmdSeq) {
    if (this.debugFlow) {
      console.log('queueCommandsAtFront');
    }
    this.cmdQueue = this.flattenCommands(cmdSeq).concat(this.cmdQueue);
    if (!this.running) {
      this.run();
    }
  }

  run() {
    if (this.debugFlow) {
      console.log('run queue len =', this.cmdQueue.length);
    }
    if (this.waitFrame) {
      if (this.debugFlow) {
        console.log('Queue stalled waiting for frame.');
      }
      return;
    }
    if (this.running) {
      if (this.debugFlow) {
        console.log('Queue already running.');
      }
      return;
    }
    this.running = true;
    while (this.cmdQueue.length > 0 && !this.waitFrame) {
      var cmd = this.cmdQueue.shift();
      switch (cmd.cmdType) {

        case SEND_FRAME:
          if (this.debugFlow) {
            console.log('SEND_FRAME');
          }
          var frame = cmd.cmdData;
          if (this.debugFrames) {
            this.dumpFrame('Sent:', frame);
          }
          var rawFrame = this.xb.buildFrame(frame);
          if (this.debugRawFrames) {
            console.log('Sent:', rawFrame);
          }
          this.serialport.write(rawFrame, serialWriteError);
          break;

        case WAIT_FRAME:
          if (this.debugFlow) {
            console.log('WAIT_FRAME');
          }
          this.waitFrame = cmd.cmdData;
          break;

        case EXEC_FUNC:
          var ths = cmd.cmdData[0];
          var func = cmd.cmdData[1];
          var args = cmd.cmdData[2];
          if (this.debugFlow) {
            console.log('EXEC_FUNC', func.name);
          }
          func.apply(ths, args);
          break;
      }
    }
    this.running = false;
  }
}

var acm = ZigBeeAdapter.atCommandMap = {};
acm[AT_CMD.API_OPTIONS] = 'apiOptions';
acm[AT_CMD.CONFIGURED_64_BIT_PAN_ID] = 'configuredPanId64';
acm[AT_CMD.DEVICE_TYPE_IDENTIFIER] = 'deviceTypeIdentifier';
acm[AT_CMD.ENCRYPTION_ENABLED] = 'encryptionEnabled';
acm[AT_CMD.ENCRYPTION_OPTIONS] = 'encryptionOptions';
acm[AT_CMD.NETWORK_ADDR_16_BIT] = 'networkAddr16';
acm[AT_CMD.NODE_IDENTIFIER] = 'nodeIdentifier';
acm[AT_CMD.NODE_JOIN_TIME] = 'networkJoinTime';
acm[AT_CMD.NUM_REMAINING_CHILDREN] = 'numRemainingChildren';
acm[AT_CMD.OPERATING_16_BIT_PAN_ID] = 'operatingPanId16';
acm[AT_CMD.OPERATING_64_BIT_PAN_ID] = 'operatingPanId64';
acm[AT_CMD.OPERATING_CHANNEL] = 'operatingChannel';
acm[AT_CMD.SCAN_CHANNELS] = 'scanChannels';
acm[AT_CMD.ZIGBEE_STACK_PROFILE] = 'zigBeeStackProfile';

var arh = ZigBeeAdapter.atResponseHandler = {};
arh[AT_CMD.SERIAL_NUMBER_HIGH] =
  ZigBeeAdapter.prototype.handleAtSerialNumberHigh;
arh[AT_CMD.SERIAL_NUMBER_LOW] =
  ZigBeeAdapter.prototype.handleAtSerialNumberLow;

var fh = ZigBeeAdapter.frameHandler = {};
fh[C.FRAME_TYPE.AT_COMMAND_RESPONSE] =
  ZigBeeAdapter.prototype.handleAtResponse;
fh[C.FRAME_TYPE.ZIGBEE_EXPLICIT_RX] =
  ZigBeeAdapter.prototype.handleExplicitRx;
fh[C.FRAME_TYPE.ZIGBEE_TRANSMIT_STATUS] =
  ZigBeeAdapter.prototype.handleTransmitStatus;
fh[C.FRAME_TYPE.ROUTE_RECORD] =
  ZigBeeAdapter.prototype.handleRouteRecord;

var zch = ZigBeeAdapter.zdoClusterHandler = {};
zch[zdo.CLUSTER_ID.ACTIVE_ENDPOINTS_RESPONSE] =
  ZigBeeAdapter.prototype.handleActiveEndpointsResponse;
zch[zdo.CLUSTER_ID.MANAGEMENT_LQI_RESPONSE] =
  ZigBeeAdapter.prototype.handleManagementLqiResponse;
zch[zdo.CLUSTER_ID.MANAGEMENT_RTG_RESPONSE] =
  ZigBeeAdapter.prototype.handleManagementRtgResponse;
zch[zdo.CLUSTER_ID.SIMPLE_DESCRIPTOR_RESPONSE] =
  ZigBeeAdapter.prototype.handleSimpleDescriptorResponse;

function isDigiPort(port) {
  // Note that 0403:6001 is the default FTDI VID:PID, so we need to further
  // refine the search using the manufacturer.
  return (port.vendorId === '0x0403' &&
          port.productId === '0x6001' &&
          port.manufacturer === 'Digi');
}

// Scan the serial ports looking for an XBee adapter.
//
//    callback(error, port)
//        Upon success, callback is invoked as callback(null, port) where `port`
//        is the port object from SerialPort.list().
//        Upon failure, callback is invoked as callback(err) instead.
//
function findDigiPorts() {
  return new Promise((resolve, reject) => {
    SerialPort.list((error, ports) => {
      if (error) {
        reject(error);
      } else {
        var digiPorts = ports.filter(isDigiPort);
        if (digiPorts.length) {
          resolve(digiPorts);
        } else {
          reject('No Digi port found');
        }
      }
    });
  });
}

function loadZigBeeAdapters(adapterManager) {
  findDigiPorts().then((digiPorts) => {
    for (var port of digiPorts) {
      /* jshint -W031 */
      new ZigBeeAdapter(adapterManager, port);
    }
  }, (error) => {
    console.error(error);
  });
}

module.exports = loadZigBeeAdapters;
