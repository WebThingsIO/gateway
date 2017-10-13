/**
 * ZigBee Property.
 *
 * Object which decscribes a property, and its value.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

var Deferred = require('../deferred');
var Property = require('../property');
var utils = require('../utils');

class ZigBeeProperty extends Property {
  constructor(device, name, type, profileId, endpoint, clusterId, cmd, attr) {
    super(device, name, type);

    this.profileId = profileId;
    this.endpoint = endpoint;
    this.clusterId = clusterId;
    this.cmd = cmd;
    this.attr = attr;
  }

  asDict() {
    var dict = super.asDict();
    dict.profileId = this.profileId;
    dict.endpoint = this.endpoint;
    dict.clusterId = this.clusterId;
    dict.cmd = this.cmd;
    dict.attr = this.attr;
    dict.value = this.value;
    return dict;
  }

  /**
   * @returns a promise which resolves to the updated value.
   *
   * @note it is possible that the updated value doesn't match
   * the value passed in.
   */
  setValue(value) {
    var deferredSet = this.deferredSet;
    if (!deferredSet) {
      deferredSet = new Deferred();
      this.deferredSet = deferredSet;
    }

    this.setCachedValue(value);

    let cmd = this.cmd[value];

    console.log('ZigBee: setProperty property:', this.name,
                'for:', this.device.name,
                'profileId:', utils.hexStr(this.profileId, 4),
                'endpoint:', this.endpoint,
                'clusterId:', utils.hexStr(this.clusterId, 4),
                'cmd:', cmd,
                'value:', value);

    if (cmd === undefined) {
      let err = 'ZigBee: unrecognized value: "' + value + '"';
      console.error('ZigBee: unrecognized value: "' + value + '"');
      deferredSet.reject(err);
    } else {
      this.device.sendZclFrameWaitExplicitRxResolve(
        this,
        {
          frameCntl: { frameType: 1 },
          cmd: cmd,
        });
    }
    return deferredSet.promise;
  }
}

module.exports = ZigBeeProperty;
