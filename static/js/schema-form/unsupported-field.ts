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

import * as Utils from '../utils';
import * as Fluent from '../fluent';

export default class UnsupportedField {
  private schema: Record<string, unknown>;

  constructor(schema: Record<string, unknown>) {
    // XXX render json as string so dev can inspect faulty subschema
    this.schema = schema;
  }

  render(): HTMLDivElement {
    const schema = Utils.escapeHtml(JSON.stringify(this.schema, null, 2));
    const field = document.createElement('div');
    field.className = 'unsupported-field';

    const fieldMessage = document.createElement('span');
    fieldMessage.innerText = Fluent.getMessage('unsupported-field');

    const schemaMessage = document.createElement('span');
    schemaMessage.innerHTML = schema;

    field.appendChild(fieldMessage);
    field.appendChild(schemaMessage);

    return field;
  }
}
