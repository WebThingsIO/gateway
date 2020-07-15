const RulePartBlock = require('./RulePartBlock');
const BlockConfigureDropdown = require('./BlockConfigureDropdown');
const fluent = require('../fluent');

class NotifierOutletBlock extends RulePartBlock {
  constructor(ruleArea, onPresentationChange, onRuleUpdate, notifier, outlet,
              values) {
    super(ruleArea, onPresentationChange, onRuleUpdate,
          `${outlet.name} ${fluent.getMessage('rule-notification')}`,
          '/images/thing-icons/notification.svg');

    this.notifier = notifier;
    this.outlet = outlet;
    this.values = {
      title: '',
      message: '',
      level: 0,
    };

    if (values) {
      this.values = values;
    }

    const blockContainer = this.elt.querySelector('.rule-part-block');
    const infoContainer = this.elt.querySelector('.rule-part-info');
    this.updateValues = this.updateValues.bind(this);
    this.dropdown = new BlockConfigureDropdown(this, infoContainer);
    this.dropdown.addValue({
      id: 'title',
      title: fluent.getMessage('notification-title'),
      type: 'string',
      value: this.values.title,
    });
    this.dropdown.addValue({
      id: 'message',
      title: fluent.getMessage('notification-message'),
      type: 'string',
      value: this.values.message,
    });
    this.levels = [
      fluent.getMessage('notification-low'),
      fluent.getMessage('notification-normal'),
      fluent.getMessage('notification-high'),
    ];
    this.dropdown.addValue({
      id: 'level',
      title: fluent.getMessage('notification-level'),
      type: 'string',
      enum: this.levels,
      value: this.levels[this.values.level],
    });
    blockContainer.addEventListener('click', this.onBlockClick.bind(this));
    infoContainer.addEventListener('click', this.onBlockClick.bind(this));
    this.updateRulePart();
  }

  onBlockClick() {
    if (!this.dropdown.elt.classList.contains('open')) {
      this.dropdown.onCommit();
    }
  }

  updateValues(values) {
    this.values = values;
    this.values.level = this.levels.indexOf(this.values.level);
    this.updateRulePart();
    this.onRuleChange();
  }

  updateRulePart() {
    this.setRulePart({effect: {
      type: 'NotifierOutletEffect',
      notifier: this.notifier.id,
      outlet: this.outlet.id,
      title: this.values.title,
      message: this.values.message,
      level: this.values.level,
    }});
  }

  setRulePart(rulePart) {
    this.rulePart = rulePart;
    if (rulePart.trigger) {
      throw new Error('NotifierOutletBlock can only be an effect');
    }
    if (!rulePart.effect) {
      return;
    }
    this.role = 'effect';
    this.rulePartBlock.classList.add('effect');
    const effect = this.rulePart.effect;
    this.dropdown.setValue('title', effect.title);
    this.dropdown.setValue('message', effect.message);
    this.dropdown.setValue('level', this.levels[effect.level]);
  }

  remove() {
    super.remove();
    this.dropdown.remove();
  }
}

module.exports = NotifierOutletBlock;
