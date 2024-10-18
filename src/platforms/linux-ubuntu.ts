/**
 * Ubuntu platform interface.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import BasePlatform from './base';
import DBus from 'dbus';
import ipRegex from 'ip-regex';
import {LanMode, NetworkAddresses, WirelessNetwork} from './types';
let Netmask = require('netmask').Netmask;

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
          return;
        }
        iface.GetAllDevices(function(error: Error, result: string[]) {
          if (error) {
            console.error('Error calling GetAllDevices on NetworkManager DBus: ' + error);
            reject();
            return;
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
          return;
        }
        iface.getProperty('DeviceType', function(error, value) {
          if (error) {
            console.error(error);
            reject();
            return;
          }
          resolve(value);
        });
      });
    });
  }

  /**
   * Get a list of Ethernet network adapters from the system network manager.
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
   * Get a list of Wi-Fi network adapters from the system network manager.
   * 
   * @returns {Promise<Array<string>>} A promise which resolves with an array 
   *  of DBus object paths.
   */
  private async getWifiDevices(): Promise<string[]> {
    // Get a list of all network adapter devices
    let devices = await this.getDevices();
    let wifiDevices: string[] = [];
    // Filter by type
    for (const device of devices) {
      const type = await this.getDeviceType(device);
      if (type == 2) {
        wifiDevices.push(device);
      }
    }
    return wifiDevices;
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
          return;
        }
        iface.getProperty('ActiveConnection', function(error, activeConnectionPath) {
          if (error) {
            console.error(error);
            reject();
            return;
          }
          systemBus.getInterface('org.freedesktop.NetworkManager',
            activeConnectionPath,
            'org.freedesktop.NetworkManager.Connection.Active',
            function(error, iface) {
            if (error) {
              console.error(error);
              reject();
              return;
            }
            iface.getProperty('Connection', function(error, value) {
              if (error) {
                console.error(error);
                reject();
                return;
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
  private getConnectionSettings(path: string): Promise<Record<string, any>> {
    return new Promise((resolve, reject) => {
      this.systemBus.getInterface('org.freedesktop.NetworkManager',
        path,
        'org.freedesktop.NetworkManager.Settings.Connection',
        function(error, iface) {
        if (error) {
          console.error(error);
          reject();
          return;
        }
        iface.GetSettings(function(error: Error, value: any) {
          if (error) {
            console.error(error);
            reject();
            return;
          }
          resolve(value);
        });
      });
    });
  }

  private setConnectionSettings(path: string, settings: Record<string, any>): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.systemBus.getInterface('org.freedesktop.NetworkManager',
        path,
        'org.freedesktop.NetworkManager.Settings.Connection',
        function(error, iface) {
        if (error) {
          console.error(error);
          reject();
          return;
        }
        iface.Update(settings, function(error: Error) {
          if (error) {
            console.error(error);
            reject();
            return;
          }
          resolve(true);
        });
      });
    });
  }

  /**
   * Get an IPv4 configuration for a given device path.
   *
   * @param {String} path Object path for a device.
   * @returns {Promise<IP4Config>} Promise resolves with IP4Config object.
   */
  private getDeviceIp4Config(path: string): Promise<any> {
    const systemBus = this.systemBus;
    return new Promise((resolve, reject) => {
      systemBus.getInterface('org.freedesktop.NetworkManager',
        path,
        'org.freedesktop.NetworkManager.Device',
        function(error, iface) {
        if (error) {
          console.error(error);
          reject();
          return;
        }
        iface.getProperty('Ip4Config', function(error, ip4ConfigPath) {
          if (error) {
            console.error(error);
            reject();
            return;
          }
          systemBus.getInterface('org.freedesktop.NetworkManager',
            ip4ConfigPath,
            'org.freedesktop.NetworkManager.IP4Config',
            function(error, iface) {
            if (error) {
              console.error(error);
              reject();
              return;
            }
            iface.getProperty('AddressData', function(error, value) {
              if (error) {
                console.error(error);
                reject();
                return;
              }
              resolve(value);
            });
          });
        });
      });
    });
  }

  /**
   * Get the SSID of the Wi-Fi access point with a given DBUS object path.
   * 
   * @param {string} path DBUS object path of the Wi-Fi access point.
   * @returns {Promise<string>} The SSID of the access point.
   */
  private getAccessPointSsid(path: string): Promise<string> {
    const systemBus = this.systemBus;
    return new Promise((resolve, reject) => {
      systemBus.getInterface('org.freedesktop.NetworkManager',
        path,
        'org.freedesktop.NetworkManager.AccessPoint',
        function(error, iface) {
          if(error) {
            console.error(error);
            reject();
            return;
          }
          iface.getProperty('Ssid', function(error, value: any) {
            if(error) {
              console.error(error);
              reject();
              return;
            }
            // Convert SSID from byte array to string.
            let ssid = String.fromCharCode(...value);
            resolve(ssid);
          });
        }
    )
    });
  }

  /**
   * Get the signal strength of the Wi-Fi access point with a given DBUS object path.
   * 
   * @param {string} path DBUS object path of the Wi-Fi access point.
   * @returns {Promise<number>} The strength of the signal as a percentage.
   */
  private getAccessPointStrength(path: string): Promise<number> {
    const systemBus = this.systemBus;
    return new Promise((resolve, reject) => {
      systemBus.getInterface('org.freedesktop.NetworkManager',
        path,
        'org.freedesktop.NetworkManager.AccessPoint',
        function(error, iface) {
          if(error) {
            console.error(error);
            reject();
            return;
          }
          iface.getProperty('Strength', function(error, value: any) {
            if(error) {
              console.error(error);
              reject();
              return;
            }
            resolve(value);
          });
        }
    )});
  }

  /**
   * Gets the encryption status of the Wi-Fi access point with a given DBUS object path.
   * 
   * @param {string} path DBUS object path of the Wi-Fi access point.
   * @returns {Promise<boolean>} true if encrypted, false if not.
   */
  private async getAccessPointSecurity(path: string): Promise<boolean> {
    const systemBus = this.systemBus;
    const wpaFlagRequest = new Promise((resolve, reject) => {
      systemBus.getInterface('org.freedesktop.NetworkManager',
        path,
        'org.freedesktop.NetworkManager.AccessPoint',
        function(error, iface) {
          if(error) {
            console.error(error);
            reject();
            return;
          }
          iface.getProperty('WpaFlags', function(error, value: any) {
            if(error) {
              console.error(error);
              reject();
              return;
            }
            resolve(value);
          });
        }
    )});
    const wpa2FlagRequest = new Promise((resolve, reject) => {
      systemBus.getInterface('org.freedesktop.NetworkManager',
        path,
        'org.freedesktop.NetworkManager.AccessPoint',
        function(error, iface) {
          if(error) {
            console.error(error);
            reject();
            return;
          }
          iface.getProperty('RsnFlags', function(error, value: any) {
            if(error) {
              console.error(error);
              reject();
              return;
            }
            resolve(value);
          });
        }
    )});
    // Request WPA and WPA2 flags for access point.
    let requests = [];
    requests.push(wpaFlagRequest);
    requests.push(wpa2FlagRequest);
    let responses = await Promise.all(requests);
    if (responses[0] == 0 && responses[1] == 0) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Get details about an access point reachable from a wireless device.
   * 
   * @param {string} path The DBUS path of an access point.
   * @param {string|null} activeAccessPoint: The DBUS path of the active access point, if any.
   * @returns {WirelessNetwork} Wireless network object of the form:
   * {
   *   ssid: '...',
   *   quality: <number>,
   *   encryption: true|false,
   *   configured: true|false,
   *   connected: true| false
   * }
   * @throws {Error} Error if not able to get all access point details.
   */
  private async getAccessPointDetails(path: string, activeAccessPoint: string|null): Promise<WirelessNetwork> {
    let ssid: string;
    let strength: number;
    let security: boolean;
    let connected: boolean;
    if(path === activeAccessPoint) {
      connected = true;
    } else {
      connected = false;
    }
    try {
      ssid = await this.getAccessPointSsid(path);
      strength = await this.getAccessPointStrength(path);
      security = await this.getAccessPointSecurity(path);
    } catch(error) {
      console.error(error);
      throw new Error('Failed to get access point details');
    }
    let response = {
      'ssid': ssid,
      'quality': strength,
      'encryption': security,
      'configured': connected, // TODO: Figure out what this is actually meant to mean
      'connected': connected
    };
    // Resolve with access point details
    return response;
  }

  /**
   * Get the active Access Point a given Wi-Fi adapter is connected to.
   *
   * @param {String} path DBUS Object path for a Wi-Fi device.
   * @returns {Promise<string>} Promise resolves with the DBUS object path of an access point.
   */
  private getActiveAccessPoint(path: string): Promise<string> {
    const systemBus = this.systemBus;
    return new Promise((resolve, reject) => {
      systemBus.getInterface('org.freedesktop.NetworkManager',
        path,
        'org.freedesktop.NetworkManager.Device.Wireless',
        (error, iface) => {
        if (error) {
          console.error(error);
          reject();
          return;
        }
        iface.getProperty('ActiveAccessPoint', (error, accessPointPath) => {
          if (error) {
            console.log('Unable to detect a connected Wi-Fi access point');
            reject();
            return;
          }
          resolve(accessPointPath);
        });
      });
    });
  }

  /**
   * Get a list of access points for the wireless device at the given path.
   * 
   * @param {String} path The DBUS object path of a wireless device.
   * @returns {Promise<Array<string>>} An array of DBus object paths of Access Points.
   */
  private getWifiAccessPoints(path: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.systemBus.getInterface('org.freedesktop.NetworkManager',
        path,
        'org.freedesktop.NetworkManager.Device.Wireless',
        function(error, iface) {
        if (error) {
          console.error('Error getting a wireless device via NetworkManager: ' + error);
          reject();
          return;
        }
        iface.getProperty('AccessPoints', function(error: Error | null, result: any) {
          if (error) {
            console.error('Error getting AccessPoints from a wireless device: ' + error);
            reject();
            return;
          }
          resolve(result);
        });
      });
    });
  }

  /**
   * Get an access point DBUS object bath for a given SSID.
   * 
   * @param {string} ssid The SSID of the network to search for.
   * @returns {Promise<string>} A Promise which resolves with the DBUS object 
   *   path of the access point, or null if not found;
   */
  private async getAccessPointbySsid(ssid: string): Promise<string|null> {
    const wifiDevices = await this.getWifiDevices();
    const wifiAccessPoints = await this.getWifiAccessPoints(wifiDevices[0]);
    // Return the first access point that has a matching SSID
    // TODO: Deal with duplicates
    for (const accessPoint of wifiAccessPoints) {
      const accessPointSsid = await this.getAccessPointSsid(accessPoint);
      if (accessPointSsid == ssid) {
        return accessPoint;
      }
    }
    return null;
  }

  /**
   * Connect to Wi-Fi access point.
   *
   * @param {string} wifiDevice DBUS object path of wireless device to use.
   * @param {string} accessPoint DBUS object path of access point to connec to (e.g. 1)
   * @param {string} ssid SSID of access point to connect to.
   * @param {boolean} secure Whether or not authentication is provided.
   * @param {string} password provided by user.
   * @returns {Promise}
   */
  private connectToWifiAccessPoint(wifiDevice: string, accessPoint: string,
    ssid: string, secure: boolean, password: string): Promise<any> {
    const systemBus = this.systemBus;
    return new Promise((resolve, reject) => {
      systemBus.getInterface('org.freedesktop.NetworkManager',
        '/org/freedesktop/NetworkManager',
        'org.freedesktop.NetworkManager',
        (error, iface) => {

        if (error) {
          reject(error);
          return;
        }

        // Convert SSID to an array of bytes
        let ssidBytes = [];
        for (let i = 0; i < ssid.length; ++i) {
          ssidBytes.push(ssid.charCodeAt(i));
        }

        // Assemble connection information
        let connectionInfo: Record<string, unknown> = {
          '802-11-wireless': {
            ssid: ssidBytes,
          },
          'connection': {
            id: ssid,
            type: '802-11-wireless',
          }
        };

        if (secure) {
          connectionInfo['802-11-wireless-security'] = {
            'key-mgmt': 'wpa-psk',
            'psk': password,
          }
        }

        // TODO: Should we re-use an existing connection rather than add a new one
        // if one already exists?
        iface.AddAndActivateConnection(connectionInfo, wifiDevice,
          accessPoint, function(error: Error, value: any) {
          if (error) {
            reject(error);
            return;
          }
          resolve(value);
        });

      });
    });
  }

  /**
   * Disconnect a network device.
   * 
   * @param {string} path DBUS object path of device.
   * @returns {Promise<any>} A promise which resolves upon successful 
   *   deactivation or rejects on failure.
   */
  private disconnectNetworkDevice(path: string): Promise<any> {
    const systemBus = this.systemBus;
    return new Promise((resolve, reject) => {
      systemBus.getInterface('org.freedesktop.NetworkManager',
        path,
        'org.freedesktop.NetworkManager.Device',
        (error, iface) => {
          if (error) {
            reject(error);
            return;
          }
          iface.Disconnect(function(error: Error, value: any) {
            if (error) {
              reject(error);
              return;
            }
            resolve(value);
          });
      })
    });
  }

  /**
   * Get the current addresses for Wi-Fi and LAN.
   *
   * @returns {Promise<NetworkAddresses>} Promise that resolves with
   *   {
   *     lan: '...',
   *     wlan: {
   *      ip: '...',
   *      ssid: '...',
   *    }
   *  }
   */
  async getNetworkAddressesAsync(): Promise<NetworkAddresses> {
    let result: NetworkAddresses = {
      lan: '',
      wlan: {
        ip: '',
        ssid: ''
      }
    };
    try {
      const ethernetDevices = await this.getEthernetDevices();
      const ethernetIp4Config = await this.getDeviceIp4Config(ethernetDevices[0]);
      result.lan = ethernetIp4Config[0].address;
    } catch(error) {
        console.log('Unable to detect an Ethernet IP address');
    }
    try {
      const wifiDevices = await this.getWifiDevices();
      const wifiIp4Config = await this.getDeviceIp4Config(wifiDevices[0]);
      const accessPoint = await this.getActiveAccessPoint(wifiDevices[0]);
      const ssid = await this.getAccessPointSsid(accessPoint);
      result.wlan.ip = wifiIp4Config[0].address;
      result.wlan.ssid = ssid;
    } catch(error) {
      console.log('Unable to detect a Wi-Fi IP address and active SSID');
    }
    return result;
  }

  /**
   * Get LAN network settings.
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
      if(settings.ipv4['address-data'][0] && 
        settings.ipv4['address-data'][0].hasOwnProperty('address')) {
        result.options.ipaddr = settings.ipv4['address-data'][0].address;
      }
      if(settings.ipv4.hasOwnProperty('gateway')) {
        result.options.gateway = settings.ipv4.gateway;
      }
      if(result.options.ipaddr && 
        settings.ipv4['address-data'][0].hasOwnProperty('prefix')) {
        // Convert cidr style prefix to dot-decimal netmask
        const ip = result.options.ipaddr;
        const cidr = settings.ipv4['address-data'][0].prefix;
        const block = new Netmask(`${ip}/${cidr}`);
        result.options.netmask = block.mask;
      }
      return result;
    }).catch((error) => {
      console.error('Error getting LAN mode from Network Manager: ' + error);
      return result;
    });
  }

  /**
   * Set LAN network settings.
   *
   * @param {string} mode static|dhcp|....
   * @param {<Record<string, any>} options Mode-specific options.
   * @returns {Promise<boolean>} Promise that resolves true if successful and false if not.
   */
  async setLanModeAsync(mode: string, options: Record<string, any>): Promise<boolean> {
    let lanConnection: string;
    return this.getEthernetDevices().then((devices) => {
      return this.getDeviceConnection(devices[0]);
    }).then((connection) => {
      lanConnection = connection;
      // First get current settings to carry over some values
      return this.getConnectionSettings(lanConnection);
    }).then((oldSettings) => {
      let settings: Record<string, any> = {};
      // Carry over some values from the old settings
      settings.connection = {
        id: oldSettings.connection.id,
        uuid: oldSettings.connection.uuid,
        type: oldSettings.connection.type
      }
      if(mode == 'dhcp') {
        // Set dynamic IP
        settings.ipv4 = {
          method: 'auto'
        };
      } else if(mode == 'static') {
        const regex = ipRegex({ exact: true });
        if (
          !(options.hasOwnProperty('ipaddr') && regex.test(<string>options.ipaddr) &&
          options.hasOwnProperty('gateway') && regex.test(<string>options.gateway) &&
          options.hasOwnProperty('netmask') && regex.test(<string>options.netmask))) {
          console.log('Setting a static IP address requires a valid IP address, gateway and netmask');
          return false;
        }
        // Set static IP address
        // Convert dot-decimal netmask to cidr style prefix for storage
        const netmask = new Netmask(options.ipaddr, options.netmask);
        const prefix = netmask.bitmask;
        // Convert dot-decimal IP and gateway to little endian integers for storage
        const ipaddrInt = options.ipaddr.split('.').reverse().reduce(function(int: any, value: any) { return int * 256 + +value });
        const gatewayInt = options.gateway.split('.').reverse().reduce(function(int: any, value: any) { return int * 256 + +value });
        settings.ipv4 = {
          'method': 'manual',
          'addresses': [
            [ipaddrInt, prefix, gatewayInt]
          ],
          // The NetworkManager docs say that the addresses property is deprecated,
          // but using address-data and gateway doesn't seem to work on Ubuntu yet.
          /*'address-data': [{
            'address': options.ipaddr,
            'prefix': prefix
          }],
          'gateway': options.gateway*/
        }
      } else {
        console.error('LAN mode not recognised');
        return false;
      }
      return this.setConnectionSettings(lanConnection, settings);
    }).catch((error) => {
      console.error('Error setting LAN settings: ' + error);
      return false;
    });
  }

  /**
   * Scan for visible wireless networks on the first wireless device.
   *
   * @returns {Promise<WirelessNetwork[]>} Promise which resolves with an array of networks as objects:
   *  [
   *    {
   *      ssid: '...',
   *      quality: <number>,
   *      encryption: true|false,
   *      configured: true|false,
   *      connected: true|false
   *    },
   *    ...                 
   *  ]
   */
  async scanWirelessNetworksAsync(): Promise<WirelessNetwork[]> {
    const wifiDevices = await this.getWifiDevices();
    const wifiAccessPoints = await this.getWifiAccessPoints(wifiDevices[0]);
    let activeAccessPoint: string|null;
    try {
      activeAccessPoint = await this.getActiveAccessPoint(wifiDevices[0]);
    } catch(error) {
      activeAccessPoint = null;
    }
    let apRequests: Array<Promise<WirelessNetwork>> = [];
    wifiAccessPoints.forEach((ap) => {
      apRequests.push(this.getAccessPointDetails(ap, activeAccessPoint));
    });
    let responses = await Promise.all(apRequests);
    return responses;
  }

  /**
   * Set the wireless mode and options.
   *
   * @param {boolean} enabled - whether or not wireless is enabled
   * @param {string} mode - ap, sta, ...
   * @param {Object?} options - options specific to wireless mode
   * @returns {Promise<boolean>} Boolean indicating success.
   */
  async setWirelessModeAsync(enabled: boolean, mode = 'ap', options: Record<string, any> = {}): Promise<boolean> {
    const valid = [
      //'ap', //TODO: Implement ap mode
      'sta'
    ];
    if (enabled && !valid.includes(mode)) {
      console.error(`Wireless mode ${mode} not supported on this platform`);
      return false;
    }
    const wifiDevices = await this.getWifiDevices();

    // If `enabled` set to false, disconnect wireless device
    if(enabled === false) {
      // Return false if no wifi device found
      if(!wifiDevices[0]) {
        return false;
      }
      try {
        await this.disconnectNetworkDevice(wifiDevices[0]);
      } catch(error) {
        console.error(`Error whilst attempting to disconnect wireless device: ${error}`);
        return false;
      }
      return true;
    }

    // Otherwise connect to Wi-Fi access point using provided options
    if(!options.hasOwnProperty('ssid')) {
      console.log('Could not connect to wireless network because no SSID provided');
      return false;
    }
    const accessPoint = await this.getAccessPointbySsid(options.ssid);
    if(accessPoint == null) {
      console.log('No network with specified SSID found');
      return false;
    }
    let secure = false;
    if (options.key) {
      secure = true;
    }
    try {
      this.connectToWifiAccessPoint(wifiDevices[0], accessPoint, options.ssid, 
        secure, options.key)
    } catch(error) {
      console.error(`Error connecting to Wi-Fi access point: ${error}`);
      return false;
    }
    return true;
  }
}

export default new LinuxUbuntuPlatform();
