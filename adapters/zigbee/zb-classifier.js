/**
 *
 * ZWaveClassifier - Determines properties from command classes.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */


'use strict';

var zclId = require('zcl-id');

const THING_TYPE_ON_OFF_SWITCH = 'onOffSwitch';

class ZWaveClassifier {

    constructor() {
    }

    classify(node) {

        // HACK: - right now, we consider everything to be an onoff switch

        if (!node.isCoordinator) {
            this.initOnOffSwitch(node);
        }
    }

    initOnOffSwitch(node, valueId) {
        node.type = THING_TYPE_ON_OFF_SWITCH;
        node.properties = [{
            'name': 'on',
            'type': 'boolean',
        }];
        node.actions = [{
            'name': 'toggle',
            'description': 'Toggles On/Off',
        }];
        node.propertyMap = {'on': zclId.cluster('genOnOff').value };
    }
}

module.exports = new ZWaveClassifier();
