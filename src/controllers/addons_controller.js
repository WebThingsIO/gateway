const PromiseRouter = require('express-promise-router');
const AddonManager = require('../addon-manager');
const Settings = require('../models/settings');

const AddonsController = PromiseRouter();

AddonsController.get('/', async (request, response) => {
  Settings.getAddonSettings().then(function(result) {
    if (typeof result === 'undefined') {
      response.status(404).json([]);
    } else {
      const installedAddons = [];
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

  if (!request.body || !request.body.hasOwnProperty('enabled')) {
    response.status(400).send('Enabled property not defined');
    return;
  }

  const enabled = request.body.enabled;

  const key = `addons.${addonName}`;

  let current;
  try {
    current = await Settings.get(key);
    if (typeof current === 'undefined') {
      throw new Error('Setting is undefined.');
    }
  } catch (e) {
    console.error(`Failed to get current settings for add-on ${addonName}`);
    console.error(e);
    response.status(400).send(e);
    return;
  }

  current.moziot.enabled = enabled;
  try {
    await Settings.set(key, current);
  } catch (e) {
    console.error(`Failed to set settings for add-on ${addonName}`);
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

    response.status(200).json({enabled: enabled});
  } catch (e) {
    console.error(`Failed to toggle add-on ${addonName}`);
    console.error(e);
    response.status(400).send(e);
  }
});

AddonsController.put('/:addonName/config', async (request, response) => {
  const addonName = request.params.addonName;

  if (!request.body || !request.body.hasOwnProperty('config')) {
    response.status(400).send('Config property not defined');
    return;
  }

  const config = request.body.config;

  const key = `addons.${addonName}`;

  let current;
  try {
    current = await Settings.get(key);
    if (typeof current === 'undefined') {
      throw new Error('Setting is undefined.');
    }
  } catch (e) {
    console.error(`Failed to get current settings for add-on ${addonName}`);
    console.error(e);
    response.status(400).send(e);
    return;
  }

  current.moziot.config = config;
  try {
    await Settings.set(key, current);
  } catch (e) {
    console.error(`Failed to set settings for add-on ${addonName}`);
    console.error(e);
    response.status(400).send(e);
    return;
  }

  try {
    await AddonManager.unloadAddon(addonName, true);
    await AddonManager.loadAddon(addonName);

    response.status(200).json({config});
  } catch (e) {
    console.error(`Failed to apply config add-on ${addonName}`);
    console.error(e);
    response.status(400).send(e);
  }
});

AddonsController.post('/', async (request, response) => {
  if (!request.body ||
      !request.body.hasOwnProperty('name') ||
      !request.body.hasOwnProperty('url') ||
      !request.body.hasOwnProperty('checksum')) {
    response.status(400).send('Missing required parameter(s).');
    return;
  }

  const name = request.body.name;
  const url = request.body.url;
  const checksum = request.body.checksum;

  try {
    await AddonManager.installAddonFromUrl(name, url, checksum, true);
    const key = `addons.${name}`;
    const savedSettings = await Settings.get(key);
    response.status(200).json(savedSettings);
  } catch (e) {
    response.status(400).send(e);
  }
});

AddonsController.patch('/:addonName', async (request, response) => {
  const name = request.params.addonName;

  if (!request.body ||
      !request.body.hasOwnProperty('url') ||
      !request.body.hasOwnProperty('checksum')) {
    response.status(400).send('Missing required parameter(s).');
    return;
  }

  const url = request.body.url;
  const checksum = request.body.checksum;

  try {
    await AddonManager.uninstallAddon(name, true, false);
    await AddonManager.installAddonFromUrl(name, url, checksum, true);
    response.sendStatus(200);
  } catch (e) {
    console.error(`Failed to update add-on: ${name}\n${e}`);
    response.status(400).send(e);
  }
});

AddonsController.delete('/:addonName', async (request, response) => {
  const addonName = request.params.addonName;

  try {
    await AddonManager.uninstallAddon(addonName, false, true);
    response.sendStatus(200);
  } catch (e) {
    console.error(`Failed to uninstall add-on: ${addonName}\n${e}`);
    response.status(400).send(e);
  }
});

module.exports = AddonsController;
