const PromiseRouter = require('express-promise-router');
const fetch = require('node-fetch');
const fs = require('fs');
const os = require('os');
const path = require('path');
const promisePipe = require('promisepipe');
const rimraf = require('rimraf');
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

AddonsController.post('/', async (request, response) => {
  if (!request.body ||
      !request.body.hasOwnProperty('name') ||
      !request.body.hasOwnProperty('url')) {
    response.status(400).send('Missing required parameter(s).');
    return;
  }

  const name = request.body.name;
  const url = request.body.url;

  const tempPath = fs.mkdtempSync(`${os.tmpdir()}${path.sep}`);
  const destPath = path.join(tempPath, `${name}.tar.gz`);

  try {
    const res = await fetch(url);
    const dest = fs.createWriteStream(destPath);
    await promisePipe(res.body, dest);
  } catch (e) {
    rimraf(tempPath, {glob: false}, (e) => {
      if (e) {
        console.error(`Error removing temp directory: ${tempPath}\n${e}`);
      }
    });
    console.error(`Failed to download add-on: ${name}\n${e}`);
    response.status(400).send(e);
    return;
  }

  try {
    await AddonManager.installAddon(name, destPath);
    response.sendStatus(200);
  } catch (e) {
    console.error(`Failed to install add-on: ${name}\n${e}`);
    response.status(400).send(e);
  }

  rimraf(tempPath, {glob: false}, (e) => {
    if (e) {
      console.error(`Error removing temp directory: ${tempPath}\n${e}`);
    }
  });
});

AddonsController.delete('/:addonName', async (request, response) => {
  const addonName = request.params.addonName;

  try {
    await AddonManager.uninstallAddon(addonName);
    response.sendStatus(200);
  } catch (e) {
    console.error(`Failed to uninstall add-on: ${addonName}\n${e}`);
    response.status(400).send(e);
  }
});

module.exports = AddonsController;
