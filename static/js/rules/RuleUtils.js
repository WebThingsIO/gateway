const RuleUtils = {
  icon: (description) => {
    if (description.selectedCapability) {
      switch (description.selectedCapability) {
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
        default:
          return description.iconHref ||
            '/optimized-images/thing-icons/thing.svg';
      }
    } else {
      switch (description.type) {
        case 'onOffSwitch':
          return '/optimized-images/thing-icons/on_off_switch.svg';
        case 'onOffLight':
        case 'onOffColorLight':
        case 'dimmableLight':
        case 'dimmableColorLight':
          return '/optimized-images/thing-icons/light.svg';
        case 'binarySensor':
          return '/optimized-images/thing-icons/binary_sensor.svg';
        case 'multiLevelSensor':
          return '/optimized-images/thing-icons/multi_level_sensor.svg';
        case 'multiLevelSwitch':
          return '/optimized-images/thing-icons/multi_level_switch.svg';
        case 'smartPlug':
          return '/optimized-images/thing-icons/smart_plug.svg';
        default:
          return description.iconHref ||
            '/optimized-images/thing-icons/thing.svg';
      }
    }
  },
  // Helper function for selecting the thing corresponding to a property
  byProperty: (property) => (option) => {
      if (!property) {
        console.warn('byProperty property undefined', new Error().stack);
        return false;
      }
      const propHref = `/things/${property.thing}/properties/${property.id}`;
      const optProp = option.properties[property.id];
      return optProp && optProp.links.filter((l) => {
        return (!l.rel || l.rel === 'property') && l.href === propHref;
      }).length > 0;
    },
  // Helper function for selecting the thing corresponding to an href
  byThing: (thing) => (otherThing) => otherThing.href === `/things/${thing}`,
  thingFromPart: (gateway, part) => {
    let thing = null;
    if (part.type === 'EventTrigger' || part.type === 'ActionEffect') {
      thing = gateway.things.filter(
        RuleUtils.byThing(part.thing)
      )[0];
    } else if (part.property) {
      thing = gateway.things.filter(
        RuleUtils.byProperty(part.property)
      )[0];
    }
    return thing;
  },
  extractProperty: (href) => href.match(/properties\/([^/]+)/)[1],
  extractThing: (href) => href.match(/things\/([^/]+)/)[1],
};

module.exports = RuleUtils;
