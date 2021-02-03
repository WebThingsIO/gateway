/**
 * Field for result of JSON-schema validation.
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

import { ErrorObject } from 'ajv';

export default class ErrorField {
  private field: HTMLDivElement;

  private errorList: HTMLUListElement;

  constructor() {
    const field = document.createElement('div');
    field.className = 'errors-field hidden';

    field.innerHTML = `
      <div>
        <h3 class="errors-title" data-l10n-id="errors"></h3>
      </div>
      <ul class="errors-list">
      </ul>`;

    this.field = field;
    this.errorList = field.querySelector('ul')!;
  }

  render(errors: ErrorObject[]): HTMLDivElement {
    if (errors.length > 0) {
      const errorHtml = errors.map((error) => {
        return `
            <li class="error-item">
              ${`${error.dataPath} ${error.message}`.trim()}
            </li>`;
      });

      this.errorList.innerHTML = errorHtml.join(' ');

      this.field.classList.remove('hidden');
    } else {
      this.field.classList.add('hidden');
    }

    return this.field;
  }
}
