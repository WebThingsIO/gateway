/*
 * WebThings Gateway App.
 *
 * Back end main script.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// Set up the user profile.
import UserProfile from './user-profile';
import migrate from './migrate';
const migration = migrate();

// Causes a timestamp to be prepended to console log lines.
import './log-timestamps';

// External Dependencies
import https from 'https';
import http from 'http';
import fs from 'fs';
import express from 'express';
import expressWs from 'express-ws';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import config from 'config';
import path from 'path';
import expressHandlebars from 'express-handlebars';
import ipRegex from 'ip-regex';
import * as SegfaultHandler from 'segfault-handler';

// Internal Dependencies
import AddonManager from './addon-manager';
import * as Constants from './constants';
import Database from './db';
import * as mDNSserver from './mdns-server';
import Logs from './models/logs';
import * as Platform from './platform';
const Router = require('./router');
import sleep from './sleep';
import Things from './models/things';
import TunnelService from './tunnel-service';
import {WiFiSetupApp, isWiFiConfigured} from './wifi-setup';
import {AddressInfo} from 'net';

SegfaultHandler.registerHandler(path.join(UserProfile.logDir, 'crash.log'));

// Open the databases
Database.open();
Logs.open();

export const servers: {
  http: http.Server;
  https: https.Server | null;
} = {
  http: http.createServer(),
  https: createHttpsServer(),
};

const httpApp: express.Application = createGatewayApp(servers.http, false);
let httpsApp: express.Application | null = null;

/**
 * Creates an HTTPS server object, if successful. If there are no public and
 * private keys stored for the tunnel service, null is returned.
 *
 * @param {}
 * @return {Object|null} https server object if successful, else NULL
 */
function createHttpsServer(): https.Server | null {
  if (!TunnelService.hasCertificates()) {
    return null;
  }

  // HTTPS server configuration
  const options: https.ServerOptions = {
    key: fs.readFileSync(path.join(UserProfile.sslDir, 'privatekey.pem')),
    cert: fs.readFileSync(path.join(UserProfile.sslDir, 'certificate.pem')),
  };

  if (fs.existsSync(path.join(UserProfile.sslDir, 'chain.pem'))) {
    options.ca = fs.readFileSync(path.join(UserProfile.sslDir, 'chain.pem'));
  }

  return https.createServer(options);
}

let httpsAttempts = 5;
function startHttpsGateway(): Promise<https.Server | null> {
  const port = config.get('ports.https');

  if (!servers.https) {
    servers.https = createHttpsServer();
    if (!servers.https) {
      httpsAttempts -= 1;
      if (httpsAttempts < 0) {
        console.error('Unable to create HTTPS server after several tries');
        gracefulExit();
        process.exit(0);
      }

      return sleep(4000).then(startHttpsGateway);
    }
  }

  httpsApp = createGatewayApp(servers.https, true);
  servers.https.on('request', httpsApp);

  const promises = [];

  // Start the HTTPS server
  promises.push(new Promise<void>((resolve) => {
    servers.https!.listen(port, () => {
      migration.then(() => {
        // load existing things from the database
        return Things.getThings();
      }).then(() => {
        AddonManager.loadAddons();
      });
      rulesEngineConfigure();
      console.log('HTTPS server listening on port', (<AddressInfo>servers.https!.address()!).port);
      resolve();
    });
  }));

  // Redirect HTTP to HTTPS
  servers.http.on('request', httpsApp);
  const httpPort = config.get('ports.http');

  promises.push(new Promise<void>((resolve) => {
    servers.http.listen(httpPort, () => {
      console.log('Redirector listening on port', (<AddressInfo>servers.http.address()!).port);
      resolve();
    });
  }));

  return Promise.all(promises).then(() => servers.https);
}

function startHttpGateway(): Promise<void> {
  servers.http.on('request', httpApp);

  const port = config.get('ports.http');

  return new Promise<void>((resolve) => {
    servers.http.listen(port, () => {
      migration.then(() => {
        // load existing things from the database
        return Things.getThings();
      }).then(() => {
        AddonManager.loadAddons();
      });
      rulesEngineConfigure();
      console.log('HTTP server listening on port', (<AddressInfo>servers.http.address()!).port);
      resolve();
    });
  });
}

function stopHttpGateway(): void {
  servers.http.removeListener('request', httpApp);

  if (httpsApp) {
    servers.http.removeListener('request', httpsApp);
  }

  servers.http.close();
}

function stopHttpsGateway(): void {
  if (servers.https && httpsApp) {
    servers.https.removeListener('request', httpsApp);
    servers.https.close();
    servers.https = null;
  }
}

function startWiFiSetup(): void {
  console.log('Starting WiFi setup');
  servers.http.on('request', WiFiSetupApp.onRequest);

  const port = config.get('ports.http');

  servers.http.listen(port);
}

function stopWiFiSetup(): void {
  console.log('Stopping WiFi Setup');
  servers.http.removeListener('request', WiFiSetupApp.onRequest);
  servers.http.close();
}

/**
 * Set up the rules engine.
 */
function rulesEngineConfigure(): void {
  // TODO: fix circular import
  const rulesEngine = require('./rules-engine/index').default;
  rulesEngine.configure();
}

function createApp(isSecure: boolean): express.Application {
  const port = isSecure ? config.get('ports.https') : config.get('ports.http');
  const app = express();
  app.engine(
    'handlebars',
    expressHandlebars({
      defaultLayout: undefined, // eslint-disable-line no-undefined
      layoutsDir: Constants.VIEWS_PATH,
    })
  );
  app.set('view engine', 'handlebars');
  app.set('views', Constants.VIEWS_PATH);

  // Redirect based on https://https.cio.gov/apis/
  app.use((request, response, next) => {
    // If the server is in non-HTTPS mode, or the request is already HTTPS,
    // just carry on.
    if (!isSecure || request.secure) {
      next();
      return;
    }

    // If the Host header was not set, disallow this request.
    if (!request.hostname) {
      response.sendStatus(403);
      return;
    }

    // If the request is for a bare hostname, a .local address, or an IP
    // address, allow it.
    if (request.hostname.indexOf('.') < 0 ||
        request.hostname.endsWith('.local') ||
        ipRegex({exact: true}).test(request.hostname)) {
      next();
      return;
    }

    if (request.method !== 'GET') {
      response.sendStatus(403);
      return;
    }

    if (request.headers.authorization) {
      response.sendStatus(403);
      return;
    }

    let httpsUrl = `https://${request.hostname}`;

    // If we're behind forwarding we can redirect to the port-free https url
    if (port !== 443 && !config.get('behindForwarding')) {
      httpsUrl += `:${port}`;
    }

    httpsUrl += request.url;
    response.redirect(301, httpsUrl);
  });

  // Use bodyParser to access the body of requests
  app.use(bodyParser.urlencoded({
    extended: false,
  }));
  app.use(bodyParser.json({limit: '1mb'}));

  // Use fileUpload to handle multi-part uploads
  app.use(fileUpload());

  return app;
}

/**
 * @param {http.Server|https.Server} server
 * @return {express.Router}
 */
function createGatewayApp(server: http.Server | https.Server, isSecure: boolean):
express.Application {
  const app = createApp(isSecure);

  // Inject WebSocket support
  expressWs(app, server);

  // Configure router with configured app.
  Router.configure(app);

  return app;
}

export const serverStartup: {
  promise: Promise<void | unknown>;
} = {
  promise: Promise.resolve(),
};

switch (Platform.getOS()) {
  case 'linux-raspbian':
    migration.then(() => {
      return isWiFiConfigured();
    }).then((configured) => {
      if (!configured) {
        WiFiSetupApp.onConnection = () => {
          stopWiFiSetup();
          startGateway();
        };
        startWiFiSetup();
      } else {
        startGateway();
      }
    });
    break;
  default:
    startGateway();
    break;
}

function startGateway(): void {
  // if we have the certificates installed, we start https
  if (TunnelService.hasCertificates()) {
    serverStartup.promise = TunnelService.userSkipped().then((skipped): Promise<unknown> => {
      const promise = startHttpsGateway();

      // if the user opted to skip the tunnel, but still has certificates, go
      // ahead and start up the https server.
      if (skipped) {
        return promise;
      }

      // if they did not opt to skip, check if they have a tunnel token. if so,
      // start the tunnel.
      return promise.then((server) => {
        if (!server) {
          console.error('Failed to start HTTPS gateway');
        } else {
          TunnelService.hasTunnelToken().then((result) => {
            if (result) {
              TunnelService.setServerHandle(server!);
              TunnelService.start();
            }
          });
        }
      });
    });
  } else {
    serverStartup.promise = startHttpGateway();
  }
}

function gracefulExit(): void {
  AddonManager.unloadAddons();
  TunnelService.stop();
}

// Get some decent error messages for unhandled rejections. This is
// often just errors in the code.
process.on('unhandledRejection', (reason) => {
  console.log('Unhandled Rejection');
  console.error(reason);
});

// Do graceful shutdown when Control-C is pressed.
process.on('SIGINT', () => {
  console.log('Control-C: Exiting gracefully');
  gracefulExit();
  process.exit(0);
});

// function to stop running server and start https
TunnelService.switchToHttps = () => {
  stopHttpGateway();
  stopHttpsGateway();
  startHttpsGateway().then((server) => {
    if (!server) {
      console.error('Failed to start HTTPS gateway');
    } else {
      TunnelService.setServerHandle(server!);
    }
  });
};

// This part starts our Service Discovery process.
// We check to see if mDNS should be setup in default mode, or has a previous
// user setup a unique domain. Then we start it.
mDNSserver.getmDNSstate().then((state) => {
  if (Platform.implemented('setMdnsServerStatus')) {
    Platform.setMdnsServerStatus(state);
  }
});
