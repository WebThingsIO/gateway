/**
 * Validate data with JSON-schema.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * This Source Code includes react-jsonschema-form
 * released under the Apache License 2.0.
 * https://github.com/mozilla-services/react-jsonschema-form
 * Date on whitch referred: Thu, Mar 08, 2018  1:08:52 PM
 */

'use strict';

const Ajv = require('ajv');

const Validator = {
  _ajv: new Ajv({
    errorDataPath: 'property',
    allErrors: true,
  }),
};

Validator._reEscapeChar = /\\(\\)?/g;
Validator._rePropName = RegExp(
  // Match anything that isn't a dot or bracket.
  '[^.[\\]]+|' +
  // Or match property names within brackets.
  '\\[(?:' +
  // Match a non-string expression.
  '([^"\'].*)|' +
  // Or match strings (supports escaping characters).
  '(["\'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2' +
  ')\\]|' +
  // Or match "" as the space between consecutive dots or empty brackets.
  '(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))'
  , 'g');

Validator._toPath = (string) => {
  const result = [];
  string.replace(
    Validator._rePropName,
    (match, expression, quote, subString) => {
      let key = match;
      if (quote) {
        key = subString.replace(Validator._reEscapeChar, '$1');
      } else if (expression) {
        key = expression.trim();
      }
      result.push(key);
    });
  return result;
};

Validator._toErrorSchema = (errors) => {
  // Transforms a ajv validation errors list:
  // [
  //   {dataPath: ".level1.level2[2].level3", message: "err a"},
  //   {dataPath: ".level1.level2[2].level3", message: "err b"},
  //   {dataPath: ".level1.level2[4].level3", message: "err b"},
  // ]
  // Into an error tree:
  // {
  //   level1: {
  //     level2: {
  //       2: {level3: {errors: ["err a", "err b"]}},
  //       4: {level3: {errors: ["err b"]}},
  //     }
  //   }
  // };
  if (errors === null || !errors.length) {
    return {};
  }
  return errors.reduce((errorSchema, error) => {
    const {dataPath, message} = error;
    const path = Validator._toPath(dataPath);
    let parent = errorSchema;

    for (const segment of path.slice(0)) {
      if (!(segment in parent)) {
        parent[segment] = {};
      }
      parent = parent[segment];
    }
    if (Array.isArray(parent.__errors)) {
      // We store the list of errors for this node in a dataPath named
      // __errors to avoid name collision with a possible sub schema
      // field named "errors" (see `validate.createErrorHandler`).
      parent.__errors = parent.__errors.concat(message);
    } else {
      parent.__errors = [message];
    }
    return errorSchema;
  }, {});
};

Validator.validateFormData = (formData, schema) => {
  if (Validator.hasOwnProperty('_ajv')) {
    Validator._ajv.validate(schema, formData);
    let errors = Validator._ajv.errors;
    errors = errors === null ? [] : errors;
    const errorSchema = Validator._toErrorSchema(errors);

    return {errors, errorSchema};
  } else {
    return {errors: [{message: 'validator still not available'}]};
  }
};

module.exports = Validator;
