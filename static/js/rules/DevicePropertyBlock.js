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
class DevicePropertyBlock extends RulePartBlock {
  constructor(ruleArea, onPresentationChange, onRuleChange, thing) {
    super(ruleArea, onPresentationChange, onRuleChange, thing.name,
          RuleUtils.icon(thing));
    this.thing = thing;

    const propertyInfo = this.elt.querySelector('.rule-part-info');
    this.propertySelect = new PropertySelect(this, propertyInfo, thing);
  }

  /**
   * On mouse up during a drag
   */
  onUp(clientX, clientY) {
    const originalRole = this.role;
    super.onUp(clientX, clientY);
    if (this.role !== originalRole) {
      this.propertySelect.updateOptionsForRole(this.role);
      this.rulePart = null;
      this.onRuleChange();
    }
  }

  /**
   * Initialize based on an existing partial rule
   */
  setRulePart(rulePart) {
    super.setRulePart(rulePart);

    this.propertySelect.updateOptionsForRole(this.role);
    this.propertySelect.selectByRuleFragment(rulePart);
  }
}

module.exports = DevicePropertyBlock;
