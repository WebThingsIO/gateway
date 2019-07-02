class BlockConfigureDropdown {
  /**
   * A hand-coded <select>-like element which allows the configuration of
   * several values through a dropdown-style menu
   * @constructor
   * @param {RulePartBlock} block
   * @param {Element} parent
   */
  constructor(block, parent) {
    this.block = block;

    this.elt = document.createElement('div');
    this.elt.classList.add('property-select');
    this.elt.classList.add('block-configure-dropdown');

    this.onClick = this.onClick.bind(this);
    this.elt.addEventListener('click', this.onClick);

    this.onDocumentClick = this.onDocumentClick.bind(this);
    document.body.addEventListener('click', this.onDocumentClick);

    this.addValue({
      openButton: true,
      id: null,
      title: 'Configure...',
      type: null,
    });

    // Disable dragging started by clicking property select
    this.elt.addEventListener('mousedown', (e) => {
      e.stopPropagation();
    });
    this.elt.addEventListener('touchstart', (e) => {
      e.stopPropagation();
    });

    parent.appendChild(this.elt);
  }

  /**
   * Add a configurable value to the dropdown
   * @param {String} name
   * @param {Object} schema - JSON schema description of value
   */
  addValue(schema) {
    const elt = document.createElement('div');
    elt.classList.add('property-select-option');
    if (schema.openButton) {
      elt.classList.add('open-button');
    }
    const nameElt = document.createElement('span');
    nameElt.classList.add('property-select-name');
    nameElt.textContent = schema.title;
    nameElt.title = schema.title;
    elt.appendChild(nameElt);

    const stopPropagation = (e) => {
      e.stopPropagation();
    };

    if (schema.type === 'number' || schema.type === 'integer') {
      let valueInput, valueSelect;
      if (schema.hasOwnProperty('enum') && schema.enum.length > 0) {
        valueSelect = document.createElement('select');
        valueSelect.classList.add('value-select');

        for (const choice of schema.enum) {
          const option = document.createElement('option');
          option.value = choice;
          option.innerText = choice;
          valueSelect.appendChild(option);
        }

        valueSelect.addEventListener('click', stopPropagation);
        elt.appendChild(valueSelect);
      } else {
        valueInput = document.createElement('input');
        valueInput.classList.add('value-input');
        valueInput.type = 'number';
        if (schema.hasOwnProperty('multipleOf')) {
          valueInput.step = `${schema.multipleOf}`;
        } else if (schema.type === 'number') {
          valueInput.step = 'any';
        } else {
          valueInput.step = '1';
        }
        if (schema.hasOwnProperty('minimum')) {
          valueInput.min = `${schema.minimum}`;
        }
        if (schema.hasOwnProperty('maximum')) {
          valueInput.max = `${schema.maximum}`;
        }
        valueInput.addEventListener('click', stopPropagation);
        elt.appendChild(valueInput);
      }

      elt.addEventListener('change', () => {
        let value;
        if (valueInput) {
          value = parseFloat(valueInput.value);
        } else {
          value =
            parseFloat(valueSelect.options[valueSelect.selectedIndex].value);
        }

        if (schema.hasOwnProperty('multipleOf')) {
          value = Math.round(value / schema.multipleOf) * schema.multipleOf;
        }
        if (schema.type === 'integer') {
          value = parseInt(value);
        }
        if (schema.hasOwnProperty('minimum')) {
          value = Math.max(value, schema.minimum);
        }
        if (schema.hasOwnProperty('maximum')) {
          value = Math.min(value, schema.maximum);
        }

        if (valueInput) {
          valueInput.value = value;
        }
        this.block.onValueChange(schema.id, value);
      });
    } else if (schema.type === 'string') {
      let valueInput, valueSelect;
      if (schema.hasOwnProperty('enum') && schema.enum.length > 0) {
        valueSelect = document.createElement('select');
        valueSelect.classList.add('value-select');

        for (const choice of schema.enum) {
          const option = document.createElement('option');
          option.value = choice;
          option.innerText = choice;
          valueSelect.appendChild(option);
        }

        valueSelect.addEventListener('click', stopPropagation);
        elt.appendChild(valueSelect);
      } else {
        valueInput = document.createElement('input');
        valueInput.classList.add('value-input');
        if (schema.id === 'color') {
          valueInput.type = 'color';
        } else {
          valueInput.type = 'text';
        }
        valueInput.addEventListener('click', stopPropagation);
        elt.appendChild(valueInput);
      }

      elt.addEventListener('change', () => {
        let value;
        if (valueInput) {
          value = valueInput.value;
        } else {
          value = valueSelect.options[valueSelect.selectedIndex].value;
        }
        this.block.onValueChange(name, value);
      });
    }

    this.elt.appendChild(elt);
  }

  /**
   * Open when the user clicks the configure button
   * @param {Event} e
   */
  onClick(_e) {
    this.elt.classList.add('open');
  }

  /**
   * Close when the user clicks off of the dropdown
   * @param {Event} e
   */
  onDocumentClick(e) {
    if (!this.elt.classList.contains('open')) {
      return;
    }
    let node = e.target;
    while (node) {
      if (node === this.elt) {
        return;
      }
      node = node.parentNode;
    }
    this.elt.classList.remove('open');
  }

  remove() {
    this.elt.removeEventListener('click', this.onClick);
    document.body.removeEventListener('click', this.onDocumentClick);
  }
}

module.exports = BlockConfigureDropdown;
