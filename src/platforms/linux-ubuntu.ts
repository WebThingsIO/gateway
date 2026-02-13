/**
 * Ubuntu platform interface.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { LinuxUbuntuCorePlatform } from './linux-ubuntu-core';
import { SelfUpdateStatus } from './types';

class LinuxUbuntuPlatform extends LinuxUbuntuCorePlatform {
  /**
   * Determine whether or not the gateway can auto-update itself.
   *
   * @returns {Object} {
   *                      available: <bool>,
   *                      enabled: <bool>,
   *                      configurable: <bool>,
   *                      triggerable: <bool>
   *                   }
   */
  getSelfUpdateStatus(): SelfUpdateStatus {
    // Automatic updates are not supported on Ubuntu
    // (snaps are detected separately in Platform.ts)
    return {
      available: false,
      enabled: false,
      configurable: false,
      triggerable: false,
    };
  }
}

export default new LinuxUbuntuPlatform();
