/**
 * Temporary API for interacting with the server.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

(function() {
  window.API = {
    jwt: localStorage.getItem('jwt'),

    isLoggedIn() {
      return !!this.jwt;
    },

    /**
     * The default options to use with fetching API calls
     * @return {Object}
     */
    headers() {
      let headers = {
        Accept: 'application/json'
      }
      if (this.jwt) {
        headers.Authorization = `Bearer ${this.jwt}`;
      }
      return headers;
    },

    userCount() {
      const opts = {
        headers: {
          'Accept': 'application/json'
        }
      };
      return fetch('/users/count', opts).then((res) => {
        return res.json();
      }).then((body) => {
        return body.count;
      });
    },

    assertJWT() {
      if (!this.jwt) {
        throw new Error('No JWT go login..')
      }
    },

    verifyJWT() {
      const opts = {
        headers: {
          'Authorization': `Bearer ${window.API.jwt}`,
          'Accept': 'application/json'
        }
      };

      return fetch('/things/', opts).then((res) => {
        return res.ok;
      });
    },

    createUser: function (name, email, password) {
      const opts = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name, email, password
        })
      };
      return fetch('/users/', opts).then((res) => {
        if (!res.ok) {
          throw new Error('Repeating signup not permitted');
        }
        return res.json();
      }).then((body) => {
        const jwt = body.jwt;
        localStorage.setItem('jwt', jwt);
        window.API.jwt = jwt;
      });
    },

    getUser: function(id) {
      const opts = {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${window.API.jwt}`,
        }
      };
      return fetch(`/users/${id}`, opts).then((response) => {
        if (!response.ok) {
          throw new Error('Unable to access user info');
        }
        return response.json();
      });
    },

    addUser: function (name, email, password) {
      const opts = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${window.API.jwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name, email, password
        })
      };
      return fetch('/users/', opts).then((res) => {
        if (!res.ok) {
          throw new Error('Failed to add new user');
        }
      });
    },

    editUser: function(id, name, email, password, newPassword) {
      const opts = {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${window.API.jwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({id, name, email, password, newPassword}),
      };
      return fetch(`/users/${id}`, opts).then((response) => {
        if (!response.ok) {
          throw new Error('Failed to edit user');
        }
      });
    },

    deleteUser: function(id) {
      const opts = {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${window.API.jwt}`,
        }
      };
      return fetch(`/users/${id}`, opts).then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete user');
        }
      });
    },

    getAllUserInfo: function() {
      const opts = {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${window.API.jwt}`,
        }
      };
      return fetch('/users/info', opts).then((response) => {
        if (!response.ok) {
          throw new Error('Unable to access user info');
        }
        return response.json();
      });
    },

    login: function (email, password) {
      const opts = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email, password
        })
      };
      return fetch('/login/', opts).then((res) => {
        if (!res.ok) {
          throw new Error('Incorrect username or password');
        }
        return res.json();
      }).then((body) => {
        const jwt = body.jwt;
        localStorage.setItem('jwt', jwt);
        window.API.jwt = jwt;
      });
    },

    logout: function() {
      this.assertJWT();
      localStorage.removeItem('jwt');
      return fetch('/log-out', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${window.API.jwt}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }).then((res) => {
        if (!res.ok) {
          console.error('Logout failed...');
        }
      });
    },

    setAddonSetting: function(addonName, enabled) {
      const headers = {
        'Authorization': `Bearer ${window.API.jwt}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      const payload = {
        'enabled': enabled
      };
      return fetch('/addons/' + addonName, {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: headers
      }).then(function(response) {
        if (!response.ok) {
          throw new Error(
            'Unexpected response code while setting add-on setting');
        }

        console.log('Set ' + addonName + ' to ' + enabled);
      });
    },

    installAddon: function(addonName, addonUrl) {
      const headers = {
        'Authorization': `Bearer ${window.API.jwt}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      const payload = {
        'name': addonName,
        'url': addonUrl,
      };
      return fetch('/addons', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: headers
      }).then(function(response) {
        if (!response.ok) {
          throw new Error('Unexpected response code while installing add-on.');
        }

        console.log(`Successfully installed ${addonName}`);
      });
    },

    uninstallAddon: function(addonName) {
      const headers = {
        'Authorization': `Bearer ${window.API.jwt}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      return fetch('/addons/' + addonName, {
        method: 'DELETE',
        headers: headers
      }).then(function(response) {
        if (!response.ok) {
          throw new Error(
            'Unexpected response code while uninstalling add-on.');
        }

        console.log(`Successfully uninstalled ${addonName}`);
      });
    },

    updateAddon: function(addonName, addonUrl) {
      const headers = {
        'Authorization': `Bearer ${window.API.jwt}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      const payload = {
        'url': addonUrl,
      };
      return fetch('/addons/' + addonName, {
        method: 'PATCH',
        body: JSON.stringify(payload),
        headers: headers
      }).then(function(response) {
        if (!response.ok) {
          throw new Error('Unexpected response code while updating add-on.');
        }

        console.log(`Successfully updated ${addonName}`);
      });
    },

    getExperimentSetting: function(experimentName) {
      const headers = {
        'Authorization': `Bearer ${window.API.jwt}`,
        'Accept': 'application/json'
      };
      return fetch('/settings/experiments/' + experimentName, {
        method: 'GET',
        headers: headers
      })
      .then(function(response) {
        if (!response.ok) {
          throw new Error('Error getting ' + experimentName);
        }

        return response.json()
          .then(function(json) {
            return json.enabled;
          }).catch(function(e) {
            throw new Error('Error getting ' + experimentName + ' ' + e);
          });
      });
    },

    setExperimentSetting: function(experimentName, enabled) {
      const headers = {
        'Authorization': `Bearer ${window.API.jwt}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      const payload = {
       'enabled': enabled
      };
      return fetch('/settings/experiments/' + experimentName, {
       method: 'PUT',
       body: JSON.stringify(payload),
       headers: headers
      })
      .then(function(response) {
        if (!response.ok) {
         throw new Error(
            'Unexpected response code while setting experiment setting');
        }

       console.log('Set ' + experimentName + ' to ' + enabled);
      });
    },

    getUpdateStatus: function() {
      return fetch('/updates/status',
        {headers: this.headers()}
      ).then(res => {
        return res.json();
      });
    },

    getUpdateLatest: function() {
      return fetch('/updates/latest',
        {headers: this.headers()}
      ).then(res => {
        return res.json();
      });
    }
  };
}());
