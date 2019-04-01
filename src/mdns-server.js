/*
 * mDNS service handler.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

// External dependencies
const config = require('config');
const dnssd = require('dnssd');

// Internal dependencies
const Platform = require('./platform');
const Settings = require('./models/settings');
const TunnelService = require('./ssltunnel');

/**
 * DNS Service Discovery object.
 *
 * Creates an object which contains the 'profile' used to have a mDNS service
 * discovery process running. The object will be instantiated with default
 * values to ensure it will always work no matter DB or Config state.
 *
 * It provides methods to interact with the object. This object is created
 * quite early on since the starting process in app.js and parts of the UI in
 * settings_controller.js need to use its methods.
 */
class DNSserviceDiscovery {
  constructor() {
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

    this.handleError = (e) => {
      console.debug(`mDNS error: ${e}`);
      setTimeout(() => {
        if (this.serviceState && this.dnssdHandle) {
          this.dnssdHandle.start();
        }
      }, 10000);
    };

    if (!Platform.implemented('setMdnsServerStatus')) {
      // Initialize our object and make sure it's not started on object creation
      this.dnssdHandle =
        dnssd.Advertisement(dnssd.tcp('http'), this.port, options);
      this.dnssdHandle.on('error', this.handleError);
      this.dnssdHandle.stop();
    }
  }

  /**
   * Update the internal state of the mDNS service discovery, then restart it if
   * necessary.
   *
   * @param {boolean} state Whether or not to enable the service.
   */
  setState(state) {
    this.serviceState = !!state;    // Make sure it's a boolean value

    let success = true;
    if (Platform.implemented('setMdnsServerStatus')) {
      success = Platform.setMdnsServerStatus(state);
    } else if (this.serviceState) {
      this.dnssdHandle.start();
    } else {
      this.dnssdHandle.stop(true);
    }

    if (success) {
      console.log(`Service Discovery: state changed to: ${this.serviceState}`);
    } else {
      console.error('Service Discovery: failed to change state');
    }
  }

  /**
   * Update the local name of the mDNS service discovery.
   *
   * Updating the localDomain name, stop the old service, and then create a new
   * dnssd object. The DNS name must be < 63 chars [a-z,0-9] and no hyphen as
   * the first character.
   *
   * @param {string} localDomain local DNS name. e.g. 'Myhome-iot'
   */
  setLocalDomain(localDomain) {
    // Check any letter or number a-Z, A-Z, 0-9 and '-' any number of times with
    // a length less than 63
    localDomain = localDomain.toLowerCase();
    const re = new RegExp(/^([a-z0-9]|[a-z0-9][a-z0-9-]*[a-z0-9])$/);
    const valid = re.test(localDomain) && localDomain.length <= 63;

    if (valid) {
      // Change our object data member and stop the old service first.
      this.localDomain = localDomain;

      let success = true;
      if (Platform.implemented('setHostname')) {
        success = Platform.setHostname(this.localDomain);
      } else if (!Platform.implemented('setMdnsServerStatus')) {
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
          txt,
        };

        this.dnssdHandle = dnssd.Advertisement(dnssd.tcp('http'),
                                               this.port, options);
        this.dnssdHandle.on('error', this.handleError);
        this.dnssdHandle.start();
      }

      if (success) {
        console.log(`Service Discovery: local domain changed to: ${localDomain}`);
      } else {
        console.error('Service Discovery: failed to set local domain');
      }
    } else {
      console.error('Service Discovery:',
                    `Domain name did not match [a-z,A-Z,0-9,-]+: ${localDomain}`);
      throw new Error('Invalid local domain name. It should only consist ' +
                      'of characters a-Z, A-Z, 0-9, or -');
    }
  }

  /**
   * This method will take a new profile 'object' and use this to update
   * the objects internal variables. It then will create a new mDNS
   * advertiser object using the new profile and restart the advertiser
   * depending on the state of the DNSserviceDiscovery manager.
   *
   * @return
   *
   * @param {object} newProfile For example:
   *   newProfile = {
   *     name: "WebThings Gateway",
   *     host: "gateway",     // Local DNS name
   *     txt: {
   *       desc: "descriptive text",
   *       protocols:  "http, https, oauth2 etc..",
   *       power: "default power"
   *     }
   *   }
   */
  changeProfile(newProfile) {
    try {
      console.log('Service Discovery: changing profile - local domain is now:',
                  newProfile.host);
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
                       txt};

      if (!Platform.implemented('setMdnsServerStatus')) {
        this.dnssdHandle = dnssd.Advertisement(dnssd.tcp('http'),
                                               this.port, options);
        this.dnssdHandle.on('error', this.handleError);

        // Check to see if the profile should be active or not.
        if (this.serviceState) {
          this.dnssdHandle.start();
        } else {
          this.dnssdHandle.stop();
        }
      }
    } catch (err) {
      // We should never get here. Don't attempt to start service discovery
      // and log an error message. But allow the application to carry on
      console.error(
        'Service Discovery: could not change profile settings:',
        err
      );
    }
  }

  /**
   * Stop the node mDNS service.
   */
  cleanup() {
    if (!Platform.implemented('setMdnsServerStatus') && this.dnssdHandle) {
      this.dnssdHandle.stop(true);
    }
  }
}

/**
 * Look at settings that may be in the DB (set by the user) or default settings.
 * It will safely return a profile that will work for the calling application to
 * use.
 *
 * @return: {Object} mDNS config options, for example:
 *   Options = {
 *     name: "WebThings Gateway",
 *     host: "gateway",     // Local DNS name
 *     txt: {
 *       desc: "descriptive text",
 *       protocols:  "http, https, oauth2 etc..",
 *       power: "default power"
 *     }
 *   }
 * This function searches /config or db.sqlite3 DB
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
    const options = {name: locName, host: mDNSserviceDomain, txt};

    return options;
  } catch (err) {
    // We should never get here. Don't attempt to start service discovery.
    // Just log an error message and allow the application to carry on.
    console.error('Service Discovery: could not find configuration settings:',
                  err);
  }
}

/**
 * Get the current enablement state of the mDNS service.
 *
 * @return: {boolean} 'True' if mDNS service discovery has a default or user
 * configured state requesting it to be started. 'False' if default or user
 * configured or no state if found.
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
    console.error(
      'Service Discovery: Error getting DB entry for multicast DNS state:',
      err);

    return config.get('settings.defaults.domain.localAccess');
  }
}

module.exports = {
  server: new DNSserviceDiscovery(),
  getmDNSconfig,
  getmDNSstate,
};
