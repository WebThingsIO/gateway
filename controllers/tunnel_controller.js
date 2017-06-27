/**
 * Tunnel Controller.
 *
 * Manages tunnel controller actions
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

/* jshint unused:false */

const express = require('express');
const greenlock = require('greenlock');
const leChallengeDns = require('le-challenge-dns').create({ debug: false })
const config = require('config');
const fetch = require('node-fetch');
const fs = require('fs');
const TunnelService = require('../ssltunnel');

var SettingsController = express.Router();

SettingsController.post('/subscribe', function (request, response) {

    let email = request.body.email;
    let subdomain = request.body.subdomain;
    let fulldomain =  subdomain + '.' + config.get('ssltunnel.domain');

    function returnError(message){
      response.statusMessage = 'Error issuing certificate - ' + message;
      response.status(400).end();
    }
    // function to automatically agree and accept the ToS
    function leAgree(opts, agreeCb) { agreeCb(null, opts.tosUrl); }
    let leStore = require('le-store-certbot').create({
        configDir: null,
        debug: true,
        logsDir: null
    });
    let le = greenlock.create({
        server: greenlock.productionServerUrl,
        challengeType: 'dns-01',
        challenges: { 'dns-01': leChallengeDns },
        approveDomains: [fulldomain],
        agreeToTerms: leAgree,
        debug: true,
        store: leStore
    });

    let token;
    // promise to be resolved when LE has the dns challenge ready for us
    leChallengeDns.leDnsResponse = function(challenge, keyAuthorization,
                                            keyAuthDigest){
        return new Promise((resolve) => {
            // ok now that we have a challenge, we call our gateway to setup
            // the TXT record
            fetch('http://' + config.get('ssltunnel.registration_endpoint') +
                '/dnsconfig?token=' + token + '&challenge=' + keyAuthDigest)
                .catch(function(e) {
                    returnError(e);
                })
                .then(function(res) {
                    return res.text();
                })
                .then(function() {
                    resolve('Success!');
                });
        });
    }

    fetch('http://' + config.get('ssltunnel.registration_endpoint')
        + '/subscribe?name=' + subdomain)
        .then(function (res) {
            return res.text();
        })
        .then(function (body) {
            const jsonToken = JSON.parse(body);
            if (jsonToken.error) {
                returnError(jsonToken.error);
            } else {
                // store the token in the db
                token = jsonToken.token;
                fs.writeFileSync('tunneltoken', JSON.stringify(jsonToken));
                // Register Let's Encrypt
                le.register({
                    domains: [fulldomain],
                    email: email,
                    agreeTos: true,
                    rsaKeySize: 2048,
                    challengeType: 'dns-01'
                }).then(function (results) {
                    console.log('success', results);
                    // ok. we got the certificates. let's save them
                    fs.writeFileSync('certificate.pem', results.cert);
                    fs.writeFileSync('privatekey.pem', results.privkey);
                    let endpoint_url = 'https://' + subdomain + '.' +
                        config.get('ssltunnel.domain');
                    TunnelService.start(response, endpoint_url);
                    TunnelService.switchToHttps();
                }, function (err) {
                    returnError(err.detail ||
                        err.message.substring(0,err.message.indexOf('\n')));
                });
            }
        })
        .catch(function(e) {
            returnError(e);
        });
});

SettingsController.post('/skiptunnel', function (request, response) {
    fs.writeFileSync('notunnel');
    response.status(200).end();
});


SettingsController.get('/tunnelinfo', function (request, response) {
    if (fs.existsSync('tunneltoken')){
        let tunneltoken = JSON.parse(fs.readFileSync('tunneltoken'));
        let endpoint = 'https://' + tunneltoken.name + '.' +
            config.get('ssltunnel.domain') + ':4443';
        response.send(endpoint);
        response.status(200).end();
    } else {
        response.status(404).end();
    }
});

module.exports = SettingsController;
