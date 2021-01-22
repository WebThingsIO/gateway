/**
 * settings-adapter.ts - Adapter for testing portions of the the
 *                       settings-controller.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {Adapter, AddonManagerProxy} from 'gateway-addon';
import manifest from './manifest.json';

class SettingsTestAdapter extends Adapter {
  constructor(addonManager: AddonManagerProxy, packageName: string) {
    super(addonManager, packageName, packageName);
    addonManager.addAdapter(this);
  }
}

function loadSettingsTestAdapter(addonManager: AddonManagerProxy): void {
  new SettingsTestAdapter(addonManager, manifest.id);
}

export = loadSettingsTestAdapter;
