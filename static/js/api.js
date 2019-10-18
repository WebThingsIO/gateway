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
  headers(contentType) {
    const headers = {
      Accept: 'application/json',
    };

    if (this.jwt) {
      headers.Authorization = `Bearer ${this.jwt}`;
    }

    if (contentType) {
      headers['Content-Type'] = contentType;
    }

    return headers;
  },

  getJson(url) {
    const opts = {
      method: 'GET',
      headers: this.headers(),
    };

    return fetch(url, opts).then((res) => {
      if (!res.ok) {
        throw new Error(res.status);
      }

      return res.json();
    });
  },

  postJson(url, data) {
    const opts = {
      method: 'POST',
      headers: this.headers('application/json'),
      body: JSON.stringify(data),
    };

    return fetch(url, opts).then((res) => {
      if (!res.ok) {
        throw new Error(res.status);
      }

      return res.json();
    });
  },

  putJson(url, data) {
    const opts = {
      method: 'PUT',
      headers: this.headers('application/json'),
      body: JSON.stringify(data),
    };

    return fetch(url, opts).then((res) => {
      if (!res.ok) {
        throw new Error(res.status);
      }

      return res.json();
    });
  },

  patchJson(url, data) {
    const opts = {
      method: 'PATCH',
      headers: this.headers('application/json'),
      body: JSON.stringify(data),
    };

    return fetch(url, opts).then((res) => {
      if (!res.ok) {
        throw new Error(res.status);
      }

      return res.json();
    });
  },

  delete(url) {
    const opts = {
      method: 'DELETE',
      headers: this.headers(),
    };

    return fetch(url, opts).then((res) => {
      if (!res.ok) {
        throw new Error(res.status);
      }
    });
  },

  loadImage(url) {
    const opts = {
      headers: {
        Authorization: `Bearer ${this.jwt}`,
      },
      cache: 'reload',
    };

    return fetch(url, opts).then((res) => {
      if (!res.ok) {
        throw new Error(res.status);
      }

      return res.blob();
    });
  },

  userCount() {
    return this.getJson('/users/count').then((body) => {
      return body.count;
    }).catch(() => {
      throw new Error('Failed to get user count.');
    });
  },

  assertJWT() {
    if (!this.jwt) {
      throw new Error('No JWT go login..');
    }
  },

  verifyJWT() {
    return fetch('/things', {headers: this.headers()}).then((res) => res.ok);
  },

  createUser(name, email, password) {
    return this.postJson('/users', {name, email, password}).then((body) => {
      const jwt = body.jwt;
      localStorage.setItem('jwt', jwt);
      API.jwt = jwt;
    }).catch(() => {
      throw new Error('Repeating signup not permitted');
    });
  },

  getUser(id) {
    return this.getJson(`/users/${encodeURIComponent(id)}`);
  },

  addUser(name, email, password) {
    return this.postJson('/users', {name, email, password});
  },

  editUser(id, name, email, password, newPassword) {
    return this.putJson(
      `/users/${encodeURIComponent(id)}`,
      {id, name, email, password, newPassword}
    );
  },

  deleteUser(id) {
    return this.delete(`/users/${encodeURIComponent(id)}`);
  },

  getAllUserInfo() {
    return this.getJson('/users/info');
  },

  login(email, password) {
    return this.postJson('/login', {email, password}).then((body) => {
      const jwt = body.jwt;
      localStorage.setItem('jwt', jwt);
      API.jwt = jwt;
    }).catch(() => {
      throw new Error('Incorrect username or password');
    });
  },

  logout() {
    this.assertJWT();
    localStorage.removeItem('jwt');

    return this.postJson('/log-out', {}).catch(() => {
      console.error('Logout failed...');
    });
  },

  getInstalledAddons() {
    return this.getJson('/addons');
  },

  getAddonConfig(addonId) {
    return this.getJson(`/addons/${encodeURIComponent(addonId)}/config`);
  },

  setAddonConfig(addonId, config) {
    return this.putJson(
      `/addons/${encodeURIComponent(addonId)}/config`,
      {config}
    );
  },

  setAddonSetting(addonId, enabled) {
    return this.putJson(`/addons/${encodeURIComponent(addonId)}`, {enabled});
  },

  installAddon(addonId, addonUrl, addonChecksum) {
    return this.postJson('/addons', {
      id: addonId,
      url: addonUrl,
      checksum: addonChecksum,
    });
  },

  uninstallAddon(addonId) {
    return this.delete(`/addons/${encodeURIComponent(addonId)}`);
  },

  updateAddon(addonId, addonUrl, addonChecksum) {
    return this.patchJson(
      `/addons/${encodeURIComponent(addonId)}`,
      {
        url: addonUrl,
        checksum: addonChecksum,
      }
    );
  },

  getAddonsInfo() {
    return this.getJson('/settings/addonsInfo');
  },

  getExperimentSetting(experimentName) {
    return this.getJson(
      `/settings/experiments/${encodeURIComponent(experimentName)}`
    ).then((json) => {
      return json.enabled;
    }).catch((e) => {
      if (e.message === '404') {
        return false;
      }

      throw new Error(`Error getting ${experimentName}`);
    });
  },

  setExperimentSetting(experimentName, enabled) {
    return this.putJson(
      `/settings/experiments/${encodeURIComponent(experimentName)}`,
      {enabled}
    );
  },

  getUpdateStatus() {
    return this.getJson('/updates/status');
  },

  getUpdateLatest() {
    return this.getJson('/updates/latest');
  },

  startUpdate() {
    return this.postJson('/updates/update', {});
  },

  getExtensions() {
    return this.getJson('/extensions');
  },

  getThings() {
    return this.getJson('/things');
  },

  getThing(thingId) {
    return this.getJson(`/things/${encodeURIComponent(thingId)}`);
  },

  setThingLayoutIndex(thingId, index) {
    return this.patchJson(
      `/things/${encodeURIComponent(thingId)}`,
      {layoutIndex: index}
    );
  },

  setThingFloorplanPosition(thingId, x, y) {
    return this.patchJson(
      `/things/${encodeURIComponent(thingId)}`,
      {
        floorplanX: x,
        floorplanY: y,
      }
    );
  },

  setThingCredentials(thingId, data) {
    const body = {
      thingId,
    };

    if (data.hasOwnProperty('pin')) {
      body.pin = data.pin;
    } else {
      body.username = data.username;
      body.password = data.password;
    }

    return this.patchJson('/things', body);
  },

  addThing(description) {
    return this.postJson('/things', description);
  },

  addWebThing(url) {
    return this.postJson('/new_things', {url});
  },

  removeThing(thingId) {
    return this.delete(`/things/${encodeURIComponent(thingId)}`);
  },

  updateThing(thingId, updates) {
    return this.putJson(`/things/${encodeURIComponent(thingId)}`, updates);
  },

  getPushKey() {
    return this.getJson('/push/vapid-public-key');
  },

  pushSubscribe(subscription) {
    return this.postJson('/push/register', subscription);
  },

  getNotifiers() {
    return this.getJson('/notifiers');
  },

  submitAssistantCommand(text) {
    const opts = {
      method: 'POST',
      headers: this.headers('application/json'),
      body: JSON.stringify({text}),
    };

    let ok;
    return fetch('/commands', opts).then((res) => {
      ok = res.ok;
      return res.json();
    }).then((body) => {
      return [ok, body];
    });
  },

  startPairing(timeout) {
    return this.postJson('/actions', {
      pair: {
        input: {
          timeout,
        },
      },
    });
  },

  cancelPairing(actionUrl) {
    return this.delete(actionUrl);
  },

  getRules() {
    return this.getJson('/rules');
  },

  getRule(ruleId) {
    return this.getJson(`/rules/${encodeURIComponent(ruleId)}`);
  },

  addRule(description) {
    return this.postJson('/rules', description);
  },

  updateRule(ruleId, description) {
    return this.putJson(`/rules/${encodeURIComponent(ruleId)}`, description);
  },

  deleteRule(ruleId) {
    return this.delete(`/rules/${encodeURIComponent(ruleId)}`);
  },

  getLogs() {
    return this.getJson('/logs/.schema');
  },

  addLog(description) {
    const opts = {
      method: 'POST',
      headers: this.headers('application/json'),
      body: JSON.stringify(description),
    };

    let ok;
    return fetch('/logs', opts).then((res) => {
      ok = res.ok;

      if (!res.ok) {
        return res.text();
      }

      return res.json();
    }).then((body) => {
      return [ok, body];
    }).catch(() => {
      return [ok, null];
    });
  },

  deleteLog(thingId, propertyId) {
    return this.delete(
      `/logs/things/${encodeURIComponent(thingId)}/properties/${encodeURIComponent(propertyId)}`
    );
  },

  uploadFloorplan(file) {
    const formData = new FormData();
    formData.append('file', file);

    const opts = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.jwt}`,
      },
      body: formData,
    };

    return fetch('/uploads', opts).then((res) => {
      if (!res.ok) {
        throw new Error(res.status);
      }
    });
  },

  setupTunnel(email, subdomain, reclamationToken, optout) {
    const opts = {
      method: 'POST',
      headers: this.headers('application/json'),
      body: JSON.stringify({email, subdomain, reclamationToken, optout}),
    };

    return fetch('/settings/subscribe', opts).then((res) => {
      if (!res.ok) {
        return [false, res.statusText];
      }

      return res.json().then((body) => [true, body]);
    });
  },

  skipTunnel() {
    const opts = {
      method: 'POST',
      headers: this.headers('application/json'),
      body: JSON.stringify({}),
    };

    return fetch('/settings/skiptunnel', opts).then((res) => {
      if (!res.ok) {
        return [false, res.statusText];
      }

      return res.json().then((body) => [true, body]);
    });
  },

  reclaimDomain(subdomain) {
    return this.postJson('/settings/reclaim', {subdomain});
  },

  getLanSettings() {
    return this.getJson('/settings/network/lan');
  },

  getWanSettings() {
    return this.getJson('/settings/network/wan');
  },

  getWlanSettings() {
    return this.getJson('/settings/network/wireless');
  },

  getDhcpSettings() {
    return this.getJson('/settings/network/dhcp');
  },

  getWirelessNetworks() {
    return this.getJson('/settings/network/wireless/networks');
  },

  getNetworkAddresses() {
    return this.getJson('/settings/network/addresses');
  },

  setLanSettings(settings) {
    return this.putJson('/settings/network/lan', settings);
  },

  setWanSettings(settings) {
    return this.putJson('/settings/network/wan', settings);
  },

  setWlanSettings(settings) {
    return this.putJson('/settings/network/wireless', settings);
  },

  setDhcpSettings(settings) {
    return this.putJson('/settings/network/dhcp', settings);
  },

  getSshStatus() {
    return this.getJson('/settings/system/ssh');
  },

  setSshStatus(enabled) {
    return this.putJson('/settings/system/ssh', {enabled});
  },

  getPlatform() {
    return this.getJson('/settings/system/platform');
  },

  getTunnelInfo() {
    return this.getJson('/settings/tunnelinfo');
  },

  setDomainSettings(settings) {
    return this.putJson('/settings/domain', settings);
  },

  getAdapters() {
    return this.getJson('/adapters');
  },

  getAuthorizations() {
    return this.getJson('/authorizations');
  },

  revokeAuthorization(clientId) {
    return this.delete(`/authorizations/${encodeURIComponent(clientId)}`);
  },

  ping() {
    const opts = {
      method: 'GET',
      headers: this.headers(),
    };

    return fetch('/ping', opts).then((res) => {
      if (!res.ok) {
        throw new Error(res.status);
      }
    });
  },

  getCountry() {
    return this.getJson('/settings/localization/country');
  },

  setCountry(country) {
    return this.putJson('/settings/localization/country', {country});
  },

  getTimezone() {
    return this.getJson('/settings/localization/timezone');
  },

  setTimezone(zone) {
    return this.putJson('/settings/localization/timezone', {zone});
  },

  getLanguage() {
    return this.getJson('/settings/localization/language');
  },

  setLanguage(language) {
    return this.putJson('/settings/localization/language', {language});
  },

  getUnits() {
    return this.getJson('/settings/localization/units');
  },

  setUnits(units) {
    return this.putJson('/settings/localization/units', units);
  },
};

// Elevate this to the window level.
window.API = API;

module.exports = API;
