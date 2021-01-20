import express from 'express';
import {Constants} from 'gateway-addon';
import AddonManager from '../addon-manager';

const NotifiersController = express.Router();

/**
 * Helper function to cut down on unnecessary API round trips
 * @param {Notifier} notifier
 * @return {Object}
 */
function notifierAsDictWithOutlets(notifier: any): any {
  const notifierDict = notifier.asDict();
  const outlets = notifier.getOutlets();
  notifierDict.outlets = Array.from(Object.values(outlets)).map((outlet: any) => {
    return outlet.asDict();
  });
  return notifierDict;
}

NotifiersController.get('/', async (_request, response) => {
  const notifiers = AddonManager.getNotifiers();
  const notifierList = Array.from(notifiers.values())
    .map(notifierAsDictWithOutlets);
  response.status(200).json(notifierList);
});

NotifiersController.get('/:notifierId', async (request, response) => {
  const notifierId = request.params.notifierId;
  const notifier = AddonManager.getNotifier(notifierId);
  if (notifier) {
    response.status(200).send(notifierAsDictWithOutlets(notifier));
  } else {
    response.status(404).send(`Notifier "${notifierId}" not found.`);
  }
});

NotifiersController.get('/:notifierId/outlets', async (request, response) => {
  const notifierId = request.params.notifierId;
  const notifier = AddonManager.getNotifier(notifierId);
  if (!notifier) {
    response.status(404).send(`Notifier "${notifierId}" not found.`);
    return;
  }
  const outlets = notifier.getOutlets();
  const outletList = Array.from(Object.values(outlets)).map((outlet: any) => {
    return outlet.asDict();
  });
  response.status(200).json(outletList);
});

/**
 * Create a new notification with the title, message, and level contained in
 * the request body
 */
NotifiersController.post(
  `/:notifierId/outlets/:outletId/notification`,
  async (request, response) => {
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
    const {title, message, level} = request.body;
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
  }
);

export default NotifiersController;
