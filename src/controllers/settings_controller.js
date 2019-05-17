/**
 * Settings Controller.
 *
 * Manages gateway settings.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

/* jshint unused:false */

const CertificateManager = require('../certificate-manager');
const config = require('config');
const fetch = require('node-fetch');
const mDNSserver = require('../mdns-server');
const Platform = require('../platform');
const pkg = require('../../package.json');
const PromiseRouter = require('express-promise-router');
const Settings = require('../models/settings');
const TunnelService = require('../ssltunnel');

const SettingsController = PromiseRouter();

/**
 * Set an experiment setting.
 */
SettingsController.put(
  '/experiments/:experimentName',
  async (request, response) => {
    const experimentName = request.params.experimentName;

    if (!request.body || !request.body.hasOwnProperty('enabled')) {
      response.status(400).send('Enabled property not defined');
      return;
    }

    const enabled = request.body.enabled;

    try {
      const result =
        await Settings.set(`experiments.${experimentName}.enabled`,
                           enabled);
      response.status(200).json({enabled: result});
    } catch (e) {
      console.error(`Failed to set setting experiments.${experimentName}`);
      console.error(e);
      response.status(400).send(e);
    }
  });

/**
 * Get an experiment setting.
 */
SettingsController.get(
  '/experiments/:experimentName',
  async (request, response) => {
    const experimentName = request.params.experimentName;

    try {
      const result =
        await Settings.get(`experiments.${experimentName}.enabled`);
      if (typeof result === 'undefined') {
        response.status(404).send('Setting not found');
      } else {
        response.status(200).json({enabled: result});
      }
    } catch (e) {
      console.error(`Failed to get setting experiments.${experimentName}`);
      console.error(e);
      response.status(400).send(e);
    }
  });

SettingsController.post('/reclaim', async (request, response) => {
  if (!request.body || !request.body.hasOwnProperty('subdomain')) {
    response.statusMessage = 'Subdomain missing from request';
    response.status(400).end();
    return;
  }

  const subdomain = request.body.subdomain;

  try {
    await fetch(`${config.get('ssltunnel.registration_endpoint')
    }/reclaim?name=${subdomain}`);
    response.status(200).end();
  } catch (e) {
    console.error(e);
    response.statusMessage = `Error reclaiming domain - ${e}`;
    response.status(400).end();
  }
});

SettingsController.post('/subscribe', async (request, response) => {
  if (!request.body ||
      !request.body.hasOwnProperty('email') ||
      !request.body.hasOwnProperty('subdomain') ||
      !request.body.hasOwnProperty('optout')) {
    response.statusMessage = 'Invalid request';
    response.status(400).end();
    return;
  }

  const email = request.body.email.trim().toLowerCase();
  const reclamationToken = request.body.reclamationToken.trim().toLowerCase();
  const subdomain = request.body.subdomain.trim().toLowerCase();
  const fulldomain = `${subdomain}.${config.get('ssltunnel.domain')}`;
  const optout = request.body.optout ? 1 : 0;

  function cb(err) {
    if (err) {
      response.statusMessage = `Error issuing certificate - ${err}`;
      response.status(400).end();
    } else {
      const endpoint =
        `https://${subdomain}.${config.get('ssltunnel.domain')}`;
      TunnelService.start(response, endpoint);
      TunnelService.switchToHttps();
    }
  }

  await CertificateManager.register(
    email,
    reclamationToken,
    subdomain,
    fulldomain,
    optout,
    cb
  );
});

SettingsController.post('/skiptunnel', async (request, response) => {
  try {
    await Settings.set('notunnel', true);
    response.status(200).end();
  } catch (e) {
    console.error('Failed to set notunnel setting.');
    console.error(e);
    response.status(400).send(e);
  }
});

SettingsController.get('/tunnelinfo', async (request, response) => {
  try {
    const localDomainSettings = await Settings.getTunnelInfo();
    response.send(localDomainSettings);
    response.status(200).end();
  } catch (e) {
    console.error('Failed to retrieve default settings for ' +
      'tunneltoken or local service discovery setting');
    console.error(e);
    response.status(400).send(e);
  }
});

/* This is responsible for controlling dynamically the local domain name
 * settings (via mDNS) and changing or updating mozilla tunnel endpoints.
 * The /domain endpoint is invoked from:
 *   MainMenu -> Settings -> Doamin
 *
 * JSON data: {
 *              local: {
 *                multicastDNSstate: boolean,
 *                localDNSname: string, - e.g. MyHome
 *              },
 *              mozillaTunnel: {
 *                tunnel: boolean,
 *                tunnelName: string, - e.g. MyName
 *                tunnelEmail: string
 *              }
 *            }
 */
SettingsController.put('/domain', async (request, response) => {
  if (!request.body || !request.body.hasOwnProperty('local')) {
    response.statusMessage = 'Invalid request.';
    response.status(400).end();
    return;
  }

  try {
    if (request.body.local.hasOwnProperty('localDNSname')) {
      const requestDomainName = request.body.local.localDNSname;
      await Settings.set('localDNSname', requestDomainName);
      mDNSserver.server.setLocalDomain(requestDomainName);
    } else if (request.body.local.hasOwnProperty('multicastDNSstate')) {
      const requestState = request.body.local.multicastDNSstate;
      await Settings.set('multicastDNSstate', requestState);
      mDNSserver.server.setState(requestState);
    } else {
      response.statusMessage = 'Invalid request.';
      response.status(400).end();
      return;
    }

    let protocol, port;
    if (request.secure) {
      protocol = 'https';
      port = config.get('ports.https');
    } else {
      protocol = 'http';
      port = config.get('ports.http');
    }

    const url = `${protocol}://${mDNSserver.server.localDomain}.local:${port}`;
    const localDomainSettings = {localDomain: url,
                                 update: true,
                                 mDNSstate: mDNSserver.server.serviceState};
    response.status(200).json(localDomainSettings);
  } catch (err) {
    console.error(`Failed setting domain with: ${err} `);
    const localDomainSettings = {localDomain: mDNSserver.server.localDomain,
                                 update: false,
                                 mDNSstate: mDNSserver.server.serviceState,
                                 error: err.message};
    response.status(400).json(localDomainSettings);
  }
});

SettingsController.get('/addonsInfo', (request, response) => {
  response.json({
    url: config.get('addonManager.listUrl'),
    api: config.get('addonManager.api'),
    architecture: Platform.getArchitecture(),
    version: pkg.version,
    nodeVersion: Platform.getNodeVersion(),
    pythonVersions: Platform.getPythonVersions(),
    testAddons: config.get('addonManager.testAddons'),
  });
});

SettingsController.get('/system/platform', (request, response) => {
  response.json({
    architecture: Platform.getArchitecture(),
    os: Platform.getOS(),
  });
});

SettingsController.get('/system/ssh', (request, response) => {
  const toggleImplemented = Platform.implemented('setSshServerStatus');
  let enabled = false;
  if (Platform.implemented('getSshServerStatus')) {
    enabled = Platform.getSshServerStatus();
  }

  response.json({
    toggleImplemented,
    enabled,
  });
});

SettingsController.put('/system/ssh', (request, response) => {
  if (!request.body || !request.body.hasOwnProperty('enabled')) {
    response.status(400).send('Enabled property not defined');
    return;
  }

  const toggleImplemented = Platform.implemented('setSshServerStatus');
  if (toggleImplemented) {
    const enabled = request.body.enabled;
    if (Platform.setSshServerStatus(enabled)) {
      response.status(200).json({enabled});
    } else {
      response.status(400).send('Failed to toggle SSH');
    }
  } else {
    response.status(500).send('Toggle SSH not implemented');
  }
});

SettingsController.post('/system/actions', (request, response) => {
  if (!request.body || !request.body.hasOwnProperty('action')) {
    response.status(400).send('Action property not defined');
    return;
  }

  const action = request.body.action;
  switch (action) {
    case 'restartGateway':
      if (Platform.implemented('restartGateway')) {
        if (Platform.restartGateway()) {
          response.status(200).end();
        } else {
          response.status(500).send('Failed to restart gateway');
        }
      } else {
        response.status(500).send('Restart gateway not implemented');
      }
      break;
    case 'restartSystem':
      if (Platform.implemented('restartSystem')) {
        if (Platform.restartSystem()) {
          response.status(200).end();
        } else {
          response.status(500).send('Failed to restart system');
        }
      } else {
        response.status(500).send('Restart system not implemented');
      }
      break;
    default:
      response.status(400).send('Unsupported action');
      break;
  }
});

SettingsController.get('/network/dhcp', (request, response) => {
  if (Platform.implemented('getDhcpServerStatus')) {
    response.json({enabled: Platform.getDhcpServerStatus()});
  } else {
    response.status(500).send('DHCP status not implemented');
  }
});

SettingsController.put('/network/dhcp', (request, response) => {
  if (!request.body || !request.body.hasOwnProperty('enabled')) {
    response.status(400).send('Missing enabled property');
    return;
  }

  const enabled = request.body.enabled;

  if (Platform.implemented('setDhcpServerStatus')) {
    if (Platform.setDhcpServerStatus(enabled)) {
      response.status(200).end();
    } else {
      response.status(500).send('Failed to toggle DHCP');
    }
  } else {
    response.status(500).send('Toggle DHCP not implemented');
  }
});

SettingsController.get('/network/lan', (request, response) => {
  if (Platform.implemented('getLanMode')) {
    response.json(Platform.getLanMode());
  } else {
    response.status(500).send('LAN mode not implemented');
  }
});

SettingsController.put('/network/lan', (request, response) => {
  if (!request.body || !request.body.hasOwnProperty('mode')) {
    response.status(400).send('Missing mode property');
    return;
  }

  const mode = request.body.mode;
  const options = request.body.options;

  if (Platform.implemented('setLanMode')) {
    if (Platform.setLanMode(mode, options)) {
      response.status(200).end();
    } else {
      response.status(500).send('Failed to update LAN configuration');
    }
  } else {
    response.status(500).send('Setting LAN mode not implemented');
  }
});

SettingsController.get('/network/wan', (request, response) => {
  if (Platform.implemented('getWanMode')) {
    response.json(Platform.getWanMode());
  } else {
    response.status(500).send('WAN mode not implemented');
  }
});

SettingsController.put('/network/wan', (request, response) => {
  if (!request.body || !request.body.hasOwnProperty('mode')) {
    response.status(400).send('Missing mode property');
    return;
  }

  const mode = request.body.mode;
  const options = request.body.options;

  if (Platform.implemented('setWanMode')) {
    if (Platform.setWanMode(mode, options)) {
      response.status(200).end();
    } else {
      response.status(500).send('Failed to update WAN configuration');
    }
  } else {
    response.status(500).send('Setting WAN mode not implemented');
  }
});

SettingsController.get('/network/wireless', (request, response) => {
  if (Platform.implemented('getWirelessMode')) {
    response.json(Platform.getWirelessMode());
  } else {
    response.status(500).send('Wireless mode not implemented');
  }
});

SettingsController.get('/network/wireless/networks', (request, response) => {
  if (Platform.implemented('scanWirelessNetworks')) {
    response.json(Platform.scanWirelessNetworks());
  } else {
    response.status(500).send('Wireless scanning not implemented');
  }
});

SettingsController.put('/network/wireless', (request, response) => {
  if (!request.body || !request.body.hasOwnProperty('enabled')) {
    response.status(400).send('Missing enabled property');
    return;
  }

  const enabled = request.body.enabled;
  const mode = request.body.mode;
  const options = request.body.options;

  if (Platform.implemented('setWirelessMode')) {
    if (Platform.setWirelessMode(enabled, mode, options)) {
      response.status(200).end();
    } else {
      response.status(500).send('Failed to update wireless configuration');
    }
  } else {
    response.status(500).send('Setting wireless mode not implemented');
  }
});

SettingsController.get('/network/addresses', (request, response) => {
  if (Platform.implemented('getNetworkAddresses')) {
    response.json(Platform.getNetworkAddresses());
  } else {
    response.status(500).send('Network addresses not implemented');
  }
});

module.exports = SettingsController;
