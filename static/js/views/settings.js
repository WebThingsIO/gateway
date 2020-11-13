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
const fluent = require('../fluent');
const InstalledAddon = require('./installed-addon');
const ipRegex = require('ip-regex')({exact: true});
const Menu = require('./menu');
const page = require('page');
const QRCode = require('qrcode-svg');
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
    this.discoveredAddonsSearch =
      document.getElementById('discovered-addons-search');
    this.experimentSettings = document.getElementById('experiment-settings');
    this.localizationSettings =
      document.getElementById('localization-settings');
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

    this.insertTitleElement(this.menu, fluent.getMessage('settings'),
                            '/images/settings-icon.png');
    this.insertTitleElement(this.domainSettings, fluent.getMessage('domain'),
                            '/images/domain-icon.png');
    this.insertTitleElement(this.userSettingsMain, fluent.getMessage('users'),
                            '/images/users-icon.png');
    this.insertTitleElement(this.userSettingsEdit,
                            fluent.getMessage('edit-user'),
                            '/images/user.svg');
    this.insertTitleElement(this.userSettingsAdd, fluent.getMessage('add-user'),
                            '/images/user.svg');
    this.insertTitleElement(this.adapterSettings, fluent.getMessage('adapters'),
                            '/images/adapters-icon.png');
    this.insertTitleElement(this.addonMainSettings, fluent.getMessage('addons'),
                            '/images/add-on.svg');
    const addonConfigTitle =
      this.insertTitleElement(this.addonConfigSettings,
                              fluent.getMessage('addon-config'),
                              '/images/add-on.svg');
    this.addonConfigTitleName =
      addonConfigTitle.querySelector('.section-title-name');

    this.insertTitleElement(this.addonDiscoverySettings,
                            fluent.getMessage('addon-discovery'),
                            '/images/add-on.svg');
    this.insertTitleElement(this.experimentSettings,
                            fluent.getMessage('experiments'),
                            '/images/experiments-icon.png');
    this.insertTitleElement(this.localizationSettings,
                            fluent.getMessage('localization'),
                            '/images/localization-icon.svg');
    this.insertTitleElement(this.updateSettings,
                            fluent.getMessage('updates'),
                            '/images/update-icon.svg');
    this.insertTitleElement(this.authorizationSettings,
                            fluent.getMessage('authorizations'),
                            '/images/authorization.svg');
    this.insertTitleElement(this.developerSettings,
                            fluent.getMessage('developer'),
                            '/images/developer-icon.svg');

    this.discoverAddonsButton.addEventListener('click', () => {
      page('/settings/addons/discovered');
    });
    this.backButton.addEventListener('click', () => {
      this.discoveredAddonsSearch.value = '';
    });
    this.discoveredAddonsSearch.addEventListener('input', () => {
      this.updateDiscoveredAddonsList();
    });
    this.addUserButton.addEventListener('click', () => {
      page('/settings/users/add');
    });

    this.setupDomainElements();
    this.setupNetworkElements();
    this.setupUserElements();
    this.setupLocalizationElements();
    this.setupUpdateElements();
    this.setupExperimentElements();
    this.setupDeveloperElements();
  },

  setupDomainElements: function() {
    this.elements.domain = {
      update: document.getElementById('domain-settings-local-update'),
      localName: document.getElementById('domain-settings-local-name'),
      localCheckbox: document.getElementById('domain-settings-local-checkbox'),
      tunnelName: document.getElementById('domain-settings-tunnel-name'),
    };

    this.elements.domain.update.addEventListener(
      'click',
      this.onLocalDomainClick.bind(this)
    );

    this.elements.domain.localCheckbox.addEventListener(
      'change',
      this.onLocalDomainCheckboxChange.bind(this)
    );
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
      fluent.getMessage('network'),
      '/images/network.svg'
    );
    this.insertTitleElement(
      this.elements.network.client.main,
      fluent.getMessage('network'),
      '/images/network.svg'
    );
    this.insertTitleElement(
      this.elements.network.client.ethernet.main,
      fluent.getMessage('network-settings-ethernet'),
      '/images/ethernet.svg'
    );
    this.elements.network.client.wifi.title = this.insertTitleElement(
      this.elements.network.client.wifi.main,
      fluent.getMessage('network-settings-wifi'),
      '/images/wifi.svg'
    ).querySelector('.section-title-name');
    this.insertTitleElement(
      this.elements.network.router.main,
      fluent.getMessage('network'),
      '/images/network.svg'
    );
    this.insertTitleElement(
      this.elements.network.router.wan.main,
      fluent.getMessage('network-settings-internet-wan'),
      '/images/internet.svg'
    );
    this.insertTitleElement(
      this.elements.network.router.lan.main,
      fluent.getMessage('network-settings-home-network-lan'),
      '/images/network.svg'
    );
    this.insertTitleElement(
      this.elements.network.router.wlan.main,
      fluent.getMessage('network-settings-wifi-wlan'),
      '/images/wifi.svg'
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
          fluent.getMessage('network-settings-changing'),
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

        API.setLanSettings(body).then(() => {
          page('/settings/network');
          ev.target.disabled = false;
        }).catch((e) => {
          App.showMessage(fluent.getMessage('failed-ethernet-configure'), 3000);
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
          fluent.getMessage('network-settings-changing'),
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

        API.setWlanSettings(body).then(() => {
          page('/settings/network');
          ev.target.disabled = false;
        }).catch((e) => {
          App.showMessage(fluent.getMessage('failed-wifi-configure'), 3000);
          console.error(`Failed to set Wi-Fi config: ${e}`);
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
          fluent.getMessage('network-settings-changing'),
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

        API.setWanSettings(body).then(() => {
          page('/settings/network');
          ev.target.disabled = false;
        }).catch((e) => {
          App.showMessage(fluent.getMessage('failed-wan-configure'), 3000);
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
          fluent.getMessage('network-settings-changing'),
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

        API.setLanSettings(lanBody).then(() => {
          return API.setDhcpSettings(dhcpBody);
        }).then(() => {
          page('/settings/network');
          ev.target.disabled = false;
        }).catch((e) => {
          App.showMessage(fluent.getMessage('failed-lan-configure'), 3000);
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
          fluent.getMessage('network-settings-changing'),
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

        API.setWlanSettings(body).then(() => {
          page('/settings/network');
          ev.target.disabled = false;
        }).catch((e) => {
          App.showMessage(fluent.getMessage('failed-configure-wlan'), 3000);
          console.error(`Failed to set WLAN config: ${e}`);
          ev.target.disabled = false;
        });
      }
    );
    this.validateWlan();
  },
  /* eslint-enable max-len */

  /* eslint-disable max-len */
  setupUserElements: function() {
    this.elements.user = {
      edit: {
        save: document.getElementById('user-settings-edit-save'),
        form: document.getElementById('edit-user-form'),
        id: document.getElementById('user-settings-edit-id'),
        email: document.getElementById('user-settings-edit-email'),
        name: document.getElementById('user-settings-edit-name'),
        password: document.getElementById('user-settings-edit-password'),
        newPassword: document.getElementById('user-settings-edit-new-password'),
        confirmPassword: document.getElementById('user-settings-edit-confirm-password'),
        passwordMismatch: document.getElementById('user-settings-edit-password-mismatch'),
        mfaEnabled: document.getElementById('user-settings-edit-mfa-enabled'),
        mfaForm: document.getElementById('user-settings-edit-mfa-form'),
        mfaQrCode: document.getElementById('user-settings-mfa-qr-code'),
        mfaSecret: document.getElementById('user-settings-mfa-secret'),
        mfaTotp: document.getElementById('user-settings-mfa-totp'),
        mfaVerify: document.getElementById('user-settings-mfa-verify'),
        mfaError: document.getElementById('user-settings-mfa-error'),
        mfaRegenerateCodes: document.getElementById('user-settings-mfa-regenerate-codes'),
        mfaBackupCodesMessage: document.getElementById('user-settings-mfa-backup-codes-message'),
        mfaBackupCodes: document.getElementById('user-settings-mfa-backup-codes'),
        error: document.getElementById('user-settings-edit-error'),
      },
      add: {
        save: document.getElementById('user-settings-add-save'),
        form: document.getElementById('add-user-form'),
        email: document.getElementById('user-settings-add-email'),
        name: document.getElementById('user-settings-add-name'),
        password: document.getElementById('user-settings-add-password'),
        confirmPassword: document.getElementById('user-settings-add-confirm-password'),
        passwordMismatch: document.getElementById('user-settings-add-password-mismatch'),
        error: document.getElementById('user-settings-add-error'),
      },
    };

    this.elements.user.edit.mfaEnabled.addEventListener('change', (e) => {
      const id = parseInt(this.elements.user.edit.id.value, 10);

      if (e.target.checked) {
        API.userEnableMfa(id).then((body) => {
          this.elements.user.edit.mfaForm.classList.remove('hidden');
          const qrcode = new QRCode({
            content: body.url,
            container: 'svg-viewbox',
            join: true,
          });
          this.elements.user.edit.mfaQrCode.innerHTML = qrcode.svg();
          this.elements.user.edit.mfaSecret.innerText = body.secret;
          this.elements.user.edit.mfaVerify.disabled = true;
        }).catch(console.error);
      } else {
        API.userDisableMfa(id).then(() => {
          this.elements.user.edit.mfaError.classList.add('hidden');
          this.elements.user.edit.mfaForm.classList.add('hidden');
          this.elements.user.edit.mfaRegenerateCodes.classList.add('hidden');
        }).catch(console.error);
      }
    });

    this.elements.user.edit.mfaTotp.addEventListener('input', (e) => {
      this.elements.user.edit.mfaVerify.disabled = e.target.value.length !== 6;
    });

    this.elements.user.edit.mfaVerify.addEventListener('click', (e) => {
      e.target.disabled = true;
      const id = parseInt(this.elements.user.edit.id.value, 10);

      API.userEnableMfa(id, this.elements.user.edit.mfaTotp.value)
        .then((body) => {
          e.target.disabled = false;
          this.elements.user.edit.mfaError.classList.add('hidden');
          this.elements.user.edit.mfaForm.classList.add('hidden');
          this.elements.user.edit.mfaBackupCodesMessage.classList.remove('hidden');
          this.elements.user.edit.mfaBackupCodes.classList.remove('hidden');
          body.backupCodes.forEach((c) => {
            const p = document.createElement('p');
            p.innerText = c;
            this.elements.user.edit.mfaBackupCodes.appendChild(p);
          });
        }).catch(() => {
          e.target.disabled = false;
          this.elements.user.edit.mfaError.classList.remove('hidden');
        });
    });

    this.elements.user.edit.mfaRegenerateCodes.addEventListener(
      'click',
      (e) => {
        e.target.disabled = true;
        const id = parseInt(this.elements.user.edit.id.value, 10);

        API.userRegenerateMfaBackupCodes(id).then((body) => {
          e.target.disabled = false;
          this.elements.user.edit.mfaBackupCodesMessage.classList.remove('hidden');
          this.elements.user.edit.mfaBackupCodes.classList.remove('hidden');
          this.elements.user.edit.mfaBackupCodes.innerHTML = '';
          body.backupCodes.forEach((c) => {
            const p = document.createElement('p');
            p.innerText = c;
            this.elements.user.edit.mfaBackupCodes.appendChild(p);
          });
        }).catch((err) => {
          e.target.disabled = false;
          console.error(err);
        });
      }
    );

    this.elements.user.edit.form.addEventListener('submit', (e) => {
      e.preventDefault();

      this.elements.user.edit.save.disabled = true;
      this.elements.user.edit.error.classList.add('hidden');
      if (this.elements.user.edit.newPassword.value !== '' &&
          this.elements.user.edit.newPassword.value !==
            this.elements.user.edit.confirmPassword.value) {
        this.elements.user.edit.passwordMismatch.classList.remove('hidden');
        return;
      } else {
        this.elements.user.edit.passwordMismatch.classList.add('hidden');
      }

      const id = parseInt(this.elements.user.edit.id.value, 10);
      const emailValue = this.elements.user.edit.email.value;
      const nameValue = this.elements.user.edit.name.value;
      const passwordValue = this.elements.user.edit.password.value;
      const newPasswordValue =
        this.elements.user.edit.newPassword.value !== '' ?
          this.elements.user.edit.newPassword.value :
          null;

      API.editUser(id, nameValue, emailValue, passwordValue, newPasswordValue)
        .then(() => {
          this.elements.user.edit.save.disabled = false;
          page('/settings/users');
        })
        .catch((err) => {
          this.elements.user.edit.save.disabled = false;
          this.elements.user.edit.error.classList.remove('hidden');
          this.elements.user.edit.error.textContent = err.message;
          console.error(err);
        });
    });

    this.elements.user.add.form.addEventListener('submit', (e) => {
      e.preventDefault();

      this.elements.user.add.save.disabled = true;
      this.elements.user.add.error.classList.add('hidden');
      if (this.elements.user.add.password.value !==
            this.elements.user.add.confirmPassword.value) {
        this.elements.user.add.passwordMismatch.classList.remove('hidden');
        return;
      } else {
        this.elements.user.add.passwordMismatch.classList.add('hidden');
      }

      const emailValue = this.elements.user.add.email.value;
      const nameValue = this.elements.user.add.name.value;
      const passwordValue = this.elements.user.add.password.value;

      API.addUser(nameValue, emailValue, passwordValue)
        .then(() => {
          this.elements.user.add.save.disabled = false;
          page('/settings/users');
        })
        .catch((err) => {
          this.elements.user.add.save.disabled = false;
          this.elements.user.add.error.classList.remove('hidden');
          this.elements.user.add.error.textContent = err.message;
          console.error(err);
        });
    });
  },
  /* eslint-enable max-len */

  /* eslint-disable max-len */
  setupLocalizationElements: function() {
    this.elements.localization = {
      country: document.getElementById('localization-settings-country'),
      timezone: document.getElementById('localization-settings-timezone'),
      language: document.getElementById('localization-settings-language'),
      units: {
        temperature: document.getElementById('localization-settings-units-temperature'),
      },
    };

    this.elements.localization.country.addEventListener(
      'change',
      (ev) => {
        API.setCountry(ev.target.value)
          .catch(console.error);
      }
    );

    this.elements.localization.timezone.addEventListener(
      'change',
      (ev) => {
        API.setTimezone(ev.target.value)
          .then(() => window.location.reload())
          .catch(console.error);
      }
    );

    this.elements.localization.language.addEventListener(
      'change',
      (ev) => {
        API.setLanguage(ev.target.value)
          .then(() => window.location.reload())
          .catch(console.error);
      }
    );

    this.elements.localization.units.temperature.addEventListener(
      'change',
      (ev) => {
        API.setUnits({temperature: ev.target.value})
          .then(() => window.location.reload())
          .catch(console.error);
      }
    );
  },
  /* eslint-enable max-len */

  /* eslint-disable max-len */
  setupUpdateElements: function() {
    this.elements.update = {
      updateNow: document.getElementById('update-now'),
      enableSelfUpdatesCheckbox: document.getElementById('enable-self-updates-checkbox'),
    };

    this.elements.update.updateNow.addEventListener(
      'click',
      this.onUpdateClick
    );

    this.elements.update.enableSelfUpdatesCheckbox.addEventListener(
      'change',
      this.onEnableSelfUpdatesCheckboxChange
    );
  },
  /* eslint-enable max-len */

  setupExperimentElements: function() {
    // Uncomment this and change "example" to add a new experiment
    // this.showExperimentCheckbox('example', 'example-experiment-checkbox');
  },

  setupDeveloperElements: function() {
    this.elements.developer = {
      sshCheckbox: document.getElementById('enable-ssh-checkbox'),
      logsLink: document.getElementById('view-internal-logs'),
    };

    this.elements.developer.sshCheckbox.addEventListener('change', (e) => {
      const value = e.target.checked;
      API.setSshStatus(value).catch((e) => {
        console.error(`Failed to toggle SSH: ${e}`);
      });
    });
  },

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
        <img class="section-title-icon" alt="${name} ${fluent.getMessage('icon')}" src="${icon}" />
        <span class="section-title-name">${name}</span>
      </div>
      <div class="section-title-right-flex"></div>
    `;
    section.insertBefore(elt, section.firstChild);
    return elt;
  },

  show: function(section, subsection, id) {
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
    this.localizationSettings.classList.add('hidden');
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
      case 'localization':
        this.showLocalizationSettings();
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

    // Comented out until full integration of Dynamic tunnel creation
    // with Service Discovery
    // const addDomainTunnelButton =
    //   document.getElementById('domain-settings-moz-tunnel-change');
    //     addDomainTunnelButton.addEventListener('click', () => {
    //     this.onTunnelDomainClick();
    // });

    API.getTunnelInfo().then((body) => {
      if (body) {
        this.elements.domain.localCheckbox.checked = body.mDNSstate;
        this.elements.domain.localName.value = body.localDomain;
        this.elements.domain.tunnelName.innerText = body.tunnelDomain;
      } else {
        this.elements.domain.localName.value =
          fluent.getMessage('unknown-state');
        this.elements.domain.tunnelName.innerText =
          fluent.getMessage('unknown-state');
      }

      if (!this.elements.domain.localCheckbox.checked) {
        this.elements.domain.localName.disabled = true;
        this.elements.domain.update.disabled = true;
      }
    });
  },

  onLocalDomainCheckboxChange: (e) => {
    const error = document.getElementById('domain-settings-error');
    const value = e.target.checked ? true : false;

    API.setDomainSettings({local: {multicastDNSstate: value}}).then(() => {
      document.getElementById('domain-settings-local-update').disabled = !value;
      document.getElementById('domain-settings-local-name').disabled = !value;
      error.classList.add('hidden');
    }).catch((err) => {
      const errorMessage = `${fluent.getMessage('error')}: ${err}`;
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

    API.setDomainSettings({local: {localDNSname: localDomainName.value}})
      .then((domainJson) => {
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
        const errorMessage = `${fluent.getMessage('error')}: ${err}`;
        console.error(errorMessage);
        error.classList.remove('hidden');
        error.textContent = err;
      });
  },

  // The button controller to update the tunnel domain settings.
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

    API.getPlatform().then((body) => {
      switch (body.os) {
        case 'linux-debian':
        case 'linux-raspbian':
          this.elements.network.client.main.classList.remove('hidden');
          break;
        case 'linux-openwrt':
          this.elements.network.router.main.classList.remove('hidden');
          break;
        default:
          this.elements.network.unsupported.main.classList.remove('hidden');
          return Promise.resolve(null);
      }

      return API.getNetworkAddresses();
    }).then((body) => {
      if (!body) {
        return;
      }

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

    API.getLanSettings().then((body) => {
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

    API.getWirelessNetworks().then((body) => {
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

    API.getWanSettings().then((body) => {
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

    API.getLanSettings().then((body) => {
      this.elements.network.router.lan.ip.value = body.ipdaddr || '192.168.2.1';
      this.elements.network.router.lan.netmask.value =
        body.netmask || '255.255.255.0';

      return API.getDhcpSettings();
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

    API.getWlanSettings().then((body) => {
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
    this.elements.user.edit.mfaForm.classList.add('hidden');
    this.elements.user.edit.mfaError.classList.add('hidden');
    this.elements.user.edit.mfaBackupCodes.innerHTML = '';
    this.elements.user.edit.mfaBackupCodes.classList.add('hidden');
    this.elements.user.edit.mfaBackupCodesMessage.classList.add('hidden');
    this.elements.user.edit.mfaRegenerateCodes.classList.add('hidden');
    this.view.classList.add('dark');

    this.elements.user.edit.id.value = id;
    API.getUser(id).then((user) => {
      this.elements.user.edit.email.value = user.email;
      this.elements.user.edit.name.value = user.name;
      this.elements.user.edit.password.value = '';
      this.elements.user.edit.newPassword.value = '';
      this.elements.user.edit.confirmPassword.value = '';
      this.elements.user.edit.mfaEnabled.checked = user.mfaEnrolled;

      if (user.mfaEnrolled) {
        this.elements.user.edit.mfaRegenerateCodes.classList.remove('hidden');
      }

      this.elements.user.edit.name.focus();
    });
  },

  showAddUserScreen: function() {
    this.backButton.href = '/settings/users';
    this.userSettings.classList.remove('hidden');
    this.userSettingsMain.classList.add('hidden');
    this.userSettingsEdit.classList.add('hidden');
    this.userSettingsAdd.classList.remove('hidden');
    this.view.classList.add('dark');

    this.elements.user.add.email.value = '';
    this.elements.user.add.name.value = '';
    this.elements.user.add.password.value = '';
    this.elements.user.add.confirmPassword.value = '';
    this.elements.user.add.name.focus();
  },

  showAdapterSettings: function() {
    this.adapterSettings.classList.remove('hidden');

    // Fetch a list of adapters from the server
    API.getAdapters().then((adapters) => {
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

    this.fetchInstalledAddonsDeferred =
      API.getInstalledAddons().then((body) => {
        if (!body) {
          return;
        }

        // Store a map of id->version.
        this.installedAddons.clear();
        for (const s of body) {
          try {
            this.installedAddons.set(s.id, s);
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

    this.fetchAvailableAddonsDeferred = API.getAddonsInfo().then((data) => {
      if (!data || !data.urls || !data.architecture || !data.version ||
          !data.nodeVersion) {
        return;
      }

      const params = new URLSearchParams();
      params.set('arch', data.architecture);
      params.set('version', data.version);
      params.set('node', data.nodeVersion);

      if (data.pythonVersions && data.pythonVersions.length > 0) {
        params.set('python', data.pythonVersions.join(','));
      }

      if (data.testAddons) {
        params.set('test', '1');
      }

      const promises = [];

      for (const url of data.urls) {
        promises.push(fetch(`${url}?${params.toString()}`, {
          method: 'GET',
          cache: 'reload',
          headers: {
            Accept: 'application/json',
          },
        }));
      }

      return Promise.all(promises);
    }).then((responses) => {
      const promises = [];

      for (const resp of responses) {
        promises.push(resp.json());
      }

      return Promise.all(promises);
    }).then((bodies) => {
      this.availableAddons.clear();

      for (const body of bodies) {
        for (const addon of body) {
          const entry = {
            id: addon.id,
            name: addon.name,
            description: addon.description,
            author: addon.author,
            homepage_url: addon.homepage_url,
            license_url: addon.license_url,
            version: addon.version,
            url: addon.url,
            checksum: addon.checksum,
            primary_type: addon.primary_type,
            installed: this.installedAddons.has(addon.id),
          };

          // Check for duplicates, keep newest.
          if (this.availableAddons.has(addon.id) &&
              this.compareSemver(this.availableAddons.get(addon.id).version,
                                 entry.version) >= 0) {
            continue;
          }

          this.availableAddons.set(addon.id, entry);
        }
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
          const aName = a[1].name || a[1].id || '';
          const bName = b[1].name || b[1].id || '';
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
      for (const id of Array.from(this.installedAddons.keys()).sort()) {
        const addon = this.installedAddons.get(id);

        if (this.availableAddons.has(id)) {
          const available = this.availableAddons.get(id);
          const cmp = this.compareSemver(addon.version, available.version);

          if (cmp < 0) {
            const component = components.get(id);

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
      this.updateDiscoveredAddonsList();
    }).catch(console.error);
  },

  updateDiscoveredAddonsList: function() {
    const addonList = document.getElementById('discovered-addons-list');
    addonList.innerHTML = '';

    const searchText = this.discoveredAddonsSearch.value.toLowerCase();

    const contains = (a, b) => a.toLowerCase().indexOf(b.toLowerCase()) > -1;

    const matches = (x) => contains(x.id, searchText) ||
                           contains(x.name, searchText) ||
                           contains(x.description, searchText) ||
                           contains(x.primary_type, searchText);

    Array.from(this.availableAddons.entries())
      .filter((x) => matches(x[1]))
      .sort((a, b) => a[1].name.localeCompare(b[1].name))
      .forEach((x) => new DiscoveredAddon(x[1],
                                          this.installedAddons,
                                          this.availableAddons));
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

  showLocalizationSettings: function() {
    this.localizationSettings.classList.remove('hidden');

    const countrySelect = this.elements.localization.country;
    countrySelect.innerHTML = '';
    countrySelect.disabled = true;

    API.getCountry().then((response) => {
      for (const country of response.valid) {
        const option = document.createElement('option');
        option.value = country;
        option.innerText = country;

        if (country === response.current) {
          option.selected = 'selected';
        }

        countrySelect.appendChild(option);
      }

      countrySelect.disabled =
        !response.setImplemented || response.valid.length === 0;
    }).catch(console.error);

    const timezoneSelect = this.elements.localization.timezone;
    timezoneSelect.innerHTML = '';
    timezoneSelect.disabled = true;

    API.getTimezone().then((response) => {
      for (const zone of response.valid) {
        const option = document.createElement('option');
        option.value = zone;
        option.innerText = zone;

        if (zone === response.current) {
          option.selected = 'selected';
        }

        timezoneSelect.appendChild(option);
      }

      timezoneSelect.disabled =
        !response.setImplemented || response.valid.length === 0;
    }).catch(console.error);

    const languageSelect = this.elements.localization.language;
    languageSelect.innerHTML = '';

    API.getLanguage().then((response) => {
      if (response.current === 'en') {
        response.current = 'en-US';
      }

      for (const lang of response.valid) {
        const option = document.createElement('option');
        option.value = lang.code;
        option.innerText = lang.name;

        if (lang.code === response.current) {
          option.selected = 'selected';
        }

        languageSelect.appendChild(option);
      }
    }).catch(console.error);

    const temperatureSelect = this.elements.localization.units.temperature;

    API.getUnits().then((response) => {
      temperatureSelect.value = response.temperature;
    }).catch(console.error);
  },

  showUpdateSettings: function() {
    this.updateSettings.classList.remove('hidden');
    this.fetchUpdateInfo();
  },

  onEnableSelfUpdatesCheckboxChange: (e) => {
    const enabled = e.target.checked ? true : false;

    API.setSelfUpdateStatus(enabled).catch((e) => {
      console.error(`Failed to toggle auto-updates: ${e}`);
    });
  },

  fetchUpdateInfo: function() {
    const upToDateElt = document.getElementById('update-settings-up-to-date');
    const updateNow = document.getElementById('update-now');
    const versionElt = document.getElementById('update-settings-version');
    const statusElt = document.getElementById('update-settings-status');

    let status, support;
    Promise.all([
      API.getUpdateStatus(),
      API.getSelfUpdateStatus(),
    ]).then((results) => {
      status = results[0];
      support = results[1];

      if (!support.available) {
        upToDateElt.textContent = fluent.getMessage('updates-not-supported');
      }

      versionElt.textContent =
        `${fluent.getMessage('current-version')}: ${Utils.escapeHtml(status.version)}`;
      let statusText = `${fluent.getMessage('last-update')}: `;

      if (status.timestamp) {
        statusText += new Date(status.timestamp).toString();

        if (!status.success) {
          statusText += ` (${fluent.getMessage('failed')})`;
        }
      } else {
        statusText += fluent.getMessage('never');
      }

      this.elements.update.enableSelfUpdatesCheckbox.checked = support.enabled;
      this.elements.update.enableSelfUpdatesCheckbox.disabled =
        !support.available;

      if (support.available) {
        statusElt.textContent = statusText;
      } else {
        statusElt.classList.add('hidden');
      }

      if (support.available) {
        upToDateElt.textContent = fluent.getMessage('checking-for-updates');
        updateNow.classList.add('hidden');

        API.getUpdateLatest().then((latest) => {
          if (latest.version) {
            const cmp = this.compareSemver(status.version, latest.version);
            if (cmp < 0) {
              // Update available
              upToDateElt.textContent = fluent.getMessage('update-available');
              updateNow.classList.remove('hidden');
              updateNow.classList.remove('disabled');
            } else {
              // All up to date!
              upToDateElt.textContent = fluent.getMessage('update-up-to-date');
              updateNow.classList.add('hidden');
            }
          }
        }).catch(() => {
          upToDateElt.textContent =
            fluent.getMessage('failed-to-check-for-updates');
        });
      }
    });
  },

  onUpdateClick: function() {
    const updateNow = document.getElementById('update-now');
    updateNow.removeEventListener('click', this.onUpdateClick);
    updateNow.classList.add('disabled');

    API.startUpdate().then(() => {
      updateNow.textContent = fluent.getMessage('in-progress');
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
            updateNow.textContent = fluent.getMessage('restarting');
            isDown = true;
          }
          setTimeout(checkStatus, 5000);
        });
      }
      checkStatus();
    }).catch(() => {
      updateNow.textContent = fluent.getMessage('error');
    });
  },

  showAuthorizationSettings: function() {
    this.authorizationSettings.classList.remove('hidden');

    API.getAuthorizations().then((clients) => {
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

    API.revokeAuthorization(clientId).then(() => {
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

    this.elements.developer.logsLink.href = `/internal-logs?jwt=${API.jwt}`;

    API.getSshStatus().then((body) => {
      this.elements.developer.sshCheckbox.checked = body.enabled;
      if (!body.toggleImplemented) {
        this.elements.developer.sshCheckbox.disabled = true;
      }
    }).catch((e) => {
      console.error(`Error getting SSH setting: ${e}`);
    });
  },
};

module.exports = SettingsScreen;
