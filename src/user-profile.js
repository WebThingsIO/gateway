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
    this.uploadDir = path.join(this.baseDir, 'uploads');
    this.gatewayDir = path.join(__dirname, '..');
  },

  migrate: function() {
    // Create all required profile directories.
    if (!fs.existsSync(this.configDir)) {
      mkdirp.sync(this.configDir);
    }
    if (!fs.existsSync(this.sslDir)) {
      mkdirp.sync(this.sslDir);
    }
    if (!fs.existsSync(this.uploadDir)) {
      mkdirp.sync(this.uploadDir);
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
    const oldUploadDir = path.join(this.gatewayDir, 'static', 'uploads');
    if (fs.existsSync(oldUploadDir) &&
        fs.lstatSync(oldUploadDir).isDirectory()) {
      const fnames = fs.readdirSync(oldUploadDir);
      for (const fname of fnames) {
        fs.renameSync(
          path.join(oldUploadDir, fname), path.join(this.uploadDir, fname));
      }

      fs.rmdirSync(oldUploadDir);
      fs.symlinkSync(this.uploadDir, oldUploadDir);
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
  },
};

module.exports = Profile;
