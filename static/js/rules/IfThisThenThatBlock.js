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

  this.rulePartProperty = this.elt.querySelector('.rule-part-property');
  this.rulePartProperty.classList.add('ifttt-property');
  this.updateProperty();
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
    this.updateProperty();
  }
};

/**
 * Initialize based on an existing partial rule
 */
IfThisThenThatBlock.prototype.setRulePart = function(rulePart) {
  RulePartBlock.prototype.setRulePart.call(this, rulePart);
  this.event = rulePart.event || 'gateway';
  this.updateProperty();
};

/**
 * Update the block's property based on its role
 */
IfThisThenThatBlock.prototype.updateProperty = function() {
  if (this.role === 'trigger') {
    this.rulePartProperty.innerHTML =
      'Hook: <a href="/rules-ifttt">/rules-ifttt</a>';
  } else if (this.role === 'effect') {
    this.rulePartProperty.textContent = `Event: ${this.event}`;
  } else {
    this.rulePartProperty.textContent = 'Event or Hook';
  }
};

