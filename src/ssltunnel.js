/**
 * MozIoT Gateway Tunnelservice.
 *
 * Manages the tunnel service.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const fs = require('fs');
const CertificateManager = require('./certificate-manager');
const config = require('config');
const Deferred = require('./deferred');
const path = require('path');
const fetch = require('node-fetch');
const spawnSync = require('child_process').spawn;
const Settings = require('./models/settings');
const UserProfile = require('./user-profile');
const PushService = require('./push-service');

const DEBUG = false || (process.env.NODE_ENV === 'test');

const TunnelService = {

  pagekiteProcess: null,
  tunneltoken: null,
  switchToHttps: null,
  connected: new Deferred(),
  pingInterval: null,
  renewInterval: null,
  server: null,

  /*
   * Router middleware to check if we have a ssl tunnel set.
   *
   * @param {Object} request Express request object.
   * @param {Object} response Express response object.
   * @param {Object} next Next middleware.
   */
  isTunnelSet: async function(request, response, next) {
    // If ssl tunnel is disabled, continue
    if (!config.get('ssltunnel.enabled')) {
      return next();
    } else {
      let notunnel = await Settings.get('notunnel');
      if (typeof notunnel !== 'boolean') {
        notunnel = false;
      }

      // then we check if we have certificates installed
      if ((fs.existsSync(path.join(UserProfile.sslDir,
                                   'certificate.pem')) &&
           fs.existsSync(path.join(UserProfile.sslDir,
                                   'privatekey.pem'))) ||
          notunnel) {
        // if certs are installed,
        // then we don't need to do anything and return
        return next();
      }

      // if there are no certs installed,
      // we display the cert setup page to the user
      response.render('tunnel-setup',
                      {domain: config.get('ssltunnel.domain')});
    }
  },

  // Set a handle for the running https server, used when renewing certificates
  setServerHandle: function(server) {
    this.server = server;
  },

  // method that starts the client if the box has a registered tunnel
  start: function(response, urlredirect) {
    Settings.get('tunneltoken').then((result) => {
      if (typeof result === 'object') {
        let responseSent = false;
        this.tunneltoken = result;
        const endpoint = `${result.name}.${
          config.get('ssltunnel.domain')}`;
        this.pagekiteProcess =
          spawnSync(config.get('ssltunnel.pagekite_cmd'),
                    ['--clean', `--frontend=${endpoint}:${
                      config.get('ssltunnel.port')}`,
                     `--service_on=https:${endpoint
                     }:localhost:${
                       config.get('ports.https')}:${
                       this.tunneltoken.token}`],
                    {shell: true});

        this.pagekiteProcess.stdout.on('data', (data) => {
          if (DEBUG) {
            console.log(`[pagekite] stdout: ${data}`);
          }

          const needToSend = response && !responseSent;

          if (data.indexOf('err=Error in connect') > -1) {
            this.connected.reject();
            if (needToSend) {
              responseSent = true;
              response.status(400).end();
            }
          } else if (data.indexOf('connect=') > -1) {
            this.connected.resolve();
            if (needToSend) {
              responseSent = true;
              response.send(urlredirect);
            }
          }
        });
        this.pagekiteProcess.stderr.on('data', (data) => {
          console.log(`[pagekite] stderr: ${data}`);
        });
        this.pagekiteProcess.on('close', (code) => {
          console.log(`[pagekite] process exited with code ${code}`);
        });

        this.connected.promise.then(() => {
          // Ping the registration server every hour.
          this.pingInterval =
            setInterval(() => this.pingRegistrationServer(), 60 * 60 * 1000);

          // Enable push service
          PushService.init(`https://${endpoint}`);

          // Try to renew certificates immediately, then daily.
          CertificateManager.renew(this.server).then(() => {
            this.renewInterval = setInterval(() => {
              CertificateManager.renew(this.server);
            }, 24 * 60 * 60 * 1000);
          });
        }).catch(() => {});
      } else {
        console.error('tunneltoken not set');
        if (response) {
          response.status(400).end();
        }
      }
    }).catch((e) => {
      console.error('Failed to get tunneltoken setting');
      console.error(e);

      if (response) {
        response.status(400).send(e);
      }
    });
  },

  // method to stop pagekite process
  stop: function() {
    if (this.pingInterval !== null) {
      clearInterval(this.pingInterval);
    }

    if (this.renewInterval !== null) {
      clearInterval(this.renewInterval);
    }

    if (this.pagekiteProcess) {
      this.pagekiteProcess.kill('SIGHUP');
    }
  },

  // method to check if the box has certificates
  hasCertificates: function() {
    return fs.existsSync(path.join(UserProfile.sslDir, 'certificate.pem')) &&
      fs.existsSync(path.join(UserProfile.sslDir, 'privatekey.pem'));
  },

  // method to check if the box has a registered tunnel
  hasTunnelToken: async function() {
    const tunneltoken = await Settings.get('tunneltoken');
    return typeof tunneltoken === 'object';
  },

  // method to check if user skipped the ssl tunnel setup
  userSkipped: async function() {
    const notunnel = await Settings.get('notunnel');
    if (typeof notunnel === 'boolean' && notunnel) {
      return true;
    }

    return false;
  },

  // method to ping the registration server to track active domains
  pingRegistrationServer: function() {
    const url = `${config.get('ssltunnel.registration_endpoint')}` +
      `/ping?token=${this.tunneltoken.token}`;
    fetch(url).catch((e) => {
      console.log('Failed to ping registration server:', e);
    });
  },
};

module.exports = TunnelService;
