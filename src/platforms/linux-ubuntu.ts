/**
 * Ubuntu platform interface.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import BasePlatform from './base';
import DBus from 'dbus';
import {LanMode, NetworkAddresses, WirelessNetwork} from './types';

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
  private getConnectionSettings(path: string) {
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
      return result;
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

  // Currently unused code...

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
