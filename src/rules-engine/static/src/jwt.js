/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

let jwt = localStorage.getItem('jwt');
if (!jwt) {
  fetch('jwt').then(res => {
    jwt = res;
  });
}

/**
 * The default options to use with fetching API calls
 * @return {Object}
 */
function apiOptions() { // eslint-disable-line
  return {
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + jwt
    }
  };
}

