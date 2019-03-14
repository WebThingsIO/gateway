/**
 * LevelDetail
 *
 * A bubble showing the level of a thing
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const Utils = require('../../utils');

class LevelDetail {
  constructor(thing, name, property) {
    this.thing = thing;
    this.name = name;
    this.readOnly = !!property.readOnly;
    this.label = property.title || 'Level';
    this.unit =
      property.unit ? Utils.unitNameToAbbreviation(property.unit) : null;

    if (property.hasOwnProperty('minimum')) {
      this.min = property.minimum;
    } else {
      this.min = 0;
    }

    if (property.hasOwnProperty('maximum')) {
      this.max = property.maximum;
    } else {
      this.max = 100;
    }

    if (property.hasOwnProperty('multipleOf')) {
      this.step = property.multipleOf;
    } else if (property.type === 'number') {
      this.step = 'any';
    } else {
      this.step = 1;
    }

    this.id = `level-${Utils.escapeHtmlForIdClass(this.name)}`;
  }

  attach() {
    this.level = this.thing.element.querySelector(`#${this.id}`);
    const setLevel = Utils.debounce(500, this.set.bind(this));
    this.level.addEventListener('change', setLevel);
  }

  view() {
    const unit = this.unit || '';
    const readOnly = this.readOnly ? 'data-read-only="true"' : '';

    return `
      <webthing-level-property data-name="${Utils.escapeHtml(this.label)}"
        data-unit="${unit}" min="${this.min}" max="${this.max}"
        step="${this.step}" id="${this.id}" ${readOnly}>
      </webthing-level-property>`;
  }

  update(level) {
    if (!this.level) {
      return;
    }

    this.level.value = level;
  }

  set() {
    this.thing.setProperty(this.name, this.level.value);
  }
}

module.exports = LevelDetail;
