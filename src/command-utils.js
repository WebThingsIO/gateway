/**
 * Command utilities.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const booleans = {
  on: {
    value: true,
    '@type': 'OnOffProperty',
    negation: 'off',
  },
  off: {
    value: false,
    '@type': 'OnOffProperty',
    negation: 'on',
  },
  motion: {
    value: true,
    '@type': 'MotionProperty',
    negation: 'no motion',
    verb: 'detects',
  },
  'no motion': {
    value: false,
    '@type': 'MotionProperty',
    negation: 'motion',
    verb: 'detects',
  },
  open: {
    value: true,
    '@type': 'OpenProperty',
    negation: 'closed',
  },
  closed: {
    value: false,
    '@type': 'OpenProperty',
    negation: 'open',
  },
  leak: {
    value: true,
    '@type': 'LeakProperty',
    negation: 'dry',
  },
  leaking: {
    value: true,
    '@type': 'LeakProperty',
    negation: 'dry',
  },
  dry: {
    value: false,
    '@type': 'LeakProperty',
    negation: 'leaking',
  },
  pushed: {
    value: true,
    '@type': 'PushedProperty',
    negation: 'not pushed',
  },
  'not pushed': {
    value: false,
    '@type': 'PushedProperty',
    negation: 'pushed',
  },
};

/**
 * Mapping of CSS color names (in human-readable form) to hex colors.
 */
const colors = {
  black: '#000000',
  silver: '#c0c0c0',
  gray: '#808080',
  white: '#ffffff',
  maroon: '#800000',
  red: '#ff0000',
  purple: '#800080',
  fuchsia: '#ff00ff',
  green: '#008000',
  lime: '#00ff00',
  olive: '#808000',
  yellow: '#ffff00',
  navy: '#000080',
  blue: '#0000ff',
  teal: '#008080',
  aqua: '#00ffff',
  orange: '#ffa500',
  'alice blue': '#f0f8ff',
  'antique white': '#faebd7',
  aquamarine: '#7fffd4',
  azure: '#f0ffff',
  beige: '#f5f5dc',
  bisque: '#ffe4c4',
  'blanched almond': '#ffebcd',
  'blue violet': '#8a2be2',
  brown: '#a52a2a',
  burlywood: '#deb887',
  'cadet blue': '#5f9ea0',
  chartreuse: '#7fff00',
  chocolate: '#d2691e',
  coral: '#ff7f50',
  'cornflower blue': '#6495ed',
  'corn silk': '#fff8dc',
  crimson: '#dc143c',
  cyan: '#00ffff',
  'dark blue': '#00008b',
  'dark cyan': '#008b8b',
  'dark goldenrod': '#b8860b',
  'dark gray': '#a9a9a9',
  'dark green': '#006400',
  'dark grey': '#a9a9a9',
  'dark khaki': '#bdb76b',
  'dark magenta': '#8b008b',
  'dark olive green': '#556b2f',
  'dark orange': '#ff8c00',
  'dark orchid': '#9932cc',
  'dark red': '#8b0000',
  'dark salmon': '#e9967a',
  'dark seagreen': '#8fbc8f',
  'dark slate blue': '#483d8b',
  'dark slate gray': '#2f4f4f',
  'dark slate grey': '#2f4f4f',
  'dark turquoise': '#00ced1',
  'dark violet': '#9400d3',
  'deep pink': '#ff1493',
  'deep sky blue': '#00bfff',
  'dim gray': '#696969',
  'dim grey': '#696969',
  'dodger blue': '#1e90ff',
  firebrick: '#b22222',
  'floral white': '#fffaf0',
  'forest green': '#228b22',
  gainsboro: '#dcdcdc',
  'ghost white': '#f8f8ff',
  gold: '#ffd700',
  goldenrod: '#daa520',
  'green yellow': '#adff2f',
  grey: '#808080',
  honeydew: '#f0fff0',
  'hot pink': '#ff69b4',
  'indian red': '#cd5c5c',
  indigo: '#4b0082',
  ivory: '#fffff0',
  khaki: '#f0e68c',
  lavender: '#e6e6fa',
  'lavender blush': '#fff0f5',
  'lawn green': '#7cfc00',
  'lemon chiffon': '#fffacd',
  'light blue': '#add8e6',
  'light coral': '#f08080',
  'light cyan': '#e0ffff',
  'light goldenrod yellow': '#fafad2',
  'light gray': '#d3d3d3',
  'light green': '#90ee90',
  'light grey': '#d3d3d3',
  'light pink': '#ffb6c1',
  'light salmon': '#ffa07a',
  'light sea green': '#20b2aa',
  'light sky blue': '#87cefa',
  'light slate gray': '#778899',
  'light slate grey': '#778899',
  'light steel blue': '#b0c4de',
  'light yellow': '#ffffe0',
  'lime green': '#32cd32',
  linen: '#faf0e6',
  magenta: '#ff00ff',
  'medium aquamarine': '#66cdaa',
  'medium blue': '#0000cd',
  'medium orchid': '#ba55d3',
  'medium purple': '#9370db',
  'medium sea green': '#3cb371',
  'medium slate blue': '#7b68ee',
  'medium spring green': '#00fa9a',
  'medium turquoise': '#48d1cc',
  'medium violet red': '#c71585',
  'midnight blue': '#191970',
  'mint cream': '#f5fffa',
  'misty rose': '#ffe4e1',
  moccasin: '#ffe4b5',
  'navajo white': '#ffdead',
  'old lace': '#fdf5e6',
  'olive drab': '#6b8e23',
  'orange red': '#ff4500',
  orchid: '#da70d6',
  'pale goldenrod': '#eee8aa',
  'pale green': '#98fb98',
  'pale turquoise': '#afeeee',
  'pale violet red': '#db7093',
  'papaya whip': '#ffefd5',
  'peach puff': '#ffdab9',
  peru: '#cd853f',
  pink: '#ffc0cb',
  plum: '#dda0dd',
  'powder blue': '#b0e0e6',
  'rosy brown': '#bc8f8f',
  'royal blue': '#4169e1',
  'saddle brown': '#8b4513',
  salmon: '#fa8072',
  'sandy brown': '#f4a460',
  'sea green': '#2e8b57',
  seashell: '#fff5ee',
  sienna: '#a0522d',
  'sky blue': '#87ceeb',
  'slate blue': '#6a5acd',
  'slate gray': '#708090',
  'slate grey': '#708090',
  snow: '#fffafa',
  'spring green': '#00ff7f',
  'steel blue': '#4682b4',
  tan: '#d2b48c',
  thistle: '#d8bfd8',
  tomato: '#ff6347',
  turquoise: '#40e0d0',
  violet: '#ee82ee',
  wheat: '#f5deb3',
  'white smoke': '#f5f5f5',
  'yellow green': '#9acd32',
  'rebecca purple': '#663399',
};

/**
 * Mapping of percentages (in human-readable form) to numbers.
 */
const percentages = {
  'zero percent': 0,
  'one percent': 1,
  'two percent': 2,
  'three percent': 3,
  'four percent': 4,
  'five percent': 5,
  'six percent': 6,
  'seven percent': 7,
  'eight percent': 8,
  'nine percent': 9,

  'ten percent': 10,
  'eleven percent': 11,
  'twelve percent': 12,
  'thirteen percent': 13,
  'fourteen percent': 14,
  'fifteen percent': 15,
  'sixteen percent': 16,
  'seventeen percent': 17,
  'eighteen percent': 18,
  'nineteen percent': 19,

  'twenty percent': 20,
  'twenty one percent': 21,
  'twenty two percent': 22,
  'twenty three percent': 23,
  'twenty four percent': 24,
  'twenty five percent': 25,
  'twenty six percent': 26,
  'twenty seven percent': 27,
  'twenty eight percent': 28,
  'twenty nine percent': 29,

  'thirty percent': 30,
  'thirty one percent': 31,
  'thirty two percent': 32,
  'thirty three percent': 33,
  'thirty four percent': 34,
  'thirty five percent': 35,
  'thirty six percent': 36,
  'thirty seven percent': 37,
  'thirty eight percent': 38,
  'thirty nine percent': 39,

  'forty percent': 40,
  'forty one percent': 41,
  'forty two percent': 42,
  'forty three percent': 43,
  'forty four percent': 44,
  'forty five percent': 45,
  'forty six percent': 46,
  'forty seven percent': 47,
  'forty eight percent': 48,
  'forty nine percent': 49,

  // Handle misspelling of forty
  'fourty percent': 40,
  'fourty one percent': 41,
  'fourty two percent': 42,
  'fourty three percent': 43,
  'fourty four percent': 44,
  'fourty five percent': 45,
  'fourty six percent': 46,
  'fourty seven percent': 47,
  'fourty eight percent': 48,
  'fourty nine percent': 49,

  'fifty percent': 50,
  'fifty one percent': 51,
  'fifty two percent': 52,
  'fifty three percent': 53,
  'fifty four percent': 54,
  'fifty five percent': 55,
  'fifty six percent': 56,
  'fifty seven percent': 57,
  'fifty eight percent': 58,
  'fifty nine percent': 59,

  'sixty percent': 60,
  'sixty one percent': 61,
  'sixty two percent': 62,
  'sixty three percent': 63,
  'sixty four percent': 64,
  'sixty five percent': 65,
  'sixty six percent': 66,
  'sixty seven percent': 67,
  'sixty eight percent': 68,
  'sixty nine percent': 69,

  'seventy percent': 70,
  'seventy one percent': 71,
  'seventy two percent': 72,
  'seventy three percent': 73,
  'seventy four percent': 74,
  'seventy five percent': 75,
  'seventy six percent': 76,
  'seventy seven percent': 77,
  'seventy eight percent': 78,
  'seventy nine percent': 79,

  'eighty percent': 80,
  'eighty one percent': 81,
  'eighty two percent': 82,
  'eighty three percent': 83,
  'eighty four percent': 84,
  'eighty five percent': 85,
  'eighty six percent': 86,
  'eighty seven percent': 87,
  'eighty eight percent': 88,
  'eighty nine percent': 89,

  'ninety percent': 90,
  'ninety one percent': 91,
  'ninety two percent': 92,
  'ninety three percent': 93,
  'ninety four percent': 94,
  'ninety five percent': 95,
  'ninety six percent': 96,
  'ninety seven percent': 97,
  'ninety eight percent': 98,
  'ninety nine percent': 99,

  'one hundred percent': 100,
};

for (let i = 0; i <= 100; i++) {
  percentages[`${i}%`] = i;
}

const plurals = {
  devices: [],
  things: [],
  lights: ['Light'],
};

/**
 * Find a property of a thing by its expected @type.
 *
 * @param {Object} thing Thing to search
 * @param {String} type Expected @type value
 * @param {String?} fallbackName Fallback name for legacy devices
 * @returns {String} property name
 */
function findProperty(thing, propType, fallbackName) {
  for (const prop in thing.properties) {
    if (thing.properties[prop]['@type'] === propType) {
      return prop;
    }
  }

  if (thing.properties.hasOwnProperty(fallbackName)) {
    return fallbackName;
  }

  return null;
}

module.exports = {
  booleans,
  colors,
  percentages,
  plurals,
  findProperty,
};
