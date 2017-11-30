/**
 *
 * ZigbeeDevice - represents a device on the Zigbee network
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

var C = xbeeApi.constants;

class ZigbeeNode extends Device {

  constructor(adapter, id64, id16) {
    // Our id is a Mac address on the Zigbee network. It's unique within
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

    for (var property of this.properties.values()) {
      if (profileId == property.profileId &&
          endpoint == property.endpoint &&
          clusterId == property.clusterId) {
        if (this.frameHasAttr(frame, property)) {
          return property;
        }
      }
    }
  }

  handleDiscoverRsp(frame) {
    let payload = frame.zcl.payload;
    let maxAttrId = 0;
    for (let attrInfo of payload.attrInfos) {
      maxAttrId = Math.max(maxAttrId, attrInfo.attrId);
      let clusterId = parseInt(frame.clusterId, 16);
      let attr = zclId.attr(clusterId, attrInfo.attrId);
      let attrStr = attr ? attr.key : 'unknown';
      let dataType = zclId.dataType(attrInfo.dataType);
      let dataTypeStr = dataType ? dataType.key : 'unknown';
      console.log('      AttrId:', attrStr + ' (' + attrInfo.attrId + ')',
                  'dataType:', dataTypeStr + ' (' + attrInfo.dataType + ')');
    }

    if (frame.zcl.payload.discComplete == 0) {
      // More attributes are available
      let discoverFrame =
        this.makeDiscoverAttributesFrame(
          frame.sourceEndpoint,
          frame.profileId,
          frame.clusterId,
          maxAttrId + 1);
        this.adapter.sendFrameWaitFrameAtFront(discoverFrame, {
          type: C.FRAME_TYPE.ZIGBEE_TRANSMIT_STATUS,
          id: discoverFrame.id,
        });
    }
  }

  handleReadRsp(frame) {
    var property = this.findPropertyFromFrame(frame);
    if (property) {
      var attrEntry = this.getAttrEntryFromFrame(frame, property);
      let [value, logValue] = property.parseAttrEntry(attrEntry);
      property.setCachedValue(value);
      console.log(this.name,
                  'property:', property.name,
                  'profileId:', utils.hexStr(property.profileId, 4),
                  'endpoint:', property.endpoint,
                  'clusterId:', utils.hexStr(property.clusterId, 4),
                  frame.zcl.cmdId,
                  'value:', logValue);
      var deferredSet = property.deferredSet;
      if (deferredSet) {
        property.deferredSet = null;
        deferredSet.resolve(property.value);
      }
      this.notifyPropertyChanged(property);
    }
  }

  handleZhaResponse(frame) {
    if (frame.zcl) {
      switch (frame.zcl.cmdId) {
        case 'readRsp':
        case 'report':
          this.handleReadRsp(frame);
          break;
        case 'discoverRsp':
          this.handleDiscoverRsp(frame);
          break;
      }
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
    var frame = this.makeZclFrameForProperty(
      property,
      {
        cmd: 'configReport',
        payload: [{
          direction: 0,
          attrId: zclId.attr(clusterId, attr).value,
          dataType: zclId.attrType(clusterId, attr).value,
          minRepIntval: 1,
          maxRepIntval: 120,
          repChange: 1,
        }],
      }
    );
    return frame;
  }

  makeDiscoverAttributesFrame(endpoint, profileId, clusterId, startAttrId) {
    var frame = this.makeZclFrame(
      endpoint, profileId, clusterId,
      {
        cmd: 'discover',
        payload: {
          startAttrId: startAttrId,
          maxAttrIds: 255,
        },
      }
    );
    return frame;
  }

  makeReadAttributeFrame(property) {
    var clusterId = property.clusterId;
    var attr = property.attr;
    var frame = this.makeZclFrameForProperty(
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
    var frame = this.makeZclFrameForProperty(
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

  makeZclFrame(endpoint, profileId, clusterId, zclData) {
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

      destinationEndpoint: endpoint,
      profileId: profileId,
      clusterId: utils.hexStr(clusterId, 4),

      broadcastRadius: 0,
      options: 0,
      zcl: zclData,
    };

    frame.data = zcl.frame(zclData.frameCntl,
                           zclData.manufCode,
                           frame.id,
                           zclData.cmd,
                           zclData.payload,
                           clusterId);
    return frame;
  }

  makeZclFrameForProperty(property, zclData) {
    return this.makeZclFrame(property.endpoint,
                             property.profileId,
                             property.clusterId,
                             zclData);
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

  sendZclFrameWaitExplicitRxResolve(property, zclData) {
    var frame = this.makeZclFrameForProperty(property, zclData);
    this.adapter.sendFrameWaitFrameResolve(frame, {
      type: C.FRAME_TYPE.ZIGBEE_EXPLICIT_RX,
      remote64: frame.destination64,
    }, property);
  }
}

module.exports = ZigbeeNode;
