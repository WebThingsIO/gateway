/**
 *
 * utils - Some utility functions
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

var utils = module.exports = {};

function repeatChar(char, len) {
  if (len <= 0) {
    return '';
  }
  return new Array(len + 1).join(char);
}
utils.repeatChar = repeatChar;

function padLeft(str, len) {
  return (repeatChar(' ', len) + str).slice(-len);
}
utils.padLeft = padLeft;

function padRight(str, len) {
  return (str + repeatChar(' ', len)).slice(0, len);
}
utils.padRight = padRight;

function hexStr(num, len) {
  return (repeatChar('0', len) + num.toString(16)).slice(-len);
}
utils.hexStr = hexStr;

function alignCenter(str, len) {
  if (str.length >= len) {
    return str.slice(0, len);
  }
  var leftSpace = parseInt((len - str.length) / 2);
  return padRight(padLeft(str, str.length + leftSpace), len);
}

/**
 * Prints formatted columns of lines. Lines is an array of lines.
 * Each line can be a single character, in which case a separator line
 * using that character is printed. Otherwise a line is expected to be an
 * array of fields.
 * The alignment argument is expected to be a string, one character per
 * column. '<' = left, '>' = right, '=' = center). If no alignment
 * character is found, then left alignment is assumed.
 */
function printTable(alignment, lines) {
  var width = [];
  var colWidth;
  var idx;

  // Take a pass through the data and figure out the width for each column.
  for (var line of lines) {
    if (typeof(line) !== 'string') {
      for (idx in line) {
        colWidth = line[idx].length;
        if (width[idx] === undefined || colWidth > width[idx]) {
          width[idx] = colWidth;
        }
      }
    }
  }

  // Now that we know how wide each column is, go and print them.
  for (line of lines) {
    var lineStr = '';
    for (idx in width) {
      if (idx > 0) {
        lineStr += ' ';
      }
      colWidth = width[idx];
      if (typeof(line) === 'string') {
        lineStr += repeatChar(line[0], colWidth);
      } else {
        var align = alignment[idx];
        var field = line[idx];
        if (field === undefined) {
          field = '';
        }
        if (align === '>') {
          lineStr += padLeft(field, colWidth);
        } else if (align === '=') {
          lineStr += alignCenter(field, colWidth);
        } else {
          lineStr += padRight(field, colWidth);
        }
      }
    }
    console.log(lineStr);
  }
}
utils.printTable = printTable;
