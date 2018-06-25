/**
 * Utility functions.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const Utils = {
  /**
   * @param {String} str
   * @return {String} the string with the first letter capitalized
   */
  capitalize: function(str) {
    return str[0].toUpperCase() + str.substr(1);
  },
  escapeHtml: function(text) {
    if (typeof (text) !== 'string') {
      text = `${text}`;
    }

    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/°/g, '&deg;');
  },
  escapeHtmlForIdClass: function(text) {
    if (typeof (text) !== 'string') {
      text = `${text}`;
    }

    text = text.replace(/[^_a-zA-Z0-9-]/g, '_');
    if (/^[0-9-]/.test(text)) {
      text = `_${text}`;
    }

    return text;
  },
  fuzzyTime: function(date) {
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
      fuzzy = 'now';
    } else if (delta < minute) {
      fuzzy = `${delta} secs ago`;
    } else if (delta < 2 * minute) {
      fuzzy = '1 min ago';
    } else if (delta < hour) {
      fuzzy = `${Math.floor(delta / minute)} mins ago`;
    } else if (delta < 2 * hour) {
      fuzzy = '1 hour ago';
    } else if (delta < day) {
      fuzzy = `${Math.floor(delta / hour)} hours ago`;
    } else if (delta < 2 * day) {
      fuzzy = '1 day ago';
    } else if (delta < week) {
      fuzzy = `${Math.floor(delta / day)} days ago`;
    } else if (delta < 2 * week) {
      fuzzy = '1 week ago';
    } else if (delta < month) {
      fuzzy = `${Math.floor(delta / week)} weeks ago`;
    } else if (delta < 2 * month) {
      fuzzy = '1 month ago';
    } else if (delta < year) {
      fuzzy = `${Math.floor(delta / month)} months ago`;
    } else if (delta < 2 * year) {
      fuzzy = '1 year ago';
    } else {
      fuzzy = `${Math.floor(delta / year)} years ago`;
    }

    return fuzzy;
  },
  debounce: function(delay, callback) {
    return Utils.throttle(delay, callback, true);
  },
  throttle: function(delay, callback, debounceMode = false) {
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
  unitNameToAbbreviation: function(unit) {
    switch (unit.toLowerCase()) {
      case 'volt':
      case 'volts':
        return 'V';

      case 'hertz':
        return 'Hz';

      case 'amp':
      case 'amps':
      case 'ampere':
      case 'amperes':
        return 'A';

      case 'watt':
      case 'watts':
        return 'W';

      case 'percent':
        return '%';

      case 'fahrenheit':
        return '°F';

      case 'celsius':
        return '°C';

      case 'kelvin':
        return 'K';

      case 'meter':
      case 'meters':
      case 'metre':
      case 'metres':
        return 'm';

      case 'second':
      case 'seconds':
        return 's';

      default:
        return unit;
    }
  },
};

module.exports = Utils;
