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

const defaultIcon = '/optimized-images/thing-icons/thing.svg';

function capabilityHasIcon(capability) {
  return capabilityToIcon(capability) !== defaultIcon;
}

function capabilityToIcon(capability) {
  switch (capability) {
    case 'OnOffSwitch':
      return '/optimized-images/thing-icons/on_off_switch.svg';
    case 'MultiLevelSwitch':
      return '/optimized-images/thing-icons/multi_level_switch.svg';
    case 'ColorControl':
      return '/optimized-images/thing-icons/color_control.svg';
    case 'EnergyMonitor':
      return '/optimized-images/thing-icons/energy_monitor.svg';
    case 'BinarySensor':
      return '/optimized-images/thing-icons/binary_sensor.svg';
    case 'MultiLevelSensor':
      return '/optimized-images/thing-icons/multi_level_sensor.svg';
    case 'SmartPlug':
      return '/optimized-images/thing-icons/smart_plug.svg';
    case 'Light':
      return '/optimized-images/thing-icons/light.svg';
    case 'DoorSensor':
      return '/optimized-images/thing-icons/door_sensor.svg';
    case 'MotionSensor':
      return '/optimized-images/thing-icons/motion_sensor.svg';
    case 'LeakSensor':
      return '/optimized-images/thing-icons/leak_sensor.svg';
    case 'PushButton':
      return '/optimized-images/thing-icons/push_button.svg';
    case 'VideoCamera':
      return '/optimized-images/thing-icons/video_camera.svg';
    case 'Camera':
      return '/optimized-images/thing-icons/camera.svg';
    case 'TemperatureSensor':
      return '/optimized-images/thing-icons/temperature_sensor.svg';
    case 'Alarm':
      return '/optimized-images/thing-icons/alarm.svg';
    case 'Custom':
    default:
      return defaultIcon;
  }
}

function typeHasIcon(type) {
  return typeToIcon(type) !== defaultIcon;
}

function typeToIcon(type) {
  switch (type) {
    case 'onOffSwitch':
      return '/optimized-images/thing-icons/on_off_switch.svg';
    case 'binarySensor':
      return '/optimized-images/thing-icons/binary_sensor.svg';
    case 'multiLevelSensor':
      return '/optimized-images/thing-icons/multi_level_sensor.svg';
    case 'onOffLight':
    case 'onOffColorLight':
    case 'dimmableLight':
    case 'dimmableColorLight':
      return '/optimized-images/thing-icons/light.svg';
    case 'multiLevelSwitch':
      return '/optimized-images/thing-icons/multi_level_switch.svg';
    case 'smartPlug':
      return '/optimized-images/thing-icons/smart_plug.svg';
    default:
      return defaultIcon;
  }
}

module.exports = {
  capabilityHasIcon,
  capabilityToIcon,
  typeHasIcon,
  typeToIcon,
};
