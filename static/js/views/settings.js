/**
 * Settings Screen.
 *
 * UI for gateway settings.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const Adapter = require('./adapter');
const API = require('../api');
const App = require('../app');
const AddonConfig = require('./addon-config');
const DiscoveredAddon = require('./discovered-addon');
const InstalledAddon = require('./installed-addon');
const ipRegex = require('ip-regex')({exact: true});
const Menu = require('./menu');
const page = require('page');
const User = require('./user');
const Utils = require('../utils');
const WirelessNetwork = require('./wireless-network');

// eslint-disable-next-line no-unused-vars
const SettingsScreen = {

  /**
   * Initialise Settings Screen.
   */
  init: function() {
    this.elements = {};
    this.view = document.getElementById('settings-view');
    this.menu = document.getElementById('settings-menu');
    this.domainSettings = document.getElementById('domain-settings');
    this.userSettings = document.getElementById('user-settings');
    this.userSettingsMain = document.getElementById('user-settings-main');
    this.userSettingsEdit = document.getElementById('user-settings-edit');
    this.userSettingsAdd = document.getElementById('user-settings-add');
    this.addUserButton = document.getElementById('add-user-button');
    this.adapterSettings = document.getElementById('adapter-settings');
    this.addonSettings = document.getElementById('addon-settings');
    this.addonMainSettings = document.getElementById('addon-main-settings');
    this.addonConfigSettings = document.getElementById('addon-config-settings');
    this.addonDiscoverySettings =
      document.getElementById('addon-discovery-settings');
    this.addonConfigSettings = document.getElementById('addon-config-settings');
    this.discoverAddonsButton =
      document.getElementById('discover-addons-button');
    this.experimentSettings = document.getElementById('experiment-settings');
    this.updateSettings = document.getElementById('update-settings');
    this.authorizationSettings =
      document.getElementById('authorization-settings');
    this.developerSettings = document.getElementById('developer-settings');
    this.backButton = document.getElementById('settings-back-button');

    this.availableAddons = new Map();
    this.installedAddons = new Map();
    this.fetchInstalledAddonsDeferred = null;
    this.fetchAvailableAddonsDeferred = null;
    this.availableAddonsLastFetched = null;

    this.insertTitleElement(this.menu, 'Settings',
                            '/optimized-images/settings-icon.png');
    this.insertTitleElement(this.domainSettings, 'Domain',
                            '/optimized-images/domain-icon.png');
    this.insertTitleElement(this.userSettingsMain, 'Users',
                            '/optimized-images/users-icon.png');
    this.insertTitleElement(this.userSettingsEdit, 'Edit User',
                            '/optimized-images/user.svg');
    this.insertTitleElement(this.userSettingsAdd, 'Add User',
                            '/optimized-images/user.svg');
    this.insertTitleElement(this.adapterSettings, 'Adapters',
                            '/optimized-images/adapters-icon.png');
    this.insertTitleElement(this.addonMainSettings, 'Add-ons',
                            '/optimized-images/add-on.svg');
    const addonConfigTitle =
      this.insertTitleElement(this.addonConfigSettings,
                              'Configure Add-on',
                              '/optimized-images/add-on.svg');
    this.addonConfigTitleName =
      addonConfigTitle.querySelector('.section-title-name');

    this.insertTitleElement(this.addonDiscoverySettings,
                            'Discover New Add-ons',
                            '/optimized-images/add-on.svg');
    this.insertTitleElement(this.experimentSettings, 'Experiments',
                            '/optimized-images/experiments-icon.png');
    this.insertTitleElement(this.updateSettings, 'Updates',
                            '/optimized-images/update-icon.svg');
    this.insertTitleElement(this.authorizationSettings, 'Authorizations',
                            '/optimized-images/authorization.svg');
    this.insertTitleElement(this.developerSettings, 'Developer',
                            '/optimized-images/developer-icon.svg');

    this.discoverAddonsButton.addEventListener('click', () => {
      page('/settings/addons/discovered');
    });
    this.addUserButton.addEventListener('click', () => {
      page('/settings/users/add');
    });

    this.setupNetworkElements();
  },

  /* eslint-disable max-len */
  setupNetworkElements: function() {
    // Find all elements
    this.elements.network = {
      main: document.getElementById('network-settings'),
      unsupported: {
        main: document.getElementById('network-settings-unsupported'),
      },
      client: {
        main: document.getElementById('network-settings-client'),
        ethernet: {
          main: document.getElementById('network-settings-ethernet'),
          mainIp: document.getElementById('network-settings-list-item-ethernet-ip'),
          configure: document.getElementById('network-settings-list-item-ethernet-configure'),
          mode: document.getElementById('network-settings-ethernet-mode'),
          ipLabel: document.getElementById('network-settings-ethernet-ip-label'),
          ip: document.getElementById('network-settings-ethernet-ip'),
          netmaskLabel: document.getElementById('network-settings-ethernet-netmask-label'),
          netmask: document.getElementById('network-settings-ethernet-netmask'),
          gatewayLabel: document.getElementById('network-settings-ethernet-gateway-label'),
          gateway: document.getElementById('network-settings-ethernet-gateway'),
          done: document.getElementById('network-settings-ethernet-done'),
        },
        wifi: {
          main: document.getElementById('network-settings-wifi'),
          mainSsid: document.getElementById('network-settings-list-item-wifi-ssid'),
          mainIp: document.getElementById('network-settings-list-item-wifi-ip'),
          configure: document.getElementById('network-settings-list-item-wifi-configure'),
          list: document.getElementById('network-settings-wifi-network-list'),
          wrap: document.getElementById('network-settings-wifi-wrap'),
          ssid: document.getElementById('network-settings-wifi-ssid'),
          password: document.getElementById('network-settings-wifi-password'),
          showPassword: document.getElementById('network-settings-wifi-show-password'),
          connect: document.getElementById('network-settings-wifi-connect'),
        },
      },
      router: {
        main: document.getElementById('network-settings-router'),
        wan: {
          main: document.getElementById('network-settings-wan'),
          mainIp: document.getElementById('network-settings-list-item-wan-ip'),
          configure: document.getElementById('network-settings-list-item-wan-configure'),
          mode: document.getElementById('network-settings-wan-mode'),
          ipLabel: document.getElementById('network-settings-wan-ip-label'),
          ip: document.getElementById('network-settings-wan-ip'),
          netmaskLabel: document.getElementById('network-settings-wan-netmask-label'),
          netmask: document.getElementById('network-settings-wan-netmask'),
          gatewayLabel: document.getElementById('network-settings-wan-gateway-label'),
          gateway: document.getElementById('network-settings-wan-gateway'),
          usernameLabel: document.getElementById('network-settings-wan-username-label'),
          username: document.getElementById('network-settings-wan-username'),
          passwordLabel: document.getElementById('network-settings-wan-password-label'),
          password: document.getElementById('network-settings-wan-password'),
          done: document.getElementById('network-settings-wan-done'),
        },
        lan: {
          main: document.getElementById('network-settings-lan'),
          mainIp: document.getElementById('network-settings-list-item-lan-ip'),
          configure: document.getElementById('network-settings-list-item-lan-configure'),
          ip: document.getElementById('network-settings-lan-ip'),
          netmask: document.getElementById('network-settings-lan-netmask'),
          dhcp: document.getElementById('network-settings-lan-dhcp'),
          done: document.getElementById('network-settings-lan-done'),
        },
        wlan: {
          main: document.getElementById('network-settings-wlan'),
          mainSsid: document.getElementById('network-settings-list-item-wlan-ssid'),
          configure: document.getElementById('network-settings-list-item-wlan-configure'),
          enable: document.getElementById('network-settings-wlan-enable'),
          ssid: document.getElementById('network-settings-wlan-ssid'),
          password: document.getElementById('network-settings-wlan-password'),
          showPassword: document.getElementById('network-settings-wlan-show-password'),
          done: document.getElementById('network-settings-wlan-done'),
        },
      },
    };

    // Set up title elements
    this.insertTitleElement(
      this.elements.network.unsupported.main,
      'Network',
      '/optimized-images/network.svg'
    );
    this.insertTitleElement(
      this.elements.network.client.main,
      'Network',
      '/optimized-images/network.svg'
    );
    this.insertTitleElement(
      this.elements.network.client.ethernet.main,
      'Ethernet',
      '/optimized-images/ethernet.svg'
    );
    this.elements.network.client.wifi.title = this.insertTitleElement(
      this.elements.network.client.wifi.main,
      'Wi-Fi',
      '/optimized-images/wifi.svg'
    ).querySelector('.section-title-name');
    this.insertTitleElement(
      this.elements.network.router.main,
      'Network',
      '/optimized-images/network.svg'
    );
    this.insertTitleElement(
      this.elements.network.router.wan.main,
      'Internet (WAN)',
      '/optimized-images/internet.svg'
    );
    this.insertTitleElement(
      this.elements.network.router.lan.main,
      'Home Network (LAN)',
      '/optimized-images/network.svg'
    );
    this.insertTitleElement(
      this.elements.network.router.wlan.main,
      'Wi-Fi (WLAN)',
      '/optimized-images/wifi.svg'
    );

    // Set up "Configure" button handlers
    this.elements.network.client.ethernet.configure.addEventListener(
      'click',
      () => page('/settings/network/ethernet')
    );
    this.elements.network.client.wifi.configure.addEventListener(
      'click',
      () => page('/settings/network/wifi')
    );
    this.elements.network.router.wan.configure.addEventListener(
      'click',
      () => page('/settings/network/wan')
    );
    this.elements.network.router.lan.configure.addEventListener(
      'click',
      () => page('/settings/network/lan')
    );
    this.elements.network.router.wlan.configure.addEventListener(
      'click',
      () => page('/settings/network/wlan')
    );

    // Ethernet config
    const ethernetEls = [
      this.elements.network.client.ethernet.ipLabel,
      this.elements.network.client.ethernet.ip,
      this.elements.network.client.ethernet.netmaskLabel,
      this.elements.network.client.ethernet.netmask,
      this.elements.network.client.ethernet.gatewayLabel,
      this.elements.network.client.ethernet.gateway,
    ];
    this.elements.network.client.ethernet.ip.addEventListener(
      'input',
      this.validateEthernet.bind(this)
    );
    this.elements.network.client.ethernet.netmask.addEventListener(
      'input',
      this.validateEthernet.bind(this)
    );
    this.elements.network.client.ethernet.gateway.addEventListener(
      'input',
      this.validateEthernet.bind(this)
    );
    this.elements.network.client.ethernet.mode.addEventListener(
      'change',
      (ev) => {
        this.validateEthernet();
        if (ev.target.value === 'static') {
          ethernetEls.forEach((el) => el.classList.remove('hidden'));
        } else {
          ethernetEls.forEach((el) => el.classList.add('hidden'));
        }
      }
    );
    this.elements.network.client.ethernet.mode.value = 'dhcp';
    ethernetEls.forEach((el) => el.classList.add('hidden'));

    this.elements.network.client.ethernet.done.addEventListener(
      'click',
      (ev) => {
        ev.target.disabled = true;
        App.showMessage(
          'Changing network settings. This may take a minute.',
          3000
        );

        const body = {
          mode: this.elements.network.client.ethernet.mode.value,
        };

        if (body.mode === 'static') {
          body.options = {
            ipaddr: this.elements.network.client.ethernet.ip.value,
            netmask: this.elements.network.client.ethernet.netmask.value,
            gateway: this.elements.network.client.ethernet.gateway.value,
          };
        }

        fetch('/settings/network/lan', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${API.jwt}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }).then((res) => {
          if (!res.ok) {
            throw new Error(`Error status: ${res.status}`);
          }

          page('/settings/network');
          ev.target.disabled = false;
        }).catch((e) => {
          App.showMessage('Failed to configure ethernet.', 3000);
          console.error(`Failed to set ethernet config: ${e}`);
          ev.target.disabled = false;
        });
      }
    );

    // Wi-Fi config
    this.elements.network.client.wifi.showPassword.addEventListener(
      'change',
      (ev) => {
        if (ev.target.checked) {
          this.elements.network.client.wifi.password.setAttribute(
            'type',
            'text'
          );
        } else {
          this.elements.network.client.wifi.password.setAttribute(
            'type',
            'password'
          );
        }
      }
    );
    this.elements.network.client.wifi.password.addEventListener(
      'input',
      this.validateWifi.bind(this)
    );
    this.elements.network.client.wifi.connect.addEventListener(
      'click',
      (ev) => {
        ev.target.disabled = true;
        App.showMessage(
          'Changing network settings. This may take a minute.',
          3000
        );

        const body = {
          enabled: true,
          mode: 'sta',
          options: {
            ssid: this.elements.network.client.wifi.ssid.value,
            key: this.elements.network.client.wifi.password.value,
          },
        };

        fetch('/settings/network/wireless', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${API.jwt}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }).then((res) => {
          if (!res.ok) {
            throw new Error(`Error status: ${res.status}`);
          }

          page('/settings/network');
          ev.target.disabled = false;
        }).catch((e) => {
          App.showMessage('Failed to configure wi-fi.', 3000);
          console.error(`Failed to set wi-fi config: ${e}`);
          ev.target.disabled = false;
        });
      }
    );
    this.validateWifi();

    // WAN config
    this.elements.network.router.wan.ip.addEventListener(
      'input',
      this.validateWan.bind(this)
    );
    this.elements.network.router.wan.netmask.addEventListener(
      'input',
      this.validateWan.bind(this)
    );
    this.elements.network.router.wan.gateway.addEventListener(
      'input',
      this.validateWan.bind(this)
    );
    this.elements.network.router.wan.username.addEventListener(
      'input',
      this.validateWan.bind(this)
    );
    this.elements.network.router.wan.password.addEventListener(
      'input',
      this.validateWan.bind(this)
    );
    const wanStaticEls = [
      this.elements.network.router.wan.ipLabel,
      this.elements.network.router.wan.ip,
      this.elements.network.router.wan.netmaskLabel,
      this.elements.network.router.wan.netmask,
      this.elements.network.router.wan.gatewayLabel,
      this.elements.network.router.wan.gateway,
    ];
    const wanPppoeEls = [
      this.elements.network.router.wan.usernameLabel,
      this.elements.network.router.wan.username,
      this.elements.network.router.wan.passwordLabel,
      this.elements.network.router.wan.password,
    ];
    this.elements.network.router.wan.mode.addEventListener(
      'change',
      (ev) => {
        this.validateWan();
        switch (ev.target.value) {
          case 'dhcp':
            wanStaticEls.forEach((el) => el.classList.add('hidden'));
            wanPppoeEls.forEach((el) => el.classList.add('hidden'));
            break;
          case 'static':
            wanStaticEls.forEach((el) => el.classList.remove('hidden'));
            wanPppoeEls.forEach((el) => el.classList.add('hidden'));
            break;
          case 'pppoe':
            wanStaticEls.forEach((el) => el.classList.add('hidden'));
            wanPppoeEls.forEach((el) => el.classList.remove('hidden'));
            break;
        }
      }
    );
    this.elements.network.router.wan.mode.value = 'dhcp';
    wanStaticEls.forEach((el) => el.classList.add('hidden'));
    wanPppoeEls.forEach((el) => el.classList.add('hidden'));

    this.elements.network.router.wan.done.addEventListener(
      'click',
      (ev) => {
        ev.target.disabled = true;
        App.showMessage(
          'Changing network settings. This may take a minute.',
          3000
        );

        const body = {
          mode: this.elements.network.router.wan.mode.value,
        };

        if (body.mode === 'static') {
          body.options = {
            ipaddr: this.elements.network.router.wan.ip.value,
            netmask: this.elements.network.router.wan.netmask.value,
            gateway: this.elements.network.router.wan.gateway.value,
          };
        } else if (body.mode === 'pppoe') {
          body.options = {
            username: this.elements.network.router.wan.username.value,
            password: this.elements.network.router.wan.password.value,
          };
        }

        fetch('/settings/network/wan', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${API.jwt}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }).then((res) => {
          if (!res.ok) {
            throw new Error(`Error status: ${res.status}`);
          }

          page('/settings/network');
          ev.target.disabled = false;
        }).catch((e) => {
          App.showMessage('Failed to configure WAN.', 3000);
          console.error(`Failed to set WAN config: ${e}`);
          ev.target.disabled = false;
        });
      }
    );

    // LAN config
    this.elements.network.router.lan.ip.addEventListener(
      'input',
      this.validateLan.bind(this)
    );
    this.elements.network.router.lan.netmask.addEventListener(
      'input',
      this.validateLan.bind(this)
    );
    this.elements.network.router.lan.done.addEventListener(
      'click',
      (ev) => {
        ev.target.disabled = true;
        App.showMessage(
          'Changing network settings. This may take a minute.',
          3000
        );

        const lanBody = {
          mode: 'static',
          options: {
            ipaddr: this.elements.network.router.lan.ip.value,
            netmask: this.elements.network.router.lan.netmask.value,
          },
        };

        const dhcpBody = {
          enabled: this.elements.network.router.lan.dhcp.checked,
        };

        fetch('/settings/network/lan', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${API.jwt}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(lanBody),
        }).then((res) => {
          if (!res.ok) {
            throw new Error(`Error status: ${res.status}`);
          }

          return fetch('/settings/network/dhcp', {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${API.jwt}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dhcpBody),
          });
        }).then((res) => {
          if (!res.ok) {
            throw new Error(`Error status: ${res.status}`);
          }

          page('/settings/network');
          ev.target.disabled = false;
        }).catch((e) => {
          App.showMessage('Failed to configure LAN.', 3000);
          console.error(`Failed to set LAN config: ${e}`);
          ev.target.disabled = false;
        });
      }
    );
    this.validateLan();

    // WLAN config
    this.elements.network.router.wlan.ssid.addEventListener(
      'input',
      this.validateWlan.bind(this)
    );
    this.elements.network.router.wlan.password.addEventListener(
      'input',
      this.validateWlan.bind(this)
    );
    this.elements.network.router.wlan.showPassword.addEventListener(
      'change',
      (ev) => {
        if (ev.target.checked) {
          this.elements.network.router.wlan.password.setAttribute(
            'type',
            'text'
          );
        } else {
          this.elements.network.router.wlan.password.setAttribute(
            'type',
            'password'
          );
        }
      }
    );
    this.elements.network.router.wlan.done.addEventListener(
      'click',
      (ev) => {
        ev.target.disabled = true;
        App.showMessage(
          'Changing network settings. This may take a minute.',
          3000
        );

        const body = {
          enabled: this.elements.network.router.wlan.enable.checked,
          mode: 'ap',
        };

        if (body.enabled) {
          body.options = {
            ssid: this.elements.network.router.wlan.ssid.value,
            key: this.elements.network.router.wlan.password.value,
          };
        }

        fetch('/settings/network/wireless', {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${API.jwt}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }).then((res) => {
          if (!res.ok) {
            throw new Error(`Error status: ${res.status}`);
          }

          page('/settings/network');
          ev.target.disabled = false;
        }).catch((e) => {
          App.showMessage('Failed to configure WLAN.', 3000);
          console.error(`Failed to set WLAN config: ${e}`);
          ev.target.disabled = false;
        });
      }
    );
    this.validateWlan();
  },
  /* eslint-enable max-len */

  validateEthernet: function() {
    const valid =
      this.elements.network.client.ethernet.mode.value === 'dhcp' ||
      (ipRegex.test(this.elements.network.client.ethernet.ip.value) &&
       ipRegex.test(this.elements.network.client.ethernet.netmask.value) &&
       ipRegex.test(this.elements.network.client.ethernet.gateway.value));

    this.elements.network.client.ethernet.done.disabled = !valid;
  },

  validateWifi: function() {
    const valid =
      this.elements.network.client.wifi.password.value.length >= 8;

    this.elements.network.client.wifi.connect.disabled = !valid;
  },

  validateWan: function() {
    const valid =
      this.elements.network.router.wan.mode.value === 'dhcp' ||
      (this.elements.network.router.wan.mode.value === 'static' &&
       ipRegex.test(this.elements.network.router.wan.ip.value) &&
       ipRegex.test(this.elements.network.router.wan.netmask.value) &&
       ipRegex.test(this.elements.network.router.wan.gateway.value)) ||
      (this.elements.network.router.wan.mode.value === 'pppoe' &&
       this.elements.network.router.wan.username.value.length > 0 &&
       this.elements.network.router.wan.password.value.length > 0);

    this.elements.network.router.wan.done.disabled = !valid;
  },

  validateLan: function() {
    const valid =
      ipRegex.test(this.elements.network.router.lan.ip.value) &&
      ipRegex.test(this.elements.network.router.lan.netmask.value);

    this.elements.network.router.lan.done.disabled = !valid;
  },

  validateWlan: function() {
    const valid =
      this.elements.network.router.wlan.ssid.value.length > 0 &&
      this.elements.network.router.wlan.ssid.value.length <= 32 &&
      this.elements.network.router.wlan.password.value.length >= 8;

    this.elements.network.router.wlan.done.disabled = !valid;
  },

  hideNetworkElements: function() {
    this.elements.network.main.classList.add('hidden');
    this.elements.network.unsupported.main.classList.add('hidden');
    this.elements.network.client.main.classList.add('hidden');
    this.elements.network.client.ethernet.main.classList.add('hidden');
    this.elements.network.client.wifi.main.classList.add('hidden');
    this.elements.network.router.main.classList.add('hidden');
    this.elements.network.router.wan.main.classList.add('hidden');
    this.elements.network.router.lan.main.classList.add('hidden');
    this.elements.network.router.wlan.main.classList.add('hidden');
  },

  insertTitleElement: (section, name, icon) => {
    const elt = document.createElement('div');
    elt.classList.add('section-title');
    elt.innerHTML = `
      <div class="section-title-back-flex"></div>
      <div class="section-title-container">
        <img class="section-title-icon" alt="${name} Icon" src="${icon}" />
        <span class="section-title-name">${name}</span>
      </div>
      <div class="section-title-speech-flex"></div>
    `;
    section.insertBefore(elt, section.firstChild);
    return elt;
  },

  show: function(section, subsection, id) {
    document.getElementById('speech-wrapper').classList.remove('assistant');

    this.backButton.href = '/settings';
    this.view.classList.remove('dark');
    this.discoverAddonsButton.classList.add('hidden');
    this.addUserButton.classList.add('hidden');

    if (section) {
      this.showSection(section, subsection, id);
    } else {
      this.showMenu();
    }
  },

  showMenu: function() {
    App.showMenuButton();
    this.hideBackButton();
    this.menu.classList.remove('hidden');
    this.domainSettings.classList.add('hidden');
    this.userSettings.classList.add('hidden');
    this.userSettingsMain.classList.add('hidden');
    this.userSettingsEdit.classList.add('hidden');
    this.userSettingsAdd.classList.add('hidden');
    this.adapterSettings.classList.add('hidden');
    this.addonSettings.classList.add('hidden');
    this.addonMainSettings.classList.add('hidden');
    this.addonConfigSettings.classList.add('hidden');
    this.addonDiscoverySettings.classList.add('hidden');
    this.experimentSettings.classList.add('hidden');
    this.updateSettings.classList.add('hidden');
    this.authorizationSettings.classList.add('hidden');
    this.developerSettings.classList.add('hidden');
    this.discoverAddonsButton.classList.add('hidden');
    this.addUserButton.classList.add('hidden');
    this.hideNetworkElements();
  },

  hideMenu: function() {
    this.menu.classList.add('hidden');
  },

  showBackButton: function() {
    this.backButton.classList.remove('hidden');
  },

  hideBackButton: function() {
    this.backButton.classList.add('hidden');
  },

  showSection: function(section, subsection, id) {
    switch (section) {
      case 'domain':
        this.showDomainSettings();
        break;
      case 'network':
        if (subsection) {
          switch (subsection) {
            case 'ethernet':
              this.showEthernetSettings();
              break;
            case 'wifi':
              if (id && id === 'configure') {
                this.showWifiConfigure();
              } else {
                this.showWifiSettings();
              }
              break;
            case 'wan':
              this.showWanSettings();
              break;
            case 'lan':
              this.showLanSettings();
              break;
            case 'wlan':
              this.showWlanSettings();
              break;
            default:
              console.error('Tried to display undefined subsection');
              return;
          }
        } else {
          this.showNetworkSettings();
        }
        break;
      case 'users':
        if (subsection) {
          switch (subsection) {
            case 'edit':
              this.showEditUserScreen(id);
              break;
            case 'add':
              this.showAddUserScreen(id);
              break;
            default:
              console.error('Tried to display undefined subsection');
              return;
          }
        } else {
          this.showUserSettings();
        }
        break;
      case 'adapters':
        this.showAdapterSettings();
        break;
      case 'addons':
        if (subsection) {
          switch (subsection) {
            case 'discovered':
              this.showDiscoveredAddonsScreen();
              break;
            case 'config':
              this.showAddonConfigScreen(id);
              break;
            default:
              console.error('Tried to display undefined subsection');
              return;
          }
        } else {
          this.showAddonSettings();
        }
        break;
      case 'experiments':
        this.showExperimentSettings();
        break;
      case 'updates':
        this.showUpdateSettings();
        break;
      case 'authorizations':
        this.showAuthorizationSettings();
        break;
      case 'developer':
        this.showDeveloperSettings();
        break;
      default:
        console.error('Tried to display undefined section');
        return;
    }
    this.hideMenu();
    App.hideMenuButton();
    this.showBackButton();
  },

  showDomainSettings: function() {
    this.domainSettings.classList.remove('hidden');
    const opts = {
      headers: API.headers(),
    };

    const addDomainLocalButton =
      document.getElementById('domain-settings-local-update');
    const localDomainName =
        document.getElementById('domain-settings-local-name');
    const tunnelDomainName =
        document.getElementById('domain-settings-tunnel-name');

    addDomainLocalButton.addEventListener(
      'click', this.onLocalDomainClick.bind(this));

    // Comented out until full integration of Dynamic tunnel creation
    // with Service Discovery
    // const addDomainTunnelButton =
    //   document.getElementById('domain-settings-moz-tunnel-change');
    //     addDomainTunnelButton.addEventListener('click', () => {
    //     this.onTunnelDomainClick();
    // });

    fetch('/settings/tunnelinfo', opts).then((response) => {
      return response.json();
    }).then((body) => {
      const localDomainCheckbox =
        document.getElementById('domain-settings-local-checkbox');

      if (body) {
        localDomainCheckbox.checked = body.mDNSstate;
        localDomainName.value = body.localDomain;
        tunnelDomainName.innerText = body.tunnelDomain;
      } else {
        localDomainName.value = 'Unknown state.';
        tunnelDomainName.innerText = 'Unknown state.';
      }

      if (!localDomainCheckbox.checked) {
        localDomainName.disabled = true;
        addDomainLocalButton.disabled = true;
      }

      localDomainCheckbox.addEventListener(
        'change', this.onLocalDomainCheckboxChange.bind(this));
    });
  },

  onLocalDomainCheckboxChange: (e) => {
    const error = document.getElementById('domain-settings-error');
    const value = e.target.checked ? true : false;

    fetch('/settings/domain', {
      method: 'PUT',
      body: JSON.stringify({local: {multicastDNSstate: value}}),
      headers: {
        Authorization: `Bearer ${window.API.jwt}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(() => {
      document.getElementById('domain-settings-local-update').disabled = !value;
      document.getElementById('domain-settings-local-name').disabled = !value;
      error.classList.add('hidden');
    }).catch((err) => {
      const errorMessage = `Error: ${err}`;
      console.error(errorMessage);
      error.classList.remove('hidden');
      error.textContent = err;
      e.target.checked = !value;
      document.getElementById('domain-settings-local-update').disabled = value;
      document.getElementById('domain-settings-local-name').disabled = value;
    });
  },

  // The button controller to update the local domain settings.
  // In menu -> Settings -> Domain
  onLocalDomainClick: () => {
    const localDomainName =
      document.getElementById('domain-settings-local-name');
    const error = document.getElementById('domain-settings-error');

    fetch('/settings/domain', {
      method: 'PUT',
      body: JSON.stringify({local: {localDNSname: localDomainName.value}}),
      headers: {
        Authorization: `Bearer ${API.jwt}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      return response.json();
    }).then((domainJson) => {
      // if the update was successful, we have a legit local domain and mDNS
      // is active then redirect
      if (domainJson.update && domainJson.localDomain.length > 0) {
        if (domainJson.mDNSstate) {
          App.showMessage('Update succeeded.', 3000);
        }
      } else {
        error.classList.remove('hidden');
        error.textContent = domainJson.error;
        document.getElementById('domain-settings-local-name')
          .value = domainJson.localDomain;
      }
    }).catch((err) => {
      const errorMessage = `Error: ${err}`;
      console.error(errorMessage);
      error.classList.remove('hidden');
      error.textContent = err;
    });
  },

  // The button controller to update the mozilla tunnel domain settings.
  // In menu -> Settings -> Domain. Removed until this feature is done
  // at a future point.

  // onTunnelDomainClick: function() {
  //   var tunnelDomainCheckbox = document.getElementById(
  //     'domain-settings-tunnel-checkbox');
  //   var tunnelDomainName = document.getElementById(
  //     'domain-settings-tunnel-name');
  //   var tunnelDomainEmail = document.getElementById(
  //     'domain-settings-tunnel-email');
  //   console.log('* tunnel domain checkbox is: ' +
  //                'tunnelDomainCheckbox.checked');
  //
  //   var data = {tunnelState: tunnelDomainCheckbox.checked,
  //               tunnelDNSname: tunnelDomainName.value,
  //               tunnelUserEmail: tunnelDomainEmail};
  //   console.log('* json data to send is: ' + JSON.stringify(data));
  //
  //
  //   fetch('/settings/setdomain', {
  //     body: JSON.stringify({answer: "42"}),
  //     headers: API.headers(),
  //     method: 'POST'
  //   })
  //     .then(function (response) {
  //     return response.json();
  //   })
  //     .then((domainJson) => {
  //
  //     console.log(domainJson);
  //   })
  //   .catch(function () {
  //     console.log('Error');
  //   });
  //
  // }

  showNetworkSettings: function() {
    this.hideNetworkElements();
    this.elements.network.main.classList.remove('hidden');

    fetch('/settings/system/platform', {
      headers: API.headers(),
    }).then((res) => {
      return res.json();
    }).then((body) => {
      switch (body.os) {
        case 'linux-raspbian':
          this.elements.network.client.main.classList.remove('hidden');
          break;
        case 'linux-openwrt':
          this.elements.network.router.main.classList.remove('hidden');
          break;
        default:
          this.elements.network.unsupported.main.classList.remove('hidden');
          break;
      }

      return fetch('/settings/network/addresses', {
        headers: API.headers(),
      });
    }).then((res) => {
      if (!res.ok) {
        throw new Error(`Error status: ${res.status}`);
      }

      return res.json();
    }).then((body) => {
      this.elements.network.client.ethernet.mainIp.innerText = body.lan;
      this.elements.network.router.lan.mainIp.innerText = body.lan;
      this.elements.network.client.wifi.mainIp.innerText = body.wlan.ip;
      this.elements.network.client.wifi.mainSsid.innerText = body.wlan.ssid;
      this.elements.network.router.wlan.mainSsid.innerText = body.wlan.ssid;
      this.elements.network.router.wan.mainIp.innerText = body.wan;
    }).catch((e) => {
      console.error(`Error getting platform setting: ${e}`);
    });
  },

  showEthernetSettings: function() {
    this.backButton.href = '/settings/network';
    this.view.classList.add('dark');
    this.hideNetworkElements();
    this.elements.network.main.classList.remove('hidden');

    // set default values in case things go bad
    this.elements.network.client.ethernet.netmask.value = '255.255.255.0';

    this.elements.network.client.ethernet.main.classList.remove('hidden');

    fetch('/settings/network/lan', {
      headers: {
        Authorization: `Bearer ${API.jwt}`,
        Accept: 'application/json',
      },
    }).then((res) => {
      if (!res.ok) {
        throw new Error(`Error status: ${res.status}`);
      }

      return res.json();
    }).then((body) => {
      this.elements.network.client.ethernet.mode.value = body.mode || 'dhcp';
      this.elements.network.client.ethernet.ip.value = body.ipdaddr || '';
      this.elements.network.client.ethernet.netmask.value =
        body.netmask || '255.255.255.0';
      this.elements.network.client.ethernet.gateway.value = body.gateway || '';
    }).catch((e) => {
      console.error(`Failed to get ethernet config: ${e}`);
    }).then(() => {
      this.validateEthernet();
    });
  },

  showWifiSettings: function() {
    this.backButton.href = '/settings/network';
    this.view.classList.add('dark');
    this.hideNetworkElements();
    this.elements.network.client.wifi.wrap.classList.add('hidden');
    this.elements.network.client.wifi.list.classList.remove('hidden');
    this.elements.network.main.classList.remove('hidden');
    this.elements.network.client.wifi.main.classList.remove('hidden');

    fetch('/settings/network/wireless/networks', {
      headers: {
        Authorization: `Bearer ${API.jwt}`,
        Accept: 'application/json',
      },
    }).then((res) => {
      return res.json();
    }).then((body) => {
      this.elements.network.client.wifi.list.innerHTML = '';
      body.forEach((network) => new WirelessNetwork(network));
    }).catch((e) => {
      console.error(`Failed to scan for wireless networks: ${e}`);
    }).then(() => {
      this.validateWlan();
    });
  },

  showWifiConfigure: function() {
    this.backButton.href = '/settings/network/wifi';
    this.view.classList.add('dark');
    this.hideNetworkElements();
    this.elements.network.client.wifi.password.value = '';
    this.elements.network.client.wifi.list.classList.add('hidden');
    this.elements.network.client.wifi.wrap.classList.remove('hidden');
    this.elements.network.main.classList.remove('hidden');
    this.elements.network.client.wifi.main.classList.remove('hidden');
  },

  showWanSettings: function() {
    this.backButton.href = '/settings/network';
    this.view.classList.add('dark');
    this.hideNetworkElements();
    this.elements.network.main.classList.remove('hidden');

    // set default values in case things go bad
    this.elements.network.router.wan.netmask.value = '255.255.255.0';

    this.elements.network.router.wan.main.classList.remove('hidden');

    fetch('/settings/network/wan', {
      headers: {
        Authorization: `Bearer ${API.jwt}`,
        Accept: 'application/json',
      },
    }).then((res) => {
      if (!res.ok) {
        throw new Error(`Error status: ${res.status}`);
      }

      return res.json();
    }).then((body) => {
      this.elements.network.router.wan.mode.value = body.mode || 'dhcp';
      this.elements.network.router.wan.ip.value = body.ipdaddr || '';
      this.elements.network.router.wan.netmask.value = body.netmask || '';
      this.elements.network.router.wan.gateway.value = body.gateway || '';
      this.elements.network.router.wan.username.value = body.username || '';
      this.elements.network.router.wan.password.value = body.password || '';
    }).catch((e) => {
      console.error(`Failed to get WAN config: ${e}`);
    }).then(() => {
      this.validateWan();
    });
  },

  showLanSettings: function() {
    this.backButton.href = '/settings/network';
    this.view.classList.add('dark');
    this.hideNetworkElements();
    this.elements.network.main.classList.remove('hidden');

    // set default values in case things go bad
    this.elements.network.router.lan.netmask.value = '255.255.255.0';
    this.elements.network.router.lan.dhcp.checked = true;
    this.elements.network.router.lan.ip.value = '192.168.2.1';

    this.elements.network.router.lan.main.classList.remove('hidden');

    fetch('/settings/network/lan', {
      headers: {
        Authorization: `Bearer ${API.jwt}`,
        Accept: 'application/json',
      },
    }).then((res) => {
      if (!res.ok) {
        throw new Error(`Error status: ${res.status}`);
      }

      return res.json();
    }).then((body) => {
      this.elements.network.router.lan.ip.value = body.ipdaddr || '192.168.2.1';
      this.elements.network.router.lan.netmask.value =
        body.netmask || '255.255.255.0';

      return fetch('/settings/network/dhcp', {
        headers: {
          Authorization: `Bearer ${API.jwt}`,
          Accept: 'application/json',
        },
      });
    }).then((res) => {
      if (!res.ok) {
        throw new Error(`Error status: ${res.status}`);
      }

      return res.json();
    }).then((body) => {
      this.elements.network.router.lan.dhcp.checked = body.enabled;
    }).catch((e) => {
      console.error(`Failed to get LAN config: ${e}`);
    }).then(() => {
      this.validateLan();
    });
  },

  showWlanSettings: function() {
    this.backButton.href = '/settings/network';
    this.view.classList.add('dark');
    this.hideNetworkElements();
    this.elements.network.main.classList.remove('hidden');
    this.elements.network.router.wlan.main.classList.remove('hidden');

    fetch('/settings/network/wireless', {
      headers: {
        Authorization: `Bearer ${API.jwt}`,
        Accept: 'application/json',
      },
    }).then((res) => {
      if (!res.ok) {
        throw new Error(`Error status: ${res.status}`);
      }

      return res.json();
    }).then((body) => {
      this.elements.network.router.wlan.enable.checked = body.enabled;
      this.elements.network.router.wlan.ssid.value = body.options.ssid || '';
      this.elements.network.router.wlan.password.value = body.options.key || '';
    }).catch((e) => {
      console.error(`Failed to get WLAN config: ${e}`);
    }).then(() => {
      this.validateWlan();
    });
  },

  showUserSettings: function() {
    this.userSettings.classList.remove('hidden');
    this.userSettingsEdit.classList.add('hidden');
    this.userSettingsAdd.classList.add('hidden');
    this.userSettingsMain.classList.remove('hidden');
    this.addUserButton.classList.remove('hidden');

    API.getAllUserInfo().then((users) => {
      const usersList = document.getElementById('users-list');
      usersList.innerHTML = '';

      for (const metadata of users) {
        new User(metadata);
      }
    });
  },

  showEditUserScreen: function(id) {
    this.backButton.href = '/settings/users';
    this.userSettings.classList.remove('hidden');
    this.userSettingsMain.classList.add('hidden');
    this.userSettingsAdd.classList.add('hidden');
    this.userSettingsEdit.classList.remove('hidden');
    this.view.classList.add('dark');

    API.getUser(id).then((user) => {
      const form = document.getElementById('edit-user-form');
      const email = document.getElementById('user-settings-edit-email');
      const name = document.getElementById('user-settings-edit-name');
      const password = document.getElementById('user-settings-edit-password');
      const newPassword =
        document.getElementById('user-settings-edit-new-password');
      const confirmPassword =
        document.getElementById('user-settings-edit-confirm-password');
      const passwordMismatch =
        document.getElementById('user-settings-edit-password-mismatch');
      const error = document.getElementById('user-settings-edit-error');

      email.value = user.email;
      name.value = user.name;
      password.value = '';
      newPassword.value = '';
      confirmPassword.value = '';
      name.focus();

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        error.classList.add('hidden');
        if (newPassword.value !== '' &&
            newPassword.value !== confirmPassword.value) {
          passwordMismatch.classList.remove('hidden');
          return;
        } else {
          passwordMismatch.classList.add('hidden');
        }

        const emailValue = email.value;
        const nameValue = name.value;
        const passwordValue = password.value;
        const newPasswordValue =
          newPassword.value !== '' ? newPassword.value : null;

        API.editUser(id, nameValue, emailValue, passwordValue,
                     newPasswordValue)
          .then(() => {
            page('/settings/users');
          })
          .catch((err) => {
            error.classList.remove('hidden');
            error.textContent = err.message;
            console.error(err);
          });

        return false;
      });
    });
  },

  showAddUserScreen: function() {
    this.backButton.href = '/settings/users';
    this.userSettings.classList.remove('hidden');
    this.userSettingsMain.classList.add('hidden');
    this.userSettingsEdit.classList.add('hidden');
    this.userSettingsAdd.classList.remove('hidden');
    this.view.classList.add('dark');

    const form = document.getElementById('add-user-form');
    const email = document.getElementById('user-settings-add-email');
    const name = document.getElementById('user-settings-add-name');
    const password = document.getElementById('user-settings-add-password');
    const confirmPassword =
      document.getElementById('user-settings-add-confirm-password');
    const passwordMismatch =
      document.getElementById('user-settings-add-password-mismatch');
    const error = document.getElementById('user-settings-add-error');

    email.value = '';
    name.value = '';
    password.value = '';
    confirmPassword.value = '';
    name.focus();

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      error.classList.add('hidden');
      if (password.value !== confirmPassword.value) {
        passwordMismatch.classList.remove('hidden');
        return;
      } else {
        passwordMismatch.classList.add('hidden');
      }

      const emailValue = email.value;
      const nameValue = name.value;
      const passwordValue = password.value;

      API.addUser(nameValue, emailValue, passwordValue)
        .then(() => {
          page('/settings/users');
        })
        .catch((err) => {
          error.classList.remove('hidden');
          error.textContent = err.message;
          console.error(err);
        });

      return false;
    });
  },

  showAdapterSettings: function() {
    this.adapterSettings.classList.remove('hidden');

    const opts = {
      headers: API.headers(),
    };

    // Fetch a list of adapters from the server
    fetch('/adapters', opts).then((response) => {
      return response.json();
    }).then((adapters) => {
      const noAdapters = document.getElementById('no-adapters');
      const adaptersList = document.getElementById('adapters-list');
      adaptersList.innerHTML = '';

      if (adapters.length == 0) {
        noAdapters.classList.remove('hidden');
        adaptersList.classList.add('hidden');
      } else {
        noAdapters.classList.add('hidden');
        adaptersList.classList.remove('hidden');

        adapters
          .sort((a, b) => a.name.localeCompare(b.name))
          .forEach((metadata) => new Adapter(metadata));
      }
    });
  },

  fetchInstalledAddonList: function(force) {
    if (force) {
      this.fetchInstalledAddonsDeferred = null;
    }

    if (this.fetchInstalledAddonsDeferred) {
      return this.fetchInstalledAddonsDeferred.catch(() => {
        this.fetchInstalledAddonsDeferred = null;
        return this.fetchInstalledAddonList();
      });
    }

    this.fetchInstalledAddonsDeferred = fetch('/addons', {
      headers: API.headers(),
    }).then((response) => {
      return response.json();
    }).then((body) => {
      if (!body) {
        return;
      }

      // Store a map of name->version.
      this.installedAddons.clear();
      for (const s of body) {
        try {
          const settings = JSON.parse(s.value);
          this.installedAddons.set(settings.name, settings);
        } catch (err) {
          console.error(`Failed to parse add-on settings: ${err}`);
        }
      }
    });

    return this.fetchInstalledAddonsDeferred;
  },

  fetchAvailableAddonList: function(force) {
    // Force a refresh of this list every 5 minutes in order to pick up
    // updates in long-running tabs.
    if (!this.availableAddonsLastFetched ||
        (new Date()) - this.availableAddonsLastFetched > 5 * 60 * 1000) {
      force = true;
    }

    if (force) {
      this.fetchAvailableAddonsDeferred = null;
    }

    if (this.fetchAvailableAddonsDeferred) {
      return this.fetchAvailableAddonsDeferred.catch(() => {
        this.fetchAvailableAddonsDeferred = null;
        return this.fetchAvailableAddonList();
      });
    }

    this.fetchAvailableAddonsDeferred = fetch('/settings/addonsInfo', {
      headers: API.headers(),
    }).then((response) => {
      return response.json();
    }).then((data) => {
      if (!data || !data.url || !data.api || !data.architecture ||
          !data.version || !data.nodeVersion) {
        return;
      }

      const params = new URLSearchParams();
      params.set('api', data.api);
      params.set('arch', data.architecture);
      params.set('version', data.version);
      params.set('node', data.nodeVersion);

      if (data.pythonVersions && data.pythonVersions.length > 0) {
        params.set('python', data.pythonVersions.join(','));
      }

      if (data.testAddons) {
        params.set('test', '1');
      }

      return fetch(`${data.url}?${params.toString()}`, {
        method: 'GET',
        cache: 'reload',
        headers: {
          Accept: 'application/json',
        },
      });
    }).then((resp) => {
      return resp.json();
    }).then((body) => {
      this.availableAddons.clear();
      for (const addon of body) {
        const entry = {
          name: addon.name,
          displayName: addon.display_name,
          description: addon.description,
          author: addon.author,
          homepage: addon.homepage,
          license: addon.license,
          version: addon.version,
          url: addon.url,
          checksum: addon.checksum,
          installed: this.installedAddons.has(addon.name),
        };
        this.availableAddons.set(addon.name, entry);
      }
    });

    return this.fetchAvailableAddonsDeferred;
  },

  showAddonSettings: function() {
    this.addonSettings.classList.remove('hidden');
    this.addonConfigSettings.classList.add('hidden');
    this.addonDiscoverySettings.classList.add('hidden');
    this.addonConfigSettings.classList.add('hidden');
    this.addonMainSettings.classList.remove('hidden');
    this.discoverAddonsButton.classList.remove('hidden');

    const components = new Map();

    // First, get the list of installed add-ons. Do this separately so that the
    // add-ons can be displayed when no internet connection is present.
    this.fetchInstalledAddonList(true).then(() => {
      const addonList = document.getElementById('installed-addons-list');
      addonList.innerHTML = '';

      Array.from(this.installedAddons.entries())
        .sort((a, b) => {
          const aName = a[1].display_name || a[1].name || '';
          const bName = b[1].display_name || b[1].name || '';
          return aName.localeCompare(bName);
        })
        .forEach((x) => {
          components.set(
            x[0],
            new InstalledAddon(x[1], this.installedAddons, this.availableAddons)
          );
        });

      // Now, we can attempt to get the list of available add-ons.
      return this.fetchAvailableAddonList(true);
    }).then(() => {
      // Compare versions of installed and available add-ons, signaling
      // available updates where necessary.
      for (const name of Array.from(this.installedAddons.keys()).sort()) {
        const addon = this.installedAddons.get(name);

        if (this.availableAddons.has(name)) {
          const available = this.availableAddons.get(name);
          const cmp = this.compareSemver(addon.version, available.version);

          if (cmp < 0) {
            const component = components.get(name);

            if (component) {
              component.setUpdateAvailable(
                available.url,
                available.version,
                available.checksum
              );
            }
          }
        }
      }
    }).catch(console.error);
  },

  showAddonConfigScreen: function(id) {
    this.backButton.href = '/settings/addons';
    this.addonSettings.classList.remove('hidden');
    this.addonMainSettings.classList.add('hidden');
    this.addonConfigSettings.classList.remove('hidden');
    this.addonDiscoverySettings.classList.add('hidden');
    this.addonConfigTitleName.textContent = `Configure ${id}`;
    this.view.classList.add('dark');

    // Force an update in case the add-on was previously updated.
    this.fetchInstalledAddonList(true).then(() => {
      const existingForm =
        this.addonConfigSettings.querySelector('.json-schema-form');
      if (existingForm) {
        existingForm.parentNode.removeChild(existingForm);
      }
      const addon = this.installedAddons.get(id);
      new AddonConfig(id, addon);
    }).catch(console.error);
  },

  showDiscoveredAddonsScreen: function() {
    this.backButton.href = '/settings/addons';
    this.addonSettings.classList.remove('hidden');
    this.addonMainSettings.classList.add('hidden');
    this.addonConfigSettings.classList.add('hidden');
    this.addonDiscoverySettings.classList.remove('hidden');
    this.view.classList.add('dark');

    this.fetchInstalledAddonList(false).then(() => {
      return this.fetchAvailableAddonList(false);
    }).then(() => {
      const addonList = document.getElementById('discovered-addons-list');
      addonList.innerHTML = '';

      Array.from(this.availableAddons.entries())
        .sort((a, b) => a[1].displayName.localeCompare(b[1].displayName))
        .forEach((x) => new DiscoveredAddon(x[1],
                                            this.installedAddons,
                                            this.availableAddons));
    }).catch(console.error);
  },

  showExperimentCheckbox: (experiment, checkboxId) => {
    const checkbox = document.getElementById(checkboxId);
    API.getExperimentSetting(experiment)
      .then((value) => {
        checkbox.checked = value;
      })
      .catch((e) => {
        console.error(
          `Error getting ${experiment} experiment setting ${e}`);
      });

    checkbox.addEventListener('change', (e) => {
      const value = e.target.checked ? true : false;
      API.setExperimentSetting(experiment, value).then(() => {
        if (value) {
          Menu.showItem(experiment);
        } else {
          Menu.hideItem(experiment);
        }
      }).catch((e) => {
        console.error(`Failed to enable ${experiment} experiment: ${e}`);
      });
    });
  },

  showExperimentSettings: function() {
    this.experimentSettings.classList.remove('hidden');
    this.showExperimentCheckbox('assistant', 'assistant-experiment-checkbox');
    this.showExperimentCheckbox('logs', 'logs-experiment-checkbox');
  },

  /**
   * Compare two semantic versions
   * @param {String} verA
   * @param {String} verB
   * @return {number} 0 if verA == verB, -1 if verA < verB, 1 if verA > verB
   */
  compareSemver: (verA, verB) => {
    if (verA === verB) {
      return 0;
    }

    function parsePart(part) {
      return parseInt(part, 10);
    }

    const partsA = verA.split('.').map(parsePart);
    const partsB = verB.split('.').map(parsePart);

    for (let i = 0; i < partsA.length; i++) {
      const partA = partsA[i];
      const partB = partsB[i];
      if (partA === partB) {
        continue;
      }
      if (partA < partB) {
        return -1;
      }
      return 1;
    }
    return 0;
  },

  showUpdateSettings: function() {
    this.updateSettings.classList.remove('hidden');
    const updateNow = document.getElementById('update-now');

    updateNow.addEventListener('click', this.onUpdateClick);
    this.fetchUpdateInfo();
  },

  fetchUpdateInfo: function() {
    const upToDateElt = document.getElementById('update-settings-up-to-date');
    const updateNow = document.getElementById('update-now');
    const versionElt = document.getElementById('update-settings-version');
    const statusElt = document.getElementById('update-settings-status');

    const fetches = Promise.all([API.getUpdateStatus(), API.getUpdateLatest()]);
    fetches.then((results) => {
      const status = results[0];
      const latest = results[1];
      let cmp = 0;
      if (latest.version) {
        cmp = this.compareSemver(status.version, latest.version);
      }
      if (cmp < 0) {
        // Update available
        upToDateElt.textContent = 'New version available';
        updateNow.classList.remove('hidden');
        updateNow.classList.remove('disabled');
      } else {
        // All up to date!
        upToDateElt.textContent = 'Your system is up to date';
        updateNow.classList.add('hidden');
      }
      versionElt.textContent =
        `Current version: ${Utils.escapeHtml(status.version)}`;
      let statusText = 'Last update: ';

      if (status.timestamp) {
        statusText += new Date(status.timestamp).toString();

        if (!status.success) {
          statusText += ' (failed)';
        }
      } else {
        statusText += 'Never';
      }

      statusElt.textContent = statusText;
    });
  },

  onUpdateClick: function() {
    const updateNow = document.getElementById('update-now');
    updateNow.removeEventListener('click', this.onUpdateClick);
    updateNow.classList.add('disabled');

    fetch('/updates/update', {
      headers: API.headers(),
      method: 'POST',
    }).then(() => {
      updateNow.textContent = 'In Progress';
      let isDown = false;
      function checkStatus() {
        API.getUpdateStatus().then(() => {
          if (isDown) {
            window.location.reload(true);
          } else {
            setTimeout(checkStatus, 5000);
          }
        }).catch(() => {
          if (!isDown) {
            updateNow.textContent = 'Restarting';
            isDown = true;
          }
          setTimeout(checkStatus, 5000);
        });
      }
      checkStatus();
    }).catch(() => {
      updateNow.textContent = 'Error';
    });
  },

  showAuthorizationSettings: function() {
    this.authorizationSettings.classList.remove('hidden');

    fetch('/authorizations', {
      headers: API.headers(),
    }).then((response) => {
      return response.json();
    }).then((clients) => {
      const authorizationsList = document.getElementById('authorizations');
      const noAuthorizations = document.getElementById('no-authorizations');

      for (const child of authorizationsList.children) {
        if (child.id === 'no-authorizations' ||
            child.id === 'new-local-authorization') {
          continue;
        }
        child.parentNode.removeChild(child);
      }

      if (clients.length === 0) {
        noAuthorizations.classList.remove('hidden');
        return;
      }

      noAuthorizations.classList.add('hidden');

      for (const client of clients) {
        const authorization = document.createElement('li');
        authorization.classList.add('authorization-item');
        const name = document.createElement('p');
        name.textContent = client.name;
        const origin = document.createElement('p');
        origin.classList.add('origin');
        origin.textContent = new URL(client.redirect_uri).host;
        const revoke = document.createElement('input');
        revoke.classList.add('revoke-button', 'text-button');
        revoke.type = 'button';
        revoke.value = 'Revoke';
        revoke.dataset.clientId = client.id;
        revoke.addEventListener('click', this.revokeAuthorization);

        authorization.appendChild(name);
        authorization.appendChild(origin);
        authorization.appendChild(revoke);
        authorizationsList.insertBefore(authorization, noAuthorizations);
      }
    });
  },

  revokeAuthorization: (event) => {
    const revoke = event.target;
    if (!revoke.dataset.clientId) {
      console.warn('Missing clientId on revoke', revoke);
      return;
    }
    const clientId = revoke.dataset.clientId;

    fetch(`/authorizations/${encodeURIComponent(clientId)}`, {
      headers: API.headers(),
      method: 'DELETE',
    }).then(() => {
      const authorization = revoke.parentNode;
      const authorizationsList = authorization.parentNode;
      authorizationsList.removeChild(authorization);

      if (authorizationsList.children.length === 0) {
        const noAuthorizations = document.getElementById('no-authorizations');
        noAuthorizations.classList.remove('hidden');
      }
    }).catch((err) => {
      console.warn('Unable to revoke', err);
    });
  },

  showDeveloperSettings: function() {
    this.developerSettings.classList.remove('hidden');

    document.getElementById('view-internal-logs').href = `/internal-logs?jwt=${API.jwt}`;
    const sshCheckbox = document.getElementById('enable-ssh-checkbox');

    fetch('/settings/system/ssh', {
      headers: API.headers(),
    }).then((response) => {
      return response.json();
    }).then((body) => {
      sshCheckbox.checked = body.enabled;
      if (body.toggleImplemented) {
        sshCheckbox.addEventListener('change', (e) => {
          const value = e.target.checked ? true : false;
          fetch('/settings/system/ssh', {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${API.jwt}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({enabled: value}),
          }).catch((e) => {
            console.error(`Failed to toggle SSH: ${e}`);
          });
        });
      } else {
        sshCheckbox.disabled = true;
      }
    }).catch((e) => {
      console.error(`Error getting SSH setting: ${e}`);
    });
  },
};

module.exports = SettingsScreen;
