/* global Draggable, PropertySelect */

/**
 * An element representing a device (`thing`) and a property. Can be
 * drag-and-dropped within `ruleArea` to change its role within `rule`
 * @constructor
 * @param {Element} ruleArea
 * @param {Rule} rule
 * @param {ThingDescription} thing
 * @param {number} x
 * @param {number} y
 */
function DevicePropertyBlock(ruleArea, rule, thing, x, y) {
  this.rule = rule;
  this.thing = thing;
  this.role = '';

  this.elt = document.createElement('div');
  this.elt.classList.add('device-property-block');
  this.snapToGrid(x, y);
  this.elt.innerHTML = `<div class="device-block">
      <img class="device-icon" src="/images/onoff.svg" width="48px"
           height="48px"/>
    </div>
    <div class="device-property-info">
      <h3 class="device-name">
        ${thing.name}
      </h3>
    </div>`;
  this.deviceBlock = this.elt.querySelector('.device-block');
  let devicePropertyInfo = this.elt.querySelector('.device-property-info');

  this.propertySelect = new PropertySelect(devicePropertyInfo, rule, thing);

  this.ruleArea = ruleArea;
  this.ruleTriggerArea = this.ruleArea.querySelector('.drag-hint-trigger');
  this.ruleEffectArea = this.ruleArea.querySelector('.drag-hint-effect');

  this.onDown = this.onDown.bind(this);
  this.onMove = this.onMove.bind(this);
  this.onUp = this.onUp.bind(this);

  this.ruleArea.appendChild(this.elt);
  this.draggable = new Draggable(this.elt, this.onDown,
    this.onMove, this.onUp);

  this.onWindowResize = this.onWindowResize.bind(this);
  window.addEventListener('resize', this.onWindowResize);

  let dragHint = document.getElementById('drag-hint');
  this.flexDir = window.getComputedStyle(dragHint).flexDirection;
}

/**
 * On mouse down during a drag
 */
DevicePropertyBlock.prototype.onDown = function() {
  let openSelector = this.elt.querySelector('.open');
  if (openSelector) {
    openSelector.classList.remove('open');
  }

  this.resetState = {
    transform: this.elt.style.transform,
  };

  let deleteArea = document.getElementById('delete-area');
  deleteArea.classList.add('delete-active');
  this.elt.classList.add('dragging');
  this.ruleArea.classList.add('drag-location-hint');

  if (this.role === 'trigger') {
    this.ruleTriggerArea.classList.remove('inactive');
  } else if (this.role === 'effect') {
    this.ruleEffectArea.classList.remove('inactive');
  }

  this.rule.onUpdate();
};

/**
 * On mouse move during a drag
 */
DevicePropertyBlock.prototype.onMove = function(clientX, clientY, relX, relY) {
  let ruleAreaRect = this.ruleArea.getBoundingClientRect();
  let devicesList = document.getElementById('devices-list');
  let devicesListHeight = devicesList.getBoundingClientRect().height;
  if (clientY > window.innerHeight - devicesListHeight) {
    this.deviceBlock.classList.remove('trigger');
    this.deviceBlock.classList.remove('effect');
  } else {
    if (this.flexDir === 'row') {
      if (relX < ruleAreaRect.width / 2) {
        this.deviceBlock.classList.add('trigger');
        this.deviceBlock.classList.remove('effect');
      } else {
        this.deviceBlock.classList.remove('trigger');
        this.deviceBlock.classList.add('effect');
      }
    } else if (this.flexDir === 'column') {
      if (relY < ruleAreaRect.height / 2) {
        this.deviceBlock.classList.add('trigger');
        this.deviceBlock.classList.remove('effect');
      } else {
        this.deviceBlock.classList.remove('trigger');
        this.deviceBlock.classList.add('effect');
      }
    }
  }

  this.snapToGrid(relX, relY);
};

/**
 * Snap coordinates to a grid
 * @param {number} relX - x coordinate relative to ruleArea
 * @param {number} relY - y coordinate relative to ruleArea
 */
DevicePropertyBlock.prototype.snapToGrid = function(relX, relY) {
  let grid = 40;
  let x = Math.floor((relX - grid / 2) / grid) * grid
        + grid / 2;
  let y = Math.floor((relY - grid / 2) / grid) * grid
        + grid / 2;
  if (y < grid / 2) {
    y = grid / 2;
  }

  this.elt.style.transform = 'translate(' + x + 'px,' + y + 'px)';
};

/**
 * On mouse up during a drag
 */
DevicePropertyBlock.prototype.onUp = function(clientX, clientY) {
  let devicesList = document.getElementById('devices-list');
  let devicesListHeight = devicesList.getBoundingClientRect().height;
  this.elt.classList.remove('dragging');
  let deleteArea = document.getElementById('delete-area');
  deleteArea.classList.remove('delete-active');
  this.ruleArea.classList.remove('drag-location-hint');

  if (this.deviceBlock.classList.contains('trigger')) {
    if (this.ruleTriggerArea.classList.contains('inactive')) {
      this.reset();
    } else {
      this.role = 'trigger';
      this.ruleTriggerArea.classList.add('inactive');
      this.propertySelect.updateOptionsForRole(this.role);
    }
  } else if (this.deviceBlock.classList.contains('effect')) {
    if (this.ruleEffectArea.classList.contains('inactive')) {
      this.reset();
    } else {
      this.role = 'effect';
      this.ruleEffectArea.classList.add('inactive');
      this.propertySelect.updateOptionsForRole(this.role);
    }
  }

  if (clientY > window.innerHeight - devicesListHeight) {
    this.remove();
  }

  this.rule.onUpdate();
};

/**
 * Reset the DevicePropertyBlock to before the current drag started
 */
DevicePropertyBlock.prototype.reset = function() {
  this.elt.style.transform = this.resetState.transform;
  if (this.role === 'trigger') {
    this.deviceBlock.classList.add('trigger')
    this.deviceBlock.classList.remove('effect')
  } else if (this.role === 'effect') {
    this.deviceBlock.classList.remove('trigger')
    this.deviceBlock.classList.add('effect')
  } else {
    this.remove();
  }
};

/**
 * Initialize based on an existing partial rule
 */
DevicePropertyBlock.prototype.setRulePart = function(rulePart) {
  if (rulePart.trigger) {
    this.role = 'trigger';
    this.deviceBlock.classList.add('trigger');
    this.ruleTriggerArea.classList.add('inactive');
    this.propertySelect.updateOptionsForRole(this.role);
    this.propertySelect.selectByValue(rulePart);
  } else if(rulePart.effect) {
    this.role = 'effect';
    this.deviceBlock.classList.add('effect');
    this.ruleEffectArea.classList.add('inactive');
    this.propertySelect.updateOptionsForRole(this.role);
    this.propertySelect.selectByValue(rulePart);
  }
};

/**
 * Switch from row to column grid alignments if necessary when the window is
 * resized
 */
DevicePropertyBlock.prototype.onWindowResize = function() {
  if (!this.role) {
    return;
  }
  let dragHint = document.getElementById('drag-hint');
  let flexDir = window.getComputedStyle(dragHint).flexDirection;
  // Throw away our current coords and snap to the new layout direction
  if (this.flexDir === flexDir) {
    return;
  }

  let areaRect = this.ruleArea.getBoundingClientRect();
  let rect = this.elt.getBoundingClientRect();

  if (flexDir === 'row') {
    let centerY = areaRect.height / 2 - rect.height / 2;

    let roleX = areaRect.width / 4 - rect.width / 2;
    if (this.role === 'effect') {
      roleX = areaRect.width * 3 / 4 - rect.width / 2;
    }

    this.snapToGrid(roleX, centerY);
  } else if (flexDir === 'column') {
    let centerX = areaRect.width / 2 - rect.width / 2;

    let roleY = areaRect.height / 4 - rect.height / 2;
    if (this.role === 'effect') {
      roleY = areaRect.height * 3 / 4 - rect.height / 2;
    }

    this.snapToGrid(centerX, roleY);
  }
  this.rule.onUpdate();
  this.flexDir = flexDir;
};

/**
 * Remove the DevicePropertyBlock from the DOM and from its associated rule
 */
DevicePropertyBlock.prototype.remove = function() {
  this.ruleArea.removeChild(this.elt);
  if (this.role === 'trigger') {
    this.rule.setTrigger(null);
  } else if (this.role === 'effect') {
    this.rule.setEffect(null);
  }
  window.removeEventListener('resize', this.onWindowResize);
};
