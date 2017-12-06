/**
 *
 * ZigbeeClassifier - Determines properties from Zigbee clusters.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */


'use strict';

const zclId = require('zcl-id');
const utils = require('../utils');
const ZigbeeProperty = require('./zb-property');

const ZHA_PROFILE_ID = zclId.profile('HA').value;
const ZHA_PROFILE_ID_HEX = utils.hexStr(ZHA_PROFILE_ID, 4);
const CLUSTER_ID_GENONOFF = zclId.cluster('genOnOff').value;
const CLUSTER_ID_GENONOFF_HEX = utils.hexStr(CLUSTER_ID_GENONOFF, 4);
const CLUSTER_ID_GENLEVELCTRL = zclId.cluster('genLevelCtrl').value;
const CLUSTER_ID_GENLEVELCTRL_HEX = utils.hexStr(CLUSTER_ID_GENLEVELCTRL, 4);

const THING_TYPE_ON_OFF_SWITCH = 'onOffSwitch';
const THING_TYPE_MULTI_LEVEL_SWITCH = 'multiLevelSwitch';

const UI_SUPPORTS_MULTILEVEL = false;

class ZigbeeClassifier {

  constructor() {
  }

  addLevelProperty(node, endpoint) {
    this.addProperty(
      node,                           // device
      'level',                        // name
      {                               // property description
        type: 'number',
        unit: '%',
        min: 0,
        max: 100,
      },
      ZHA_PROFILE_ID,                 // profileId
      endpoint,                       // endpoint
      CLUSTER_ID_GENLEVELCTRL,        // clusterId
      'currentLevel',                 // attr
      'setLevelValue',                // setAttrFromValue
      'parseLevelAttr'                // parseValueFromAttr
    );
  }

  addOnProperty(node, endpoint) {
    this.addProperty(
      node,                           // device
      'on',                           // name
      {                               // property description
        type: 'boolean',
      },
      ZHA_PROFILE_ID,                 // profileId
      endpoint,                       // endpoint
      CLUSTER_ID_GENONOFF,            // clusterId
      'onOff',                        // attr
      'setOnOffValue',                // setAttrFromValue
      'parseOnOffAttr'                // parseValueFromAttr
    );
  }

  addProperty(node, name, descr, profileId, endpoint, clusterId,
              attr, setAttrFromValue, parseValueFromAttr) {
    let property =  new ZigbeeProperty(node, name, descr, profileId,
                                       endpoint, clusterId, attr,
                                       setAttrFromValue, parseValueFromAttr);
    node.properties.set(name, property);
    node.sendFrames([
      node.makeBindFrame(property),
      node.makeConfigReportFrame(property),
      node.makeReadAttributeFrameForProperty(property),
    ]);
  }

  findZhaEndpointWithInputClusterIdHex(node, clusterIdHex) {
    for (var endpointNum in node.activeEndpoints) {
      var endpoint = node.activeEndpoints[endpointNum];
      if (endpoint.profileId == ZHA_PROFILE_ID_HEX) {
        if (endpoint.inputClusters.includes(clusterIdHex)) {
          return endpointNum;
        }
      }
    }
  }

  // internal function allows us to use early returns.
  classifyInternal(node) {
    let endpoint;

    if (UI_SUPPORTS_MULTILEVEL) {
      endpoint =
        this.findZhaEndpointWithInputClusterIdHex(node,
                                                  CLUSTER_ID_GENLEVELCTRL_HEX);
      if (endpoint) {
        this.initMultiLevelSwitch(node, endpoint);
        return;
      }
    }

    endpoint =
      this.findZhaEndpointWithInputClusterIdHex(node,
                                                CLUSTER_ID_GENONOFF_HEX);
    if (endpoint) {
      this.initOnOffSwitch(node, endpoint);
      return;
    }
  }

  classify(node) {
    if (node.isCoordinator) {
      return;
    }

    this.classifyInternal(node);

    // Now that we know the type, set the default name.
    node.defaultName = node.id + '-' + node.type;
    if (!node.name) {
      node.name = node.defaultName;
    }
  }

  initOnOffSwitch(node, endpointNum) {
    node.type = THING_TYPE_ON_OFF_SWITCH;
    this.addOnProperty(node, endpointNum);
  }

  initMultiLevelSwitch(node, endpointNum) {
    node.type = THING_TYPE_MULTI_LEVEL_SWITCH;
    this.addOnProperty(node, endpointNum);
    this.addLevelProperty(node, endpointNum);
  }
}

module.exports = new ZigbeeClassifier();
