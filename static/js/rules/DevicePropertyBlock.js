/* global PropertySelect, RulePartBlock */

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
  RulePartBlock.call(this, ruleArea, rule, thing.name, '/images/onoff.svg',
                     x, y);
  this.thing = thing;

  let rulePartInfo = this.elt.querySelector('.rule-part-property');

  this.propertySelect = new PropertySelect(rulePartInfo, rule, thing);
}

DevicePropertyBlock.prototype =
  Object.create(RulePartBlock.prototype);
DevicePropertyBlock.prototype.constructor = DevicePropertyBlock;

/**
 * On mouse up during a drag
 */
DevicePropertyBlock.prototype.onUp = function(clientX, clientY) {
  let startRole = this.role;
  RulePartBlock.prototype.onUp.call(this, clientX, clientY);
  if (this.role !== startRole) {
    this.propertySelect.updateOptionsForRole(this.role);
  }
};

/**
 * Initialize based on an existing partial rule
 */
DevicePropertyBlock.prototype.setRulePart = function(rulePart) {
  RulePartBlock.prototype.setRulePart.call(this, rulePart);
  this.propertySelect.updateOptionsForRole(this.role);
  this.propertySelect.selectByValue(rulePart);
};

