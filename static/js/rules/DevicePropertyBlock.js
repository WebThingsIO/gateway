const PropertySelect = require('./PropertySelect');
const RulePartBlock = require('./RulePartBlock');
const RuleUtils = require('./RuleUtils');

/**
 * An element representing a device (`thing`) and a property. Can be
 * drag-and-dropped within `ruleArea` to change its role within `rule`
 * @constructor
 * @param {Element} ruleArea
 * @param {Function} onPresentationChange
 * @param {Function} onRuleChange
 * @param {Rule} rule
 * @param {ThingDescription} thing
 */
function DevicePropertyBlock(ruleArea, onPresentationChange, onRuleChange,
                             thing) {
  RulePartBlock.call(this, ruleArea, onPresentationChange, onRuleChange,
                     thing.name, RuleUtils.icon(thing));
  this.thing = thing;

  const propertyInfo = this.elt.querySelector('.rule-part-info');
  this.propertySelect = new PropertySelect(this, propertyInfo, thing);
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
  this.propertySelect.selectByRuleFragment(rulePart);
};

module.exports = DevicePropertyBlock;
