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
var spawnSync = require('child_process').spawn;

var TunnelService = {

    pagekiteProcess: null,
    tunneltoken: null,
    switchToHttps: null,

    // method that starts the client if the box has a registered tunnel
    start: function(response, urlredirect) {
        let tunneltoken = JSON.parse(fs.readFileSync('tunneltoken'));
        let endpoint = tunneltoken.name + '.' + config.get('ssltunnel.domain');
        this.pagekiteProcess  =
            spawnSync(config.get('ssltunnel.pagekite_cmd'),
                ['--clean', '--frontend=' + endpoint + ':' +
                    config.get('ssltunnel.port'),
                    '--service_on=https:' + endpoint +
                    ':localhost:'+config.get('ports.https')+':moziot']);
        // TODO: we should replace the hardcoded secret by the token after
        // change the server
        this.pagekiteProcess.stdout.on('data', (data) => {
            console.log(`[pagekite] stdout: ${data}`);
            if (response) {
                if (data.indexOf('err=Error in connect') > -1) {
                    response.status(400).end();
                } else if (data.indexOf('connect=') > -1) {
                    response.send(urlredirect);
                    response.status(200).end();
                }
            }
        });
        this.pagekiteProcess.on('data', (data) => {
            console.log(`[pagekite] stderr: ${data}`);
        });
        this.pagekiteProcess.on('close', (code) => {
          console.log(`[pagekite] process exited with code ${code}`);
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
        return fs.existsSync('./certificate.pem') &&
            fs.existsSync('./privatekey.pem');
    },

    // method to check if the box has a registered tunnel
    hasTunnelToken: function() {
        return fs.existsSync('./tunneltoken');
    },

    // method to check if user skipped the sl tunnel setup
    userSkipped: function() {
         return fs.existsSync('./notunnel');
    }
}

module.exports = TunnelService;
