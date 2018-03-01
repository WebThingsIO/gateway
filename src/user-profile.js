/**
 * Things Gateway user profile.
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

const config = require('config');
const fs = require('fs');
const path = require('path');
const os = require('os');
const mkdirp = require('mkdirp');
const db = require('./db');
const Settings = require('./models/settings');

const Profile = {
  init: function() {
    this.baseDir = config.get('profileDir');
    this.configDir = path.join(this.baseDir, 'config');
    this.sslDir = path.join(this.baseDir, 'ssl');
    this.uploadsDir = path.join(this.baseDir, 'uploads');
    this.logDir = path.join(this.baseDir, 'log');
    this.gatewayDir = path.join(__dirname, '..');

    if (process.env.NODE_ENV === 'test') {
      this.addonsDir = path.join(this.gatewayDir, 'src', 'addons-test');
    } else {
      this.addonsDir = path.join(this.baseDir, 'addons');
    }
  },

  migrate: function() {
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
      fs.renameSync(oldDbPath, dbPath);
    }

    // Open the database.
    db.open();

    // Move the tunneltoken into the database.
    const ttPath = path.join(this.gatewayDir, 'tunneltoken');
    if (fs.existsSync(ttPath)) {
      const token = JSON.parse(fs.readFileSync(ttPath));
      Settings.set('tunneltoken', token).then(() => {
        fs.unlinkSync(ttPath);
      }).catch((e) => {
        throw e;
      });
    }

    // Move the notunnel setting into the database.
    const ntPath = path.join(this.gatewayDir, 'notunnel');
    if (fs.existsSync(ntPath)) {
      Settings.set('notunnel', true).then(() => {
        fs.unlinkSync(ntPath);
      }).catch((e) => {
        throw e;
      });
    }

    // Move certificates, if necessary.
    const pkPath1 = path.join(this.gatewayDir, 'privatekey.pem');
    const pkPath2 = path.join(this.gatewayDir, 'ssl', 'privatekey.pem');
    if (fs.existsSync(pkPath1)) {
      fs.renameSync(pkPath1, path.join(this.sslDir, 'privatekey.pem'));
    } else if (fs.existsSync(pkPath2)) {
      fs.renameSync(pkPath2, path.join(this.sslDir, 'privatekey.pem'));
    }

    const certPath1 = path.join(this.gatewayDir, 'certificate.pem');
    const certPath2 = path.join(this.gatewayDir, 'ssl', 'certificate.pem');
    if (fs.existsSync(certPath1)) {
      fs.renamesync(certPath1, path.join(this.sslDir, 'certificate.pem'));
    } else if (fs.existsSync(certPath2)) {
      fs.renameSync(certPath2, path.join(this.sslDir, 'certificate.pem'));
    }

    const chainPath1 = path.join(this.gatewayDir, 'chain.pem');
    const chainPath2 = path.join(this.gatewayDir, 'ssl', 'chain.pem');
    if (fs.existsSync(chainPath1)) {
      fs.renameSync(chainPath1, path.join(this.sslDir, 'chain.pem'));
    } else if (fs.existsSync(chainPath2)) {
      fs.renameSync(chainPath2, path.join(this.sslDir, 'chain.pem'));
    }

    const csrPath1 = path.join(this.gatewayDir, 'csr.pem');
    const csrPath2 = path.join(this.gatewayDir, 'ssl', 'csr.pem');
    if (fs.existsSync(csrPath1)) {
      fs.renameSync(csrPath1, path.join(this.sslDir, 'csr.pem'));
    } else if (fs.existsSync(csrPath2)) {
      fs.renameSync(csrPath2, path.join(this.sslDir, 'csr.pem'));
    }

    const oldSslDir = path.join(this.gatewayDir, 'ssl');
    if (fs.existsSync(oldSslDir)) {
      fs.rmdirSync(oldSslDir);
    }

    // Move old uploads, if necessary.
    const oldUploadsDir = path.join(this.gatewayDir, 'static', 'uploads');
    if (fs.existsSync(oldUploadsDir) &&
        fs.lstatSync(oldUploadsDir).isDirectory()) {
      const fnames = fs.readdirSync(oldUploadsDir);
      for (const fname of fnames) {
        fs.renameSync(
          path.join(oldUploadsDir, fname), path.join(this.uploadsDir, fname));
      }

      fs.rmdirSync(oldUploadsDir);
      fs.symlinkSync(this.uploadsDir, oldUploadsDir);
    }

    // Create a user config if one doesn't exist.
    const userConfigPath = path.join(this.configDir, 'local.js');
    if (!fs.existsSync(userConfigPath)) {
      fs.writeFileSync(
        userConfigPath, '\'use strict\';\n\nmodule.exports = {\n};');
    }

    const localConfigPath = path.join(this.gatewayDir, 'config', 'local.js');
    if (!fs.existsSync(localConfigPath)) {
      fs.symlinkSync(userConfigPath, localConfigPath);
    }

    // Move anything that exists in ~/mozilla-iot, such as certbot configs.
    const oldProfileDir = path.join(os.homedir(), 'mozilla-iot');
    if (fs.existsSync(oldProfileDir) &&
        fs.lstatSync(oldProfileDir).isDirectory()) {
      const fnames = fs.readdirSync(oldProfileDir);
      for (const fname of fnames) {
        fs.renameSync(
          path.join(oldProfileDir, fname), path.join(this.baseDir, fname));
      }

      fs.rmdirSync(oldProfileDir);
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
            fs.renameSync(oldFname, newFname);
          } else if (fname.endsWith('.js') && lstat.isFile()) {
            // Symlink dependencies.
            if (!fs.lstatSync(newFname).isSymbolicLink()) {
              fs.symlinkSync(oldFname, newFname);
            }
          }
        }
      }
    }
  },
};

module.exports = Profile;
