/**
 * test-adapter.js - Adapter for testing portions of the the
 *                   AddonManager.loadAddons.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

const {Adapter} = require('gateway-addon');

class TestAdapter extends Adapter {
  constructor(addonManager, packageName) {
    super(addonManager, packageName, packageName);
    addonManager.addAdapter(this);
  }
}

function loadTestAdapter(addonManager, manifest, _errorCallback) {
  new TestAdapter(addonManager, manifest.name);
}

module.exports = loadTestAdapter;
