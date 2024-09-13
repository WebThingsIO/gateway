import DBus from 'dbus';
import { WirelessNetwork } from '../types';

export interface ConnectionSettings {
  connection: {
    id: string;
    uuid?: string;
    type: string;
  };
  ipv4?: {
    method: string;
    addresses?: Array<Array<number>>;
    'address-data'?: Array<AddressData>;
    gateway?: string;
  };
  '802-11-wireless'?: {
    ssid: Array<number>;
  };
  '802-11-wireless-security'?: {
    'key-mgmt'?: string;
    psk?: string;
  };
}

export interface AddressData {
  address: string;
  prefix: number;
}

/**
 * Network Manager.
 *
 * Manages networking devices over DBus.
 */
class NetworkManager {
  // Reference to the DBus system bus once connected
  private systemBus: DBus.DBusConnection | null = null;

  /**
   * Connect to the system bus.
   */
  start(): void {
    // There can only be one system bus instance open at a time.
    if (!this.systemBus) {
      this.systemBus = DBus.getBus('system');
    }
  }

  /**
   * Disconnect from the system bus.
   */
  stop(): void {
    if (this.systemBus) {
      this.systemBus.disconnect();
    }
  }

  /**
   * Get a list of network adapters from the system network manager.
   *
   * @returns {Promise<string[]>} An array of DBus object paths.
   */
  getDevices(): Promise<string[]> {
    this.start();
    return new Promise((resolve, reject) => {
      this.systemBus!.getInterface(
        'org.freedesktop.NetworkManager',
        '/org/freedesktop/NetworkManager',
        'org.freedesktop.NetworkManager',
        function (error, iface) {
          if (error) {
            console.error(`Error accessing the NetworkManager DBus interface: ${error}`);
            reject();
            return;
          }
          iface.GetAllDevices(function (error: Error, result: string[]) {
            if (error) {
              console.error(`Error calling GetAllDevices on NetworkManager DBus: ${error}`);
              reject();
              return;
            }
            resolve(result);
          });
        }
      );
    });
  }

  /**
   * Get the device type for a given network adapter.
   *
   * @param {string} path Object path for device.
   * @returns {Promise<number>} Resolves with a device type
   *  (1 is Ethernet, 2 is Wi-Fi...).
   */
  getDeviceType(path: string): Promise<number> {
    this.start();
    return new Promise((resolve, reject) => {
      this.systemBus!.getInterface(
        'org.freedesktop.NetworkManager',
        path,
        'org.freedesktop.NetworkManager.Device',
        function (error, iface) {
          if (error) {
            console.error(error);
            reject();
            return;
          }
          iface.getProperty('DeviceType', function (error, value) {
            if (error) {
              console.error(error);
              reject();
              return;
            }
            resolve(+value);
          });
        }
      );
    });
  }

  /**
   * Get a list of Ethernet network adapters from the system network manager.
   *
   * @returns {Promise<string[]>} A promise which resolves with an array
   *  of DBus object paths.
   */
  async getEthernetDevices(): Promise<string[]> {
    // Get a list of all network adapter devices
    const devices = await this.getDevices();
    const ethernetDevices: string[] = [];
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
   * @returns {Promise<string[]} A promise which resolves with an array
   *  of DBus object paths.
   */
  async getWifiDevices(): Promise<string[]> {
    // Get a list of all network adapter devices
    const devices = await this.getDevices();
    const wifiDevices: string[] = [];
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
   * @param {string} path Object path for device.
   * @returns {Promise<string>} Resolves with object path of the active
   *  connection object associated with this device.
   */
  getDeviceConnection(path: string): Promise<string> {
    this.start();
    return new Promise((resolve, reject) => {
      this.systemBus!.getInterface(
        'org.freedesktop.NetworkManager',
        path,
        'org.freedesktop.NetworkManager.Device',
        (error, iface) => {
          if (error) {
            console.error(error);
            reject();
            return;
          }
          iface.getProperty('ActiveConnection', (error, activeConnectionPath) => {
            if (error) {
              console.error(error);
              reject();
              return;
            }
            this.systemBus!.getInterface(
              'org.freedesktop.NetworkManager',
              activeConnectionPath,
              'org.freedesktop.NetworkManager.Connection.Active',
              (error, iface) => {
                if (error) {
                  console.error(error);
                  reject();
                  return;
                }
                iface.getProperty('Connection', function (error, value) {
                  if (error) {
                    console.error(error);
                    reject();
                    return;
                  }
                  resolve(value);
                });
              }
            );
          });
        }
      );
    });
  }

  /**
   * Get the settings for a given connection.
   *
   * @param {string} path Object path for a connection settings profile.
   * @returns {Promise<ConnectionSettings>} Resolves with the settings of a connection.
   */
  getConnectionSettings(path: string): Promise<ConnectionSettings> {
    this.start();
    return new Promise((resolve, reject) => {
      this.systemBus!.getInterface(
        'org.freedesktop.NetworkManager',
        path,
        'org.freedesktop.NetworkManager.Settings.Connection',
        function (error, iface) {
          if (error) {
            console.error(error);
            reject();
            return;
          }
          iface.GetSettings(function (error: Error, value: ConnectionSettings) {
            if (error) {
              console.error(error);
              reject();
              return;
            }
            resolve(value);
          });
        }
      );
    });
  }

  /**
   * Update connection settings.
   *
   * Note that this persists the connection object, but a connection needs to be
   * reactivated in order for it to take effect.
   *
   * @param {string} path DBus object path of the Connection Settings object to update.
   * @param {ConnectionSettings} settings A connection settings object.
   * @returns {Promise<boolean>} A Promise that resolves with true on success or
   *  rejects with an Error on failure.
   */
  setConnectionSettings(path: string, settings: ConnectionSettings): Promise<boolean> {
    this.start();
    return new Promise((resolve, reject) => {
      this.systemBus!.getInterface(
        'org.freedesktop.NetworkManager',
        path,
        'org.freedesktop.NetworkManager.Settings.Connection',
        function (error, iface) {
          if (error) {
            console.error(error);
            reject();
            return;
          }
          iface.Update(settings, function (error: Error) {
            if (error) {
              console.error(error);
              reject();
              return;
            }
            resolve(true);
          });
        }
      );
    });
  }

  /**
   * Activate a network connection.
   *
   * @param {string} connection The DBus object path of the connection settings to apply.
   * @param {string} device The DBus object path of the device to apply settings to.
   * @returns {Promise<boolean>} A Promise which resolves with true on success
   *  or rejects on failure.
   */
  activateConnection(connection: string, device: string): Promise<boolean> {
    this.start();
    return new Promise((resolve, reject) => {
      this.systemBus!.getInterface(
        'org.freedesktop.NetworkManager',
        '/org/freedesktop/NetworkManager',
        'org.freedesktop.NetworkManager',
        function (error, iface) {
          if (error) {
            console.error(error);
            reject();
            return;
          }
          iface.ActivateConnection(connection, device, '/', function (error: Error) {
            if (error) {
              console.error(error);
              reject();
              return;
            }
            resolve(true);
          });
        }
      );
    });
  }

  /**
   * Get an IPv4 configuration for a given device path.
   *
   * @param {String} path Object path for a device.
   * @returns {Promise<Array<AddressData>>} Promise resolves with IP4Config object.
   */
  getDeviceIp4Config(path: string): Promise<Array<AddressData>> {
    this.start();
    return new Promise((resolve, reject) => {
      this.systemBus!.getInterface(
        'org.freedesktop.NetworkManager',
        path,
        'org.freedesktop.NetworkManager.Device',
        (error, iface) => {
          if (error) {
            console.error(error);
            reject();
            return;
          }
          iface.getProperty('Ip4Config', (error, ip4ConfigPath) => {
            if (error) {
              console.error(error);
              reject();
              return;
            }
            this.systemBus!.getInterface(
              'org.freedesktop.NetworkManager',
              ip4ConfigPath,
              'org.freedesktop.NetworkManager.IP4Config',
              (error, iface) => {
                if (error) {
                  console.error(error);
                  reject();
                  return;
                }
                // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/71006
                // eslint-disable-next-line  @typescript-eslint/no-explicit-any
                iface.getProperty('AddressData', function (error, value: any) {
                  if (error) {
                    console.error(error);
                    reject();
                    return;
                  }
                  resolve(value);
                });
              }
            );
          });
        }
      );
    });
  }

  /**
   * Get the SSID of the Wi-Fi access point with a given DBUS object path.
   *
   * @param {string} path DBUS object path of the Wi-Fi access point.
   * @returns {Promise<string>} The SSID of the access point.
   */
  getAccessPointSsid(path: string): Promise<string> {
    this.start();
    return new Promise((resolve, reject) => {
      this.systemBus!.getInterface(
        'org.freedesktop.NetworkManager',
        path,
        'org.freedesktop.NetworkManager.AccessPoint',
        function (error, iface) {
          if (error) {
            console.error(error);
            reject();
            return;
          }
          // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/71006
          // eslint-disable-next-line  @typescript-eslint/no-explicit-any
          iface.getProperty('Ssid', function (error, value: any) {
            if (error) {
              console.error(error);
              reject();
              return;
            }
            // Convert SSID from byte array to string.
            const ssid = String.fromCharCode(...value);
            resolve(ssid);
          });
        }
      );
    });
  }

  /**
   * Get the signal strength of the Wi-Fi access point with a given DBUS object path.
   *
   * @param {string} path DBUS object path of the Wi-Fi access point.
   * @returns {Promise<number>} The strength of the signal as a percentage.
   */
  getAccessPointStrength(path: string): Promise<number> {
    this.start();
    return new Promise((resolve, reject) => {
      this.systemBus!.getInterface(
        'org.freedesktop.NetworkManager',
        path,
        'org.freedesktop.NetworkManager.AccessPoint',
        function (error, iface) {
          if (error) {
            console.error(error);
            reject();
            return;
          }
          // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/71006
          // eslint-disable-next-line  @typescript-eslint/no-explicit-any
          iface.getProperty('Strength', function (error, value: any) {
            if (error) {
              console.error(error);
              reject();
              return;
            }
            resolve(value);
          });
        }
      );
    });
  }

  /**
   * Gets the encryption status of the Wi-Fi access point with a given DBUS object path.
   *
   * @param {string} path DBUS object path of the Wi-Fi access point.
   * @returns {Promise<boolean>} true if encrypted, false if not.
   */
  async getAccessPointSecurity(path: string): Promise<boolean> {
    this.start();
    const wpaFlagRequest = new Promise((resolve, reject) => {
      this.systemBus!.getInterface(
        'org.freedesktop.NetworkManager',
        path,
        'org.freedesktop.NetworkManager.AccessPoint',
        (error, iface) => {
          if (error) {
            console.error(error);
            reject();
            return;
          }
          // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/71006
          // eslint-disable-next-line  @typescript-eslint/no-explicit-any
          iface.getProperty('WpaFlags', function (error, value: any) {
            if (error) {
              console.error(error);
              reject();
              return;
            }
            resolve(value);
          });
        }
      );
    });
    const wpa2FlagRequest = new Promise((resolve, reject) => {
      this.systemBus!.getInterface(
        'org.freedesktop.NetworkManager',
        path,
        'org.freedesktop.NetworkManager.AccessPoint',
        function (error, iface) {
          if (error) {
            console.error(error);
            reject();
            return;
          }
          // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/71006
          // eslint-disable-next-line  @typescript-eslint/no-explicit-any
          iface.getProperty('RsnFlags', function (error, value: any) {
            if (error) {
              console.error(error);
              reject();
              return;
            }
            resolve(value);
          });
        }
      );
    });
    // Request WPA and WPA2 flags for access point.
    const requests = [];
    requests.push(wpaFlagRequest);
    requests.push(wpa2FlagRequest);
    const responses = await Promise.all(requests);
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
   * @returns {Promise<WirelessNetwork>} A Promise which resolves with a wireless network
   *   object of the form:
   * {
   *   ssid: '...',
   *   quality: <number>,
   *   encryption: true|false,
   *   configured: true|false,
   *   connected: true| false
   * }
   * @throws {Error} Error if not able to get all access point details.
   */
  async getAccessPointDetails(
    path: string,
    activeAccessPoint: string | null
  ): Promise<WirelessNetwork> {
    let ssid: string;
    let strength: number;
    let security: boolean;
    let connected: boolean;
    if (path === activeAccessPoint) {
      connected = true;
    } else {
      connected = false;
    }
    try {
      ssid = await this.getAccessPointSsid(path);
      strength = await this.getAccessPointStrength(path);
      security = await this.getAccessPointSecurity(path);
    } catch (error) {
      console.error(error);
      throw new Error('Failed to get access point details');
    }
    const response = {
      ssid: ssid,
      quality: strength,
      encryption: security,
      configured: connected, // Currently assumes only configured if connected
      connected: connected,
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
  getActiveAccessPoint(path: string): Promise<string> {
    this.start();
    return new Promise((resolve, reject) => {
      this.systemBus!.getInterface(
        'org.freedesktop.NetworkManager',
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
        }
      );
    });
  }

  /**
   * Get a list of access points for the wireless device at the given path.
   *
   * @param {String} path The DBUS object path of a wireless device.
   * @returns {Promise<string[]>} An array of DBus object paths of Access Points.
   */
  getWifiAccessPoints(path: string): Promise<string[]> {
    this.start();
    return new Promise((resolve, reject) => {
      this.systemBus!.getInterface(
        'org.freedesktop.NetworkManager',
        path,
        'org.freedesktop.NetworkManager.Device.Wireless',
        function (error, iface) {
          if (error) {
            console.error(`Error getting a wireless device via NetworkManager: ${error}`);
            reject();
            return;
          }
          // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/71006
          // eslint-disable-next-line  @typescript-eslint/no-explicit-any
          iface.getProperty('AccessPoints', function (error: Error | null, result: any) {
            if (error) {
              console.error(`Error getting AccessPoints from a wireless device: ${error}`);
              reject();
              return;
            }
            resolve(result);
          });
        }
      );
    });
  }

  /**
   * Get an access point DBUS object bath for a given SSID.
   *
   * @param {string} ssid The SSID of the network to search for.
   * @returns {Promise<string|null> } A Promise which resolves with the DBUS object
   *   path of the access point, or null if not found;
   */
  async getAccessPointbySsid(ssid: string): Promise<string | null> {
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
   * @returns {Promise<void>} Resolves on success, rejects with an Error on failure.
   */
  connectToWifiAccessPoint(
    wifiDevice: string,
    accessPoint: string,
    ssid: string,
    secure: boolean,
    password: string
  ): Promise<void> {
    this.start();
    return new Promise((resolve, reject) => {
      this.systemBus!.getInterface(
        'org.freedesktop.NetworkManager',
        '/org/freedesktop/NetworkManager',
        'org.freedesktop.NetworkManager',
        (error, iface) => {
          if (error) {
            reject(error);
            return;
          }

          // Convert SSID to an array of bytes
          const ssidBytes = [];
          for (let i = 0; i < ssid.length; ++i) {
            ssidBytes.push(ssid.charCodeAt(i));
          }

          // Assemble connection information
          const connectionInfo: ConnectionSettings = {
            '802-11-wireless': {
              ssid: ssidBytes,
            },
            connection: {
              id: ssid,
              type: '802-11-wireless',
            },
          };

          if (secure) {
            connectionInfo['802-11-wireless-security'] = {
              'key-mgmt': 'wpa-psk',
              psk: password,
            };
          }

          // TODO: Should we re-use an existing connection rather than add a new one
          // if one already exists?
          iface.AddAndActivateConnection(
            connectionInfo,
            wifiDevice,
            accessPoint,
            function (error: Error) {
              if (error) {
                reject(error);
                return;
              }
              resolve();
            }
          );
        }
      );
    });
  }

  /**
   * Disconnect a network device.
   *
   * @param {string} path DBUS object path of device.
   * @returns {Promise<void>} A promise which resolves upon successful
   *   deactivation or rejects with an Error on failure.
   */
  disconnectNetworkDevice(path: string): Promise<void> {
    this.start();
    return new Promise((resolve, reject) => {
      this.systemBus!.getInterface(
        'org.freedesktop.NetworkManager',
        path,
        'org.freedesktop.NetworkManager.Device',
        (error, iface) => {
          if (error) {
            reject(error);
            return;
          }
          iface.Disconnect(function (error: Error) {
            if (error) {
              reject(error);
              return;
            }
            resolve();
          });
        }
      );
    });
  }
}

export default new NetworkManager();
