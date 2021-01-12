import express from 'express';
import fs from 'fs';
import path from 'path';
import {AddonManager} from '../addon-manager';
import * as Settings from '../models/settings';
import UserProfile from '../user-profile';

export default function AddonsController(addonManager: AddonManager): express.Router {
  const router = express.Router();

  router.get('/', async (_request, response) => {
    response.status(200).json(Array.from(addonManager.getInstalledAddons().values()));
  });

  router.get('/:addonId/license', async (request, response) => {
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

  router.put('/:addonId', async (request, response) => {
    const addonId = request.params.addonId;

    if (!request.body || !request.body.hasOwnProperty('enabled')) {
      response.status(400).send('Enabled property not defined');
      return;
    }

    const enabled = request.body.enabled;

    try {
      if (enabled) {
        await addonManager.enableAddon(addonId);
      } else {
        await addonManager.disableAddon(addonId, true);
      }

      response.status(200).json({enabled});
    } catch (e) {
      console.error(`Failed to toggle add-on ${addonId}`);
      console.error(e);
      response.status(400).send(e);
    }
  });

  router.get('/:addonId/config', async (request, response) => {
    const addonId = request.params.addonId;
    const key = `addons.config.${addonId}`;

    try {
      const config = await Settings.getSetting(key);
      response.status(200).json(config || {});
    } catch (e) {
      console.error(`Failed to get config for add-on ${addonId}`);
      console.error(e);
      response.status(400).send(e);
    }
  });

  router.put('/:addonId/config', async (request, response) => {
    const addonId = request.params.addonId;

    if (!request.body || !request.body.hasOwnProperty('config')) {
      response.status(400).send('Config property not defined');
      return;
    }

    const config = request.body.config;
    const key = `addons.config.${addonId}`;

    try {
      await Settings.setSetting(key, config);
    } catch (e) {
      console.error(`Failed to set config for add-on ${addonId}`);
      console.error(e);
      response.status(400).send(e);
      return;
    }

    try {
      await addonManager.unloadAddon(addonId, true);

      if (await addonManager.addonEnabled(addonId)) {
        await addonManager.loadAddon(addonId);
      }

      response.status(200).json({config});
    } catch (e) {
      console.error(`Failed to restart add-on ${addonId}`);
      console.error(e);
      response.status(400).send(e);
    }
  });

  router.post('/', async (request, response) => {
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
      await addonManager.installAddonFromUrl(id, url, checksum, true);
      const key = `addons.${id}`;
      const obj = await Settings.getSetting(key);
      response.status(200).json(obj);
    } catch (e) {
      response.status(400).send(e);
    }
  });

  router.patch('/:addonId', async (request, response) => {
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
      await addonManager.installAddonFromUrl(id, url, checksum, false);
      const key = `addons.${id}`;
      const obj = await Settings.getSetting(key);
      response.status(200).json(obj);
    } catch (e) {
      console.error(`Failed to update add-on: ${id}\n${e}`);
      response.status(400).send(e);
    }
  });

  router.delete('/:addonId', async (request, response) => {
    const addonId = request.params.addonId;

    try {
      await addonManager.uninstallAddon(addonId, false, true);
      response.sendStatus(204);
    } catch (e) {
      console.error(`Failed to uninstall add-on: ${addonId}\n${e}`);
      response.status(400).send(e);
    }
  });

  return router;
}
