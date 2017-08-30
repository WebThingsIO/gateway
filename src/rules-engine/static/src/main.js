/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

/* global Gateway, RuleCard */

let createRuleButton = document.getElementById('create-rule');
let rulesList = document.getElementById('rules');
let gateway = new Gateway();

/**
 * @return {Promise<Array<RuleDescription>>}
 */
function readRules() {
  return fetch('rules').then(res => {
    return res.json();
   }).then(fetchedRules => {
     for (let ruleDesc of fetchedRules) {
       addRuleCard(ruleDesc);
     }
  });
}

let nextId = 0;
/**
 * Add a rule, filling it with the data from a RuleDescription
 * @param {RuleDescription} desc
 */
function addRuleCard(desc) {
  let ruleElt = document.createElement('div');
  ruleElt.classList.add('rule');
  new RuleCard(gateway, ruleElt, nextId, desc);
  nextId += 1;
  rulesList.appendChild(ruleElt);
}

gateway.readThings().then(() => {
  return readRules();
}).then(() => {
  createRuleButton.addEventListener('click', () => {
    window.location = 'edit.html';
  });
});
