/**
 * Utility functions.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const fluent = require('./fluent');

const Utils = {
  /**
   * @param {String} str
   * @return {String} the string with the first letter capitalized
   */
  capitalize: (str) => str[0].toUpperCase() + str.substr(1),
  escapeHtml: (text) => {
    if (typeof (text) !== 'string') {
      text = `${text}`;
    }

    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/°/g, '&deg;')
      .replace(/⋅/g, '&sdot;');
  },
  unescapeHtml: (text) => {
    if (typeof (text) !== 'string') {
      text = `${text}`;
    }

    return text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'") // eslint-disable-line quotes
      .replace(/&deg;/g, '°')
      .replace(/&sdot;/g, '⋅');
  },
  escapeHtmlForIdClass: (text) => {
    if (typeof (text) !== 'string') {
      text = `${text}`;
    }

    text = text.replace(/[^_a-zA-Z0-9-]/g, '_');
    if (/^[0-9-]/.test(text)) {
      text = `_${text}`;
    }

    return text;
  },
  fuzzyTime: (date) => {
    const now = new Date();
    const delta = Math.round((now - date) / 1000);

    const minute = 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const month = day * 30;
    const year = day * 365;

    let fuzzy;
    if (delta < 5) {
      fuzzy = fluent.getMessage('utils-now');
    } else if (delta < minute) {
      fuzzy = fluent.getMessage(
        'utils-seconds-ago',
        {value: delta}
      );
    } else if (delta < hour) {
      fuzzy = fluent.getMessage(
        'utils-minutes-ago',
        {value: Math.floor(delta / minute)}
      );
    } else if (delta < day) {
      fuzzy = fluent.getMessage(
        'utils-hours-ago',
        {value: Math.floor(delta / hour)}
      );
    } else if (delta < week) {
      fuzzy = fluent.getMessage(
        'utils-days-ago',
        {value: Math.floor(delta / day)}
      );
    } else if (delta < month) {
      fuzzy = fluent.getMessage(
        'utils-weeks-ago',
        {value: Math.floor(delta / week)}
      );
    } else if (delta < year) {
      fuzzy = fluent.getMessage(
        'utils-months-ago',
        {value: Math.floor(delta / month)}
      );
    } else {
      fuzzy = fluent.getMessage(
        'utils-years-ago',
        {value: Math.floor(delta / year)}
      );
    }

    return fuzzy;
  },
  debounce: (delay, callback) => Utils.throttle(delay, callback, true),
  throttle: (delay, callback, debounceMode = false) => {
    let timeout = null;
    let lastExec = 0;
    const throttleMode = !debounceMode;

    return function wrapper() {
      const elapsed = Number(new Date()) - lastExec;
      const args = arguments;

      const exec = () => {
        lastExec = Number(new Date());
        callback(args);
      };

      if (timeout) {
        clearTimeout(timeout);
      }

      if (throttleMode === true && elapsed > delay) {
        exec();
      } else {
        timeout = setTimeout(exec, debounceMode ? delay : delay - elapsed);
      }
    };
  },
  colorTemperatureToRGB: (value) => {
    /**
     * Algorithm found here:
     * http://www.tannerhelland.com/4435/convert-temperature-rgb-algorithm-code/
     */
    value /= 100;

    let r;
    if (value <= 66) {
      r = 255;
    } else {
      r = value - 60;
      r = 329.698727446 * r ** -0.1332047592;
      r = Math.max(r, 0);
      r = Math.min(r, 255);
    }

    let g;
    if (value <= 66) {
      g = value;
      g = 99.4708025861 * Math.log(g) - 161.1195681661;
    } else {
      g = value - 60;
      g = 288.1221695283 * g ** -0.0755148492;
    }

    g = Math.max(g, 0);
    g = Math.min(g, 255);

    let b;
    if (value >= 66) {
      b = 255;
    } else if (value <= 19) {
      b = 0;
    } else {
      b = value - 10;
      b = 138.5177312231 * Math.log(b) - 305.0447927307;
      b = Math.max(b, 0);
      b = Math.min(b, 255);
    }

    r = Math.round(r).toString(16);
    g = Math.round(g).toString(16);
    b = Math.round(b).toString(16);

    return `#${r}${g}${b}`;
  },
  sortCapabilities: (capabilities) => {
    // copy the array, as we're going to sort in place.
    const list = capabilities.slice();

    const priority = [
      'Lock',
      'Thermostat',
      'VideoCamera',
      'Camera',
      'SmartPlug',
      'Light',
      'MultiLevelSwitch',
      'OnOffSwitch',
      'ColorControl',
      'ColorSensor',
      'EnergyMonitor',
      'DoorSensor',
      'MotionSensor',
      'LeakSensor',
      'SmokeSensor',
      'PushButton',
      'TemperatureSensor',
      'HumiditySensor',
      'MultiLevelSensor',
      'Alarm',
      'BinarySensor',
      'BarometricPressureSensor',
      'AirQualitySensor',
    ];

    list.sort((a, b) => {
      if (!priority.includes(a) && !priority.includes(b)) {
        return 0;
      } else if (!priority.includes(a)) {
        return 1;
      } else if (!priority.includes(b)) {
        return -1;
      }

      return priority.indexOf(a) - priority.indexOf(b);
    });

    return list;
  },

  /**
   * Adjust an input value to match schema bounds.
   *
   * @param {number} value - Value to adjust
   * @returns {number} Adjusted value
   */
  adjustInputValue: function(value, schema) {
    if (typeof value !== 'number') {
      return value;
    }

    let multipleOf = schema.multipleOf;
    if (typeof multipleOf !== 'number' && schema.type === 'integer') {
      multipleOf = 1;
    }

    if (typeof multipleOf === 'number') {
      value = Math.round(value / multipleOf) * multipleOf;

      // Deal with floating point nonsense
      if (`${multipleOf}`.includes('.')) {
        const precision = `${multipleOf}`.split('.')[1].length;
        value = Number(value.toFixed(precision));
      }
    }

    if (schema.hasOwnProperty('minimum')) {
      value = Math.max(value, schema.minimum);
    }

    if (schema.hasOwnProperty('maximum')) {
      value = Math.min(value, schema.maximum);
    }

    // If there is an enum, match the closest enum value
    if (schema.hasOwnProperty('enum')) {
      value = schema.enum.sort(
        (a, b) => Math.abs(a - value) - Math.abs(b - value)
      )[0];
    }

    return value;
  },
};

module.exports = Utils;
