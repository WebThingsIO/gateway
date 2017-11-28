const PromiseRouter = require('express-promise-router');
const AddonManager = require('../addon-manager');
const Settings = require('../models/settings');

const AddonsController = PromiseRouter();

AddonsController.get('/', async (request, response) => {
  Settings.getAddonSettings().then(function(result) {
    if (result === undefined) {
      response.status(404).json([]);
    } else {
      let installedAddons = [];
      for (const setting of result) {
        // Remove the leading 'addons.' from the settings key to get the
        // package name.
        const packageName = setting.key.substr(setting.key.indexOf('.') + 1);
        if (packageName.length <= 0) {
          continue;
        }

        if (AddonManager.isAddonInstalled(packageName)) {
          installedAddons.push(setting);
        }
      }

      response.status(200).json(installedAddons);
    }
  }).catch(function(e) {
    console.error('Failed to get add-on settings.');
    console.error(e);
    response.status(400).send(e);
  });
});

AddonsController.put('/:addonName', async (request, response) => {
  const addonName = request.params.addonName;

  if (!request.body || request.body['enabled'] === undefined) {
    response.status(400).send('Enabled property not defined');
    return;
  }

  const enabled = request.body['enabled'];

  const key = `addons.${addonName}`;

  let current;
  try {
    current = await Settings.get(key);
  } catch (e) {
    console.error('Failed to get current settings for add-on ' + addonName);
    console.error(e);
    response.status(400).send(e);
    return;
  }

  current.moziot.enabled = enabled;
  try {
    await Settings.set(key, current);
  } catch (e) {
    console.error('Failed to set settings for add-on ' + addonName);
    console.error(e);
    response.status(400).send(e);
    return;
  }

  try {
    if (enabled) {
      await AddonManager.loadAddon(addonName);
    } else {
      await AddonManager.unloadAddon(addonName);
    }

    response.status(200).json({'enabled': enabled});
  } catch (e) {
    console.error('Failed to toggle add-on ' + addonName);
    console.error(e);
    response.status(400).send(e);
  }
});

module.exports = AddonsController;
