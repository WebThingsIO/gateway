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

import config from 'config';
import path from 'path';

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


export default UserProfile;
