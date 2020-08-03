/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const Alarm = require('./alarm');
const BinarySensor = require('./binary-sensor');
const Camera = require('./camera');
const ColorControl = require('./color-control');
const ColorSensor = require('./color-sensor');
const DoorSensor = require('./door-sensor');
const EnergyMonitor = require('./energy-monitor');
const HumiditySensor = require('./humidity-sensor');
const LeakSensor = require('./leak-sensor');
const Light = require('./light');
const Lock = require('./lock');
const MotionSensor = require('./motion-sensor');
const MultiLevelSensor = require('./multi-level-sensor');
const MultiLevelSwitch = require('./multi-level-switch');
const OnOffSwitch = require('./on-off-switch');
const PushButton = require('./push-button');
const SmartPlug = require('./smart-plug');
const TemperatureSensor = require('./temperature-sensor');
const Thermostat = require('./thermostat');
const Thing = require('./thing');
const VideoCamera = require('./video-camera');

function createThingFromCapability(
  capability, thingModel, description, format) {
  if (capability) {
    switch (capability) {
      case 'OnOffSwitch':
        return new OnOffSwitch(thingModel, description, format);
      case 'MultiLevelSwitch':
        return new MultiLevelSwitch(thingModel, description, format);
      case 'ColorControl':
        return new ColorControl(thingModel, description, format);
      case 'ColorSensor':
        return new ColorSensor(thingModel, description, format);
      case 'EnergyMonitor':
        return new EnergyMonitor(thingModel, description, format);
      case 'BinarySensor':
        return new BinarySensor(thingModel, description, format);
      case 'MultiLevelSensor':
        return new MultiLevelSensor(thingModel, description, format);
      case 'SmartPlug':
        return new SmartPlug(thingModel, description, format);
      case 'Light':
        return new Light(thingModel, description, format);
      case 'DoorSensor':
        return new DoorSensor(thingModel, description, format);
      case 'MotionSensor':
        return new MotionSensor(thingModel, description, format);
      case 'LeakSensor':
        return new LeakSensor(thingModel, description, format);
      case 'PushButton':
        return new PushButton(thingModel, description, format);
      case 'VideoCamera':
        return new VideoCamera(thingModel, description, format);
      case 'Camera':
        return new Camera(thingModel, description, format);
      case 'TemperatureSensor':
        return new TemperatureSensor(thingModel, description, format);
      case 'HumiditySensor':
        return new HumiditySensor(thingModel, description, format);
      case 'Alarm':
        return new Alarm(thingModel, description, format);
      case 'Thermostat':
        return new Thermostat(thingModel, description, format);
      case 'Lock':
        return new Lock(thingModel, description, format);
    }
  }

  return new Thing(thingModel, description, format);
}

module.exports = {createThingFromCapability};
