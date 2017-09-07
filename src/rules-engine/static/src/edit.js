/* global API, DevicePropertyBlock, Gateway, Rule, RuleUtils */

let gateway = new Gateway();

// Fetch the rule description from the Engine or default to null
let rulePromise = Promise.resolve(null);
let rule = null;

const ruleIdMatches = window.location.search.match(/ruleId=(\d+)/)
if (ruleIdMatches) {
  const ruleId = ruleIdMatches[1];
  rulePromise = fetch('/rules-engine/rules/' + ruleId, {
    headers: API.headers()
  }).then(function(res) {
    return res.json();
  });
}

let ruleArea = document.getElementById('rule-area');
let ruleName = document.querySelector('.rule-name');
let ruleNameCustomize = document.querySelector('.rule-name-customize');
ruleNameCustomize.addEventListener('click', function() {
  // Select all of ruleName, from https://stackoverflow.com/questions/6139107/
  let range = document.createRange();
  range.selectNodeContents(ruleName);
  let selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
});
ruleName.contentEditable = true;
ruleName.addEventListener('blur', function() {
  rule.name = ruleName.textContent;
  rule.update();
});
let ruleDescription = document.querySelector('.rule-info > p');

let devicesList = document.getElementById('devices-list');
let onboardingHint = document.getElementById('onboarding-hint');
let connection = document.getElementById('connection');

let deleteOverlay = document.getElementById('rule-delete-overlay');
let deleteButton = document.getElementById('delete-button');
let deleteCancel = document.querySelector('.rule-delete-cancel-button');
let deleteConfirm = document.querySelector('.rule-delete-confirm-button');

/**
 * Instantiate a draggable DevicePropertyBlock from a template DeviceBlock in
 * the palette
 * @param {Event} event
 */
function onDeviceBlockDown(event) {
  if (!rule) {
    return;
  }
  let deviceRect = event.target.getBoundingClientRect();

  let x = deviceRect.left;
  let y = deviceRect.top;
  let newBlock = new DevicePropertyBlock(ruleArea, rule, this, x, y);

  newBlock.draggable.onDown(event);
}

/**
 * Create a device-block from a thing
 * @param {ThingDescription} thing
 * @return {Element}
 */
function makeDeviceBlock(thing) {
  let elt = document.createElement('div');
  elt.classList.add('device');

  elt.innerHTML = `<div class="device-block">
    <img class="device-icon" src="/rules-engine/images/onoff.svg" width="48px"
         height="48px"/>
  </div>
  <p>${thing.name}</p>`;

  return elt;
}

/**
 * Instantiate a DevicePropertyBlock
 * @param {'trigger'|'action'} role
 * @param {number} x
 * @param {number} y
 */
function makeDevicePropertyBlock(role, x, y) {
  let thing = gateway.things.filter(
    RuleUtils.byProperty(rule[role].property)
  )[0];
  let block = new DevicePropertyBlock(ruleArea, rule, thing, x, y);
  let rulePart = {};
  rulePart[role] = rule[role];
  block.setRulePart(rulePart);
}

function showConnection() {
  connection.classList.remove('hidden');

  let triggerBlock = document.querySelector('.device-block.trigger').parentNode;
  let actionBlock = document.querySelector('.device-block.action').parentNode;
  function transformToCoords(elt) {
    let re = /translate\((\d+)px, +(\d+)px\)/;
    let matches = elt.style.transform.match(re);
    let x = parseFloat(matches[1]);
    let y = parseFloat(matches[2]);
    return {
      x: x,
      y: y
    };
  }
  let triggerCoords = transformToCoords(triggerBlock);
  let actionCoords = transformToCoords(actionBlock);

  let startX = triggerCoords.x + 310;
  let startY = triggerCoords.y + 50;
  let endX = actionCoords.x - 10;
  let endY = actionCoords.y + 50;

  let midX = (startX + endX) / 2;

  let pathDesc  = [
    'M', startX, startY,
    'C', midX, startY, midX, endY, endX, endY
  ].join(' ');

  let path = connection.querySelector('path');
  path.setAttribute('d', pathDesc);
  let circleTrigger = connection.querySelector('.trigger');
  circleTrigger.setAttribute('cx', startX);
  circleTrigger.setAttribute('cy', startY);
  let circleAction = connection.querySelector('.action');
  circleAction.setAttribute('cx', endX);
  circleAction.setAttribute('cy', endY);
}

function hideConnection() {
  connection.classList.add('hidden');
}

gateway.readThings().then(things => {
  for (let thing of things) {
    let elt = makeDeviceBlock(thing);
    elt.addEventListener('mousedown', onDeviceBlockDown.bind(thing));
    devicesList.appendChild(elt);
  }
}).then(function() {
  return rulePromise;
}).then(function(ruleDesc) {
  function onRuleUpdate() {
    ruleName.textContent = rule.name || 'Rule Name';
    ruleDescription.textContent = rule.toHumanDescription();
    if (rule.trigger && rule.action) {
      showConnection();
    } else {
      hideConnection();
    }

    if (!document.querySelector('.device-property-block')) {
      onboardingHint.classList.remove('hidden');
    } else {
      onboardingHint.classList.add('hidden');
    }
  }
  rule = new Rule(gateway, ruleDesc, onRuleUpdate);
  if (ruleDesc) {
    let areaRect = ruleArea.getBoundingClientRect();
    // Create DevicePropertyBlocks from trigger and action if applicable
    if (ruleDesc.trigger) {
      makeDevicePropertyBlock('trigger', 20,
        areaRect.height / 2);
    }
    if (ruleDesc.action) {
      makeDevicePropertyBlock('action', areaRect.width - 320,
        areaRect.height / 2);
    }
  }
  onRuleUpdate();
});

deleteButton.addEventListener('click', function() {
  deleteOverlay.classList.add('active');
});

deleteCancel.addEventListener('click', function() {
  deleteOverlay.classList.remove('active');
});

deleteConfirm.addEventListener('click', function() {
  rule.delete().then(function() {
    window.location = 'index.html';
  });
});
