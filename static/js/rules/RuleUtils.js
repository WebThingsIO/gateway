const RuleUtils = {
  icon: function(description) {
    if (description.selectedCapability) {
      switch (description.selectedCapability) {
        case 'OnOffSwitch':
          return '/optimized-images/rule-icons/on_off_switch.svg';
        case 'MultiLevelSwitch':
          return '/optimized-images/rule-icons/multi_level_switch.svg';
        case 'ColorControl':
          return '/optimized-images/rule-icons/color_control.svg';
        case 'EnergyMonitor':
          return '/optimized-images/rule-icons/energy_monitor.svg';
        case 'BinarySensor':
          return '/optimized-images/rule-icons/binary_sensor.svg';
        case 'MultiLevelSensor':
          return '/optimized-images/rule-icons/multi_level_sensor.svg';
        case 'SmartPlug':
          return '/optimized-images/rule-icons/smart_plug.svg';
        case 'Light':
          return '/optimized-images/rule-icons/light.svg';
        case 'DoorSensor':
          return '/optimized-images/rule-icons/door_sensor.svg';
        case 'MotionSensor':
          return '/optimized-images/rule-icons/motion_sensor.svg';
        case 'PushButton':
          return '/optimized-images/rule-icons/push_button.svg';
        default:
          return '/optimized-images/rule-icons/thing.svg';
      }
    } else {
      switch (description.type) {
        case 'onOffSwitch':
          return '/optimized-images/rule-icons/on_off_switch.svg';
        case 'onOffLight':
        case 'onOffColorLight':
        case 'dimmableLight':
        case 'dimmableColorLight':
          return '/optimized-images/rule-icons/light.svg';
        case 'binarySensor':
          return '/optimized-images/rule-icons/binary_sensor.svg';
        case 'multiLevelSensor':
          return '/optimized-images/rule-icons/multi_level_sensor.svg';
        case 'multiLevelSwitch':
          return '/optimized-images/rule-icons/multi_level_switch.svg';
        case 'smartPlug':
          return '/optimized-images/rule-icons/smart_plug.svg';
        default:
          return '/optimized-images/rule-icons/thing.svg';
      }
    }
  },
  // Helper function for selecting the thing corresponding to a property
  byProperty: function byProperty(property) {
    return function(option) {
      if (!property) {
        console.warn('byProperty property undefined', new Error().stack);
        return false;
      }
      const optProp = option.properties[property.name];
      return optProp && (optProp.href === property.href);
    };
  },
  // Helper function for selecting the thing corresponding to an href
  byHref: function byHref(href) {
    return function(thing) {
      return thing.href === href;
    };
  },
  thingFromPart: function(gateway, part) {
    let thing = null;
    if (part.type === 'EventTrigger' || part.type === 'ActionEffect') {
      thing = gateway.things.filter(
        RuleUtils.byHref(part.thing.href)
      )[0];
    } else if (part.property) {
      thing = gateway.things.filter(
        RuleUtils.byProperty(part.property)
      )[0];
    }
    return thing;
  },
};

module.exports = RuleUtils;
