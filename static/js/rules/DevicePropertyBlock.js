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
  RulePartBlock.call(this, ruleArea, rule, thing.name,
                     '/images/on-off-switch.svg', x, y);
  this.thing = thing;

  const propertyInfo = this.elt.querySelector('.rule-part-info');
  this.propertySelect = new PropertySelect(propertyInfo, rule, thing);
}

DevicePropertyBlock.prototype = Object.create(RulePartBlock.prototype);

/**
 * On mouse up during a drag
 */
DevicePropertyBlock.prototype.onUp = function(clientX, clientY) {
  const originalRole = this.role;
  RulePartBlock.prototype.onUp.call(this, clientX, clientY);
  if (this.role !== originalRole) {
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
