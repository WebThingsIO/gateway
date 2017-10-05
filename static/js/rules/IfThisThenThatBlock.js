/* global RulePartBlock */


/**
 * An element representing an interaction with an IFTTT maker hook
 *
 * @constructor
 * @param {Element} ruleArea
 * @param {Rule} rule
 * @param {number} x
 * @param {number} y
 */
function IfThisThenThatBlock(ruleArea, rule, x, y) {
  RulePartBlock.call(this, ruleArea, rule, 'IFTTT Hook', '/images/if.svg',
                     x, y);

  this.event = 'gateway';

  let rulePartProperty = this.elt.querySelector('.rule-part-property');
  rulePartProperty.classList.add('ifttt-property');
  rulePartProperty.textContent = `Event: ${this.event}`;
}

IfThisThenThatBlock.prototype =
  Object.create(RulePartBlock.prototype);
IfThisThenThatBlock.prototype.constructor = IfThisThenThatBlock;

/**
 * On mouse up during a drag
 */
IfThisThenThatBlock.prototype.onUp = function(clientX, clientY) {
  let startRole = this.role;
  RulePartBlock.prototype.onUp.call(this, clientX, clientY);
  if (this.role !== startRole) {
    if (this.role === 'trigger') {
      this.rule.setTrigger({
        type: 'IfThisThenThatTrigger'
      })
    } else {
      this.rule.setEffect({
        type: 'IfThisThenThatEffect',
        event: this.event
      });
    }
  }
};

/**
 * Initialize based on an existing partial rule
 */
IfThisThenThatBlock.prototype.setRulePart = function(rulePart) {
  RulePartBlock.prototype.setRulePart.call(this, rulePart);
  this.event = rulePart.event || 'gateway';
  let rulePartProperty = this.elt.querySelector('.rule-part-property');
  rulePartProperty.textContent = `Event: ${this.event}`;
};

