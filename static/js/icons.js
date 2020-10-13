/**
 * Icons utilities
 *
 * One-stop-shop for all your thing icon needs
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const fluent = require('./fluent');

function defaultIcon() {
  return fluent.getMessage('thing-icons-thing-src');
}

function capabilityHasIcon(capability) {
  return capabilityToIcon(capability) !== defaultIcon();
}

function capabilityToIcon(capability) {
  switch (capability) {
    case 'OnOffSwitch':
      return '/images/thing-icons/on_off_switch.svg';
    case 'MultiLevelSwitch':
      return '/images/thing-icons/multi_level_switch.svg';
    case 'ColorControl':
    case 'ColorSensor':
      return '/images/thing-icons/color_control.svg';
    case 'EnergyMonitor':
      return '/images/thing-icons/energy_monitor.svg';
    case 'BinarySensor':
      return '/images/thing-icons/binary_sensor.svg';
    case 'AirQualitySensor':
    case 'BarometricPressureSensor':
    case 'HumiditySensor':
    case 'MultiLevelSensor':
      return '/images/thing-icons/multi_level_sensor.svg';
    case 'SmartPlug':
      return '/images/thing-icons/smart_plug.svg';
    case 'Light':
      return '/images/thing-icons/light.svg';
    case 'DoorSensor':
      return '/images/thing-icons/door_sensor.svg';
    case 'MotionSensor':
      return '/images/thing-icons/motion_sensor.svg';
    case 'LeakSensor':
      return '/images/thing-icons/leak_sensor.svg';
    case 'SmokeSensor':
      return '/images/thing-icons/smoke_sensor.svg';
    case 'PushButton':
      return '/images/thing-icons/push_button.svg';
    case 'VideoCamera':
      return '/images/thing-icons/video_camera.svg';
    case 'Camera':
      return '/images/thing-icons/camera.svg';
    case 'TemperatureSensor':
      return '/images/thing-icons/temperature_sensor.svg';
    case 'Alarm':
      return '/images/thing-icons/alarm.svg';
    case 'Thermostat':
      return '/images/thing-icons/thermostat.svg';
    case 'Lock':
      return '/images/thing-icons/lock.svg';
    case 'Custom':
    default:
      return defaultIcon();
  }
}

module.exports = {
  capabilityHasIcon,
  capabilityToIcon,
  defaultIcon,
};
