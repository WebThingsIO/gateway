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

    userCount() {
      return fetch('/users/count').then((res) => {
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

    createUser: function (name, email, password) {
      const opts = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name, email, password
        })
      };
      return fetch('/users/', opts).then((res) => {
        if (!res.ok) {
          return Promise.reject('Repeating signup not permitted');
        }
        return res.json();
      }).then((body) => {
        const jwt = body.jwt;
        localStorage.setItem('jwt', jwt);
        window.API.jwt = jwt;
      });
    },

    login: function (email, password) {
      const opts = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email, password
        })
      };
      return fetch('/login/', opts).then((res) => {
        if (!res.ok) {
          return Promise.reject('Incorrect username or password');
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
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        if (res.status !== 200) {
          console.error('Logout failed...');
        }
      });
    }
  };
}());
