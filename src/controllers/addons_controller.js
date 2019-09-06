'use strict';

const PromiseRouter = require('express-promise-router');
const AddonManager = require('../addon-manager');
const Settings = require('../models/settings');
const UserProfile = require('../user-profile');
const fs = require('fs');
const path = require('path');

const AddonsController = PromiseRouter();

AddonsController.get('/', async (request, response) => {
  response.status(200).json(Array.from(AddonManager.installedAddons.values()));
});

AddonsController.get('/:addonName/license', async (request, response) => {
  const addonName = request.params.addonName;
  const addonDir = path.join(UserProfile.addonsDir, addonName);

  fs.readdir(addonDir, (err, files) => {
    if (err) {
      response.status(404).send(err);
      return;
    }

    const licenses = files.filter((f) => {
      return /^LICENSE(\..*)?$/.test(f) &&
        fs.lstatSync(path.join(addonDir, f)).isFile();
    });

    if (licenses.length === 0) {
      response.status(404).send('License not found');
      return;
    }

    fs.readFile(
      path.join(addonDir, licenses[0]),
      {encoding: 'utf8'},
      (err, data) => {
        if (err) {
          response.status(404).send(err);
          return;
        }

        response.status(200).type('text/plain').send(data);
      }
    );
  });
});

AddonsController.put('/:addonName', async (request, response) => {
  const addonName = request.params.addonName;

  if (!request.body || !request.body.hasOwnProperty('enabled')) {
    response.status(400).send('Enabled property not defined');
    return;
  }

  const enabled = request.body.enabled;

  try {
    if (enabled) {
      await AddonManager.enableAddon(addonName);
    } else {
      await AddonManager.disableAddon(addonName);
    }

    response.status(200).json({enabled});
  } catch (e) {
    console.error(`Failed to toggle add-on ${addonName}`);
    console.error(e);
    response.status(400).send(e);
  }
});

AddonsController.get('/:addonName/config', async (request, response) => {
  const addonName = request.params.addonName;
  const key = `addons.config.${addonName}`;

  try {
    const config = await Settings.get(key);
    response.status(200).json(config || {});
  } catch (e) {
    console.error(`Failed to get config for add-on ${addonName}`);
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
  const key = `addons.config.${addonName}`;

  try {
    await Settings.set(key, config);
  } catch (e) {
    console.error(`Failed to set config for add-on ${addonName}`);
    console.error(e);
    response.status(400).send(e);
    return;
  }

  try {
    await AddonManager.unloadAddon(addonName, true);

    if (await AddonManager.addonEnabled(addonName)) {
      await AddonManager.loadAddon(addonName);
    }

    response.status(200).json({config});
  } catch (e) {
    console.error(`Failed to restart add-on ${addonName}`);
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
    const obj = await Settings.get(key);
    response.status(200).json(obj);
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
    await AddonManager.installAddonFromUrl(name, url, checksum, false);
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
