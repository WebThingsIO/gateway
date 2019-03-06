/**
 * Notifications
 *
 * Implements a basic form of the Push API. Based on the
 * serviceworker cookbook payload example.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const API = require('./api');

const Notifications = {
  onReady: async (registration) => {
    if (!registration.pushManager) {
      return;
    }

    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      const res = await fetch('/push/vapid-public-key', {
        headers: API.headers(),
      });
      const vapid = await res.json();
      if (vapid.error) {
        console.error('Error getting vapid key:', vapid.error);
        return;
      }
      const convertedVapidKey = urlBase64ToUint8Array(vapid.publicKey);
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });
    }
    await fetch('/push/register', {
      method: 'post',
      headers: Object.assign({
        'Content-Type': 'application/json',
      }, API.headers()),
      body: JSON.stringify({
        subscription,
      }),
    });
  },
};

// From https://github.com/mozilla/serviceworker-cookbook/blob/master/tools.js
// This function is needed because Chrome doesn't accept a base64 encoded string
// as value for applicationServerKey in pushManager.subscribe yet
// https://bugs.chromium.org/p/chromium/issues/detail?id=802280
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}


module.exports = Notifications;
