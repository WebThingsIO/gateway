/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

function getClassFromCapability(capability) {
  switch (capability) {
    case 'OnOffSwitch':
      return 'on-off-switch';
    case 'MultiLevelSwitch':
      return 'multi-level-switch';
    case 'ColorControl':
      return 'color-control';
    case 'ColorSensor':
      return 'color-sensor';
    case 'EnergyMonitor':
      return 'energy-monitor';
    case 'BinarySensor':
      return 'binary-sensor';
    case 'MultiLevelSensor':
      return 'multi-level-sensor';
    case 'SmartPlug':
      return 'smart-plug';
    case 'Light':
      return 'light';
    case 'DoorSensor':
      return 'door-sensor';
    case 'MotionSensor':
      return 'motion-sensor';
    case 'LeakSensor':
      return 'leak-sensor';
    case 'PushButton':
      return 'push-button';
    case 'VideoCamera':
      return 'video-camera';
    case 'Camera':
      return 'camera';
    case 'TemperatureSensor':
      return 'temperature-sensor';
    case 'HumiditySensor':
      return 'humidity-sensor';
    case 'Alarm':
      return 'alarm';
    case 'Thermostat':
      return 'thermostat';
    case 'Lock':
      return 'lock';
  }

  return '';
}

module.exports = {getClassFromCapability};
