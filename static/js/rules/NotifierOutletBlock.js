const RulePartBlock = require('./RulePartBlock');
const BlockConfigureDropdown = require('./BlockConfigureDropdown');

class NotifierOutletBlock extends RulePartBlock {
  constructor(ruleArea, onPresentationChange, onRuleUpdate, notifier, outlet) {
    super(ruleArea, onPresentationChange, onRuleUpdate, outlet.name,
          '/optimized-images/thing-icons/notification.svg');

    const configureContainer = this.elt.querySelector('.rule-part-info');
    this.dropdown = new BlockConfigureDropdown(this, configureContainer);
    this.dropdown.addValue({
      id: 'title',
      title: 'Title',
      type: 'string',
    });
    this.dropdown.addValue({
      id: 'message',
      title: 'Message',
      type: 'string',
    });
    this.dropdown.addValue({
      id: 'level',
      title: 'Level',
      type: 'integer',
      minimum: 0,
      maximum: 2,
    });
  }

  remove() {
    super.remove();
    this.dropdown.remove();
  }
}

module.exports = NotifierOutletBlock;
