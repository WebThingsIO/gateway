/**
 *
 * ZWaveClassifier - Determines properties from command classes.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */


'use strict';

// See; http://wiki.micasaverde.com/index.php/ZWave_Command_Classes for a
// complete list of command classes.

const COMMAND_CLASS_SWITCH_BINARY = 37;
const COMMAND_CLASS_SWITCH_MULTILEVEL = 38;
const COMMAND_CLASS_SWITCH_ALL = 39;

const THING_TYPE_ON_OFF_SWITCH = "onOffSwitch";

class ZWaveClassifier {

    constructor() {
    }

    classify(node) {
        for (var valueId in node.values) {
            var value = node.values[valueId];

            if (value.class_id == COMMAND_CLASS_SWITCH_BINARY) {
                // This looks like an on/off switch
                this.initOnOffSwitch(node, valueId);
                return;
            }
        }
    }

    initOnOffSwitch(node, valueId) {
        node.type = "onOffSwitch";
        node.properties = [{
            'name': 'on',
            'type': 'boolean',
        }];
        node.actions = [{
            'name': 'toggle',
            'description': 'Toggles On/Off',
        }];
        node.propertyMap = {'on': valueId };
    }
}

module.exports = new ZWaveClassifier();
