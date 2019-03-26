/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

const PromiseRouter = require('express-promise-router');

const APIError = require('./APIError');
const Database = require('./Database');
const Engine = require('./Engine');
const Rule = require('./Rule');

const index = PromiseRouter();
const engine = new Engine();

/**
 * Express middleware for extracting rules from the bodies of requests
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
function parseRuleFromBody(req, res, next) {
  if (!req.body.trigger) {
    res.status(400).send(new APIError('No trigger provided').toString());
    return;
  }
  if (!req.body.effect) {
    res.status(400).send(new APIError('No effect provided').toString());
    return;
  }

  let rule = null;
  try {
    rule = Rule.fromDescription(req.body);
  } catch (e) {
    res.status(400).send(new APIError('Invalid rule', e).toString());
    return;
  }
  req.rule = rule;
  next();
}

index.get('/', async (req, res) => {
  const rules = await engine.getRules();
  res.send(rules.map((rule) => {
    return rule.toDescription();
  }));
});


index.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const rule = await engine.getRule(id);
    res.send(rule.toDescription());
  } catch (e) {
    res.status(404).send(
      new APIError('Engine failed to get rule', e).toString());
  }
});

index.post('/', parseRuleFromBody, async (req, res) => {
  const ruleId = await engine.addRule(req.rule);
  res.send({id: ruleId});
});

index.put('/:id', parseRuleFromBody, async (req, res) => {
  try {
    await engine.updateRule(parseInt(req.params.id), req.rule);
    res.send({});
  } catch (e) {
    res.status(404).send(
      new APIError('Engine failed to update rule', e).toString());
  }
});

index.delete('/:id', async (req, res) => {
  try {
    await engine.deleteRule(req.params.id);
    res.send({});
  } catch (e) {
    res.status(404).send(
      new APIError('Engine failed to delete rule', e).toString());
  }
});

index.configure = async () => {
  await Database.open();
  await engine.getRules();
};

module.exports = index;
