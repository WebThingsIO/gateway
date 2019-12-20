/**
 * Read data from the official ISO 639-3 table.
 */

'use strict';

const fs = require('fs');
const {getName} = require('country-list');
const parse = require('csv-parse/lib/sync');
const path = require('path');

let parsed = false;
const by1 = new Map();
const by3 = new Map();

/**
 * Parse the table in this directory.
 */
function readFile() {
  let fname;
  try {
    for (const name of fs.readdirSync(__dirname)) {
      if (name.endsWith('.tab')) {
        fname = name;
        break;
      }
    }
  } catch (e) {
    console.error('Failed to list directory:', e);
    return false;
  }

  if (!fname) {
    return false;
  }

  let data;
  try {
    data = fs.readFileSync(path.join(__dirname, fname), 'utf8');
  } catch (e) {
    console.error('Failed to read ISO-639 table:', e);
    return false;
  }

  if (!data) {
    return false;
  }

  const records = parse(data, {delimiter: '\t', columns: true, trim: true});
  if (records.length === 0) {
    return false;
  }

  for (const record of records) {
    // Id is the 639-3 code
    if (record.Id) {
      by3.set(record.Id, record.Ref_Name);
    }

    // Part1 is the 639-1 code
    if (record.Part1) {
      by1.set(record.Part1, record.Ref_Name);
    }
  }

  return true;
}

/**
 * Look up the provided code.
 *
 * @param {string} code - Code to look up
 * @returns {string?} Language name or undefined if not found.
 */
function lookup(code) {
  if (!parsed) {
    if (!readFile()) {
      return;
    }

    parsed = true;
  }

  const [language, country] = code.split('-');
  let name;
  if (language.length === 2) {
    name = by1.get(language);
  } else if (language.length === 3) {
    name = by3.get(language);
  } else {
    return;
  }

  if (name && country) {
    const countryName = getName(country) || country;
    name = `${name} (${countryName})`;
  }

  return name;
}

module.exports = lookup;
