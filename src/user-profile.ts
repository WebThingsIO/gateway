/**
 * WebThings Gateway user profile.
 *
 * The user profile lives outside of the source tree to allow for things like
 * data persistence with Docker, as well as the ability to easily switch
 * profiles, if desired.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

process.env.ALLOW_CONFIG_MUTATIONS = 'true';

import config from 'config';
import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import {ncp} from 'ncp';
import rimraf, {sync as rimrafSync} from 'rimraf';

/**
 * Manually copy, then unlink, to prevent issues with cross-device renames.
 */
function renameFile(src: string, dst: string): void {
  fs.copyFileSync(src, dst);
  fs.unlinkSync(src);
}

/**
 * Manually copy, then remove, to prevent issues with cross-device renames.
 */
function renameDir(src: string, dst: string): Promise<void> {
  return new Promise((resolve, reject) => {
    ncp(src, dst, (e) => {
      if (e) {
        reject(e);
        return;
      }

      rimraf(src, (err) => {
        if (err) {
          reject(err);
          return;
        }

        resolve();
      });
    });
  });
}

const baseDir = path.resolve(
  process.env.WEBTHINGS_HOME || config.get('profileDir')
);

const UserProfile = {
  baseDir,
  configDir: path.join(baseDir, 'config'),
  dataDir: path.join(baseDir, 'data'),
  sslDir: path.join(baseDir, 'ssl'),
  uploadsDir: path.join(baseDir, 'uploads'),
  mediaDir: path.join(baseDir, 'media'),
  logDir: path.join(baseDir, 'log'),
  gatewayDir: path.resolve(path.join(__dirname, '..')),
  addonsDir: process.env.NODE_ENV === 'test' ?
    path.join(__dirname, 'addons-test') :
    path.join(baseDir, 'addons'),
};

/**
 * Migrate from old locations to new ones
 * @return {Promise} resolved when migration is complete
 */
export function migrate(): Promise<any[]> {
  const pending = [];
  // Create all required profile directories.
  if (!fs.existsSync(UserProfile.configDir)) {
    mkdirp.sync(UserProfile.configDir);
  }
  if (!fs.existsSync(UserProfile.dataDir)) {
    mkdirp.sync(UserProfile.dataDir);
  }
  if (!fs.existsSync(UserProfile.sslDir)) {
    mkdirp.sync(UserProfile.sslDir);
  }
  if (!fs.existsSync(UserProfile.uploadsDir)) {
    mkdirp.sync(UserProfile.uploadsDir);
  }
  if (!fs.existsSync(UserProfile.logDir)) {
    mkdirp.sync(UserProfile.logDir);
  }
  if (!fs.existsSync(UserProfile.addonsDir)) {
    mkdirp.sync(UserProfile.addonsDir);
  }

  // Relocate the database, if necessary, before opening it.
  const dbPath = path.join(UserProfile.configDir, 'db.sqlite3');
  const oldDbPath = path.join(UserProfile.gatewayDir, 'db.sqlite3');
  if (fs.existsSync(oldDbPath)) {
    renameFile(oldDbPath, dbPath);
  }

  const Database = require('./db');
  const Settings = require('./models/settings');
  const User = require('./models/user');
  const Users = require('./models/users');

  // Open the database.
  Database.open();

  // Normalize user email addresses
  pending.push(
    Users.getUsers().then((users: (typeof User)[]) => {
      users.forEach((user: typeof User) => {
        // Call editUser with the same user, as it will normalize the email
        // for us and save it.
        Users.editUser(user);
      });
    })
  );

  // Move the tunneltoken into the database.
  const ttPath = path.join(UserProfile.gatewayDir, 'tunneltoken');
  if (fs.existsSync(ttPath)) {
    const token = JSON.parse(fs.readFileSync(ttPath, 'utf8'));
    pending.push(
      Settings.setSetting('tunneltoken', token).then(() => {
        fs.unlinkSync(ttPath);
      })
    );
  }

  // Move the notunnel setting into the database.
  const ntPath = path.join(UserProfile.gatewayDir, 'notunnel');
  if (fs.existsSync(ntPath)) {
    pending.push(
      Settings.setSetting('notunnel', true).then(() => {
        fs.unlinkSync(ntPath);
      })
    );
  }

  // Move the wifiskip setting into the database.
  const wsPath = path.join(UserProfile.configDir, 'wifiskip');
  if (fs.existsSync(wsPath)) {
    pending.push(
      Settings.setSetting('wifiskip', true).then(() => {
        fs.unlinkSync(wsPath);
      })
    );
  }

  // Move certificates, if necessary.
  const pkPath1 = path.join(UserProfile.gatewayDir, 'privatekey.pem');
  const pkPath2 = path.join(UserProfile.gatewayDir, 'ssl', 'privatekey.pem');
  if (fs.existsSync(pkPath1)) {
    renameFile(pkPath1, path.join(UserProfile.sslDir, 'privatekey.pem'));
  } else if (fs.existsSync(pkPath2)) {
    renameFile(pkPath2, path.join(UserProfile.sslDir, 'privatekey.pem'));
  }

  const certPath1 = path.join(UserProfile.gatewayDir, 'certificate.pem');
  const certPath2 = path.join(UserProfile.gatewayDir, 'ssl', 'certificate.pem');
  if (fs.existsSync(certPath1)) {
    renameFile(certPath1, path.join(UserProfile.sslDir, 'certificate.pem'));
  } else if (fs.existsSync(certPath2)) {
    renameFile(certPath2, path.join(UserProfile.sslDir, 'certificate.pem'));
  }

  const chainPath1 = path.join(UserProfile.gatewayDir, 'chain.pem');
  const chainPath2 = path.join(UserProfile.gatewayDir, 'ssl', 'chain.pem');
  if (fs.existsSync(chainPath1)) {
    renameFile(chainPath1, path.join(UserProfile.sslDir, 'chain.pem'));
  } else if (fs.existsSync(chainPath2)) {
    renameFile(chainPath2, path.join(UserProfile.sslDir, 'chain.pem'));
  }

  const csrPath1 = path.join(UserProfile.gatewayDir, 'csr.pem');
  const csrPath2 = path.join(UserProfile.gatewayDir, 'ssl', 'csr.pem');
  if (fs.existsSync(csrPath1)) {
    renameFile(csrPath1, path.join(UserProfile.sslDir, 'csr.pem'));
  } else if (fs.existsSync(csrPath2)) {
    renameFile(csrPath2, path.join(UserProfile.sslDir, 'csr.pem'));
  }

  const oldSslDir = path.join(UserProfile.gatewayDir, 'ssl');
  if (fs.existsSync(oldSslDir)) {
    rimrafSync(oldSslDir);
  }

  // Move old uploads, if necessary.
  const oldUploadsDir = path.join(UserProfile.gatewayDir, 'static', 'uploads');
  if (fs.existsSync(oldUploadsDir) &&
    fs.lstatSync(oldUploadsDir).isDirectory()) {
    const fnames = fs.readdirSync(oldUploadsDir);
    for (const fname of fnames) {
      renameFile(
        path.join(oldUploadsDir, fname), path.join(UserProfile.uploadsDir, fname));
    }

    fs.rmdirSync(oldUploadsDir);
  }

  // Create a user config if one doesn't exist.
  const oldUserConfigPath = path.join(UserProfile.configDir, 'local.js');
  const oldLocalConfigPath = path.join(UserProfile.gatewayDir, 'config', 'local.js');
  const userConfigPath = path.join(UserProfile.configDir, 'local.json');

  if (!fs.existsSync(userConfigPath)) {
    if (fs.existsSync(oldUserConfigPath)) {
      const oldConfig = (<any>config.util).parseFile(oldUserConfigPath);
      fs.writeFileSync(userConfigPath, JSON.stringify(oldConfig, null, 2));
    } else {
      fs.writeFileSync(userConfigPath, '{\n}');
    }
  }

  if (fs.existsSync(oldUserConfigPath)) {
    fs.unlinkSync(oldUserConfigPath);
  }

  if (fs.existsSync(oldLocalConfigPath)) {
    fs.unlinkSync(oldLocalConfigPath);
  }

  // Handle any config migrations
  if (fs.existsSync(userConfigPath)) {
    const cfg = JSON.parse(fs.readFileSync(userConfigPath, 'utf8'));
    let changed = false;

    // addonManager.listUrl -> addonManager.listUrls
    if (cfg.hasOwnProperty('addonManager') &&
        cfg.addonManager.hasOwnProperty('listUrl')) {
      if (cfg.addonManager.hasOwnProperty('listUrls')) {
        cfg.addonManager.listUrls.push(cfg.addonManager.listUrl);
        cfg.addonManager.listUrls =
          Array.from(new Set(cfg.addonManager.listUrls));
      } else {
        cfg.addonManager.listUrls = [cfg.addonManager.listUrl];
      }

      delete cfg.addonManager.listUrl;
      changed = true;
    }

    if (changed) {
      fs.writeFileSync(userConfigPath, JSON.stringify(cfg, null, 2));
    }
  }

  const localConfig = (<any>config.util).parseFile(userConfigPath);
  if (localConfig) {
    config.util.extendDeep(config, localConfig);
  }

  // Move add-ons.
  if (process.env.NODE_ENV !== 'test') {
    const oldAddonsDir = path.join(UserProfile.gatewayDir, 'build', 'addons');
    if (fs.existsSync(oldAddonsDir) &&
      fs.lstatSync(oldAddonsDir).isDirectory()) {
      const fnames = fs.readdirSync(oldAddonsDir);
      for (const fname of fnames) {
        const oldFname = path.join(oldAddonsDir, fname);
        const newFname = path.join(UserProfile.addonsDir, fname);
        const lstat = fs.lstatSync(oldFname);

        if (fname !== 'plugin' && lstat.isDirectory()) {
          // Move existing add-ons.
          pending.push(renameDir(oldFname, newFname));
        }
      }
    }
  }
  return Promise.all(pending);
}

export default UserProfile;
