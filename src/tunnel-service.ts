/**
 * Gateway tunnel service.
 *
 * Manages the tunnel service.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import fs from 'fs';
import config from 'config';
import Deferred from './deferred';
import path from 'path';
import fetch from 'node-fetch';
import {spawn, ChildProcess} from 'child_process';
import {Server} from 'https';
import express from 'express';
import * as Settings from './models/settings';
import UserProfile from './user-profile';
import PushService from './push-service';
import * as CertificateManager from './certificate-manager';

const DEBUG = false || (process.env.NODE_ENV === 'test');

class TunnelService {
  private pagekiteProcess: ChildProcess|null;

  private tunnelToken: {base?: string, token: string}|null;

  private connected: Deferred<void, void>;

  private pingInterval: NodeJS.Timeout|null;

  private renewInterval: NodeJS.Timeout|null;

  private server: Server|null;

  public switchToHttps: (() => void)|null;

  constructor() {
    this.pagekiteProcess = null;
    this.tunnelToken = null;
    this.connected = new Deferred();
    this.pingInterval = null;
    this.renewInterval = null;
    this.server = null;
    this.switchToHttps = null;
  }

  /*
   * Router middleware to check if we have a ssl tunnel set.
   *
   * @param {Object} request Express request object.
   * @param {Object} response Express response object.
   * @param {Object} next Next middleware.
   */
  async isTunnelSet(_request: express.Request, response: express.Response,
                    next: express.NextFunction): Promise<void> {
    // If ssl tunnel is disabled, continue
    if (!config.get('ssltunnel.enabled')) {
      return next();
    } else {
      let notunnel = await Settings.getSetting('notunnel');
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
  }

  // Set a handle for the running https server, used when renewing certificates
  setServerHandle(server: Server): void {
    this.server = server;
  }

  // method that starts the client if the box has a registered tunnel
  start(response?: express.Response, urlredirect?: {url: string}): void {
    Settings.getSetting('tunneltoken').then((result) => {
      if (typeof result === 'object') {
        if (!result.base) {
          // handle legacy tunnels
          result.base = 'mozilla-iot.org';
          Settings.setSetting('tunneltoken', result).catch((e) => {
            console.error('Failed to set tunneltoken.base:', e);
          });
        }

        let responseSent = false;
        this.tunnelToken = result;
        const endpoint = `${result.name}.${result.base}`;
        this.pagekiteProcess =
          spawn(config.get('ssltunnel.pagekite_cmd'),
                ['--clean', `--frontend=${endpoint}:${
                  config.get('ssltunnel.port')}`,
                 `--service_on=https:${endpoint
                 }:localhost:${
                   config.get('ports.https')}:${
                   this.tunnelToken!.token}`],
                {shell: true});

        this.pagekiteProcess.stdout!.on('data', (data) => {
          if (DEBUG) {
            console.log(`[pagekite] stdout: ${data}`);
          }

          const needToSend = response && !responseSent;

          if (data.indexOf('err=Error in connect') > -1) {
            console.error('PageKite failed to connect');
            this.connected.reject();
            if (needToSend) {
              responseSent = true;
              response!.sendStatus(400);
            }
          } else if (data.indexOf('connect=') > -1) {
            console.log('PageKite connected!');
            this.connected.resolve();
            if (needToSend) {
              responseSent = true;
              response!.status(200).json(urlredirect);
            }
          }
        });
        this.pagekiteProcess.stderr!.on('data', (data) => {
          console.log(`[pagekite] stderr: ${data}`);
        });
        this.pagekiteProcess.on('close', (code) => {
          console.log(`[pagekite] process exited with code ${code}`);
        });

        this.connected.getPromise().then(() => {
          // Ping the registration server every hour.
          this.pingInterval =
            setInterval(() => this.pingRegistrationServer(), 60 * 60 * 1000);

          // Enable push service
          PushService.init(`https://${endpoint}`);

          const renew = () => {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            return CertificateManager.renew(this.server!).catch(() => {});
          };

          // Try to renew certificates immediately, then daily.
          renew().then(() => {
            this.renewInterval = setInterval(renew, 24 * 60 * 60 * 1000);
          });
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        }).catch(() => {});
      } else {
        console.error('tunneltoken not set');
        if (response) {
          response.status(400).end();
        }
      }
    }).catch((e) => {
      console.error('Failed to get tunneltoken setting:', e);

      if (response) {
        response.status(400).send(e);
      }
    });
  }

  // method to stop pagekite process
  stop(): void {
    if (this.pingInterval !== null) {
      clearInterval(this.pingInterval);
    }

    if (this.renewInterval !== null) {
      clearInterval(this.renewInterval);
    }

    if (this.pagekiteProcess) {
      this.pagekiteProcess.kill('SIGHUP');
    }
  }

  // method to check if the box has certificates
  hasCertificates(): boolean {
    return fs.existsSync(path.join(UserProfile.sslDir, 'certificate.pem')) &&
      fs.existsSync(path.join(UserProfile.sslDir, 'privatekey.pem'));
  }

  // method to check if the box has a registered tunnel
  async hasTunnelToken(): Promise<boolean> {
    const tunneltoken = await Settings.getSetting('tunneltoken');
    return typeof tunneltoken === 'object';
  }

  // method to check if user skipped the ssl tunnel setup
  async userSkipped(): Promise<boolean> {
    const notunnel = await Settings.getSetting('notunnel');
    if (typeof notunnel === 'boolean' && notunnel) {
      return true;
    }

    return false;
  }

  // method to ping the registration server to track active domains
  pingRegistrationServer(): void {
    const url = `${config.get('ssltunnel.registration_endpoint')}` +
      `/ping?token=${this.tunnelToken!.token}`;
    fetch(url).catch((e) => {
      console.log('Failed to ping registration server:', e);
    });
  }
}

const service = new TunnelService();
export default service;
