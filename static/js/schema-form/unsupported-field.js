/**
 * Field for JSON-schema type:Unsupported.
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

const Utils = require('../utils');

class UnsupportedField {
  constructor(schema) {
    // XXX render json as string so dev can inspect faulty subschema
    this.schema = schema;
  }

  render() {
    const schema = Utils.escapeHtml(JSON.stringify(this.schema, null, 2));
    const field = document.createElement('div');

    field.className = 'unsupported-field';
    field.innerHTML = `Unsupported field schema ${schema}.`;

    return field;
  }
}

module.exports = UnsupportedField;
