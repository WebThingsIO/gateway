/**
 * A hand-coded <select>-like element which allows the selection of one of a
 * thing's properties. In a perfect world this would be a styled select, but
 * this is not a perfect world.
 * @constructor
 * @param {Element} parent
 * @param {Rule} rule
 * @param {ThingDescription} thing
 */
function PropertySelect(parent, rule, thing) {
  this.rule = rule;
  this.thing = thing;
  this.role = '';

  this.elt = document.createElement('div');
  this.elt.classList.add('property-select');

  this.onClick = this.onClick.bind(this);
  this.elt.addEventListener('click', this.onClick);

  this.clearOptions();

  // Disable dragging started by clicking property select
  this.elt.addEventListener('mousedown', function(e) {
    e.stopPropagation();
  });
  this.elt.addEventListener('touchstart', function(e) {
    e.stopPropagation();
  });

  parent.appendChild(this.elt);
}

/**
 * Reset the options list to only include the placeholder Select Property
 */
PropertySelect.prototype.clearOptions = function() {
  this.elt.innerHTML = '';
  this.addOption('Select Property', null, true);
};

/**
 * Add an option to the options list
 * @param {String} name - text content of option
 * @param {Object} ruleFragment - associated rule fragment with either trigger
 * or property defined
 * @param {boolean} selected - if the option is selected
 */
PropertySelect.prototype.addOption = function(name, ruleFragment, selected) {
  const elt = document.createElement('div');
  elt.classList.add('property-select-option');
  if (selected) {
    elt.classList.add('selected');
  }
  elt.dataset.ruleFragment = JSON.stringify(ruleFragment);
  const nameElt = document.createElement('span');
  nameElt.classList.add('property-select-name');
  nameElt.textContent = name;
  nameElt.title = name;
  elt.appendChild(nameElt);

  if (!ruleFragment) {
    this.elt.appendChild(elt);
    return;
  }

  const property = getProperty(ruleFragment);

  const stopPropagation = function(e) {
    e.stopPropagation();
  };

  if (property.type === 'number') {
    let ltOption, gtOption;
    if (ruleFragment.trigger) {
      ltOption = document.createElement('option');
      ltOption.textContent = '<';
      ltOption.classList.add('lt-option');
      gtOption = document.createElement('option');
      gtOption.textContent = '>';
      gtOption.classList.add('gt-option');

      const select = document.createElement('select');
      select.appendChild(ltOption);
      select.appendChild(gtOption);
      select.addEventListener('click', stopPropagation);
      elt.appendChild(select);
    }

    const valueInput = document.createElement('input');
    valueInput.classList.add('value-input');
    valueInput.type = 'number';
    valueInput.addEventListener('click', stopPropagation);
    elt.appendChild(valueInput);

    elt.addEventListener('change', () => {
      if (ruleFragment.trigger) {
        if (ltOption.selected) {
          ruleFragment.trigger.levelType = 'LESS';
        } else if (gtOption.selected) {
          ruleFragment.trigger.levelType = 'GREATER';
        }
        ruleFragment.trigger.value = parseFloat(valueInput.value);
        this.rule.setTrigger(ruleFragment.trigger);
      } else {
        ruleFragment.effect.value = parseFloat(valueInput.value);
        this.rule.setEffect(ruleFragment.effect);
      }
      elt.dataset.ruleFragment = JSON.stringify(ruleFragment);
    });
  } else if (property.name === 'color') {
    const valueInput = document.createElement('input');
    valueInput.classList.add('value-input');
    valueInput.type = 'color';
    valueInput.addEventListener('click', stopPropagation);
    elt.appendChild(valueInput);

    elt.addEventListener('change', () => {
      if (ruleFragment.trigger) {
        ruleFragment.trigger.value = valueInput.value;
        this.rule.setTrigger(ruleFragment.trigger);
      } else {
        ruleFragment.effect.value = valueInput.value;
        this.rule.setEffect(ruleFragment.effect);
      }
    });
  }

  this.updateOption(elt);

  this.elt.appendChild(elt);
};

PropertySelect.prototype.updateOption = function(optionElt) {
  const ruleFragment = JSON.parse(optionElt.dataset.ruleFragment);

  if (!ruleFragment) {
    return;
  }

  const property = getProperty(ruleFragment);
  const fragmentValue = ruleFragment.trigger ?
    ruleFragment.trigger.value :
    ruleFragment.effect.value;

  const valueInput = optionElt.querySelector('.value-input');

  if (property.type === 'number') {
    if (ruleFragment.trigger) {
      if (ruleFragment.trigger.levelType === 'GREATER') {
        optionElt.querySelector('.gt-option').setAttribute('selected', '');
      } else {
        optionElt.querySelector('.lt-option').setAttribute('selected', '');
      }
    }
    valueInput.value = fragmentValue;
  } else if (property.name === 'color') {
    valueInput.value = fragmentValue;
  }
};

/**
 * Updates available options based on the PropertySelector's
 * DevicePropertyBlock's role.
 * @param {'trigger'|'effect'} role
 */
PropertySelect.prototype.updateOptionsForRole = function(role) {
  if (this.role === role) {
    return;
  }
  this.role = role;

  this.clearOptions();

  for (const propName of Object.keys(this.thing.properties)) {
    const property = this.thing.properties[propName];
    if (!property.name) {
      property.name = propName;
    }
    if (role === 'trigger') {
      if (property.type === 'boolean') {
        const triggerOn = {
          type: 'BooleanTrigger',
          property: property,
          onValue: true,
        };
        const triggerOff = Object.assign({}, triggerOn, {
          onValue: false,
        });
        this.addOption('On', {
          trigger: triggerOn,
        });
        this.addOption('Off', {
          trigger: triggerOff,
        });
      } else if (property.name === 'color') {
        // TODO equality isn't a thing we check for
        // this.addOption('Color', {
        //   trigger: {
        //     type: '???',
        //     property: property,
        //     onValue: null && (void 0)
        //   }
        // });
      } else if (property.type === 'number') {
        const name = property.name[0].toUpperCase() + property.name.substr(1);
        const max = property.maximum || property.max || 0;
        const min = property.minimum || property.min || 0;
        const value = (max + min) / 2;

        this.addOption(name, {
          trigger: {
            type: 'LevelTrigger',
            property: property,
            levelType: 'LESS',
            value: value,
          },
        });
      }
    } else if (role === 'effect') {
      if (property.type === 'boolean') {
        const effectOn = {
          type: 'PulseEffect',
          property: property,
          value: true,
        };
        const effectOff = Object.assign({}, effectOn, {
          value: false,
        });
        this.addOption('On', {
          effect: effectOn,
        });
        this.addOption('Off', {
          effect: effectOff,
        });
      } else if (property.name === 'color') {
        this.addOption('Color', {
          effect: {
            type: 'PulseEffect',
            property: property,
            value: '#ffffff',
          },
        });
      } else if (property.type === 'number') {
        const name = property.name[0].toUpperCase() + property.name.substr(1);
        const max = property.maximum || property.max || 0;
        const min = property.minimum || property.min || 0;
        const value = (max + min) / 2;
        this.addOption(name, {
          effect: {
            type: 'PulseEffect',
            property: property,
            value: value,
          },
        });
      }
    }
  }
  if (role === 'trigger') {
    this.addEventOptions();
  } else if (role === 'effect') {
    this.addActionOptions();
  }
};

PropertySelect.prototype.addEventOptions = function() {
  for (const name of Object.keys(this.thing.events)) {
    const eventTrigger = {
      type: 'EventTrigger',
      thing: {
        href: this.thing.href,
      },
      event: name,
    };
    this.addOption(`Event "${name}"`, {
      trigger: eventTrigger,
    });
  }
};

PropertySelect.prototype.addActionOptions = function() {
  for (const name of Object.keys(this.thing.actions)) {
    const actionEffect = {
      type: 'ActionEffect',
      thing: {
        href: this.thing.href,
      },
      action: name,
      parameters: {},
    };
    this.addOption(`Action "${name}"`, {
      effect: actionEffect,
    });
  }
};

/**
 * Select an option when the user clicks it
 * @param {Event} e
 */
PropertySelect.prototype.onClick = function(e) {
  this.elt.classList.toggle('open');
  if (!this.elt.classList.contains('open')) {
    let target = e.target;
    if (!target.classList.contains('property-select-option')) {
      target = target.parentNode;
    }

    // We were open, so that was a click to select
    this.select(target);


    const rulePart = JSON.parse(target.dataset.ruleFragment);
    if (!rulePart) {
      return;
    }

    if (rulePart.trigger) {
      this.rule.setTrigger(rulePart.trigger);
    }
    if (rulePart.effect) {
      this.rule.setEffect(rulePart.effect);
    }
  }
};

function deepEqual(a, b) {
  if (typeof a !== typeof b) {
    return false;
  }
  switch (typeof a) {
    case 'boolean':
    case 'number':
    case 'string':
    case 'undefined':
      return a === b;
    case 'object':
      break;
    default:
      console.warn('unknown type', typeof a);
      return false;
  }

  if (a === null) {
    return b === null;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) {
    return false;
  }
  for (const key of keysB) {
    if (!a.hasOwnProperty(key)) {
      return false;
    }
  }
  for (const key of keysA) {
    if (!b.hasOwnProperty(key)) {
      return false;
    }
    if (!deepEqual(a[key], b[key])) {
      return false;
    }
  }
  return true;
}

function getProperty(ruleFragment) {
  return ruleFragment.trigger ?
    ruleFragment.trigger.property :
    ruleFragment.effect.property;
}

function ruleFragmentEqual(a, b) {
  if ((!!a) !== (!!b)) {
    return false;
  }
  if (a.trigger && !b.trigger) {
    return false;
  }
  if (a.effect && !b.effect) {
    return false;
  }

  const aPart = a.trigger || a.effect;
  const bPart = b.trigger || b.effect;

  const aProperty = getProperty(a);
  const bProperty = getProperty(b);

  if (!deepEqual(aProperty, bProperty)) {
    return false;
  }

  if (aPart.type !== bPart.type) {
    return false;
  }

  if (aProperty.type === 'boolean') {
    if (aPart.type === 'BooleanTrigger') {
      return aPart.onValue === bPart.onValue;
    } else {
      return aPart.value === bPart.value;
    }
  }
  return true;
}

/**
 * Select an option by value
 * @param {Object} ruleFragment
 */
PropertySelect.prototype.selectByRuleFragment = function(ruleFragment) {
  const elements = this.elt.querySelectorAll('.property-select-option');
  for (const optionElt of elements) {
    const optionRuleFragment = JSON.parse(optionElt.dataset.ruleFragment);
    if (ruleFragmentEqual(optionRuleFragment, ruleFragment)) {
      optionElt.dataset.ruleFragment = JSON.stringify(ruleFragment);
      this.updateOption(optionElt);
      this.select(optionElt);
      return;
    }
  }
};

/**
 * Select a specific option
 * @param {Element} option - option's corresponding element
 */
PropertySelect.prototype.select = function(optionElt) {
  const selected = this.elt.querySelector('.selected');
  if (selected) {
    if (!JSON.parse(selected.dataset.ruleFragment)) {
      if (selected === optionElt) {
        return;
      }
      this.elt.removeChild(selected);
    } else {
      selected.classList.remove('selected');
    }
  }
  optionElt.classList.add('selected');
};
