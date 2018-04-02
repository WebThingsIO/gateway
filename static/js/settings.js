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

/* globals App, API, Menu, page, Adapter, InstalledAddon, DiscoveredAddon,
   User, SchemaForm, Utils */

// eslint-disable-next-line no-unused-vars
var SettingsScreen = {

  /**
   * Initialise Settings Screen.
   */
  init: function() {
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
    this.backButton = document.getElementById('settings-back-button');

    this.availableAddons = new Map();
    this.installedAddons = new Map();
  },

  show: function(section, subsection, id) {
    this.backButton.href = '/settings';

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
    fetch('/settings/tunnelinfo', opts).then(function(response) {
      return response.text();
    }).then(function(body) {
      if (body) {
        document.getElementById('current-domain').innerText = body;
      } else {
        document.getElementById('current-domain').innerText = 'Not set.';
      }
    });
  },

  showUserSettings: function() {
    this.userSettings.classList.remove('hidden');
    this.userSettingsEdit.classList.add('hidden');
    this.userSettingsAdd.classList.add('hidden');
    this.userSettingsMain.classList.remove('hidden');

    const addUserButton =
      document.getElementById('add-user-button');
    addUserButton.addEventListener('click', () => {
      page('/settings/users/add');
    });

    window.API.getAllUserInfo().then(function(users) {
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

    window.API.getUser(id).then(function(user) {
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

        window.API.editUser(id, nameValue, emailValue, passwordValue,
                            newPasswordValue)
          .then(() => {
            page('/settings/users');
          })
          .catch((err) => {
            error.classList.remove('hidden');
            error.textContent = err.message;
            console.error(err);
          });
      });
    });
  },

  showAddUserScreen: function() {
    this.backButton.href = '/settings/users';
    this.userSettings.classList.remove('hidden');
    this.userSettingsMain.classList.add('hidden');
    this.userSettingsEdit.classList.add('hidden');
    this.userSettingsAdd.classList.remove('hidden');

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

      window.API.addUser(nameValue, emailValue, passwordValue)
        .then(() => {
          page('/settings/users');
        })
        .catch((err) => {
          error.classList.remove('hidden');
          error.textContent = err.message;
          console.error(err);
        });
    });
  },

  showAdapterSettings: function() {
    this.adapterSettings.classList.remove('hidden');

    const opts = {
      headers: API.headers(),
    };

    // Fetch a list of adapters from the server
    fetch('/adapters', opts).then(function(response) {
      return response.json();
    }).then(function(adapters) {
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
          console.log(`Failed to parse add-on settings: ${err}`);
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
              version: addon.version,
              url: addon.packages[arch].url,
              checksum: addon.packages[arch].checksum,
              installed: this.installedAddons.has(addon.name),
            };
            this.availableAddons.set(addon.name, entry);
            break;
          }
        }
      }
    }).catch((e) => console.error(`Failed to parse add-ons list: ${e}`));
  },

  showAddonSettings: function() {
    this.addonSettings.classList.remove('hidden');
    this.addonConfigSettings.classList.add('hidden');
    this.addonDiscoverySettings.classList.add('hidden');
    this.addonConfigSettings.classList.add('hidden');
    this.addonMainSettings.classList.remove('hidden');

    const discoverAddonsButton =
      document.getElementById('discover-addons-button');
    discoverAddonsButton.addEventListener('click', () => {
      page('/settings/addons/discovered');
    });

    this.fetchAddonList().then(() => {
      const addonList = document.getElementById('installed-addons-list');
      addonList.innerHTML = '';

      for (const name of Array.from(this.installedAddons.keys()).sort()) {
        const addon = this.installedAddons.get(name);
        let updateUrl = null, updateVersion = null, updateChecksum = null;
        if (this.availableAddons.has(name)) {
          const available = this.availableAddons.get(name);
          if (available.version !== addon.version) {
            updateUrl = available.url;
            updateVersion = available.version;
            updateChecksum = available.checksum;
          }
        }

        new InstalledAddon(addon, this.installedAddons, updateUrl,
                           updateVersion, updateChecksum);
      }
    });
  },

  showAddonConfigScreen: function(id) {
    this.backButton.href = '/settings/addons';
    this.addonSettings.classList.remove('hidden');
    this.addonMainSettings.classList.add('hidden');
    this.addonConfigSettings.classList.remove('hidden');
    this.addonDiscoverySettings.classList.add('hidden');

    let promise;
    if (this.installedAddons.size === 0 && this.availableAddons.size === 0) {
      promise = this.fetchAddonList();
    } else {
      promise = Promise.resolve();
    }

    promise.then(() => {
      this.addonConfigSettings.innerHTML = '';

      const addon = this.installedAddons.get(id);
      const schema = addon.moziot.schema;
      const config = addon.moziot.config;

      const configForm = new SchemaForm(schema, `addon-config-${id}`, id);
      this.addonConfigSettings.appendChild(configForm.render(config));
    });
  },

  showDiscoveredAddonsScreen: function() {
    this.backButton.href = '/settings/addons';
    this.addonSettings.classList.remove('hidden');
    this.addonMainSettings.classList.add('hidden');
    this.addonConfigSettings.classList.add('hidden');
    this.addonDiscoverySettings.classList.remove('hidden');

    let promise;
    if (this.installedAddons.size === 0 && this.availableAddons.size === 0) {
      promise = this.fetchAddonList();
    } else {
      promise = Promise.resolve();
    }

    promise.then(() => {
      const addonList = document.getElementById('discovered-addons-list');
      addonList.innerHTML = '';

      for (const name of Array.from(this.availableAddons.keys()).sort()) {
        new DiscoveredAddon(this.availableAddons.get(name));
      }
    });
  },

  showExperimentCheckbox: function(experiment, checkboxId) {
    var checkbox = document.getElementById(checkboxId);
    window.API.getExperimentSetting(experiment)
    .then(function(value) {
      checkbox.checked = value;
    })
    .catch(function(e) {
      console.error('Error getting ' + experiment + ' experiment setting ' + e);
    });

    checkbox.addEventListener('change', function(e) {
      var value = e.target.checked ? true : false;
      window.API.setExperimentSetting(experiment, value).then(function() {
        if (value) {
          Menu.showItem(experiment);
        } else {
          Menu.hideItem(experiment);
        }
      }).catch(function(e) {
        console.error('Failed to enable ' + experiment + ' experiment: ' + e);
      });
    });
  },

  showExperimentSettings: function() {
    this.experimentSettings.classList.remove('hidden');
    this.showExperimentCheckbox('floorplan', 'floorplan-experiment-checkbox');
    this.showExperimentCheckbox('speech', 'speech-experiment-checkbox');
    this.showExperimentCheckbox('rules', 'rules-experiment-checkbox');
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
      return parseInt(part);
    }

    let partsA = verA.split('.').map(parsePart);
    let partsB = verB.split('.').map(parsePart);

    for (var i = 0; i < partsA.length; i++) {
      let partA = partsA[i];
      let partB = partsB[i];
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
    let updateNow = document.getElementById('update-now');

    updateNow.addEventListener('click', this.onUpdateClick);
    this.fetchUpdateInfo();
  },

  fetchUpdateInfo: function() {
    let upToDateElt = document.getElementById('update-settings-up-to-date');
    let updateNow = document.getElementById('update-now');
    let versionElt = document.getElementById('update-settings-version');
    let statusElt = document.getElementById('update-settings-status');

    let fetches = Promise.all([API.getUpdateStatus(), API.getUpdateLatest()]);
    fetches.then(function(results) {
      let status = results[0];
      let latest = results[1];
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
    }.bind(this));
  },

  onUpdateClick: function() {
    let updateNow = document.getElementById('update-now');
    updateNow.removeEventListener('click', this.onUpdateClick);
    updateNow.classList.add('disabled');

    fetch('/updates/update', {
      headers: API.headers(),
      method: 'POST',
    }).then(function() {
      updateNow.textContent = 'In Progress';
      let isDown = false;
      function checkStatus() {
        API.getUpdateStatus().then(function() {
          if (isDown) {
            window.location.reload(true);
          } else {
            setTimeout(checkStatus, 5000);
          }
        }).catch(function() {
          if (!isDown) {
            updateNow.textContent = 'Restarting';
            isDown = true;
          }
          setTimeout(checkStatus, 5000);
        });
      }
      checkStatus();
    }).catch(function() {
      updateNow.textContent = 'Error';
    });
  },

  showAuthorizationSettings: function() {
    this.authorizationSettings.classList.remove('hidden');

    fetch('/authorizations', {
      headers: API.headers(),
    }).then(function(response) {
      return response.json();
    }).then(clients => {
      const authorizationsList = document.getElementById('authorizations');
      const noAuthorizations = document.getElementById('no-authorizations');

      for (let child of authorizationsList.children) {
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

      for (let client of clients) {
        let authorization = document.createElement('li');
        authorization.classList.add('authorization-item');
        let name = document.createElement('p');
        name.textContent = client.name;
        let origin = document.createElement('p');
        origin.classList.add('origin');
        origin.textContent = new URL(client.redirect_uri).host;
        let revoke = document.createElement('input');
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
    let revoke = event.target;
    if (!revoke.dataset.clientId) {
      console.warn('Missing clientId on revoke', revoke);
      return;
    }
    let clientId = revoke.dataset.clientId;

    fetch('/authorizations/' + encodeURIComponent(clientId), {
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
    }).catch(err => {
      console.warn('Unable to revoke', err);
    });
  },
};
