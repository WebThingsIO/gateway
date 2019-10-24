/**
 * Unit utility functions.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const App = require('./app');
const fluent = require('./fluent');

const Units = {
  /**
   * Try to get an abbreviation for the provided unit name.
   *
   * @param {string} unit - Unit to abbreviate
   * @returns {string} Abbreviated unit.
   */
  nameToAbbreviation: (unit) => {
    if (!unit) {
      return '';
    }

    switch (unit.toLowerCase()) {
      case 'volt':
      case 'volts':
        return fluent.getMessage('abbrev-volt');

      case 'hertz':
        return fluent.getMessage('abbrev-hertz');

      case 'amp':
      case 'amps':
      case 'ampere':
      case 'amperes':
        return fluent.getMessage('abbrev-amp');

      case 'watt':
      case 'watts':
        return fluent.getMessage('abbrev-watt');

      case 'kilowatt hour':
      case 'kilowatt-hour':
      case 'kilowatt hours':
      case 'kilowatt-hours':
        return fluent.getMessage('abbrev-kilowatt-hour');

      case 'percent':
        return fluent.getMessage('abbrev-percent');

      case 'degree fahrenheit':
      case 'degrees fahrenheit':
      case 'fahrenheit':
        return fluent.getMessage('abbrev-fahrenheit');

      case 'degree celsius':
      case 'degrees celsius':
      case 'celsius':
        return fluent.getMessage('abbrev-celsius');

      case 'kelvin':
        return fluent.getMessage('abbrev-kelvin');

      case 'meter':
      case 'meters':
      case 'metre':
      case 'metres':
        return fluent.getMessage('abbrev-meter');

      case 'kilometer':
      case 'kilometers':
      case 'kilometre':
      case 'kilometres':
        return fluent.getMessage('abbrev-kilometer');

      case 'day':
      case 'days':
        return fluent.getMessage('abbrev-day');

      case 'hour':
      case 'hours':
        return fluent.getMessage('abbrev-hour');

      case 'minute':
      case 'minutes':
        return fluent.getMessage('abbrev-minute');

      case 'second':
      case 'seconds':
        return fluent.getMessage('abbrev-second');

      case 'millisecond':
      case 'milliseconds':
        return fluent.getMessage('abbrev-millisecond');

      case 'foot':
      case 'feet':
        return fluent.getMessage('abbrev-foot');

      default:
        return unit;
    }
  },

  /**
   * Convert a value according to user preferences.
   *
   * @param {*} value - Value to convert
   * @param {string} fromUnit - Unit to convert from
   * @param {string?} toUnit - Unit to convert to (if omitted, user preference
   *                           is used).
   * @returns {object} Object containing output value and unit.
   */
  convert: (value, fromUnit, toUnit) => {
    switch (fromUnit) {
      case 'degree celsius':
      case 'degrees celsius':
      case 'celsius':
        if ((toUnit || App.UNITS.temperature) === 'degree fahrenheit') {
          toUnit = App.UNITS.temperature;
          value = (value * 1.8) + 32;
        }
        break;
      case 'degree fahrenheit':
      case 'degrees fahrenheit':
      case 'fahrenheit':
        if ((toUnit || App.UNITS.temperature) === 'degree celsius') {
          toUnit = App.UNITS.temperature;
          value = (value - 32) / 1.8;
        }
        break;
      default:
        break;
    }

    return {value, unit: toUnit || fromUnit};
  },
};

module.exports = Units;
