const PromiseRouter = require('express-promise-router');
const fetch = require('node-fetch');
const AddonManager = require('../addon-manager');
const Settings = require('../models/settings');

const AddonsController = PromiseRouter();

AddonsController.get('/available', async (request, response) => {
  Settings.getAddonSettings().then(function(result) {
    if (result === undefined) {
      response.status(404).json([]);
    } else {
      let availableAddons = [];
      for (const setting of result) {
        // Remove the leading 'addons.' from the settings key to get the
        // package name.
        const packageName = setting.key.substr(setting.key.indexOf('.') + 1);
        if (packageName.length <= 0) {
          continue;
        }

        if (AddonManager.isAddonAvailable(packageName)) {
          availableAddons.push(setting);
        }
      }

      response.status(200).json(availableAddons);
    }
  }).catch(function(e) {
    console.error('Failed to get add-on settings.');
    console.error(e);
    response.status(400).send(e);
  });
});

AddonsController.put('/toggle/:addonName', async (request, response) => {
  var addonName = request.params.addonName;

  if (!request.body || request.body['enabled'] === undefined) {
    response.status(400).send('Enabled property not defined');
    return;
  }

  var enabled = request.body['enabled'];

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

AddonsController.get('/discovered', async (request, response) => {
  let addons;
  try {
    const res = await fetch('https://raw.githubusercontent.com/mozilla-iot/' +
                            'addon-list/master/list.json');
    addons = await res.json();
  } catch (e) {
    response.status(400).send(e);
    return;
  }

  let discovered = addons.map((a) => {
    a.installed = AddonManager.isAddonAvailable(a.name);
    return a;
  });
  response.status(200).json(discovered);
});

module.exports = AddonsController;
