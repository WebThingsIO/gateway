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
      <img class="device-icon" src="images/onoff.svg" width="48px"
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
  this.ruleActionArea = this.ruleArea.querySelector('.drag-hint-action');

  this.onDown = this.onDown.bind(this);
  this.onMove = this.onMove.bind(this);
  this.onUp = this.onUp.bind(this);

  this.ruleArea.appendChild(this.elt);
  this.draggable = new Draggable(this.elt, this.onDown,
    this.onMove, this.onUp);
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
  } else if (this.role === 'action') {
    this.ruleActionArea.classList.remove('inactive');
  }
};

/**
 * On mouse move during a drag
 */
DevicePropertyBlock.prototype.onMove = function(clientX, clientY, relX, relY) {
  let devicesList = document.getElementById('devices-list');
  let devicesListHeight = devicesList.getBoundingClientRect().height;
  if (clientY > window.innerHeight - devicesListHeight) {
    this.deviceBlock.classList.remove('trigger');
    this.deviceBlock.classList.remove('action');
  } else {
    if (relX < window.innerWidth / 2) {
      this.deviceBlock.classList.add('trigger');
      this.deviceBlock.classList.remove('action');
    } else {
      this.deviceBlock.classList.remove('trigger');
      this.deviceBlock.classList.add('action');
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
  } else if (this.deviceBlock.classList.contains('action')) {
    if (this.ruleActionArea.classList.contains('inactive')) {
      this.reset();
    } else {
      this.role = 'action';
      this.ruleActionArea.classList.add('inactive');
      this.propertySelect.updateOptionsForRole(this.role);
    }
  }

  if (clientY > window.innerHeight - devicesListHeight) {
    this.remove();
  }
};

/**
 * Reset the DevicePropertyBlock to before the current drag started
 */
DevicePropertyBlock.prototype.reset = function() {
  this.elt.style.transform = this.resetState.transform;
  if (this.role === 'trigger') {
    this.deviceBlock.classList.add('trigger')
    this.deviceBlock.classList.remove('action')
  } else if (this.role === 'action') {
    this.deviceBlock.classList.remove('trigger')
    this.deviceBlock.classList.add('action')
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
  } else if(rulePart.action) {
    this.role = 'action';
    this.deviceBlock.classList.add('action');
    this.ruleActionArea.classList.add('inactive');
    this.propertySelect.updateOptionsForRole(this.role);
    this.propertySelect.selectByValue(rulePart);
  }
}

/**
 * Remove the DevicePropertyBlock from the DOM and from its associated rule
 */
DevicePropertyBlock.prototype.remove = function() {
  this.ruleArea.removeChild(this.elt);
  if (this.role === 'trigger') {
    this.rule.setTrigger(null);
  } else if (this.role === 'action') {
    this.rule.setAction(null);
  }
};
