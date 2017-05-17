/**
 *
 * ZigBeeDevice - represents a device on the ZigBee network
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

var Device = require('../device');
var utils = require('../utils');
var xbeeApi = require('xbee-api');
var zclId = require('zcl-id');
var zcl = require('zcl-packet');
var zdo = require('./zb-zdo');

const DATA_TYPE_BOOLEAN = zclId.dataType('boolean').value;

var C = xbeeApi.constants;

class ZigBeeNode extends Device {

  constructor(adapter, id64, id16) {
    // Our id is a Mac address on the ZigBee network. It's unique within
    // the zigbee network, but might not be globally unique, so we prepend
    // with zb- to put it in a namespace.
    var deviceId = 'zb-' + id64;
    super(adapter, deviceId);

    this.addr64 = id64;
    this.addr16 = id16;
    this.neighbors = [];
    this.activeEndpoints = {};

    this.isCoordinator = (id64 == adapter.serialNumber);

    if (this.isCoordinator) {
      this.defaultName = deviceId + '-Dongle';
    } else {
      this.defaultName = deviceId + '-Node';
    }
  }

  asDict() {
    var dict = super.asDict();
    dict.addr64 = this.addr64;
    dict.addr16 = this.addr16;
    dict.neighbors = this.neighbors;
    dict.activeEndpoints = this.activeEndpoints;
    dict.isCoordinator = this.isCoordinator;
    for (var endpointNum in dict.activeEndpoints) {
      var endpoint = dict.activeEndpoints[endpointNum];
      var clusterId;
      var idx;
      var zclCluster;
      for (idx in endpoint.inputClusters) {
        clusterId = parseInt(endpoint.inputClusters[idx], 16);
        zclCluster = zclId.clusterId.get(clusterId);
        if (zclCluster) {
          endpoint.inputClusters[idx] += ' - ' + zclCluster.key;
        }
      }
      for (idx in endpoint.outputClusters) {
        clusterId = parseInt(endpoint.outputClusters[idx], 16);
        zclCluster = zclId.clusterId.get(clusterId);
        if (zclCluster) {
          endpoint.outputClusters[idx] += ' - ' + zclCluster.key;
        }
      }
    }
    return dict;
  }

  getAttrEntryFromFrame(frame, property) {
    var attr = zclId.attr(property.clusterId, property.attr).value;
    if (frame.zcl && Array.isArray(frame.zcl.payload)) {
      for (var attrEntry of frame.zcl.payload) {
        if (attrEntry.attrId == attr) {
          return attrEntry;
        }
      }
    }
  }

  frameHasAttr(frame, property) {
    var attrEntry = this.getAttrEntryFromFrame(frame, property);
    return !!attrEntry;
  }

  findPropertyFromFrame(frame) {
    var profileId = parseInt(frame.profileId, 16);
    var clusterId = parseInt(frame.clusterId, 16);
    var endpoint = parseInt(frame.sourceEndpoint, 16);

    for (var property of this.properties) {
      if (profileId == property.profileId &&
          endpoint == property.endpoint &&
          clusterId == property.clusterId) {
        if (this.frameHasAttr(frame, property)) {
          return property;
        }
      }
    }
  }

  getValueFromAttrEntry(attrEntry) {
    if (attrEntry.dataType == DATA_TYPE_BOOLEAN) {
      return attrEntry.attrData !== 0;
    }
    return attrEntry.attrData;
  }

  handleReadRsp(frame) {
    var property = this.findPropertyFromFrame(frame);
    if (property) {
      var attrEntry = this.getAttrEntryFromFrame(frame, property);
      var value = this.getValueFromAttrEntry(attrEntry);
      property.setCachedValue(value);
      console.log('ZigBee:', this.name,
                  'property:', property.name,
                  'profileId:', utils.hexStr(property.profileId, 4),
                  'endpoint:', property.endpoint,
                  'clusterId:', utils.hexStr(property.clusterId, 4),
                  frame.zcl.cmdId,
                  'value:', value);
      var deferredSet = property.deferredSet;
      if (deferredSet) {
        property.deferredSet = null;
        deferredSet.resolve(property.value);
      }
      this.notifyPropertyChanged(property);
    }
  }

  handleZhaResponse(frame) {
    if (frame.zcl &&
        (frame.zcl.cmdId == 'readRsp' || frame.zcl.cmdId == 'report')) {
      this.handleReadRsp(frame);
    }
  }

  makeBindFrame(property) {
    var frame = this.adapter.zdo.makeFrame({
      destination64: this.addr64,
      destination16: this.addr16,
      clusterId: zdo.CLUSTER_ID.BIND_REQUEST,
      bindSrcAddr64: this.addr64,
      bindSrcEndpoint: property.endpoint,
      bindClusterId: property.clusterId,
      bindDstAddrMode: 3,
      bindDstAddr64: this.adapter.serialNumber,
      bindDstEndpoint: 0,
    });
    return frame;
  }

  makeConfigReportFrame(property) {
    var clusterId = property.clusterId;
    var attr = property.attr;
    var frame = this.makeZclFrame(
      property,
      {
        cmd: 'configReport',
        payload: [{
          direction: 0,
          attrId: zclId.attr(clusterId, attr).value,
          dataType: zclId.attrType(clusterId, attr).value,
          minRepIntval: 0,
          maxRepIntval: 0,
        }],
      }
    );
    return frame;
  }

  makeDiscoverAttributesFrame(property) {
    var frame = this.makeZclFrame(
      property,
      {
        cmd: 'discover',
        payload: {
          startAttrId: 0,
          maxAttrIds: 255,
        },
      }
    );
    return frame;
  }

  makeReadAttributeFrame(property) {
    var clusterId = property.clusterId;
    var attr = property.attr;
    var frame = this.makeZclFrame(
      property,
      {
        cmd: 'read',
        payload: [{ direction: 0,
                    attrId: zclId.attr(clusterId, attr).value,
                 }],
      }
    );
    return frame;
  }

  makeReadReportConfigFrame(property) {
    var clusterId = property.clusterId;
    var attr = property.attr;
    var frame = this.makeZclFrame(
      property,
      {
        cmd: 'readReportConfig',
        payload: [{ direction: 0,
                    attrId: zclId.attr(clusterId, attr).value,
                 }],
      }
    );
    return frame;
  }

  makeZclFrame(property, zclData) {
    if (!zclData.frameCntl) {
      zclData.frameCntl = { frameType: 0 };
    }
    if (zclData.frameCntl.manufSpec === undefined) {
      zclData.frameCntl.manufSpec = 0;
    }
    if (zclData.frameCntl.direction === undefined) {
      zclData.frameCntl.direction = 0;
    }
    if (zclData.frameCntl.disDefaultRsp === undefined) {
        zclData.frameCntl.disDefaultRsp = 0;
    }
    if (zclData.manufCode === undefined) {
      zclData.manufCode = 0;
    }
    if (zclData.payload === undefined) {
      zclData.payload = [];
    }

    var frame = {
      id: xbeeApi._frame_builder.nextFrameId(),
      type: C.FRAME_TYPE.EXPLICIT_ADDRESSING_ZIGBEE_COMMAND_FRAME,
      destination64: this.addr64,
      destination16: this.addr16,
      sourceEndpoint: 0,

      destinationEndpoint: property.endpoint,
      profileId: property.profileId,
      clusterId: utils.hexStr(property.clusterId, 4),

      broadcastRadius: 0,
      options: 0,
      zcl: zclData,
    };

    frame.data = zcl.frame(zclData.frameCntl,
                           zclData.manufCode,
                           frame.id,
                           zclData.cmd,
                           zclData.payload,
                           property.clusterId);
    return frame;
  }

  notifyPropertyChanged(property) {
    var deferredSet = property.deferredSet;
    if (deferredSet) {
      property.deferredSet = null;
      deferredSet.resolve(property.value);
    }
    super.notifyPropertyChanged(property);
  }

  sendFrames(frames) {
    this.adapter.sendFrames(frames);
  }

  sendZclFrame(property, zclData) {
    var frame = this.makeZclFrame(property, zclData);
    this.adapter.sendFrame(frame);
  }
}

module.exports = ZigBeeNode;
