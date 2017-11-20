/**
 * settings-adapter.js - Adapter for testing portions of the the
 *                       settings-controller.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

var Adapter = require('../../adapters/adapter');

class SettingsTestAdapter extends Adapter {
  constructor(adapterManager, packageName) {
    super(adapterManager, packageName, packageName);
    adapterManager.addAdapter(this);
  }
}

function loadSettingsTestAdapter(adapterManager, manifest, _errorCallback) {
  new SettingsTestAdapter(adapterManager, manifest.name);
}

module.exports = loadSettingsTestAdapter;
