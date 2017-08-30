/**
 * List of event types
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */
module.exports = {
  // Sent by a trigger to a rule to notify actions
  STATE_CHANGED: 'state-changed',
  // Sent by a property to a trigger to potentially change state
  VALUE_CHANGED: 'value-changed'
};
