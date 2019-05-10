/**
 * Input Field for JSON-schema type:array.
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

const SchemaUtils = require('./schema-utils');
const SchemaField = require('./schema-field');
const Utils = require('../utils');
const UnsupportedField = require('./unsupported-field');

class ArrayField {
  constructor(schema,
              formData,
              idSchema,
              name,
              definitions,
              onChange,
              required = false,
              disabled = false,
              readOnly = false) {
    this.schema = SchemaUtils.retrieveSchema(schema, definitions, formData);
    this.formData = Array.isArray(formData) ? formData : [];
    this.idSchema = idSchema;
    this.name = name;
    this.definitions = definitions;
    this.onChange = onChange;
    this.required = required;
    this.disabled = disabled;
    this.readOnly = readOnly;
  }

  require(name) {
    return (
      Array.isArray(this.schema.required) &&
      this.schema.required.includes(name)
    );
  }

  onChangeForIndex(index) {
    return (value) => {
      const newFormData = this.formData.map((item, i) => {
        // We need to treat undefined items as nulls to have validation.
        // See https://github.com/tdegrunt/jsonschema/issues/206
        const jsonValue = typeof value === 'undefined' ? null : value;
        return index === i ? jsonValue : item;
      });

      this.formData = newFormData;

      if (this.onChange) {
        this.onChange(this.formData);
      }
    };
  }

  onSelectChange(value, all) {
    return (event) => {
      const checked = event.target.checked;

      if (checked) {
        this.formData.push(value);
        this.formData.sort((a, b) => all.indexOf(a) > all.indexOf(b));
      } else {
        this.formData = this.formData.filter((v) => v !== value);
      }

      if (this.onChange) {
        this.onChange(this.formData);
      }
    };
  }

  allowAdditionalItems() {
    const schema = this.schema;
    if (schema.additionalItems === true) {
      console.warn('additionalItems=true is currently not supported');
    }
    return SchemaUtils.isObject(schema.additionalItems);
  }

  isAddable(formItems) {
    const schema = this.schema;
    let addable = true;

    if (typeof schema.maxItems !== 'undefined') {
      addable = formItems.length < schema.maxItems;
    }

    return addable;
  }

  isItemRequired(itemSchema) {
    if (Array.isArray(itemSchema.type)) {
      // While we don't yet support composite/nullable jsonschema types, it's
      // future-proof to check for requirement against these.
      return !itemSchema.type.includes('null');
    }
    // All non-null array item types are inherently required by design
    return itemSchema.type !== 'null';
  }

  itemFieldId(index) {
    return `array_${Utils.escapeHtmlForIdClass(this.idSchema.$id)}_${index}`;
  }

  onDropIndexClick(field, index) {
    return (event) => {
      const schema = this.schema;
      const itemsField = field.querySelector('div.array-items');
      let itemSchema = schema.items;
      if (SchemaUtils.isFixedItems(schema) &&
        this.allowAdditionalItems(schema)) {
        itemSchema = schema.additionalItems;
      }

      const newItemsField = itemsField.cloneNode(false);

      event.preventDefault();

      for (let i = 0; i < index; i++) {
        const id = this.itemFieldId(i);
        const item = field.querySelector(`#${id}`);

        newItemsField.appendChild(item);
      }

      for (let i = index + 1; i < this.formData.length; i++) {
        const newItem = this.renderArrayFieldItem(
          field,
          this.formData[i],
          i - 1,
          itemSchema,
          true);

        newItemsField.appendChild(newItem);
      }

      this.formData = this.formData.filter((_, i) => i !== index);

      field.replaceChild(newItemsField, itemsField);

      if (this.onChange) {
        this.onChange(this.formData);
      }
    };
  }

  renderRemoveButton(field, index) {
    const button = document.createElement('button');
    button.className = 'btn-remove btn-form-tools';
    button.disabled = this.disabled || this.readOnly;
    button.onclick = this.onDropIndexClick(field, index);

    return button;
  }

  onAddClick(field) {
    return (event) => {
      const schema = this.schema;
      const definitions = this.definitions;
      const index = this.formData.length;
      const itemsField = field.querySelector('div.array-items');

      event.preventDefault();

      let itemSchema = schema.items;
      if (SchemaUtils.isFixedItems(schema) &&
        this.allowAdditionalItems(schema)) {
        itemSchema = schema.additionalItems;
      }

      const value = SchemaUtils.getDefaultFormState(
        itemSchema,
        // eslint-disable-next-line no-undefined
        undefined,
        definitions
      );

      this.formData.push(value);

      const itemField = this.renderArrayFieldItem(
        field,
        value,
        index,
        itemSchema,
        true);

      itemsField.appendChild(itemField);

      if (this.onChange) {
        this.onChange(this.formData);
      }
    };
  }

  renderAddButton(field) {
    const button = document.createElement('button');
    button.className = 'btn-add btn-form-tools';
    button.disabled = this.disabled || this.readOnly;
    button.onclick = this.onAddClick(field);

    return button;
  }

  renderArrayFieldItem(field, itemData, index, itemSchema, canRemove) {
    const item = document.createElement('div');
    const id = this.itemFieldId(index);
    item.className = 'array-item-row';
    item.id = id;
    const hasToolbox = canRemove;

    if (hasToolbox) {
      item.innerHTML = `
      <div class="array-item array-item-col-field">
      </div>
      <div class="array-item-toolbox array-item-col-tool">
      </div>
      `;

      const toolbox = item.querySelector('div.array-item-toolbox');
      const buttom = this.renderRemoveButton(field, index);
      toolbox.appendChild(buttom);
    } else {
      item.innerHTML = `
      <div class="array-item array-item-col">
      </div>`;
    }

    const itemIdPrefix = `${this.idSchema.$id}_${index}`;
    const itemIdSchema = SchemaUtils.toIdSchema(
      itemSchema,
      itemIdPrefix,
      this.definitions,
      itemData
    );

    const childField = item.querySelector('div.array-item');
    const child = new SchemaField(
      itemSchema,
      itemData,
      itemIdSchema,
      null,
      this.definitions,
      this.onChangeForIndex(index),
      this.isItemRequired(itemSchema),
      itemSchema.disabled,
      itemSchema.readOnly).render();

    childField.appendChild(child);

    return item;
  }

  renderArrayFieldset() {
    const id = Utils.escapeHtmlForIdClass(this.idSchema.$id);
    const description = this.schema.description;

    let title = this.schema.title ? this.schema.title : this.name;
    title = Utils.escapeHtml(title);

    const field = document.createElement('fieldset');

    field.innerHTML =
      `${(title ? `<legend id="${`${id}__title`}">${title}</legend>` : '') +
      (description ?
        `<p id="${id}__description" class="field-description">
        ${Utils.escapeHtml(description)}</p>` :
        '')
      }<div class="array-items"></div>`;

    return field;
  }

  renderNormalArray() {
    const schema = this.schema;
    const definitions = this.definitions;
    const items = this.formData;
    const itemSchema = SchemaUtils.retrieveSchema(schema.items,
                                                  definitions,
                                                  items);
    const field = this.renderArrayFieldset();
    const itemsField = field.querySelector('div.array-items');

    items.forEach((item, index) => {
      const itemField = this.renderArrayFieldItem(
        field,
        item,
        index,
        itemSchema,
        true);
      itemsField.appendChild(itemField);
    });

    if (this.isAddable(items)) {
      const button = this.renderAddButton(field);
      field.appendChild(button);
    }

    return field;
  }

  renderFixedArray() {
    const schema = this.schema;
    const definitions = this.definitions;
    const field = this.renderArrayFieldset();
    const itemsField = field.querySelector('div.array-items');

    let items = this.formData;
    const itemSchemas = schema.items.map((item, index) => {
      return SchemaUtils.retrieveSchema(item, definitions, items[index]);
    });

    if (!items || items.length < itemSchemas.length) {
      items = items || [];
      items = items.concat(new Array(itemSchemas.length - items.length));
    }

    items.forEach((item, index) => {
      const additional = index >= itemSchemas.length;
      const canRemove = additional;
      const itemSchema = additional ?
        SchemaUtils.retrieveSchema(schema.additionalItems, definitions) :
        itemSchemas[index];

      const itemField = this.renderArrayFieldItem(
        field,
        item,
        index,
        itemSchema,
        canRemove);
      itemsField.appendChild(itemField);
    });

    if (this.allowAdditionalItems() && this.isAddable(items)) {
      const button = this.renderAddButton(field);
      field.appendChild(button);
    }

    return field;
  }

  renderMultiSelect() {
    const id = Utils.escapeHtmlForIdClass(this.idSchema.$id);
    const items = this.formData;
    const schema = this.schema;
    const definitions = this.definitions;
    const itemsSchema = SchemaUtils.retrieveSchema(schema.items,
                                                   definitions,
                                                   items);
    const enumOptions = SchemaUtils.optionsList(itemsSchema);
    const all = enumOptions.map(({value}) => value);

    const field = document.createElement('fieldset');
    field.className = 'checkboxes';

    enumOptions.forEach((option, index) => {
      const checked = items.includes(option.value);
      const disabledCls = (this.disabled || this.readOnly) ? 'disabled' : '';

      const div = document.createElement('div');

      div.className = `checkbox ${disabledCls}`;

      div.innerHTML = `
      <input
        type="checkbox"
        id="${id}_${index}"
        ${checked ? 'checked' : ''}
        ${(this.disabled || this.readOnly) ? 'disabled' : ''}
      />
      <span class="checkbox-title">${Utils.escapeHtml(option.label)}</span>
      `;

      const input = div.querySelector('input');
      input.onchange = this.onSelectChange(option.value, all);

      field.appendChild(div);
    });

    return field;
  }

  render() {
    const schema = this.schema;

    if (!schema.hasOwnProperty('items')) {
      return new UnsupportedField(schema).render();
    }
    if (SchemaUtils.isFixedItems(schema)) {
      return this.renderFixedArray();
    }
    /*
    if (SchemaUtils.isFilesArray(schema, this.uiSchema, this.definitions)) {
      return this.renderFiles();
    }
    */
    if (SchemaUtils.isMultiSelect(schema, this.definitions)) {
      return this.renderMultiSelect();
    }

    return this.renderNormalArray();
  }
}

module.exports = ArrayField;
