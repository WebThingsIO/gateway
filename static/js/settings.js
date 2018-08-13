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

const App = require('./app');
const API = require('./api');
const Menu = require('./menu');
const page = require('page');
const Adapter = require('./adapter');
const InstalledAddon = require('./installed-addon');
const DiscoveredAddon = require('./discovered-addon');
const User = require('./user');
const AddonConfig = require('./addon-config');
const Utils = require('./utils');

// eslint-disable-next-line no-unused-vars
const SettingsScreen = {

  /**
   * Initialise Settings Screen.
   */
  init: function() {
    this.view = document.getElementById('settings-view');
    this.titleElement = document.getElementById('section-title');
    this.titleName = document.getElementById('section-title-name');
    this.titleIcon = document.getElementById('section-title-icon');
    this.menu = document.getElementById('settings-menu');
    this.domainSettings = document.getElementById('domain-settings');
    this.userSettings = document.getElementById('user-settings');
    this.userSettingsMain = document.getElementById('user-settings-main');
    this.userSettingsEdit = document.getElementById('user-settings-edit');
    this.userSettingsAdd = document.getElementById('user-settings-add');
    this.adapterSettings = document.getElementById('adapter-settings');
    this.addonSettings = document.getElementById('addon-settings');
    this.addonMainSettings = document.getElementById('addon-main-settings');
    this.addonConfigSettings = document.getElementById('addon-config-settings');
    this.addonDiscoverySettings =
      document.getElementById('addon-discovery-settings');
    this.addonConfigSettings = document.getElementById('addon-config-settings');
    this.experimentSettings = document.getElementById('experiment-settings');
    this.updateSettings = document.getElementById('update-settings');
    this.authorizationSettings =
      document.getElementById('authorization-settings');
    this.developerSettings = document.getElementById('developer-settings');
    this.backButton = document.getElementById('settings-back-button');

    this.availableAddons = new Map();
    this.installedAddons = new Map();
    this.fetchAddonDeferred = null;
  },

  show: function(section, subsection, id) {
    document.getElementById('speech-wrapper').classList.remove('assistant');

    this.backButton.href = '/settings';
    this.titleElement.classList.remove('hidden');
    this.view.classList.remove('dark');

    if (section) {
      this.showSection(section, subsection, id);
    } else {
      this.showMenu();
    }
  },

  showMenu: function() {
    App.showMenuButton();
    this.titleName.innerText = 'Settings';
    this.titleIcon.src = '/optimized-images/settings-icon.png';
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
    this.titleName.innerText = 'Domain';
    this.titleIcon.src = '/optimized-images/domain-icon.png';
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

  onLocalDomainCheckboxChange: function(e) {
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
  onLocalDomainClick: function() {
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
          window.location.href = domainJson.localDomain;
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

  showUserSettings: function() {
    this.userSettings.classList.remove('hidden');
    this.userSettingsEdit.classList.add('hidden');
    this.userSettingsAdd.classList.add('hidden');
    this.userSettingsMain.classList.remove('hidden');
    this.titleName.innerText = 'Users';
    this.titleIcon.src = '/optimized-images/users-icon.png';

    const addUserButton =
      document.getElementById('add-user-button');
    addUserButton.addEventListener('click', () => {
      page('/settings/users/add');
    });

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
    this.titleName.innerText = 'Edit User';
    this.titleIcon.src = '/optimized-images/user.svg';
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
    this.titleName.innerText = 'Add User';
    this.titleIcon.src = '/optimized-images/user.svg';
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
    this.titleName.innerText = 'Adapters';
    this.titleIcon.src = '/optimized-images/adapters-icon.png';

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

        for (const metadata of adapters) {
          new Adapter(metadata);
        }
      }
    });
  },

  getAddonList: function() {
    // If already fetched addon list, return a promise cached.
    if (this.fetchAddonDeferred) {
      return this.fetchAddonDeferred.catch(() => {
        this.fetchAddonDeferred = null;
        return this.getAddonList();
      });
    }

    this.fetchAddonDeferred = new Promise((resolve, reject) => {
      this.fetchAddonList().then(() => {
        resolve();
      }).catch((e) => {
        console.error(`Failed to parse add-ons list: ${e}`);
        reject(e);
      });
    });

    return this.fetchAddonDeferred;
  },

  fetchAddonList: function() {
    const opts = {
      headers: API.headers(),
    };

    let api = null, architecture = null;

    // First, get the list of installed add-ons.
    return fetch('/addons', opts).then((response) => {
      this.installedAddons.clear();
      return response.json();
    }).then((body) => {
      if (!body) {
        return;
      }

      // Store a map of name->version.
      for (const s of body) {
        try {
          const settings = JSON.parse(s.value);
          this.installedAddons.set(settings.name, settings);
        } catch (err) {
          console.error(`Failed to parse add-on settings: ${err}`);
        }
      }

      // Now, get the list of available add-ons.
      return fetch('/settings/addonsInfo', opts);
    }).then((response) => {
      return response.json();
    }).then((data) => {
      if (!data || !data.url || !data.api || !data.architecture) {
        return;
      }

      api = data.api;
      architecture = data.architecture;
      return fetch(data.url, {method: 'GET', cache: 'reload'});
    }).then((resp) => {
      this.availableAddons.clear();
      return resp.json();
    }).then((body) => {
      for (const addon of body) {
        // Skip incompatible add-ons.
        if (addon.api.min > api || addon.api.max < api) {
          continue;
        }

        // Only support architecture-compatible add-ons.
        for (const arch in addon.packages) {
          if (arch === 'any' || arch === architecture) {
            const entry = {
              name: addon.name,
              displayName: addon.display_name,
              description: addon.description,
              author: addon.author,
              homepage: addon.homepage,
              version: addon.packages[arch].version,
              url: addon.packages[arch].url,
              checksum: addon.packages[arch].checksum,
              installed: this.installedAddons.has(addon.name),
            };
            this.availableAddons.set(addon.name, entry);
            break;
          }
        }
      }
    });
  },

  showAddonSettings: function() {
    this.addonSettings.classList.remove('hidden');
    this.addonConfigSettings.classList.add('hidden');
    this.addonDiscoverySettings.classList.add('hidden');
    this.addonConfigSettings.classList.add('hidden');
    this.addonMainSettings.classList.remove('hidden');
    this.titleName.innerText = 'Add-ons';
    this.titleIcon.src = '/optimized-images/add-on.svg';

    const discoverAddonsButton =
      document.getElementById('discover-addons-button');
    discoverAddonsButton.addEventListener('click', () => {
      page('/settings/addons/discovered');
    });

    this.getAddonList().then(() => {
      const addonList = document.getElementById('installed-addons-list');
      addonList.innerHTML = '';

      for (const name of Array.from(this.installedAddons.keys()).sort()) {
        const addon = this.installedAddons.get(name);
        let updateUrl = null, updateVersion = null, updateChecksum = null;
        if (this.availableAddons.has(name)) {
          const available = this.availableAddons.get(name);
          const cmp = this.compareSemver(addon.version, available.version);
          if (cmp < 0) {
            updateUrl = available.url;
            updateVersion = available.version;
            updateChecksum = available.checksum;
          }
        }

        new InstalledAddon(addon, this.installedAddons, this.availableAddons,
                           updateUrl, updateVersion, updateChecksum);
      }
    });
  },

  showAddonConfigScreen: function(id) {
    this.backButton.href = '/settings/addons';
    this.addonSettings.classList.remove('hidden');
    this.addonMainSettings.classList.add('hidden');
    this.addonConfigSettings.classList.remove('hidden');
    this.addonDiscoverySettings.classList.add('hidden');
    this.titleName.innerText = `Configure ${id}`;
    this.titleIcon.src = '/optimized-images/add-on.svg';
    this.view.classList.add('dark');

    this.getAddonList().then(() => {
      this.addonConfigSettings.innerHTML = '';
      const addon = this.installedAddons.get(id);
      new AddonConfig(id, addon);
    });
  },

  showDiscoveredAddonsScreen: function() {
    this.backButton.href = '/settings/addons';
    this.addonSettings.classList.remove('hidden');
    this.addonMainSettings.classList.add('hidden');
    this.addonConfigSettings.classList.add('hidden');
    this.addonDiscoverySettings.classList.remove('hidden');
    this.titleName.innerText = 'Discover New Add-ons';
    this.titleIcon.src = '/optimized-images/add-on.svg';
    this.view.classList.add('dark');

    this.getAddonList().then(() => {
      const addonList = document.getElementById('discovered-addons-list');
      addonList.innerHTML = '';

      Array.from(this.availableAddons.entries())
        .sort((a, b) => a[1].displayName.localeCompare(b[1].displayName))
        .forEach((x) => new DiscoveredAddon(x[1],
                                            this.installedAddons,
                                            this.availableAddons));
    });
  },

  showExperimentCheckbox: function(experiment, checkboxId) {
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
    this.titleName.innerText = 'Experiments';
    this.titleIcon.src = '/optimized-images/experiments-icon.png';
    this.showExperimentCheckbox('assistant', 'assistant-experiment-checkbox');
  },

  /**
   * Compare two semantic versions
   * @param {String} verA
   * @param {String} verB
   * @return {number} 0 if verA == verB, -1 if verA < verB, 1 if verA > verB
   */
  compareSemver: function(verA, verB) {
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
    this.titleName.innerText = 'Updates';
    this.titleIcon.src = '/optimized-images/update-icon.svg';
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
    this.titleName.innerText = 'Authorizations';
    this.titleIcon.src = '/optimized-images/authorization.svg';

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

  revokeAuthorization: function(event) {
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
    this.titleName.innerText = 'Developer';
    this.titleIcon.src = '/optimized-images/developer-icon.svg';

    document.getElementById('view-logs').href = `/logs?jwt=${API.jwt}`;
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
