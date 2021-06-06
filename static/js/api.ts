/**
 * Temporary API for interacting with the server.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

class API {
  jwt: string | null = localStorage.getItem('jwt');

  isLoggedIn(): boolean {
    return !!this.jwt;
  }

  /**
   * The default options to use with fetching API calls
   * @return {Object}
   */
  headers(contentType?: string): Record<string, string> {
    const headers: Record<string, string> = {
      Accept: 'application/json',
    };

    if (this.jwt) {
      headers.Authorization = `Bearer ${this.jwt}`;
    }

    if (contentType) {
      headers['Content-Type'] = contentType;
    }

    return headers;
  }

  getJson(url: string): Promise<Record<string, unknown>> {
    const opts = {
      method: 'GET',
      headers: this.headers(),
    };

    return fetch(url, opts).then((res) => {
      if (!res.ok) {
        throw new Error(`${res.status}`);
      }

      return res.json();
    });
  }

  postJson(url: string, data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
    const opts = {
      method: 'POST',
      headers: this.headers('application/json'),
      body: JSON.stringify(data),
    };

    return fetch(url, opts).then((res) => {
      if (!res.ok) {
        throw new Error(`${res.status}`);
      }

      if (res.status !== 204) {
        return res.json();
      }

      return null;
    });
  }

  putJson(url: string, data: Record<string, unknown>): Promise<Record<string, unknown>> {
    const opts = {
      method: 'PUT',
      headers: this.headers('application/json'),
      body: JSON.stringify(data),
    };

    return fetch(url, opts).then((res) => {
      if (!res.ok) {
        throw new Error(`${res.status}`);
      }

      return res.json();
    });
  }

  patchJson(url: string, data: Record<string, unknown>): Promise<Record<string, unknown>> {
    const opts = {
      method: 'PATCH',
      headers: this.headers('application/json'),
      body: JSON.stringify(data),
    };

    return fetch(url, opts).then((res) => {
      if (!res.ok) {
        throw new Error(`${res.status}`);
      }

      return res.json();
    });
  }

  delete(url: string): Promise<void> {
    const opts = {
      method: 'DELETE',
      headers: this.headers(),
    };

    return fetch(url, opts).then((res) => {
      if (!res.ok) {
        throw new Error(`${res.status}`);
      }
    });
  }

  loadImage(url: string): Promise<Blob> {
    const opts: RequestInit = {
      headers: {
        Authorization: `Bearer ${this.jwt}`,
      },
      cache: 'reload',
    };

    return fetch(url, opts).then((res) => {
      if (!res.ok) {
        throw new Error(`${res.status}`);
      }

      return res.blob();
    });
  }

  userCount(): Promise<number> {
    return this.getJson('/users/count')
      .then((body) => {
        return <number>body.count;
      })
      .catch(() => {
        throw new Error('Failed to get user count.');
      });
  }

  assertJWT(): void {
    if (!this.jwt) {
      throw new Error('No JWT go login..');
    }
  }

  verifyJWT(): Promise<boolean> {
    return fetch('/things', { headers: this.headers() }).then((res) => res.ok);
  }

  createUser(name: string, email: string, password: string): Promise<void> {
    return this.postJson('/users', { name, email, password })
      .then((body) => {
        const jwt = <string>body!.jwt!;
        localStorage.setItem('jwt', jwt);
        this.jwt = jwt;
      })
      .catch(() => {
        throw new Error('Repeating signup not permitted');
      });
  }

  getUser(id: number): Promise<Record<string, unknown>> {
    return this.getJson(`/users/${encodeURIComponent(id)}`);
  }

  async addUser(name: string, email: string, password: string): Promise<Record<string, unknown>> {
    return (await this.postJson('/users', { name, email, password }))!;
  }

  editUser(
    id: string,
    name: string,
    email: string,
    password: string,
    newPassword: string
  ): Promise<Record<string, unknown>> {
    return this.putJson(`/users/${encodeURIComponent(id)}`, {
      id,
      name,
      email,
      password,
      newPassword,
    });
  }

  async userEnableMfa(id: number, totp: string): Promise<Record<string, unknown>> {
    const body: Record<string, unknown> = {
      enable: true,
    };

    if (totp) {
      body.mfa = { totp };
    }

    return (await this.postJson(`/users/${encodeURIComponent(id)}/mfa`, body))!;
  }

  async userDisableMfa(id: number): Promise<null> {
    await this.postJson(`/users/${encodeURIComponent(id)}/mfa`, { enable: false });

    return null;
  }

  userRegenerateMfaBackupCodes(id: number): Promise<Record<string, unknown>> {
    return this.putJson(`/users/${encodeURIComponent(id)}/mfa/codes`, { generate: true });
  }

  deleteUser(id: number): Promise<void> {
    return this.delete(`/users/${encodeURIComponent(id)}`);
  }

  getAllUserInfo(): Promise<Record<string, unknown>> {
    return this.getJson('/users/info');
  }

  login(email: string, password: string, totp?: string): Promise<void> {
    const body: Record<string, unknown> = {
      email,
      password,
    };

    if (totp) {
      body.mfa = { totp };
    }

    const opts = {
      method: 'POST',
      headers: this.headers('application/json'),
      body: JSON.stringify(body),
    };

    return fetch('/login', opts).then((res) => {
      if (!res.ok) {
        if (res.status === 401) {
          return res.text().then((body) => {
            throw new Error(body);
          });
        } else {
          throw new Error(`${res.status}`);
        }
      }

      return res.json().then((body) => {
        const jwt = body.jwt;
        localStorage.setItem('jwt', jwt);
        this.jwt = jwt;
      });
    });
  }

  async logout(): Promise<void> {
    this.assertJWT();
    localStorage.removeItem('jwt');

    try {
      await this.postJson('/log-out', {});
    } catch (e) {
      console.error('Logout failed:', e);
    }
  }

  getInstalledAddons(): Promise<Record<string, unknown>> {
    return this.getJson('/addons');
  }

  getAddonConfig(addonId: string): Promise<Record<string, unknown>> {
    return this.getJson(`/addons/${encodeURIComponent(addonId)}/config`);
  }

  setAddonConfig(
    addonId: string,
    config: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    return this.putJson(`/addons/${encodeURIComponent(addonId)}/config`, { config });
  }

  setAddonSetting(addonId: string, enabled: boolean): Promise<Record<string, unknown>> {
    return this.putJson(`/addons/${encodeURIComponent(addonId)}`, { enabled });
  }

  async installAddon(
    addonId: string,
    addonUrl: string,
    addonChecksum: string
  ): Promise<Record<string, unknown>> {
    return (await this.postJson('/addons', {
      id: addonId,
      url: addonUrl,
      checksum: addonChecksum,
    }))!;
  }

  uninstallAddon(addonId: string): Promise<void> {
    return this.delete(`/addons/${encodeURIComponent(addonId)}`);
  }

  updateAddon(
    addonId: string,
    addonUrl: string,
    addonChecksum: string
  ): Promise<Record<string, unknown>> {
    return this.patchJson(`/addons/${encodeURIComponent(addonId)}`, {
      url: addonUrl,
      checksum: addonChecksum,
    });
  }

  getAddonsInfo(): Promise<Record<string, unknown>> {
    return this.getJson('/settings/addonsInfo');
  }

  getExperimentSetting(experimentName: string): Promise<boolean> {
    return this.getJson(`/settings/experiments/${encodeURIComponent(experimentName)}`)
      .then((json) => {
        return <boolean>json.enabled;
      })
      .catch((e) => {
        if (e.message === '404') {
          return false;
        }

        throw new Error(`Error getting ${experimentName}`);
      });
  }

  setExperimentSetting(experimentName: string, enabled: boolean): Promise<Record<string, unknown>> {
    return this.putJson(`/settings/experiments/${encodeURIComponent(experimentName)}`, { enabled });
  }

  getUpdateStatus(): Promise<Record<string, unknown>> {
    return this.getJson('/updates/status');
  }

  getUpdateLatest(): Promise<Record<string, unknown>> {
    return this.getJson('/updates/latest');
  }

  getSelfUpdateStatus(): Promise<Record<string, unknown>> {
    return this.getJson('/updates/self-update');
  }

  setSelfUpdateStatus(enabled: boolean): Promise<Record<string, unknown>> {
    return this.putJson('/updates/self-update', { enabled });
  }

  async startUpdate(): Promise<Record<string, unknown>> {
    return (await this.postJson('/updates/update', {}))!;
  }

  getExtensions(): Promise<Record<string, unknown>> {
    return this.getJson('/extensions');
  }

  getThings(): Promise<Record<string, unknown>> {
    return this.getJson('/things');
  }

  getThing(thingId: string): Promise<Record<string, unknown>> {
    return this.getJson(`/things/${encodeURIComponent(thingId)}`);
  }

  setThingLayoutIndex(thingId: string, index: number): Promise<Record<string, unknown>> {
    return this.patchJson(`/things/${encodeURIComponent(thingId)}`, { layoutIndex: index });
  }

  setThingGroup(thingId: string, groupId: string | null): Promise<Record<string, unknown>> {
    groupId = groupId || '';
    return this.patchJson(`/things/${encodeURIComponent(thingId)}`, { group: groupId });
  }

  setThingGroupAndLayoutIndex(
    thingId: string,
    groupId: string | null,
    index: number
  ): Promise<Record<string, unknown>> {
    groupId = groupId || '';
    return this.patchJson(`/things/${encodeURIComponent(thingId)}`, {
      group: groupId,
      layoutIndex: index,
    });
  }

  setThingFloorplanPosition(
    thingId: string,
    x: number,
    y: number
  ): Promise<Record<string, unknown>> {
    return this.patchJson(`/things/${encodeURIComponent(thingId)}`, {
      floorplanX: x,
      floorplanY: y,
    });
  }

  setThingCredentials(
    thingId: string,
    data: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    const body: Record<string, unknown> = {
      thingId,
    };

    if (data.hasOwnProperty('pin')) {
      body.pin = data.pin;
    } else {
      body.username = data.username;
      body.password = data.password;
    }

    return this.patchJson('/things', body);
  }

  async addThing(description: Record<string, unknown>): Promise<Record<string, unknown>> {
    return (await this.postJson('/things', description))!;
  }

  async addWebThing(url: string): Promise<Record<string, unknown>> {
    return (await this.postJson('/new_things', { url }))!;
  }

  removeThing(thingId: string): Promise<void> {
    return this.delete(`/things/${encodeURIComponent(thingId)}`);
  }

  updateThing(thingId: string, updates: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this.putJson(`/things/${encodeURIComponent(thingId)}`, updates);
  }

  getGroups(): Promise<Record<string, unknown>> {
    return this.getJson('/groups');
  }

  getGroup(groupId: string): Promise<Record<string, unknown>> {
    return this.getJson(`/groups/${encodeURIComponent(groupId)}`);
  }

  setGroupLayoutIndex(groupId: string, index: number): Promise<Record<string, unknown>> {
    return this.patchJson(`/groups/${encodeURIComponent(groupId)}`, {
      layoutIndex: index,
    });
  }

  async addGroup(description: Record<string, unknown>): Promise<Record<string, unknown>> {
    return (await this.postJson('/groups', description))!;
  }

  removeGroup(groupId: string): Promise<void> {
    return this.delete(`/groups/${encodeURIComponent(groupId)}`);
  }

  updateGroup(groupId: string, updates: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this.putJson(`/groups/${encodeURIComponent(groupId)}`, updates);
  }

  getPushKey(): Promise<Record<string, unknown>> {
    return this.getJson('/push/vapid-public-key');
  }

  async pushSubscribe(subscription: Record<string, unknown>): Promise<Record<string, unknown>> {
    return (await this.postJson('/push/register', subscription))!;
  }

  getNotifiers(): Promise<Record<string, unknown>> {
    return this.getJson('/notifiers');
  }

  async startPairing(timeout: number): Promise<Record<string, unknown>> {
    return (await this.postJson('/actions', {
      pair: {
        input: {
          timeout,
        },
      },
    }))!;
  }

  cancelPairing(actionUrl: string): Promise<void> {
    return this.delete(actionUrl);
  }

  getRules(): Promise<Record<string, unknown>> {
    return this.getJson('/rules');
  }

  getRule(ruleId: string): Promise<Record<string, unknown>> {
    return this.getJson(`/rules/${encodeURIComponent(ruleId)}`);
  }

  async addRule(description: Record<string, unknown>): Promise<Record<string, unknown>> {
    return (await this.postJson('/rules', description))!;
  }

  updateRule(
    ruleId: string,
    description: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    return this.putJson(`/rules/${encodeURIComponent(ruleId)}`, description);
  }

  deleteRule(ruleId: string): Promise<void> {
    return this.delete(`/rules/${encodeURIComponent(ruleId)}`);
  }

  getLogs(): Promise<Record<string, unknown>> {
    return this.getJson('/logs/.schema');
  }

  async addLog(
    description: Record<string, unknown>
  ): Promise<[boolean, string | Record<string, unknown> | null]> {
    const opts = {
      method: 'POST',
      headers: this.headers('application/json'),
      body: JSON.stringify(description),
    };

    try {
      const res = await fetch('/logs', opts);

      if (!res.ok) {
        return [false, await res.text()];
      }

      return [true, await res.json()];
    } catch (_) {
      return [false, null];
    }
  }

  deleteLog(thingId: string, propertyId: string): Promise<void> {
    return this.delete(
      `/logs/things/${encodeURIComponent(thingId)}/properties/${encodeURIComponent(propertyId)}`
    );
  }

  uploadFloorplan(file: File): Promise<void> {
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
        throw new Error(`${res.status}`);
      }
    });
  }

  setupTunnel(
    email: string,
    subdomain: string,
    reclamationToken: string,
    optout: boolean
  ): Promise<[boolean, string | Record<string, unknown>]> {
    const opts = {
      method: 'POST',
      headers: this.headers('application/json'),
      body: JSON.stringify({ email, subdomain, reclamationToken, optout }),
    };

    return fetch('/settings/subscribe', opts).then((res) => {
      if (!res.ok) {
        return [false, res.statusText];
      }

      return res.json().then((body) => [true, body]);
    });
  }

  skipTunnel(): Promise<[boolean, string | Record<string, unknown>]> {
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
  }

  async reclaimDomain(subdomain: string): Promise<Record<string, unknown>> {
    return (await this.postJson('/settings/reclaim', { subdomain }))!;
  }

  getLanSettings(): Promise<Record<string, unknown>> {
    return this.getJson('/settings/network/lan');
  }

  getWlanSettings(): Promise<Record<string, unknown>> {
    return this.getJson('/settings/network/wireless');
  }

  getDhcpSettings(): Promise<Record<string, unknown>> {
    return this.getJson('/settings/network/dhcp');
  }

  getWirelessNetworks(): Promise<Record<string, unknown>> {
    return this.getJson('/settings/network/wireless/networks');
  }

  getNetworkAddresses(): Promise<Record<string, unknown>> {
    return this.getJson('/settings/network/addresses');
  }

  setLanSettings(settings: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this.putJson('/settings/network/lan', settings);
  }

  setWlanSettings(settings: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this.putJson('/settings/network/wireless', settings);
  }

  setDhcpSettings(settings: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this.putJson('/settings/network/dhcp', settings);
  }

  getNtpStatus(): Promise<Record<string, unknown>> {
    return this.getJson('/settings/system/ntp');
  }

  async restartNtpSync(): Promise<Record<string, unknown>> {
    return (await this.postJson('/settings/system/ntp', {}))!;
  }

  getSshStatus(): Promise<Record<string, unknown>> {
    return this.getJson('/settings/system/ssh');
  }

  setSshStatus(enabled: boolean): Promise<Record<string, unknown>> {
    return this.putJson('/settings/system/ssh', { enabled });
  }

  getPlatform(): Promise<Record<string, unknown>> {
    return this.getJson('/settings/system/platform');
  }

  getTunnelInfo(): Promise<Record<string, unknown>> {
    return this.getJson('/settings/tunnelinfo');
  }

  getDomainSettings(): Promise<Record<string, unknown>> {
    return this.getJson('/settings/domain');
  }

  setDomainSettings(settings: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this.putJson('/settings/domain', settings);
  }

  getAdapters(): Promise<Record<string, unknown>> {
    return this.getJson('/adapters');
  }

  getAuthorizations(): Promise<Record<string, unknown>> {
    return this.getJson('/authorizations');
  }

  revokeAuthorization(clientId: string): Promise<void> {
    return this.delete(`/authorizations/${encodeURIComponent(clientId)}`);
  }

  ping(): Promise<void> {
    const opts = {
      method: 'GET',
      headers: this.headers(),
    };

    return fetch('/ping', opts).then((res) => {
      if (!res.ok) {
        throw new Error(`${res.status}`);
      }
    });
  }

  getCountry(): Promise<Record<string, unknown>> {
    return this.getJson('/settings/localization/country');
  }

  setCountry(country: string): Promise<Record<string, unknown>> {
    return this.putJson('/settings/localization/country', { country });
  }

  getTimezone(): Promise<Record<string, unknown>> {
    return this.getJson('/settings/localization/timezone');
  }

  setTimezone(zone: string): Promise<Record<string, unknown>> {
    return this.putJson('/settings/localization/timezone', { zone });
  }

  getLanguage(): Promise<Record<string, unknown>> {
    return this.getJson('/settings/localization/language');
  }

  setLanguage(language: string): Promise<Record<string, unknown>> {
    return this.putJson('/settings/localization/language', { language });
  }

  getUnits(): Promise<Record<string, unknown>> {
    return this.getJson('/settings/localization/units');
  }

  setUnits(units: Record<string, unknown>): Promise<Record<string, unknown>> {
    return this.putJson('/settings/localization/units', units);
  }
}

const instance = new API();

// Elevate this to the window level.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).API = instance;

export default instance;
