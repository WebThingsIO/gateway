import express from 'express';
import { Constants, Notifier, Outlet } from 'gateway-addon';
import { NotifierDescription } from 'gateway-addon/lib/notifier';
import { OutletDescription } from 'gateway-addon/lib/schema';
import AddonManager from '../addon-manager';

function build(): express.Router {
  const controller = express.Router();

  /**
   * Helper function to cut down on unnecessary API round trips
   * @param {Notifier} notifier
   * @return {Object}
   */
  function notifierAsDictWithOutlets(
    notifier: Notifier
  ): NotifierDescription & { outlets: OutletDescription[] } {
    const notifierDict: NotifierDescription & {
      outlets: OutletDescription[];
    } = Object.assign(notifier.asDict(), { outlets: [] });
    const outlets = notifier.getOutlets();
    notifierDict.outlets = Array.from(Object.values(outlets)).map((outlet: Outlet) => {
      return outlet.asDict();
    });
    return notifierDict;
  }

  controller.get('/', async (_request, response) => {
    const notifiers = AddonManager.getNotifiers();
    const notifierList = Array.from(notifiers.values()).map(notifierAsDictWithOutlets);
    response.status(200).json(notifierList);
  });

  controller.get('/:notifierId', async (request, response) => {
    const notifierId = request.params.notifierId;
    const notifier = AddonManager.getNotifier(notifierId);
    if (notifier) {
      response.status(200).send(notifierAsDictWithOutlets(notifier));
    } else {
      response.status(404).send(`Notifier "${notifierId}" not found.`);
    }
  });

  controller.get('/:notifierId/outlets', async (request, response) => {
    const notifierId = request.params.notifierId;
    const notifier = AddonManager.getNotifier(notifierId);
    if (!notifier) {
      response.status(404).send(`Notifier "${notifierId}" not found.`);
      return;
    }
    const outlets = notifier.getOutlets();
    const outletList = Array.from(Object.values(outlets)).map((outlet: Outlet) => {
      return outlet.asDict();
    });
    response.status(200).json(outletList);
  });

  /**
   * Create a new notification with the title, message, and level contained in
   * the request body
   */
  controller.post(`/:notifierId/outlets/:outletId/notification`, async (request, response) => {
    const notifierId = request.params.notifierId;
    const outletId = request.params.outletId;
    const notifier = AddonManager.getNotifier(notifierId);
    if (!notifier) {
      response.status(404).send(`Notifier "${notifierId}" not found.`);
      return;
    }
    const outlet = notifier.getOutlet(outletId);
    if (!outlet) {
      response.status(404).send(`Outlet "${outletId}" of notifier "${notifierId}" not found.`);
      return;
    }
    const { title, message, level } = request.body;
    if (typeof title !== 'string' || typeof message !== 'string') {
      response.status(400).send(`Title and message must be strings`);
      return;
    }
    const levels = Object.values(Constants.NotificationLevel);
    if (!levels.includes(level)) {
      response.status(400).send(`Level must be one of ${JSON.stringify(levels)}`);
      return;
    }
    try {
      await outlet.notify(title, message, level);
      response.status(201);
    } catch (e) {
      response.status(500).send(e);
    }
  });

  return controller;
}

export default build;
