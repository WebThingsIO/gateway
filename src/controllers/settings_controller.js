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

const PromiseRouter = require('express-promise-router');
const greenlock = require('greenlock');
const leChallengeDns = require('le-challenge-dns').create({ debug: false })
const config = require('config');
const fetch = require('node-fetch');
const fs = require('fs');
const TunnelService = require('../ssltunnel');
const Settings = require('../models/settings');
const Constants = require('../constants');
const AdapterManager = require('../adapter-manager');

var SettingsController = PromiseRouter();

/**
 * Set an experiment setting.
 */
SettingsController.put('/experiments/:experimentName',
                       async (request, response) => {
  var experimentName = request.params.experimentName;

  if (!request.body || request.body['enabled'] === undefined) {
    response.status(400).send('Enabled property not defined');
    return;
  }

  var enabled = request.body['enabled'];

  try {
    const result =
      await Settings.set('experiments.' + experimentName + '.enabled',
                         enabled);
    response.status(200).json({'enabled': result});
  } catch (e) {
    console.error('Failed to set setting experiments.' + experimentName);
    console.error(e);
    response.status(400).send(e);
  }
});

/**
 * Get an experiment setting.
 */
SettingsController.get('/experiments/:experimentName',
                       async (request, response) => {
  var experimentName = request.params.experimentName;

  try {
    const result =
      await Settings.get('experiments.' + experimentName + '.enabled');
    if (result === undefined) {
      response.status(404).send('Setting not found');
    } else {
      response.status(200).json({'enabled': result});
    }
  } catch (e) {
    console.error('Failed to get setting experiments.' + experimentName);
    console.error(e);
    response.status(400).send(e);
  }
});

SettingsController.post('/reclaim', async (request, response) => {
  let subdomain = request.body.subdomain;

  try {
    await fetch(config.get('ssltunnel.registration_endpoint') +
                '/reclaim?name=' + subdomain);
    response.status(200).end();
  } catch (e) {
    console.error(e);
    response.statusMessage = 'Error reclaiming domain - ' + e;
    response.status(400).end();
  }
});

SettingsController.post('/subscribe', async (request, response) => {
  let email = request.body.email;
  let reclamationToken = request.body.reclamationToken;
  let subdomain = request.body.subdomain;
  let fulldomain =  subdomain + '.' + config.get('ssltunnel.domain');

  function returnError(message) {
    console.error(message);
    response.statusMessage = 'Error issuing certificate - ' + message;
    response.status(400).end();
  }

  // function to automatically agree and accept the ToS
  function leAgree(opts, agreeCb) {
    agreeCb(null, opts.tosUrl);
  }

  let leStore = require('le-store-certbot').create({
      webrootPath: Constants.STATIC_PATH,
      configDir: '~/mozilla-iot/etc',
      logsDir: '~/mozilla-iot/var/log',
      workDir: '~/mozilla-iot/var/lib',
      debug: true
  });
  let le = greenlock.create({
      server: greenlock.productionServerUrl,
      challengeType: 'dns-01',
      challenges: { 'dns-01': leChallengeDns },
      approveDomains: [fulldomain],
      agreeToTerms: leAgree,
      debug: true,
      store: leStore
  });

  let token;
  // promise to be resolved when LE has the dns challenge ready for us
  leChallengeDns.leDnsResponse =
    (challenge, keyAuthorization, keyAuthDigest) => {
      return new Promise((resolve) => {
        // ok now that we have a challenge, we call our gateway to setup
        // the TXT record
        fetch(config.get('ssltunnel.registration_endpoint') +
              '/dnsconfig?token=' + token + '&challenge=' + keyAuthDigest)
          .catch(function(e) {
            returnError(e);
          })
          .then(function(res) {
            return res.text();
          })
          .then(function() {
            resolve('Success!');
          });
      });
  }

  let jsonToken;
  try {
    let subscribeUrl = config.get('ssltunnel.registration_endpoint') +
      '/subscribe?name=' + subdomain + '&email=' + email;
    if (reclamationToken) {
      subscribeUrl += '&reclamationToken=' + reclamationToken.trim();
    }

    const res = await fetch(subscribeUrl);
    const body = await res.text();

    jsonToken = JSON.parse(body);
    if (jsonToken.error) {
      returnError(jsonToken.error);
      return;
    }

    // store the token in the db
    token = jsonToken.token;
    await Settings.set('tunneltoken', jsonToken);
  } catch (e) {
    returnError(e);
    return;
  }

  // Register Let's Encrypt
  try {
    let results = await le.register({
      domains: [fulldomain],
      email: config.get('ssltunnel.certemail'),
      agreeTos: true,
      rsaKeySize: 2048,
      challengeType: 'dns-01'
    });

    console.log('success', results);

    // ok. we got the certificates. let's save them
    fs.writeFileSync('certificate.pem', results.cert);
    fs.writeFileSync('privatekey.pem', results.privkey);
    fs.writeFileSync('chain.pem', results.chain);

    // now we associate user's emails with the subdomain, unless it was
    // reclaimed.
    if (!reclamationToken) {
      try {
        await fetch(config.get('ssltunnel.registration_endpoint') +
                    '/setemail?token=' + token + '&email=' + email);
        console.log('Online account created.');
      } catch (e) {
        // https://github.com/mozilla-iot/gateway/issues/358
        // we should store this error and display to the user on
        // settings page to allow him to retry
        returnError(e);
        return;
      }
    }

    let endpoint_url = 'https://' + subdomain + '.' +
      config.get('ssltunnel.domain');
    TunnelService.start(response, endpoint_url);
    TunnelService.switchToHttps();
  } catch (err) {
    returnError(err.detail ||
                err.message.substring(0,err.message.indexOf('\n')));
  }
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
    const result = await Settings.get('tunneltoken');
    if (typeof result === 'object') {
      let endpoint = 'https://' + result.name + '.' +
        config.get('ssltunnel.domain');
      response.send(endpoint);
      response.status(200).end();
    } else {
      response.status(404).end();
    }
  } catch (e) {
    console.error('Failed to retrieve tunneltoken setting');
    console.error(e);
    response.status(400).send(e);
  }
});

SettingsController.get('/adapters', async (request, response) => {
  Settings.getAdapterSettings().then(function(result) {
    if (result === undefined) {
      response.status(404).json([]);
    } else {
      response.status(200).json(result);
    }
  }).catch(function(e) {
    console.error('Failed to get adapter settings.');
    console.error(e);
    response.status(400).send(e);
  });
});

SettingsController.put('/adapters/:adapterName', async (request, response) => {
  var adapterName = request.params.adapterName;

  if (!request.body || request.body['enabled'] === undefined) {
    response.status(400).send('Enabled property not defined');
    return;
  }

  var enabled = request.body['enabled'];

  const key = `adapters.${adapterName}`;

  let current;
  try {
    current = await Settings.get(key);
  } catch (e) {
    console.error('Failed to get current settings for adapter ' + adapterName);
    console.error(e);
    response.status(400).send(e);
    return;
  }

  current.moziot.enabled = enabled;
  try {
    await Settings.set(key, current);
  } catch (e) {
    console.error('Failed to set settings for adapter ' + adapterName);
    console.error(e);
    response.status(400).send(e);
    return;
  }

  try {
    if (enabled) {
      await AdapterManager.loadAdapter(adapterName);
    } else {
      await AdapterManager.unloadAdaptersByPackageName(adapterName);
    }

    response.status(200).json({'enabled': enabled});
  } catch (e) {
    console.error('Failed to toggle adapter ' + adapterName);
    console.error(e);
    response.status(400).send(e);
  }
});

module.exports = SettingsController;
