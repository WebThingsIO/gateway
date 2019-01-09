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
        case 'TemperatureSensor':
          return '/optimized-images/rule-icons/temperature_sensor.svg';
        default:
          return description.iconHref ||
            '/optimized-images/rule-icons/thing.svg';
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
          return description.iconHref ||
            '/optimized-images/rule-icons/thing.svg';
      }
    }
  },
  // Helper function for selecting the thing corresponding to a property
  byProperty: function(property) {
    return function(option) {
      if (!property) {
        console.warn('byProperty property undefined', new Error().stack);
        return false;
      }
      const propHref = `/things/${property.thing}/properties/${property.id}`;
      const optProp = option.properties[property.id];
      return optProp && optProp.links.filter((l) => {
        return (!l.rel || l.rel === 'property') && l.href === propHref;
      }).length > 0;
    };
  },
  // Helper function for selecting the thing corresponding to an href
  byThing: function(thing) {
    return function(otherThing) {
      return otherThing.href === `/things/${thing}`;
    };
  },
  thingFromPart: function(gateway, part) {
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
  extractProperty: function(href) {
    return href.match(/properties\/([^/]+)/)[1];
  },
  extractThing: function(href) {
    return href.match(/things\/([^/]+)/)[1];
  },
};

module.exports = RuleUtils;
