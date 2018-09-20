/**
 * MozIoT Gateway Tunnelservice.
 *
 * Manages the tunnel service.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const fs = require('fs');
const config = require('config');
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

        // TODO: we should replace the hardcoded secret by the token
        // after change the server
        this.pagekiteProcess.stdout.on('data', (data) => {
          if (DEBUG) {
            console.log(`[pagekite] stdout: ${data}`);
          }
          if (response) {
            if (responseSent) {
              return;
            }

            if (data.indexOf('err=Error in connect') > -1) {
              responseSent = true;
              response.status(400).end();
            } else if (data.indexOf('connect=') > -1) {
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

        // Ping the registration server every hour.
        const delay = 60 * 60 * 1000;
        setInterval(() => this.pingRegistrationServer(), delay);

        // Enable push service
        PushService.init(`https://${endpoint}`);
      } else {
        console.error('tunneltoken not set');
        if (response) {
          response.status(400).end();
        }
      }
    }).catch(function(e) {
      console.error('Failed to get tunneltoken setting');
      console.error(e);

      if (response) {
        response.status(400).send(e);
      }
    });
  },

  // method to stop pagekite process
  stop: function() {
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
    fetch(`${config.get('ssltunnel.registration_endpoint')
    }/ping?token=${this.tunneltoken.token}`)
      .catch((e) => {
        console.log('Failed to ping registration server:', e);
      });
  },
};

module.exports = TunnelService;
