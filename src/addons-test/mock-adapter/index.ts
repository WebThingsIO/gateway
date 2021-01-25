/**
 * mock-adapter.ts - Mock Adapter.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {Action, Adapter, AddonManagerProxy, Device, Property} from 'gateway-addon';
import {
  Action as ActionSchema,
  Event as EventSchema,
  Input,
  Property as PropertySchema,
  PropertyValue,
} from 'gateway-addon/lib/schema';
import express from 'express';
import {Server} from 'http';
import manifest from './manifest.json';

class MockProperty extends Property<PropertyValue> {
  constructor(device: MockDevice, name: string, propertyDescription: PropertySchema) {
    super(device, name, propertyDescription);
    if (propertyDescription.unit) {
      this.setUnit(propertyDescription.unit!);
    }
    if (propertyDescription.description) {
      this.setDescription(propertyDescription.description!);
    }
    this.setCachedValue(propertyDescription.value ?? null);
    this.getDevice().notifyPropertyChanged(this);
  }

  /**
   * @method setValue
   * @returns a promise which resolves to the updated value.
   *
   * @note it is possible that the updated value doesn't match
   * the value passed in.
   */
  setValue(value: PropertyValue): Promise<PropertyValue> {
    return new Promise((resolve, reject) => {
      if (/^rejectProperty/.test(this.getName())) {
        reject('Read-only property');
        return;
      }
      super.setValue(value).then((updatedValue) => {
        resolve(updatedValue);
      }).catch((err) => {
        reject(err);
      });
    });
  }
}

class MockDevice extends Device {
  constructor(adapter: MockAdapter, id: string, deviceDescription: Record<string, unknown>) {
    super(adapter, id);
    this.setTitle(<string>deviceDescription.title);
    // TODO: fix after updating gateway-addon
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this as any)['@type'] = deviceDescription['@type'];
    this.setDescription(<string>deviceDescription.description);
    // TODO: fix after updating gateway-addon
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this as any).baseHref = `http://127.0.0.1:${adapter.getPort()}`;
    for (const propertyName in <Record<string, PropertySchema>>deviceDescription.properties) {
      const propertyDescription =
        (<Record<string, PropertySchema>>deviceDescription.properties)[propertyName];
      const property = new MockProperty(this, propertyName, propertyDescription);
      this.addProperty(property);
    }

    for (const actionName in <Record<string, ActionSchema>>deviceDescription.actions) {
      this.addAction(
        actionName,
        (<Record<string, ActionSchema>>deviceDescription.actions)[actionName]
      );
    }

    for (const eventName in <Record<string, EventSchema>>deviceDescription.events) {
      this.addEvent(eventName, (<Record<string, EventSchema>>deviceDescription.events)[eventName]);
    }
  }

  requestAction(actionId: string, actionName: string, input: Input): Promise<void> {
    if (actionName === 'rejectRequest') {
      return Promise.reject();
    }
    return super.requestAction(actionId, actionName, input);
  }

  removeAction(actionId: string, actionName: string): Promise<void> {
    if (actionName === 'rejectRemove') {
      return Promise.reject();
    }
    return super.removeAction(actionId, actionName);
  }

  performAction(action: Action): Promise<void> {
    return new Promise((resolve, _reject) => {
      action.start();
      action.finish();
      resolve();
    });
  }
}

export class MockAdapter extends Adapter {
  private port: number;

  private app: express.Express;

  private server: Server;

  private pairDeviceId: string | null;

  private pairDeviceDescription: Record<string, unknown> | null;

  constructor(addonManager: AddonManagerProxy, packageName: string) {
    super(addonManager, packageName, packageName);
    addonManager.addAdapter(this);

    this.pairDeviceId = null;
    this.pairDeviceDescription = null;
    this.port = 12345;
    this.app = express();
    this.app.all('/*', (req, rsp) => {
      rsp.send(`${req.method} ${req.path}`);
    });
    this.server = this.app.listen(this.port);
  }

  /**
   * For cleanup between tests. Returns a promise which resolves
   * when all of the state has been cleared.
   */
  clearState(): Promise<Device[]> {
    (<Record<string, unknown>><unknown> this).actions = {};

    return Promise.all(
      Object.keys(this.getDevices()).map((deviceId) => {
        return this.removeDevice(deviceId);
      })
    );
  }

  /**
   * Add a MockDevice to the MockAdapter
   *
   * @param {String} deviceId ID of the device to add.
   * @return {Promise} which resolves to the device added.
   */
  addDevice(deviceId: string, deviceDescription: Record<string, unknown>): Promise<Device> {
    return new Promise((resolve, reject) => {
      if (deviceId in this.getDevices()) {
        reject(`Device: ${deviceId} already exists.`);
      } else {
        const device = new MockDevice(this, deviceId, deviceDescription);
        this.handleDeviceAdded(device);
        resolve(device);
      }
    });
  }

  /**
   * Remove a MockDevice from the MockAdapter.
   *
   * @param {String} deviceId ID of the device to remove.
   * @return {Promise} which resolves to the device removed.
   */
  removeDevice(deviceId: string): Promise<Device> {
    return new Promise((resolve, reject) => {
      const device = this.getDevice(deviceId);
      if (device) {
        this.handleDeviceRemoved(device);
        resolve(device);
      } else {
        reject(`Device: ${deviceId} not found.`);
      }
    });
  }

  pairDevice(deviceId: string, deviceDescription: Record<string, unknown>): void {
    this.pairDeviceId = deviceId;
    this.pairDeviceDescription = deviceDescription;
  }

  unpairDevice(_deviceId: string): void {
    // pass
  }

  startPairing(_timeoutSeconds: number): void {
    console.log('MockAdapter:', this.getName(), 'id', this.getId(), 'pairing started');
    if (this.pairDeviceId) {
      const deviceId = this.pairDeviceId;
      const deviceDescription = this.pairDeviceDescription!;
      this.pairDeviceId = null;
      this.pairDeviceDescription = null;
      this.addDevice(deviceId, deviceDescription).then(() => {
        console.log('MockAdapter: device:', deviceId, 'was paired.');
      }).catch((err) => {
        console.error('MockAdapter: unpairing', deviceId, 'failed');
        console.error(err);
      });
    }
  }

  cancelPairing(): void {
    console.log('MockAdapter:', this.getName(), 'id', this.getId(),
                'pairing cancelled');
  }

  removeThing(device: Device): void {
    console.log('MockAdapter:', this.getName(), 'id', this.getId(),
                'removeThing(', device.getId(), ') started');

    this.removeDevice(device.getId()).then(() => {
      console.log('MockAdapter: device:', device.getId(), 'was unpaired.');
    }).catch((err) => {
      console.error('MockAdapter: unpairing', device.getId(), 'failed');
      console.error(err);
    });
  }

  cancelRemoveThing(device: Device): void {
    console.log('MockAdapter:', this.getName(), 'id', this.getId(),
                'cancelRemoveThing(', device.getId(), ')');
  }

  setPin(_deviceId: string, pin: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (pin === '1234') {
        resolve();
      } else {
        reject();
      }
    });
  }

  setCredentials(_deviceId: string, username: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (username === 'test-user' && password === 'Password-1234!') {
        resolve();
      } else {
        reject();
      }
    });
  }

  unload(): Promise<void> {
    this.server.close();
    return super.unload();
  }

  getPort(): number {
    return this.port;
  }
}

function loadMockAdapter(addonManager: AddonManagerProxy): void {
  new MockAdapter(addonManager, manifest.id);
}

export default loadMockAdapter;
