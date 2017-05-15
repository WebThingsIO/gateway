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

var Deferred = require('../../deferred');
var Property = require('../../property');
var utils = require('../../utils');

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
    var deferredSet = new Deferred();
    if (this.deferredSet) {
      deferredSet.reject('ZigBee: setProperty property ' + this.name +
                         ' already has a set in progress.');
    } else {
      // We don't update the cached value here, but rather
      // wait for the valueChanged notificaton.

      var cmd = this.cmd[value];

      console.log('ZigBee: setProperty property:', this.name,
                  'for:', this.device.name,
                  'profileId:', utils.hexStr(this.profileId, 4),
                  'endpoint:', this.endpoint,
                  'clusterId:', utils.hexStr(this.clusterId, 4),
                  'cmd:', cmd,
                  'value:', value);

      if (cmd === undefined) {
        deferredSet.reject('ZigBee: unrecognized value: "' + value + '"');
      } else {
        this.device.sendZclFrame(
          this,
          {
            frameCntl: { frameType: 1 },
            cmd: cmd,
          });
        this.deferredSet = deferredSet;
      }
    }
    return deferredSet.promise;
  }
}

module.exports = ZigBeeProperty;
