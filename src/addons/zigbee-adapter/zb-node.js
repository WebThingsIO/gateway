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

const SKIP_DISCOVER_READ_CLUSTERS = ['haDiagnostic'];

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
    this.discoveringAttributes = false;
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

  debugCmd(cmd, _params) {
    switch (cmd) {
      case 'discoverAttr':
        this.adapter.discoverAttributes(this);
        break;

      default:
        console.log('Unrecognized debugCmd:', cmd);
    }
  }

  getAttrEntryFromFrame(frame, attrId) {
    if (frame.zcl && Array.isArray(frame.zcl.payload)) {
      for (var attrEntry of frame.zcl.payload) {
        if (attrEntry.attrId == attrId) {
          return attrEntry;
        }
      }
    }
  }

  getAttrEntryFromFrameForProperty(frame, property) {
    let attrId = zclId.attr(property.clusterId, property.attr).value;
    return this.getAttrEntryFromFrame(frame, attrId);
  }

  frameHasAttr(frame, property) {
    var attrEntry = this.getAttrEntryFromFrameForProperty(frame, property);
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
    if (payload.discComplete == 0) {
      // More attributes are available
      let discoverFrame =
        this.makeDiscoverAttributesFrame(
          frame.sourceEndpoint,
          frame.profileId,
          frame.clusterId,
          payload.attrInfos.slice(-1)[0].attrId + 1
        );
        this.adapter.sendFrameWaitFrameAtFront(discoverFrame, {
          type: C.FRAME_TYPE.ZIGBEE_EXPLICIT_RX,
          zclCmdId: 'discoverRsp',
          zclSeqNum: discoverFrame.id
        });
    }

    let clusterId = parseInt(frame.clusterId, 16);
    let clusterIdStr =  zclId.cluster(clusterId).key;
    let attrInfo;
    if (SKIP_DISCOVER_READ_CLUSTERS.includes(clusterIdStr)) {
      // This is a cluster which dosen't seem to respond to read requests.
      // Just print the attributes.
      for (attrInfo of payload.attrInfos) {
        let attr = zclId.attr(clusterId, attrInfo.attrId);
        let attrStr = attr ? attr.key : 'unknown';
        let dataType = zclId.dataType(attrInfo.dataType);
        let dataTypeStr = dataType ? dataType.key : 'unknown';
        console.log('      AttrId:', attrStr + ' (' + attrInfo.attrId + ')',
                    'dataType:', dataTypeStr + ' (' + attrInfo.dataType + ')');
      }
      return;
    }

    // Read the values of all of the attributes. We put this after
    // asking for the next frame, since the read requests go at the
    // front of the queue.

    for (attrInfo of payload.attrInfos.reverse()) {
      let readFrame = this.makeReadAttributeFrame(
        frame.sourceEndpoint,
        frame.profileId,
        clusterId,
        attrInfo.attrId
      );
      this.adapter.sendFrameWaitFrameAtFront(readFrame, {
        type: C.FRAME_TYPE.ZIGBEE_EXPLICIT_RX,
        zclCmdId: 'readRsp',
        zclSeqNum: readFrame.id
      });
    }
  }

  handleReadRsp(frame) {
    if (this.discoveringAttributes && frame.zcl.cmdId === 'readRsp') {
      let clusterId = parseInt(frame.clusterId, 16);
      for (let attrEntry of frame.zcl.payload) {
        let attr = zclId.attr(clusterId, attrEntry.attrId);
        let attrStr = attr ? attr.key : 'unknown';
        let dataType = zclId.dataType(attrEntry.dataType);
        let dataTypeStr = dataType ? dataType.key : 'unknown';
        console.log('      AttrId:', attrStr + ' (' + attrEntry.attrId + ')',
                    'dataType:', dataTypeStr + ' (' + attrEntry.dataType + ')',
                    'data:', attrEntry.attrData);
      }
      return;
    }

    let property = this.findPropertyFromFrame(frame);
    if (property) {
      //console.log('ReadRsp found property');
      let attrEntry = this.getAttrEntryFromFrameForProperty(frame, property);
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

  makeReadAttributeFrame(endpoint, profileId, clusterId, attrId) {
    var frame = this.makeZclFrame(
      endpoint, profileId, clusterId,
      {
        cmd: 'read',
        payload: [{ direction: 0, attrId: attrId }],
      }
    );
    return frame;
  }

  makeReadAttributeFrameForProperty(property) {
    return this.makeReadAttributeFrame(property.endpoint,
                                       property.profileId,
                                       property.clusterId,
                                       property.attrId);
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
