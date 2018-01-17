/**
 *
 * ZWaveClassifier - Determines properties from command classes.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */


'use strict';

const Constants = require('../addon-constants');
const ZWaveProperty = require('./zwave-property');

// See; http://wiki.micasaverde.com/index.php/ZWave_Command_Classes for a
// complete list of command classes.

const COMMAND_CLASS_SWITCH_BINARY = 37;       // 0x25
const COMMAND_CLASS_SWITCH_MULTILEVEL = 38;   // 0x26
const COMMAND_CLASS_SENSOR_BINARY  = 48;      // 0x30
const COMMAND_CLASS_METER = 50;               // 0x32
//const COMMAND_CLASS_SWITCH_ALL = 39;        // 0x27
const COMMAND_CLASS_CONFIGURATION = 112;    // 0x98

class ZWaveClassifier {

  constructor() {
  }

  classify(node) {
    let binarySwitchValueId =
      node.findValueId(COMMAND_CLASS_SWITCH_BINARY, 1, 0);
    if (binarySwitchValueId) {
      this.initSwitch(node, binarySwitchValueId);
      return;
    }

    let binarySensorValueId =
      node.findValueId(COMMAND_CLASS_SENSOR_BINARY, 1, 0);
    if (binarySensorValueId) {
      this.initBinarySensor(node, binarySensorValueId);
      return;
    }
  }

  addProperty(node, name, descr, valueId,
              setZwValueFromValue, parseValueFromZwValue) {
    let property = new ZWaveProperty(node, name, descr, valueId,
                                     setZwValueFromValue,
                                     parseValueFromZwValue);
    node.properties.set(name, property);
  }

  initSwitch(node, binarySwitchValueId) {
    node.type = Constants.THING_TYPE_ON_OFF_SWITCH;
    this.addProperty(
      node,                     // node
      'on',                     // name
      {                         // property decscription
        type: 'boolean'
      },
      binarySwitchValueId       // valueId
    );

    const levelValueId =
      node.findValueId(COMMAND_CLASS_SWITCH_MULTILEVEL, 1, 0);
    if (levelValueId) {
      node.type = Constants.THING_TYPE_MULTI_LEVEL_SWITCH;
      this.addProperty(
        node,                   // node
        'level',                // name
        {                       // property decscription
          type: 'number',
          unit: 'percent',
          min: 0,
          max: 100,
        },
        levelValueId,           // valueId
        'setLevelValue',        // setZwValueFromValue
        'parseLevelZwValue'     // parseValueFromZwValue
      );
    }

    let powerValueId = node.findValueId(COMMAND_CLASS_METER, 1, 8);
    if (powerValueId) {
      node.type = Constants.THING_TYPE_SMART_PLUG;
      this.addProperty(
        node,                   // node
        'instantaneousPower',   // name
        {                       // property decscription
          type: 'number',
          unit: 'watt',
        },
        powerValueId            // valueId
      );
    }

    let voltageValueId = node.findValueId(COMMAND_CLASS_METER, 1, 16);
    if (voltageValueId) {
      node.type = Constants.THING_TYPE_SMART_PLUG;
      this.addProperty(
        node,                   // node
        'voltage',              // name
        {                       // property decscription
          type: 'number',
          unit: 'volt',
        },
        voltageValueId          // valueId
      );
    }

    /*
    For the Aeotect ZW096, current doesn't seem to be useful.

    let currentValueId = node.findValueId(COMMAND_CLASS_METER, 1, 20);
    if (currentValueId) {
      node.type = THING_TYPE_SMART_PLUG;
      this.addProperty(
        node,                   // node
        'current',              // name
        {                       // property decscription
          type: 'number',
          unit: 'ampere',
        },
        currentValueId          // valueId
      );
    }
    */

    if (node.zwInfo.manufacturer === 'Aeotec') {
      // When the user presses the button, tell us about it
      node.adapter.zwave.setValue(node.zwInfo.nodeId,         // nodeId
                                  COMMAND_CLASS_CONFIGURATION,// classId
                                  1,                          // instance
                                  80,                         // index
                                  'Basic');                   // value
      if (node.type === Constants.THING_TYPE_SMART_PLUG) {
        // Enable METER reporting
        node.adapter.zwave.setValue(node.zwInfo.nodeId,         // nodeId
                                    COMMAND_CLASS_CONFIGURATION,// classId
                                    1,                          // instance
                                    90,                         // index
                                    1);                         // value
        // Report changes of 1 watt
        node.adapter.zwave.setValue(node.zwInfo.nodeId,         // nodeId
                                    COMMAND_CLASS_CONFIGURATION,// classId
                                    1,                          // instance
                                    91,                         // index
                                    1);                         // value
      }
    }
  }

  initBinarySensor(node, binarySensorValueId) {
    node.type = Constants.THING_TYPE_BINARY_SENSOR;
    this.addProperty(
      node,                     // node
      'on',                     // name
      {                         // property decscription
        type: 'boolean'
      },
      binarySensorValueId       // valueId
    );
  }
}

module.exports = new ZWaveClassifier();
