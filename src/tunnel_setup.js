/**
 * Setup subdomain
 *
 * Implements the subdomain registration
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const config = require('config');
const fs = require('fs');
const path = require('path');
const Settings = require('./models/settings');
const UserProfile = require('./user-profile');

var TunnelSetup = {

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
            } else {
                // if there are no certs installed,
                // we display the cert setup page to the user
                response.render('tunnel_setup',
                                {
                                    domain: config.get('ssltunnel.domain'),
                                });
            }
        }
    },
};

module.exports = TunnelSetup;
