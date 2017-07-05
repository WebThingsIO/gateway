/**
 *
 * zb-zdo - Frame builder/parser for the ZigBee ZDO layer
 *
 * This follows the pattern used for the xbee-api, and builds the
 * buffer needed for the frame.data used with the
 * EXPLICIT_ADDRESSING_ZIGBEE_COMMAND_FRAME (0x11) command.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

var assert = require('assert');
var BufferBuilder = require('buffer-builder');
var BufferReader = require('buffer-reader');
var utils = require('../utils');
var xbeeApi = require('xbee-api');

var C = xbeeApi.constants;

exports = module.exports;

const ZDO_PROFILE_ID = 0;
const ZDO_PROFILE_ID_HEX = utils.hexStr(ZDO_PROFILE_ID, 4);

var zci = exports.CLUSTER_ID = {};

// Function which will convert endianess of hex strings.
// i.e. '12345678'.swapHex() returns '78563412'
String.prototype.swapHex = function() {
  return this.match(/.{2}/g).reverse().join('');
};

zci.NODE_DESCRIPTOR_REQUEST = 0x0002;
zci[zci.NODE_DESCRIPTOR_REQUEST] = 'Node Descriptor Req (0x0002)';
zci.NODE_DESCRIPTOR_RESPONSE = 0x8002;
zci[zci.NODE_DESCRIPTOR_RESPONSE] = 'Node Descriptor Resp (0x8002)';

zci.SIMPLE_DESCRIPTOR_REQUEST = 0x0004;
zci[zci.SIMPLE_DESCRIPTOR_REQUEST] = 'Simple Descriptor Req (0x0004)';
zci.SIMPLE_DESCRIPTOR_RESPONSE = 0x8004;
zci[zci.SIMPLE_DESCRIPTOR_RESPONSE] = 'Simple Descriptor Resp (0x8004)';

zci.ACTIVE_ENDPOINTS_REQUEST = 0x0005;
zci[zci.ACTIVE_ENDPOINTS_REQUEST] = 'Active Endpoints Req (0x0005)';
zci.ACTIVE_ENDPOINTS_RESPONSE = 0x8005;
zci[zci.ACTIVE_ENDPOINTS_RESPONSE] = 'Active Endpoints Resp (0x8005)';

zci.MATCH_DESCRIPTOR_REQUEST = 0x0006;
zci[zci.MATCH_DESCRIPTOR_REQUEST] = 'Match Descriptor Req (0x0005)';

zci.END_DEVICE_ANNOUNCEMENT = 0x0013;
zci[zci.END_DEVICE_ANNOUNCEMENT] = 'End Device Announcement (0x0013)';

zci.BIND_REQUEST = 0x0021;
zci[zci.BIND_REQUEST] = 'Bind Req (0x0021)';
zci.BIND_RESPONSE = 0x8021;
zci[zci.BIND_RESPONSE] = 'Bind Resp (0x8021)';

zci.MANAGEMENT_LQI_REQUEST = 0x0031;
zci[zci.MANAGEMENT_LQI_REQUEST] = 'Mgmt LQI (Neighbor Table) Req (0x0031)';
zci.MANAGEMENT_LQI_RESPONSE = 0x8031;
zci[zci.MANAGEMENT_LQI_RESPONSE] = 'Mgmt LQI (Neighbor Table) Resp (0x8031)';

zci.MANAGEMENT_RTG_REQUEST = 0x0032;
zci[zci.MANAGEMENT_RTG_REQUEST] = 'Mgmt RTG (Routing Table) Req (0x0032)';
zci.MANAGEMENT_RTG_RESPONSE = 0x8032;
zci[zci.MANAGEMENT_RTG_RESPONSE] = 'Mgmt RTG (Routing Table) Resp (0x8032)';

zci.MANAGEMENT_LEAVE_REQUEST = 0x0034;
zci[zci.MANAGEMENT_LEAVE_REQUEST] = 'Mgmt Leave Req (0x0034)';
zci.MANAGEMENT_LEAVE_RESPONSE = 0x8034;
zci[zci.MANAGEMENT_LEAVE_RESPONSE] = 'Mgmt Leave Resp (0x8034)';

zci.MANAGEMENT_PERMIT_JOIN_REQUEST = 0x0036;
zci[zci.MANAGEMENT_PERMIT_JOIN_REQUEST] = 'Mgmt Permit Join Req (0x0036)';
zci.MANAGEMENT_PERMIT_JOIN_RESPONSE = 0x8036;
zci[zci.MANAGEMENT_PERMIT_JOIN_RESPONSE] = 'Mgmt Permit Join Resp (0x8036)';

zci.MANAGEMENT_NETWORK_UPDATE_REQUEST = 0x0038;
zci[zci.MANAGEMENT_NETWORK_UPDATE_REQUEST] = 'Mgmt Network Update Req (0x0038)';
zci.MANAGEMENT_NETWORK_UPDATE_NOTIFY = 0x8038;
zci[zci.MANAGEMENT_NETWORK_UPDATE_NOTIFY] =
  'Mgmt Network Update Notify (0x8038)';

var zdoBuilder = module.exports.zdoBuilder = {};
var zdoParser = module.exports.zdoParser = {};

class ZdoApi {
  constructor(xb) {
    this.xb = xb;
  }

  getClusterIdAsString(clusterId) {
    if (typeof(clusterId) === 'number') {
      return utils.hexStr(clusterId, 4);
    }
    return '' + clusterId;
  }

  getClusterIdAsInt(clusterId) {
    if (typeof(clusterId) === 'number' ) {
      return clusterId;
    }
    return parseInt(clusterId, 16);
  }

  getClusterIdDescription(clusterId) {
    clusterId = this.getClusterIdAsInt(clusterId);
    if (clusterId in zci) {
      return zci[clusterId];
    }
    return '??? 0x' + this.getClusterIdAsString(clusterId) + ' ???';
  }

  makeFrame(frame) {
    assert(frame, 'Frame parameter must be a frame object');
    assert(frame.destination64, 'Caller must provide frame.destination64');
    assert(frame.destination16, 'Caller must provide frame.destination16');
    assert(frame.clusterId, 'Caller must provide frame.clusterId');

    var frameId = xbeeApi._frame_builder.nextFrameId();

    var zdoData = Buffer.alloc(256);
    var builder = new BufferBuilder(zdoData);
    builder.appendUInt8(frameId);

    if (!zdoBuilder[frame.clusterId]) {
      throw new Error('This library does not implement building the 0x' +
                      this.getClusterIdAsString(frame.clusterId) +
                      ' frame type.');
    }

    frame.id = frameId;
    frame.type = C.FRAME_TYPE.EXPLICIT_ADDRESSING_ZIGBEE_COMMAND_FRAME;
    frame.sourceEndpoint = 0;
    frame.destinationEndpoint = 0;
    frame.profileId = 0;

    if (!('broadcastRadius' in frame)) {
      frame.broadcastRadius = 0;
    }
    if (!('options' in frame)) {
      frame.options = 0;
    }

    zdoBuilder[frame.clusterId](frame, builder);

    frame.data = zdoData.slice(0, builder.length);

    return frame;
  }

  isZdoFrame(frame) {
    if (typeof(frame.profileId) === 'number') {
      return frame.profileId === ZDO_PROFILE_ID;
    }
    return frame.profileId === ZDO_PROFILE_ID_HEX;
  }

  parseZdoFrame(frame) {
    var reader = new BufferReader(frame.data);
    frame.zdoSeq = reader.nextUInt8();
    zdoParser[this.getClusterIdAsInt(frame.clusterId)](frame, reader);
  }
}

exports.ZdoApi = ZdoApi;

//---------------------------------------------------------------------------
//
// Builders
//
//---------------------------------------------------------------------------

zdoBuilder[zci.ACTIVE_ENDPOINTS_REQUEST] = function(frame, builder) {
  builder.appendUInt16LE(parseInt(frame.destination16, 16));
};

zdoBuilder[zci.BIND_REQUEST] = function(frame, builder) {
  builder.appendString(frame.bindSrcAddr64.swapHex(), 'hex');
  builder.appendUInt8(frame.bindSrcEndpoint);
  if (typeof(frame.bindClusterId) === 'number') {
    builder.appendUInt16LE(frame.bindClusterId, 'hex');
  } else {
    builder.appendString(frame.bindClusterId.swapHex(), 'hex');
  }
  builder.appendUInt8(frame.bindDstAddrMode);
  if (frame.bindDstAddrMode === 1) {
    assert(frame.bindDstAddr16 !== undefined,
           'Must provide bindDstAddr16 for bindDstAddrMode 1');
    builder.appendString(frame.bindDstAddr16.swapHex(), 'hex');
  } else if (frame.bindDstAddrMode === 3) {
    assert(frame.bindDstAddr64 !== undefined,
           'Must provide bindDstAddr16 for bindDstAddrMode 3');
    assert(frame.bindDstEndpoint !== undefined,
           'Must provide bindDstEndpoint for bindDstAddrMode 3');
    builder.appendString(frame.bindDstAddr64.swapHex(), 'hex');
    builder.appendUInt8(frame.bindDstEndpoint);
  } else {
    assert(false, 'Must provide frame.bindDstAddrMode');
  }
};

zdoBuilder[zci.MANAGEMENT_LEAVE_REQUEST] = function(frame, builder) {
  builder.appendString(frame.destination64.swapHex(), 'hex');
  builder.appendUInt8(frame.leaveOptions);
};

zdoBuilder[zci.MANAGEMENT_LQI_REQUEST] = function(frame, builder) {
  builder.appendUInt8(frame.startIndex);
};

zdoBuilder[zci.MANAGEMENT_PERMIT_JOIN_REQUEST] = function(frame, builder) {
  builder.appendUInt8(frame.permitDuration);
  builder.appendUInt8(frame.trustCenterSignificance);
};

zdoBuilder[zci.MANAGEMENT_RTG_REQUEST] = function(frame, builder) {
  builder.appendUInt8(frame.startIndex);
};

zdoBuilder[zci.NODE_DESCRIPTOR_REQUEST] = function(frame, builder) {
  builder.appendUInt16LE(parseInt(frame.destination16, 16));
};

zdoBuilder[zci.SIMPLE_DESCRIPTOR_REQUEST] = function(frame, builder) {
  builder.appendUInt16LE(parseInt(frame.destination16, 16));
  builder.appendUInt8(frame.endpoint);
};

//---------------------------------------------------------------------------
//
// Parsers
//
//---------------------------------------------------------------------------

zdoParser[zci.ACTIVE_ENDPOINTS_RESPONSE] = function(frame, reader) {
  frame.status = reader.nextUInt8();
  frame.zdoAddr16 = reader.nextString(2, 'hex').swapHex();
  if (reader.offset < reader.buf.length) {
    frame.numActiveEndpoints = reader.nextUInt8();
    frame.activeEndpoints = [];
    for (var i = 0; i < frame.numActiveEndpoints; i++) {
      frame.activeEndpoints[i] = reader.nextUInt8();
    }
  }
};

zdoParser[zci.BIND_RESPONSE] = function(frame, reader) {
  frame.status = reader.nextUInt8();
};

zdoParser[zci.END_DEVICE_ANNOUNCEMENT] = function(frame, reader) {
  frame.zdoAddr16 = reader.nextString(2, 'hex').swapHex();
  frame.zdoAddr64 = reader.nextString(8, 'hex').swapHex();
  frame.capability = reader.nextUInt8();
};

zdoParser[zci.MANAGEMENT_LEAVE_RESPONSE] = function(frame, reader) {
  frame.status = reader.nextUInt8();
};

zdoParser[zci.MANAGEMENT_LQI_RESPONSE] = function(frame, reader) {
  frame.status = reader.nextUInt8();
  frame.numEntries = reader.nextUInt8();
  frame.startIndex = reader.nextUInt8();
  frame.numEntriesThisResponse = reader.nextUInt8();
  frame.neighbors = [];

  for (var i = 0; i < frame.numEntriesThisResponse; i++) {
    var neighbor = frame.neighbors[i] = {};

    neighbor.panId = reader.nextString(8, 'hex').swapHex();
    neighbor.addr64 = reader.nextString(8, 'hex').swapHex();
    neighbor.addr16 = reader.nextString(2, 'hex').swapHex();

    var byte1 = reader.nextUInt8();
    neighbor.deviceType = byte1 & 0x03;
    neighbor.rxOnWhenIdle = (byte1 >> 2) & 0x03;
    neighbor.relationship = (byte1 >> 4) & 0x07;

    var byte2 = reader.nextUInt8();
    neighbor.permitJoining = byte2 & 0x03;
    neighbor.depth = reader.nextUInt8();
    neighbor.lqi = reader.nextUInt8();
  }
};

zdoParser[zci.MANAGEMENT_NETWORK_UPDATE_NOTIFY] = function(frame, reader) {
  frame.status = reader.nextUInt8();
  frame.scannedChannels = reader.nextString(4, 'hex').swapHex();
  frame.totalTransmissions = reader.nextUInt16LE();
  frame.transmissionFailures = reader.nextUInt16LE();
  frame.numEnergyValues = reader.nextUInt8();
  frame.energyValues = [];
  for (var i = 0; i < frame.numEnergyValues; i++) {
    frame.energyValues[i] = reader.nextUInt8();
  }
};

zdoParser[zci.MANAGEMENT_PERMIT_JOIN_RESPONSE] = function(frame, reader) {
  frame.status = reader.nextUInt8();
};

zdoParser[zci.MANAGEMENT_RTG_RESPONSE] = function(frame, reader) {
  frame.status = reader.nextUInt8();
  frame.numEntries = reader.nextUInt8();
  frame.startIndex = reader.nextUInt8();
  frame.numEntriesThisResponse = reader.nextUInt8();
  frame.routings = [];

  for (var i = 0; i < frame.numEntriesThisResponse; i++) {
    var routing = frame.routings[i] = {};

    routing.addr16 = reader.nextString(2, 'hex').swapHex();
    var byte1 = reader.nextUInt8();
    routing.status = byte1 & 0x07;
    routing.memoryConstrained = (byte1 >> 3) & 1;
    routing.manyToOne = (byte1 >> 4) & 1;
    routing.routeRecordRequired = (byte1 >> 5) & 1;
    routing.nextHopAddr16 = reader.nextString(2, 'hex').swapHex();
  }
};

zdoParser[zci.MATCH_DESCRIPTOR_REQUEST] = function(frame, reader) {
  frame.zdoAddr16 = reader.nextString(2, 'hex').swapHex();
  frame.profileId = reader.nextString(2, 'hex').swapHex();

  frame.inputClusterCount = reader.nextUInt8();
  frame.inputClusters = [];
  for (var i = 0; i < frame.inputClusterCount; i++) {
    frame.inputClusters[i] = reader.nextString(2, 'hex').swapHex();
  }

  frame.outputClusterCount = reader.nextUInt8();
  frame.outputClusters = [];
  for (i = 0; i < frame.outputClusterCount; i++) {
    frame.outputClusters[i] = reader.nextString(2, 'hex').swapHex();
  }
};

zdoParser[zci.NODE_DESCRIPTOR_RESPONSE] = function(frame, reader) {
  frame.status = reader.nextUInt8();
  frame.zdoAddr16 = reader.nextString(2, 'hex').swapHex();

  var byte1 = reader.nextUInt8();
  frame.logicalType = byte1 & 0x03;
  frame.complexDescriptorAvailable = (byte1 >> 3) & 0x01;
  frame.userDescriptorAvailable = (byte1 >> 4) & 0x01;

  var byte2 = reader.nextUInt8();
  frame.frequencyBand = (byte2 >> 3) & 0x1f;

  frame.macCapabilityFlags = reader.nextUInt8();
  if (reader.offset < reader.buf.length) {
    frame.manufacturerCode = reader.nextString(2, 'hex').swapHex();
    frame.maxBufferSize = reader.nextUInt8();
    frame.maxIncomingXferSize = reader.nextUInt16LE();
    frame.serverMask = reader.nextUInt16LE();
    frame.maxOutgoingXferSize = reader.nextUInt16LE();
    frame.descriptorCapabilities = reader.nextUInt8();
  }
};

zdoParser[zci.SIMPLE_DESCRIPTOR_RESPONSE] = function(frame, reader) {
  frame.status = reader.nextUInt8();
  frame.zdoAddr16 = reader.nextString(2, 'hex').swapHex();
  if (reader.offset >= reader.buf.length) {
    return;
  }
  frame.simpleDescriptorLength = reader.nextUInt8();

  if (frame.simpleDescriptorLength === 0) {
    return;
  }

  frame.endpoint = reader.nextUInt8();
  frame.appProfileId = reader.nextString(2, 'hex').swapHex();
  frame.appDeviceId = reader.nextString(2, 'hex').swapHex();

  var byte1 = reader.nextUInt8();
  frame.appDeviceVersion = byte1 & 0x0f;

  frame.inputClusterCount = reader.nextUInt8();
  frame.inputClusters = [];
  for (var i = 0; i < frame.inputClusterCount; i++) {
    frame.inputClusters[i] = reader.nextString(2, 'hex').swapHex();
  }

  frame.outputClusterCount = reader.nextUInt8();
  frame.outputClusters = [];
  for (i = 0; i < frame.outputClusterCount; i++) {
    frame.outputClusters[i] = reader.nextString(2, 'hex').swapHex();
  }
};
