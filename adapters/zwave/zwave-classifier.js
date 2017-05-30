/**
 *
 * ZWaveClassifier - Determines properties from command classes.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */


'use strict';

var ZWaveProperty = require('./zwave-property');

// See; http://wiki.micasaverde.com/index.php/ZWave_Command_Classes for a
// complete list of command classes.

const COMMAND_CLASS_SWITCH_BINARY = 37;     // 0x25
//const COMMAND_CLASS_SWITCH_MULTILEVEL = 38; // 0x26
//const COMMAND_CLASS_SWITCH_ALL = 39;        // 0x27
//const COMMAND_CLASS_CONFIGURATION = 112;    // 0x98

const THING_TYPE_ON_OFF_SWITCH = 'onOffSwitch';

class ZWaveClassifier {

    constructor() {
    }

    classify(node) {
        for (var valueId in node.zwValues) {
            var value = node.zwValues[valueId];

            if (value.class_id == COMMAND_CLASS_SWITCH_BINARY) {
                // This looks like an on/off switch
                this.initOnOffSwitch(node, valueId);
                return;
            }
        }
    }

    initOnOffSwitch(node, valueId) {
        node.type = THING_TYPE_ON_OFF_SWITCH;
        node.properties.set('on',
                            new ZWaveProperty(node, 'on', 'boolean', valueId);
    }
}

module.exports = new ZWaveClassifier();
