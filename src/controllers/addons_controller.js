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

AddonsController.get('/:addonId/license', async (request, response) => {
  const addonId = request.params.addonId;
  const addonDir = path.join(UserProfile.addonsDir, addonId);

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

AddonsController.put('/:addonId', async (request, response) => {
  const addonId = request.params.addonId;

  if (!request.body || !request.body.hasOwnProperty('enabled')) {
    response.status(400).send('Enabled property not defined');
    return;
  }

  const enabled = request.body.enabled;

  try {
    if (enabled) {
      await AddonManager.enableAddon(addonId);
    } else {
      await AddonManager.disableAddon(addonId, true);
    }

    response.status(200).json({enabled});
  } catch (e) {
    console.error(`Failed to toggle add-on ${addonId}`);
    console.error(e);
    response.status(400).send(e);
  }
});

AddonsController.get('/:addonId/config', async (request, response) => {
  const addonId = request.params.addonId;
  const key = `addons.config.${addonId}`;

  try {
    const config = await Settings.get(key);
    response.status(200).json(config || {});
  } catch (e) {
    console.error(`Failed to get config for add-on ${addonId}`);
    console.error(e);
    response.status(400).send(e);
  }
});

AddonsController.put('/:addonId/config', async (request, response) => {
  const addonId = request.params.addonId;

  if (!request.body || !request.body.hasOwnProperty('config')) {
    response.status(400).send('Config property not defined');
    return;
  }

  const config = request.body.config;
  const key = `addons.config.${addonId}`;

  try {
    await Settings.set(key, config);
  } catch (e) {
    console.error(`Failed to set config for add-on ${addonId}`);
    console.error(e);
    response.status(400).send(e);
    return;
  }

  try {
    await AddonManager.unloadAddon(addonId, true);

    if (await AddonManager.addonEnabled(addonId)) {
      await AddonManager.loadAddon(addonId);
    }

    response.status(200).json({config});
  } catch (e) {
    console.error(`Failed to restart add-on ${addonId}`);
    console.error(e);
    response.status(400).send(e);
  }
});

AddonsController.post('/', async (request, response) => {
  if (!request.body ||
      !request.body.hasOwnProperty('id') ||
      !request.body.hasOwnProperty('url') ||
      !request.body.hasOwnProperty('checksum')) {
    response.status(400).send('Missing required parameter(s).');
    return;
  }

  const id = request.body.id;
  const url = request.body.url;
  const checksum = request.body.checksum;

  try {
    await AddonManager.installAddonFromUrl(id, url, checksum, true);
    const key = `addons.${id}`;
    const obj = await Settings.get(key);
    response.status(200).json(obj);
  } catch (e) {
    response.status(400).send(e);
  }
});

AddonsController.patch('/:addonId', async (request, response) => {
  const id = request.params.addonId;

  if (!request.body ||
      !request.body.hasOwnProperty('url') ||
      !request.body.hasOwnProperty('checksum')) {
    response.status(400).send('Missing required parameter(s).');
    return;
  }

  const url = request.body.url;
  const checksum = request.body.checksum;

  try {
    await AddonManager.installAddonFromUrl(id, url, checksum, false);
    const key = `addons.${id}`;
    const obj = await Settings.get(key);
    response.status(200).json(obj);
  } catch (e) {
    console.error(`Failed to update add-on: ${id}\n${e}`);
    response.status(400).send(e);
  }
});

AddonsController.delete('/:addonId', async (request, response) => {
  const addonId = request.params.addonId;

  try {
    await AddonManager.uninstallAddon(addonId, false, true);
    response.sendStatus(204);
  } catch (e) {
    console.error(`Failed to uninstall add-on: ${addonId}\n${e}`);
    response.status(400).send(e);
  }
});

module.exports = AddonsController;
