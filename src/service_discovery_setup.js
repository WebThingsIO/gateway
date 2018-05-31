/*
 * Things Gateway App.
 *
 * Back end main script.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// External dependencies
const dnssd = require('dnssd');
const config = require('config');
const Settings = require('./models/settings');
const TunnelService = require('./ssltunnel');

// Internal dependencies
const server = new DNSserviceDiscovery();

/**
 * Our DNS Service Discovery object.
 *
 * Creates an object which contains the 'profile' used to have a mDNS service
 * discovery process running. The object will be instantiated with default
 * values to ensure it will always work no matter DB or Config state.
 *
 * It provides methods to interact with the object. This object is created
 * quite early on since the starting process in app.js and parts of the UI in
 * settings_controller.js need to use its methods.
 *
 * @param {}
 */
function DNSserviceDiscovery() {
  this.serviceState = false;
  if (process.env.NODE_ENV === 'test') {
    this.port = 8080;
  } else if (TunnelService.hasCertificates()) {
    this.port = config.get('ports.https');
  } else {
    this.port = config.get('ports.http');
  }
  this.localDomain = config.get(
    'settings.defaults.domain.localControl.mdnsServiceDomain');
  this.localName = config.get(
    'settings.defaults.domain.localControl.mdnsServiceName');
  this.protocol = config.get(
    'settings.defaults.domain.localControl.mdnsTxt.protocol');
  this.power = config.get(
    'settings.defaults.domain.localControl.mdnsTxt.power');
  this.description = config.get(
    'settings.defaults.domain.localControl.mdnsTxt.desc');
  const txt = {desc: this.description,
               protocols: this.protocol,
               power: this.power};
  const options = {name: this.localName, host: this.localDomain, txt};

  // Initialize our object and make sure it's not started on object creations.
  this.dnssdHandle = dnssd.Advertisement(dnssd.tcp('http'), this.port, options);
  this.dnssdHandle.stop();
}

/**
 * A small helper method.
 *
 * Used to update the internal state of the mDNS service discovery.
 * Then restart it depending on the boolean 'state' parameter.
 *
 * @param {boolean}: True starts the broadcast service.
 *                   False stops the broadcast service
 */
DNSserviceDiscovery.prototype.startService = function(state) {
  this.serviceState = !!state;    // Make sure it's a boolean value
  if (this.serviceState) {
    this.dnssdHandle.start();
  } else {
    this.dnssdHandle.stop(true);
  }
  console.log(`Service Discover state changed to: ${this.serviceState}`);
};

/**
 * A small helper method.
 *
 * Used to update the local name of the mDNS service discovery. It does this
 * by updating it's localDomain name, stopping the old service and then
 * creating a new dnssd object. The DNS name must be < 63 chars [a-z,0-9]
 * and no hyphen on the first character.
 *
 * @param {string} local DNS name. e.g. 'Myhome-iot'
 */
DNSserviceDiscovery.prototype.setLocalDomain = function(localDomain) {
  // Check any letter or number a-Z,A-Z, 0-9 and '-' any number of times with
  // a length less than 63
  localDomain = localDomain.toLowerCase();
  const re = new RegExp(/^([a-z0-9]|[a-z0-9][a-z0-9-]*[a-z0-9])$/);
  const valid = re.test(localDomain) && localDomain.length <= 63;

  if (valid) {
    // Change our object data member, and stop the old service first.
    console.log(`Service Discover local Domain validity is: ${valid}`);
    console.log(`Service Discover localDomain changed to: ${localDomain} `);
    this.localDomain = localDomain;
    this.dnssdHandle.stop();

    // Now let's start a new service with the new name.
    const txt = {
      desc: this.description,
      protocols: this.protocol,
      power: this.power,
    };
    const options = {
      name: this.localName,
      host: this.localDomain,
      txt: txt,
    };

    this.dnssdHandle = dnssd.Advertisement(dnssd.tcp('http'),
                                           this.port, options);
  } else {
    console.error('Our Domain Name string did not match [a-z,A-Z,0-9,-].',
                  `We got: ${localDomain}`);
    throw new Error('Invalid local domain name. It should only consist ' +
                    'of characters a-Z, A-Z, 0-9, or- ');
  }
};

/**
 * changeProfile method.
 *
 * This method will take a new profile 'object' and use this to update
 * the objects internal variables. It then will create a new mDNS
 * advertiser object using the new profile and restart the advertiser
 * depending on the state of the DNSserviceDiscovery manager.
 *
 * @return
 *
 * @param {object} newProfile
 *          e.g newProfile = {
 *                             name: "Mozilla IoT Gateway",
 *                             host: "mozillaGateway",     // Local DNS name
 *                             txt: {
 *                               desc: "descriptive text",
 *                               protocols:  "http, https, oauth2 etc..",
 *                               power: "default power"
 *                             }
 *                           }
 */
DNSserviceDiscovery.prototype.changeProfile = function(newProfile) {
  try {
    console.log('Service Discovery is changing profile. The localDomain is',
                `changed to: ${newProfile.host}`);
    this.localName = newProfile.name;
    this.localDomain = newProfile.host;
    this.description = newProfile.txt.desc;
    this.protocol = newProfile.txt.protocols;
    this.power = newProfile.txt.power;

    const txt = {desc: this.description,
                 protocols: this.protocol,
                 power: this.power};
    const options = {name: this.localName,
                     host: this.localDomain,
                     txt: txt};

    this.dnssdHandle = dnssd.Advertisement(dnssd.tcp('http'),
                                           this.port, options);

    // Check to see if the profile should be active or not.
    if (this.serviceState) {
      this.dnssdHandle.start();
    } else {
      this.dnssdHandle.stop();
    }
  } catch (err) {
    // We should never get here. Don't attempt to start service discovery
    // and log an error message. But allow the application to carry on
    console.error('The service discovery services could not change profile',
                  `settings. The error is: ${err}`);
  }
};

/**
 * A small helper function.
 *
 * getmDNSconfig will look at settings that may be in the DB - set by
 * the user and default settings. It will safely return a profile that
 * will work for the calling application to use.
 *
 * @return: {Object} mDNS config options
 *          e.g Options = {
 *                          name: "Mozilla IoT Gateway",
 *                          host: "mozillaGateway",     // Local DNS name
 *                          txt: {
 *                            desc: "descriptive text",
 *                            protocols:  "http, https, oauth2 etc..",
 *                            power: "default power"
 *                          }
 *                        }
 * This function searches /config or db.sqlite3 DB
 *
 * @param {}
 */
async function getmDNSconfig() {
  let mDNSserviceDomain;

  try {
    mDNSserviceDomain = await Settings.get('localDNSname');

    // There is no local service discovery name stored in the DB -
    // use the default value
    if (!mDNSserviceDomain) {
      mDNSserviceDomain = config.get(
        'settings.defaults.domain.localControl.mdnsServiceDomain');
    }
    const locName = config.get(
      'settings.defaults.domain.localControl.mdnsServiceName');
    const locProtocols = config.get(
      'settings.defaults.domain.localControl.mdnsTxt.protocol');
    const powerCons = config.get(
      'settings.defaults.domain.localControl.mdnsTxt.power');
    const description = config.get(
      'settings.defaults.domain.localControl.mdnsTxt.desc');

    const txt = {desc: description, protocols: locProtocols, power: powerCons};
    const options = {name: locName, host: mDNSserviceDomain, txt: txt};

    return options;
  } catch (err) {
    // We should never get here. Don't attempt to start service discovery
    // and log an error message. But allow the application to carry on
    console.error('The service discovery services could not find',
                  `configuration settings. The error is: ${err}`);
  }
}

/**
 * A small helper function.
 *
 * @return: {boolean} 'True' if mDNS service discovery has a default or user
 * configured state requesting it to be started.
 * 'False' if default or user configured or no state if found.
 *
 * This function searches /config or db.sqlite3 DB
 *
 * @param {}
 */
async function getmDNSstate() {
  let mDNSstate;
  try {
    mDNSstate = await Settings.get('multicastDNSstate');
    if (typeof mDNSstate === 'undefined') {
      return config.get('settings.defaults.domain.localAccess');
    }
    return mDNSstate;
  } catch (err) {
    // Catch this DB error. Since we don't know what state the mDNS process
    // should be in make sure it's off
    console.error('Error getting DB entry for multicast DNS state from',
                  'the DB. Should be True or False:', err);

    return config.get('settings.defaults.domain.localAccess');
  }
}

module.exports = {
  server: server,
  getmDNSconfig: getmDNSconfig,
  getmDNSstate: getmDNSstate,
};
