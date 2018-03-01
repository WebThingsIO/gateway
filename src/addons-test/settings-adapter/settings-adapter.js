/**
 * settings-adapter.js - Adapter for testing portions of the the
 *                       settings-controller.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

const {Adapter} = require('gateway-addon');

class SettingsTestAdapter extends Adapter {
  constructor(addonManager, packageName) {
    super(addonManager, packageName, packageName);
    addonManager.addAdapter(this);
  }
}

function loadSettingsTestAdapter(addonManager, manifest, _errorCallback) {
  new SettingsTestAdapter(addonManager, manifest.name);
}

module.exports = loadSettingsTestAdapter;
