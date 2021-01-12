/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import express from 'express';

const APIError = require('./APIError');
const Rule = require('./Rule');

/**
 * Express middleware for extracting rules from the bodies of requests
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
function parseRuleFromBody(req: express.Request, res: express.Response, next: express.NextFunction):
void {
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
  (req as any).rule = rule;
  next();
}

export default function RuleSystemController(engine: any): express.Router {
  const router = express.Router();

  router.get('/', async (_req, res) => {
    const rules = await engine.getRules();
    res.send(rules.map((rule: any) => {
      return rule.toDescription();
    }));
  });


  router.get('/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const rule = await engine.getRule(id);
      res.send(rule.toDescription());
    } catch (e) {
      res.status(404).send(
        new APIError('Engine failed to get rule', e).toString());
    }
  });

  router.post('/', parseRuleFromBody, async (req, res) => {
    const ruleId = await engine.addRule((req as any).rule);
    res.send({id: ruleId});
  });

  router.put('/:id', parseRuleFromBody, async (req, res) => {
    try {
      await engine.updateRule(parseInt(req.params.id), (req as any).rule);
      res.send({});
    } catch (e) {
      res.status(404).send(
        new APIError('Engine failed to update rule', e).toString());
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      await engine.deleteRule(req.params.id);
      res.send({});
    } catch (e) {
      res.status(404).send(
        new APIError('Engine failed to delete rule', e).toString());
    }
  });

  return router;
}
