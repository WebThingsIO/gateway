/**
 * Temporary API for interacting with the server.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const API = {
  jwt: localStorage.getItem('jwt'),

  isLoggedIn() {
    return !!this.jwt;
  },

  /**
     * The default options to use with fetching API calls
     * @return {Object}
     */
  headers() {
    const headers = {
      Accept: 'application/json',
    };
    if (this.jwt) {
      headers.Authorization = `Bearer ${this.jwt}`;
    }
    return headers;
  },

  userCount() {
    const opts = {
      headers: {
        Accept: 'application/json',
      },
    };
    return fetch('/users/count', opts).then((res) => {
      return res.json();
    }).then((body) => {
      return body.count;
    });
  },

  assertJWT() {
    if (!this.jwt) {
      throw new Error('No JWT go login..');
    }
  },

  verifyJWT() {
    const opts = {
      headers: {
        Authorization: `Bearer ${API.jwt}`,
        Accept: 'application/json',
      },
    };

    return fetch('/things/', opts).then((res) => {
      return res.ok;
    });
  },

  createUser: (name, email, password) => {
    const opts = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name, email, password,
      }),
    };
    return fetch('/users/', opts).then((res) => {
      if (!res.ok) {
        throw new Error('Repeating signup not permitted');
      }
      return res.json();
    }).then((body) => {
      const jwt = body.jwt;
      localStorage.setItem('jwt', jwt);
      API.jwt = jwt;
    });
  },

  getUser: (id) => {
    const opts = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${API.jwt}`,
      },
    };
    return fetch(`/users/${encodeURIComponent(id)}`, opts).then((res) => {
      if (!res.ok) {
        throw new Error('Unable to access user info');
      }
      return res.json();
    });
  },

  addUser: (name, email, password) => {
    const opts = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${API.jwt}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name, email, password,
      }),
    };
    return fetch('/users/', opts).then((res) => {
      if (!res.ok) {
        throw new Error('Failed to add new user');
      }
    });
  },

  editUser: (id, name, email, password, newPassword) => {
    const opts = {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${API.jwt}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({id, name, email, password, newPassword}),
    };
    return fetch(`/users/${encodeURIComponent(id)}`, opts).then((res) => {
      if (!res.ok) {
        throw new Error('Failed to edit user');
      }
    });
  },

  addLocalDomain: (domainName) => {
    const opts = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${window.API.jwt}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({domainName}),
    };
    return fetch('/users/', opts).then((res) => {
      if (!res.ok) {
        throw new Error('Failed to change domain name');
      }
    });
  },

  deleteUser: (id) => {
    const opts = {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${API.jwt}`,
      },
    };
    return fetch(`/users/${encodeURIComponent(id)}`, opts).then((res) => {
      if (!res.ok) {
        throw new Error('Failed to delete user');
      }
    });
  },

  getAllUserInfo: () => {
    const opts = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${API.jwt}`,
      },
    };
    return fetch('/users/info', opts).then((response) => {
      if (!response.ok) {
        throw new Error('Unable to access user info');
      }
      return response.json();
    });
  },

  login: (email, password) => {
    const opts = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email, password,
      }),
    };
    return fetch('/login/', opts).then((res) => {
      if (!res.ok) {
        throw new Error('Incorrect username or password');
      }
      return res.json();
    }).then((body) => {
      const jwt = body.jwt;
      localStorage.setItem('jwt', jwt);
      API.jwt = jwt;
    });
  },

  logout: function() {
    this.assertJWT();
    localStorage.removeItem('jwt');
    return fetch('/log-out', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API.jwt}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }).then((res) => {
      if (!res.ok) {
        console.error('Logout failed...');
      }
    });
  },

  setAddonConfig: (addonName, config) => {
    const headers = {
      Authorization: `Bearer ${API.jwt}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    const payload = {
      config,
    };
    const body = JSON.stringify(payload);
    return fetch(`/addons/${encodeURIComponent(addonName)}/config`, {
      method: 'PUT',
      body,
      headers,
    }).then((response) => {
      if (!response.ok) {
        throw new Error(
          'Unexpected response code while setting add-on config');
      }
    });
  },

  setAddonSetting: (addonName, enabled) => {
    const headers = {
      Authorization: `Bearer ${API.jwt}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    const payload = {
      enabled,
    };
    return fetch(`/addons/${encodeURIComponent(addonName)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      headers,
    }).then((response) => {
      if (!response.ok) {
        throw new Error(
          'Unexpected response code while setting add-on setting');
      }
    });
  },

  installAddon: (addonName, addonUrl, addonChecksum) => {
    const headers = {
      Authorization: `Bearer ${API.jwt}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    const payload = {
      name: addonName,
      url: addonUrl,
      checksum: addonChecksum,
    };
    return fetch('/addons', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers,
    }).then((response) => {
      if (!response.ok) {
        throw new Error('Unexpected response code while installing add-on.');
      }
      return response.json();
    });
  },

  uninstallAddon: (addonName) => {
    const headers = {
      Authorization: `Bearer ${API.jwt}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    return fetch(`/addons/${encodeURIComponent(addonName)}`, {
      method: 'DELETE',
      headers,
    }).then((response) => {
      if (!response.ok) {
        throw new Error(
          'Unexpected response code while uninstalling add-on.');
      }
    });
  },

  updateAddon: (addonName, addonUrl, addonChecksum) => {
    const headers = {
      Authorization: `Bearer ${API.jwt}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    const payload = {
      url: addonUrl,
      checksum: addonChecksum,
    };
    return fetch(`/addons/${encodeURIComponent(addonName)}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
      headers,
    }).then((response) => {
      if (!response.ok) {
        throw new Error('Unexpected response code while updating add-on.');
      }
    });
  },

  getExperimentSetting: (experimentName) => {
    const headers = {
      Authorization: `Bearer ${API.jwt}`,
      Accept: 'application/json',
    };
    return fetch(
      `/settings/experiments/${encodeURIComponent(experimentName)}`, {
        method: 'GET',
        headers,
      })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            return false;
          }

          throw new Error(`Error getting ${experimentName}`);
        }

        return response.json()
          .then((json) => {
            return json.enabled;
          }).catch((e) => {
            throw new Error(`Error getting ${experimentName} ${e}`);
          });
      });
  },

  setExperimentSetting: (experimentName, enabled) => {
    const headers = {
      Authorization: `Bearer ${API.jwt}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    const payload = {
      enabled,
    };
    return fetch(
      `/settings/experiments/${encodeURIComponent(experimentName)}`,
      {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers,
      }
    ).then((response) => {
      if (!response.ok) {
        throw new Error(
          'Unexpected response code while setting experiment setting');
      }
    });
  },

  getUpdateStatus: function() {
    return fetch('/updates/status', {
      headers: this.headers(),
    }).then((res) => {
      return res.json();
    });
  },

  getUpdateLatest: function() {
    return fetch('/updates/latest', {
      headers: this.headers(),
    }).then((res) => {
      return res.json();
    });
  },
};

window.API = API;

module.exports = API;
