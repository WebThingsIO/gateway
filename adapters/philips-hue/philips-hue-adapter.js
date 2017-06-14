/**
 *
 * PhilipsHueAdapter - an adapter for controlling TP-Link Smart Lights
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

var Adapter = require('../adapter');
var Device = require('../device');
var Property = require('../property');
var rp = require('request-promise-native');
var storage = require('node-persist');

const THING_TYPE_ON_OFF_SWITCH = 'onOffSwitch';
const KNOWN_BRIDGE_USERNAMES = 'PhilipsHueAdapter.knownBridgeUsernames';

/**
 * Property of a light bulb
 * Boolean on/off or numerical hue, sat(uration), or bri(ghtness)
 */
class PhilipsHueProperty extends Property {
  constructor(device, name, type, value) {
    super(device, name, type);
    this.setCachedValue(value);
  }

  /**
   * @param {boolean|number} value
   * @return {Promise} a promise which resolves to the updated value.
   */
  setValue(value) {
    return new Promise((resolve, reject) => {
      this.setCachedValue(value);
      resolve(this.value);
      this.device.notifyPropertyChanged(this);
    });
  }
}

/**
 * A Philips Hue light bulb
 */
class PhilipsHueDevice extends Device {
  /**
   * @param {PhilipsHueAdapter} adapter
   * @param {String} id - A globally unique identifier
   * @param {String} lightId - id of the light expected by the bridge API
   * @param {Object} light - the light API object
   */
  constructor(adapter, id, lightId, light) {
    super(adapter, id);

    this.lightId = lightId;
    this.name = light.name;

    this.type = THING_TYPE_ON_OFF_SWITCH;
    this.properties.set('on', new PhilipsHueProperty(this, 'on', 'boolean',
                        light.state.on));

    this.adapter.handleDeviceAdded(this);
  }

  /**
   * When a property changes notify the Adapter to communicate with the bridge
   * @param {PhilipsHueProperty} property
   */
  notifyPropertyChanged(property) {
    super.notifyPropertyChanged(property);
    var on = this.properties.get('on').value;
    this.adapter.sendProperties(this.lightId, {on: on});
  }
}

/**
 * Philips Hue Bridge Adapter
 * Instantiates one PhilipsHueDevice per light
 * Handles the username acquisition (pairing) process
 */
class PhilipsHueAdapter extends Adapter {
  constructor(adapterManager, bridge) {
    super(adapterManager, 'philips-hue');

    this.username = null;
    this.bridge = bridge;
    this.bridgeIp = bridge.internalipaddress;
    this.pairing = false;
    this.lights = {};

    adapterManager.addAdapter(this);

    storage.init().then(() => {
      return storage.getItem(KNOWN_BRIDGE_USERNAMES);
    }).then(knownBridgeUsernames => {
      if (!knownBridgeUsernames) {
        return Promise.reject('no known bridges');
      }

      var username = knownBridgeUsernames[this.bridge.id];
      if (!username) {
        return Promise.reject('no known username');
      }
      this.username = username;
      this.discoverLights();
    }).catch(e => {
      console.error('philips-hue-adapter storage error:', e);
    });
  }

  /**
   * If we don't have a username try to acquire one from the bridge
   * @param {number} timeoutSeconds
   */
  startPairing(timeoutSeconds) {
    this.pairing = true;
    var endTime = Date.now() + timeoutSeconds * 1000;

    var attemptPairing = () => {
      this.pair().then(username => {
        this.username = username;
        return this.discoverLights();
      }).then(() => {
        return storage.init();
      }).then(() => {
        return storage.getItem(KNOWN_BRIDGE_USERNAMES);
      }).then(knownBridgeUsernames => {
        if (!knownBridgeUsernames) {
          knownBridgeUsernames = {};
        }
        knownBridgeUsernames[this.bridge.id] = this.username;
        return storage.setItem(KNOWN_BRIDGE_USERNAMES, knownBridgeUsernames);
      }).catch(e => {
        console.error('philips-hue-adapter pairing error:', e);
        if (this.pairing && Date.now() < endTime) {
          // Attempt pairing again later
          setTimeout(attemptPairing, 500);
        }
      });
    };

    attemptPairing();
  }

  /**
   * Perform a single attempt at pairing
   * @return {Promise} Resolved with username if pairing succeeds
   */
  pair() {
    if (this.username) {
      return Promise.resolve(this.username);
    }

    return rp({
      uri: 'http://' + this.bridgeIp + '/api',
      method: 'POST',
      body: '{"devicetype":"mozilla_gateway#PhilipsHueAdapter"}'
    }).then(replyRaw => {
      var reply = null;
      try {
        reply = JSON.parse(replyRaw);
      } catch(e) {
        return Promise.reject(e);
      }

      if (!reply || reply.length === 0) {
        return Promise.reject('empty response from bridge');
      }

      var msg = reply[0];
      if (msg.error) {
        return Promise.reject(msg.error);
      }

      return msg.success.username;
    });
  }

  cancelPairing() {
    this.pairing = false;
  }

  /**
   * Discovers lights known to bridge, instantiating one PhilipsHueDevice per
   * light
   * @return {Promise}
   */
  discoverLights() {
    if (!this.username) {
      return Promise.reject('missing username');
    }

    return rp({
      uri: 'http://' + this.bridgeIp + '/api/' + this.username + '/lights',
      json: true
    }).then(lights => {
      // TODO(hobinjk): dynamically remove lights
      for (var lightId in lights) {
        if (this.lights[lightId]) {
          continue;
        }
        var light = lights[lightId];
        var id = 'philips-hue-' + this.bridge.id + '-' + lightId;
        this.lights[lightId] = new PhilipsHueDevice(this, id, lightId, light);
      }
    });
  }

  /**
   * Update the state of a light
   * @param {String} lightId - Id of light usually from 1-n
   * @param {{on: boolean, bri: number, hue: number, sat: number}}
   *        properties - Updated properties of light to be sent
   * @return {Promise}
   */
  sendProperties(lightId, properties) {
    var uri = 'http://' + this.bridgeIp + '/api/' + this.username +
              '/lights/' + lightId + '/state';
    return rp({
      uri: uri,
      method: 'PUT',
      json: true,
      body: properties
    }).catch(e => {
      console.error('philips-hue-adapter error:', e);
    });
  }
}

module.exports = PhilipsHueAdapter;

