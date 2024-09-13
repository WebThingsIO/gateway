/**
 * Ubuntu platform interface.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import BasePlatform from './base';
import DBus from 'dbus';
import {LanMode} from './types';

class LinuxUbuntuPlatform extends BasePlatform {

  systemBus = DBus.getBus('system');

  /**
   * Get a list of network adapters from the system network manager.
   * 
   * @returns {Array} An array of DBus object paths.
   */
  private getDevices(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.systemBus.getInterface('org.freedesktop.NetworkManager',
        '/org/freedesktop/NetworkManager',
        'org.freedesktop.NetworkManager',
        function(error, iface) {
        if (error) {
          console.error('Error accessing the NetworkManager DBus interface: ' + error);
          reject();
        }
        iface.GetAllDevices(function(error: Error, result: string[]) {
          if (error) {
            console.error('Error calling GetAllDevices on NetworkManager DBus: ' + error);
            reject();
          }
          resolve(result);
        });
      });
    });
  }

  /**
   * Get the device type for a given network adapter.
   *
   * @param {String} path Object path for device.
   * @returns {Promise<Integer>} Resolves with a device type
   *  (1 is Ethernet, 2 is Wi-Fi...).
   */
  private getDeviceType(path: string) {
    return new Promise((resolve, reject) => {
      this.systemBus.getInterface('org.freedesktop.NetworkManager',
        path,
        'org.freedesktop.NetworkManager.Device',
        function(error, iface) {
        if (error) {
          console.error(error);
          reject();
        }
        iface.getProperty('DeviceType', function(error, value) {
          if (error) {
            console.error(error);
            reject();
          }
          resolve(value);
        });
      });
    });
  }

  /**
   * Get a list of network Ethernet adapters from the system network manager.
   * 
   * @returns {Promise<Array<string>>} A promise which resolves with an array 
   *  of DBus object paths.
   */
  private async getEthernetDevices(): Promise<string[]> {
    // Get a list of all network adapter devices
    let devices = await this.getDevices();
    let ethernetDevices: string[] = [];
    // Filter by type
    for (const device of devices) {
      const type = await this.getDeviceType(device);
      if (type == 1) {
        ethernetDevices.push(device);
      }
    }
    return ethernetDevices;
  }

  /**
   * Get the active connection associated with a device.
   *
   * @param {String} path Object path for device.
   * @returns {Promise<String>} Resolves with object path of the active 
   *  connection object associated with this device.
   */
  private getDeviceConnection(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const systemBus = this.systemBus;
      systemBus.getInterface('org.freedesktop.NetworkManager',
        path,
        'org.freedesktop.NetworkManager.Device',
        function(error, iface) {
        if (error) {
          console.error(error);
          reject();
        }
        iface.getProperty('ActiveConnection', function(error, activeConnectionPath) {
          if (error) {
            console.error(error);
            reject();
          }
          systemBus.getInterface('org.freedesktop.NetworkManager',
            activeConnectionPath,
            'org.freedesktop.NetworkManager.Connection.Active',
            function(error, iface) {
            if (error) {
              console.error(error);
              reject();
            }
            iface.getProperty('Connection', function(error, value) {
              if (error) {
                console.error(error);
                reject();
              }
              resolve(value);
            });
          });
        });
      });
    });
  }

  /**
   * Get the settings for a given connection.
   *
   * @param {String} path Object path for a connection settings profile.
   * @returns {Promise<any>} Resolves with the settings of a connection.
   */
  private getConnectionSettings(path: string) {
    return new Promise((resolve, reject) => {
      this.systemBus.getInterface('org.freedesktop.NetworkManager',
        path,
        'org.freedesktop.NetworkManager.Settings.Connection',
        function(error, iface) {
        if (error) {
          console.error(error);
          reject();
        }
        iface.GetSettings(function(error: Error, value: any) {
          if (error) {
            console.error(error);
            reject();
          }
          resolve(value);
        });
      });
    });
  }

  /**
   * Get the LAN mode and options.
   *
   * @returns {Promise<LanMode>} Promise that resolves with 
   *   {mode: 'static|dhcp|...', options: {...}}
   */
  async getLanModeAsync(): Promise<LanMode> {
    let result: LanMode = {
      mode: '',
      options: {}
    };
    return this.getEthernetDevices().then((devices) => {
      return this.getDeviceConnection(devices[0]);
    }).then((connection) => {
      return this.getConnectionSettings(connection);
    }).then((settings: any) => {
      if(settings.ipv4.method == 'auto') {
        result.mode = 'dhcp';
      } else if(settings.ipv4.method == 'manual') {
        result.mode = 'static';
      }
      return result;
    }).catch((error) => {
      console.error('Error getting LAN mode from Network Manager: ' + error);
      // TODO: Throw error instead?
      return result;
    });
  }

  // Currently unused code...

  /**
   * Get the path to the IPv4 configuration for a given network adapter.
   *
   * @param {String} path Object path for a device.
   * @returns {Promise<string>} Promise resolves with path to configuration object.
   */
  /*getDeviceIp4ConfigPath(path: string) {
    return new Promise((resolve, reject) => {
      this.systemBus.getInterface('org.freedesktop.NetworkManager',
        path,
        'org.freedesktop.NetworkManager.Device',
        function(error, iface) {
        if (error) {
          console.error(error);
          reject();
        }
        iface.getProperty('Ip4Config', function(error, value) {
          if (error) {
            console.error(error);
            reject();
          }
          resolve(value);
        });
      });
    });
  }*/

  /**
   * Get the DHCP configuration for a given network adapter.
   *
   * @param {String} path Object path for device.
   * @returns {Promise<any>} Promise resolves with configuration.
   */
  /*getDeviceDHCP4Config(path: string) {
    return new Promise((resolve, reject) => {
      let systemBus = this.systemBus;
      systemBus.getInterface('org.freedesktop.NetworkManager',
        path,
        'org.freedesktop.NetworkManager.Device',
        function(error, iface) {
        if (error) {
          console.error(error);
          reject();
        }
        iface.getProperty('Dhcp4Config', function(error, dhcpPath) {
          if (error) {
            console.error(error);
            reject();
          }
          systemBus.getInterface('org.freedesktop.NetworkManager',
            dhcpPath,
            'org.freedesktop.NetworkManager.DHCP4Config',
            function(error, iface) {
            if (error) {
              console.error(error);
              reject();
            }
            iface.getProperty('Options', function(error, value) {
              if (error) {
                console.error(error);
                reject();
              }
              resolve(value);
            });
          });
        });
      });
    });
  }*/

  /**
   * Get a list of network connection configurations from the system network manager.
   * 
   * @returns {Array} An array of DBus object paths for connection configurations.
   */
  /*listConnections(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.systemBus.getInterface('org.freedesktop.NetworkManager',
        '/org/freedesktop/NetworkManager/Settings',
        'org.freedesktop.NetworkManager.Settings',
        function(error, iface) {
        if (error) {
          console.error('Error accessing the NetworkManager Settings DBus interface: ' + error);
          reject();
        }
        iface.ListConnections(function(error: Error, result: string[]) {
          if (error) {
            console.error('Error calling ListConnections on NetworkManager Settings DBus interface: ' + error);
            reject();
          }
          resolve(result);
        });
      });
    });
  }*/

  // Testing...
  /*getLanMode(): LanMode {
    this.getEthernetDevices().then((devices) => {
      return this.getDeviceConnection(devices[0]);
    }).then((connection) => {
      return this.getConnectionSettings(connection);
    }).then((settings) => {
      console.log('Connection settings for eth0 are probably:');
      console.dir(settings);
    });

    return {
      mode: 'dhcp',
      options: {}
    }
  }*/
}

export default new LinuxUbuntuPlatform();
