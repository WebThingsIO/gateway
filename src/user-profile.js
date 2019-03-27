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

'use strict';

process.env.ALLOW_CONFIG_MUTATIONS = 'true';
const config = require('config');
const fs = require('fs');
const path = require('path');
const os = require('os');
const mkdirp = require('mkdirp');
const ncp = require('ncp');
const rimraf = require('rimraf');

const Profile = {
  init: function() {
    this.baseDir = process.env.MOZIOT_HOME || config.get('profileDir');
    this.configDir = path.join(this.baseDir, 'config');
    this.sslDir = path.join(this.baseDir, 'ssl');
    this.uploadsDir = path.join(this.baseDir, 'uploads');
    this.mediaDir = path.join(this.baseDir, 'media');
    this.logDir = path.join(this.baseDir, 'log');
    this.gatewayDir = path.join(__dirname, '..');

    if (process.env.NODE_ENV === 'test') {
      this.addonsDir = path.join(this.gatewayDir, 'src', 'addons-test');
    } else {
      this.addonsDir = path.join(this.baseDir, 'addons');
    }
  },

  /**
   * Manually copy, then unlink, to prevent issues with cross-device renames.
   */
  renameFile: (src, dst) => {
    fs.copyFileSync(src, dst);
    fs.unlinkSync(src);
  },

  /**
   * Manually copy, then remove, to prevent issues with cross-device renames.
   */
  renameDir: (src, dst) => new Promise((resolve, reject) => {
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
  }),

  /**
   * Migrate from old locations to new ones
   * @return {Promise} resolved when migration is complete
   */
  migrate: function() {
    const pending = [];
    // Create all required profile directories.
    if (!fs.existsSync(this.configDir)) {
      mkdirp.sync(this.configDir);
    }
    if (!fs.existsSync(this.sslDir)) {
      mkdirp.sync(this.sslDir);
    }
    if (!fs.existsSync(this.uploadsDir)) {
      mkdirp.sync(this.uploadsDir);
    }
    if (!fs.existsSync(this.logDir)) {
      mkdirp.sync(this.logDir);
    }
    if (!fs.existsSync(this.addonsDir)) {
      mkdirp.sync(this.addonsDir);
    }

    // Relocate the database, if necessary, before opening it.
    const dbPath = path.join(this.configDir, 'db.sqlite3');
    const oldDbPath = path.join(this.gatewayDir, 'db.sqlite3');
    if (fs.existsSync(oldDbPath)) {
      this.renameFile(oldDbPath, dbPath);
    }

    const db = require('./db');
    const Settings = require('./models/settings');
    const Users = require('./models/users');

    // Open the database.
    db.open();

    // Normalize user email addresses
    pending.push(
      Users.getUsers().then((users) => {
        users.forEach((user) => {
          // Call editUser with the same user, as it will normalize the email
          // for us and save it.
          Users.editUser(user);
        });
      })
    );

    // Move the tunneltoken into the database.
    const ttPath = path.join(this.gatewayDir, 'tunneltoken');
    if (fs.existsSync(ttPath)) {
      const token = JSON.parse(fs.readFileSync(ttPath));
      pending.push(
        Settings.set('tunneltoken', token).then(() => {
          fs.unlinkSync(ttPath);
        }).catch((e) => {
          throw e;
        })
      );
    }

    // Move the notunnel setting into the database.
    const ntPath = path.join(this.gatewayDir, 'notunnel');
    if (fs.existsSync(ntPath)) {
      pending.push(
        Settings.set('notunnel', true).then(() => {
          fs.unlinkSync(ntPath);
        }).catch((e) => {
          throw e;
        })
      );
    }

    // Move the wifiskip setting into the database.
    const wsPath = path.join(this.configDir, 'wifiskip');
    if (fs.existsSync(wsPath)) {
      pending.push(
        Settings.set('wifiskip', true).then(() => {
          fs.unlinkSync(wsPath);
        }).catch((e) => {
          throw e;
        })
      );
    }

    // Move certificates, if necessary.
    const pkPath1 = path.join(this.gatewayDir, 'privatekey.pem');
    const pkPath2 = path.join(this.gatewayDir, 'ssl', 'privatekey.pem');
    if (fs.existsSync(pkPath1)) {
      this.renameFile(pkPath1, path.join(this.sslDir, 'privatekey.pem'));
    } else if (fs.existsSync(pkPath2)) {
      this.renameFile(pkPath2, path.join(this.sslDir, 'privatekey.pem'));
    }

    const certPath1 = path.join(this.gatewayDir, 'certificate.pem');
    const certPath2 = path.join(this.gatewayDir, 'ssl', 'certificate.pem');
    if (fs.existsSync(certPath1)) {
      this.renameFile(certPath1, path.join(this.sslDir, 'certificate.pem'));
    } else if (fs.existsSync(certPath2)) {
      this.renameFile(certPath2, path.join(this.sslDir, 'certificate.pem'));
    }

    const chainPath1 = path.join(this.gatewayDir, 'chain.pem');
    const chainPath2 = path.join(this.gatewayDir, 'ssl', 'chain.pem');
    if (fs.existsSync(chainPath1)) {
      this.renameFile(chainPath1, path.join(this.sslDir, 'chain.pem'));
    } else if (fs.existsSync(chainPath2)) {
      this.renameFile(chainPath2, path.join(this.sslDir, 'chain.pem'));
    }

    const csrPath1 = path.join(this.gatewayDir, 'csr.pem');
    const csrPath2 = path.join(this.gatewayDir, 'ssl', 'csr.pem');
    if (fs.existsSync(csrPath1)) {
      this.renameFile(csrPath1, path.join(this.sslDir, 'csr.pem'));
    } else if (fs.existsSync(csrPath2)) {
      this.renameFile(csrPath2, path.join(this.sslDir, 'csr.pem'));
    }

    const oldSslDir = path.join(this.gatewayDir, 'ssl');
    if (fs.existsSync(oldSslDir)) {
      rimraf.sync(oldSslDir, (err) => {
        if (err) {
          throw err;
        }
      });
    }

    // Move old uploads, if necessary.
    const oldUploadsDir = path.join(this.gatewayDir, 'static', 'uploads');
    if (fs.existsSync(oldUploadsDir) &&
      fs.lstatSync(oldUploadsDir).isDirectory()) {
      const fnames = fs.readdirSync(oldUploadsDir);
      for (const fname of fnames) {
        this.renameFile(
          path.join(oldUploadsDir, fname), path.join(this.uploadsDir, fname));
      }

      fs.rmdirSync(oldUploadsDir);
    }

    // Create a user config if one doesn't exist.
    const oldUserConfigPath = path.join(this.configDir, 'local.js');
    const oldLocalConfigPath = path.join(this.gatewayDir, 'config', 'local.js');
    const userConfigPath = path.join(this.configDir, 'local.json');

    if (!fs.existsSync(userConfigPath)) {
      if (fs.existsSync(oldUserConfigPath)) {
        const oldConfig = config.util.parseFile(oldUserConfigPath);
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

    const localConfig = config.util.parseFile(userConfigPath);
    if (localConfig) {
      config.util.extendDeep(config, localConfig);
    }

    // Move anything that exists in ~/mozilla-iot, such as certbot configs.
    const oldProfileDir = path.join(os.homedir(), 'mozilla-iot');
    const oldEtcDir = path.join(oldProfileDir, 'etc');
    if (fs.existsSync(oldEtcDir) && fs.lstatSync(oldEtcDir).isDirectory()) {
      pending.push(this.renameDir(oldEtcDir, path.join(this.baseDir, 'etc')));
    }
    const oldVarDir = path.join(oldProfileDir, 'var');
    if (fs.existsSync(oldVarDir) && fs.lstatSync(oldVarDir).isDirectory()) {
      pending.push(this.renameDir(oldVarDir, path.join(this.baseDir, 'var')));
    }

    // Move add-ons.
    if (process.env.NODE_ENV !== 'test') {
      const oldAddonsDir = path.join(this.gatewayDir, 'build', 'addons');
      if (fs.existsSync(oldAddonsDir) &&
        fs.lstatSync(oldAddonsDir).isDirectory()) {
        const fnames = fs.readdirSync(oldAddonsDir);
        for (const fname of fnames) {
          const oldFname = path.join(oldAddonsDir, fname);
          const newFname = path.join(this.addonsDir, fname);
          const lstat = fs.lstatSync(oldFname);

          if (fname !== 'plugin' && lstat.isDirectory()) {
            // Move existing add-ons.
            pending.push(this.renameDir(oldFname, newFname));
          }
        }
      }
    }
    return Promise.all(pending);
  },
};

module.exports = Profile;
