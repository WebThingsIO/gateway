/**
 * @module AdapterProxy base class.
 *
 * Manages Adapter data model and business logic.
 */
/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Adapter, AddonManagerProxy, Constants, Device } from 'gateway-addon';
import { Device as DeviceSchema } from 'gateway-addon/lib/schema';
import Deferred from '../deferred';
import DeviceProxy from './device-proxy';
import { AddonManager } from '../addon-manager';
import Plugin from './plugin';
const MessageType = Constants.MessageType;
const DEBUG = false;

/**
 * Class used to describe an adapter from the perspective
 * of the gateway.
 */
export default class AdapterProxy extends Adapter {
  public deferredMock: (Deferred<Device | void, unknown> & { device: Device | null }) | null = null;

  public unloadCompletedPromise: Deferred<void, void> | null = null;

  private eventHandlers: Record<string, (...args: any[]) => void> = {};

  constructor(
    addonManager: AddonManager,
    adapterId: string,
    name: string,
    packageName: string,
    private plugin: Plugin
  ) {
    super(<AddonManagerProxy>(<unknown>addonManager), adapterId, packageName);

    // TODO: fix after updating gateway-addon
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this as any).name = name;
  }

  getEventHandlers(): Record<string, (...args: any[]) => void> {
    return this.eventHandlers;
  }

  startPairing(timeoutSeconds: number): void {
    DEBUG && console.log('AdapterProxy: startPairing', this.getName(), 'id', this.getId());
    this.sendMsg(MessageType.ADAPTER_START_PAIRING_COMMAND, {
      timeout: timeoutSeconds,
    });
  }

  cancelPairing(): void {
    DEBUG && console.log('AdapterProxy: cancelPairing', this.getName(), 'id', this.getId());
    this.sendMsg(MessageType.ADAPTER_CANCEL_PAIRING_COMMAND, {});
  }

  removeThing(device: Device): void {
    DEBUG &&
      console.log(
        'AdapterProxy:',
        this.getName(),
        'id',
        this.getId(),
        'removeThing:',
        device.getId()
      );
    this.sendMsg(MessageType.ADAPTER_REMOVE_DEVICE_REQUEST, {
      deviceId: device.getId(),
    });
  }

  cancelRemoveThing(device: Device): void {
    DEBUG &&
      console.log(
        'AdapterProxy:',
        this.getName(),
        'id',
        this.getId(),
        'cancelRemoveThing:',
        device.getId()
      );
    this.sendMsg(MessageType.ADAPTER_CANCEL_REMOVE_DEVICE_COMMAND, {
      deviceId: device.getId(),
    });
  }

  sendMsg(
    methodType: number,
    data: Record<string, unknown>,
    deferred?: Deferred<unknown, unknown>
  ): void {
    data.adapterId = this.getId();
    return this.plugin.sendMsg(methodType, data, deferred);
  }

  /**
   * Unloads an adapter.
   *
   * @returns a promise which resolves when the adapter has
   *          finished unloading.
   */
  unload(): Promise<void> {
    if (this.unloadCompletedPromise) {
      console.error('AdapterProxy: unload already in progress');
      return Promise.reject();
    }
    this.unloadCompletedPromise = new Deferred();
    this.sendMsg(MessageType.ADAPTER_UNLOAD_REQUEST, {
      adapterId: this.getId(),
    });
    return this.unloadCompletedPromise.getPromise();
  }

  /**
   * Set the PIN for the given device.
   *
   * @param {String} deviceId ID of the device
   * @param {String} pin PIN to set
   *
   * @returns a promise which resolves when the PIN has been set.
   */
  setPin(deviceId: string, pin: string): Promise<void> {
    // The base class expectes a Promise<void> here, but we have to return the device schema.
    // This is nasty.
    return <Promise<void>>(<unknown>new Promise<DeviceSchema>((resolve, reject) => {
      console.log('AdapterProxy: setPin:', pin, 'for:', deviceId);

      const device = this.getDevice(deviceId);
      if (!device) {
        reject('Device not found');
        return;
      }

      const deferredSet = new Deferred<DeviceSchema, void>();

      deferredSet
        .getPromise()
        .then((device) => {
          resolve(<DeviceSchema>device);
        })
        .catch(() => {
          reject();
        });

      this.sendMsg(
        MessageType.DEVICE_SET_PIN_REQUEST,
        {
          deviceId,
          pin,
        },
        <Deferred<unknown, unknown>>deferredSet
      );
    }));
  }

  /**
   * Set the credentials for the given device.
   *
   * @param {String} deviceId ID of the device
   * @param {String} username Username to set
   * @param {String} password Password to set
   *
   * @returns a promise which resolves when the credentials have been set.
   */
  setCredentials(deviceId: string, username: string, password: string): Promise<void> {
    // The base class expectes a Promise<void> here, but we have to return the device schema.
    // This is nasty.
    return <Promise<void>>(<unknown>new Promise<DeviceSchema>((resolve, reject) => {
      console.log('AdapterProxy: setCredentials:', username, password, 'for:', deviceId);

      const device = this.getDevice(deviceId);
      if (!device) {
        reject('Device not found');
        return;
      }

      const deferredSet = new Deferred<DeviceSchema, void>();

      deferredSet
        .getPromise()
        .then((device) => {
          resolve(<DeviceSchema>device);
        })
        .catch(() => {
          reject();
        });

      this.sendMsg(
        MessageType.DEVICE_SET_CREDENTIALS_REQUEST,
        {
          deviceId,
          username,
          password,
        },
        <Deferred<unknown, unknown>>deferredSet
      );
    }));
  }

  // The following methods are added to support using the
  // MockAdapter as a plugin.

  clearState(): Promise<void> {
    if (this.deferredMock) {
      const err = 'clearState: deferredMock already in progress';
      console.error(err);
      return Promise.reject(err);
    }
    this.deferredMock = Object.assign(new Deferred<Device | void, unknown>(), { device: null });
    this.sendMsg(MessageType.MOCK_ADAPTER_CLEAR_STATE_REQUEST, {
      adapterId: this.getId(),
    });
    return <Promise<void>>this.deferredMock.getPromise();
  }

  addDevice(deviceId: string, deviceDescription: DeviceSchema): Promise<void> {
    if (this.deferredMock) {
      const err = 'addDevice: deferredMock already in progress';
      console.error(err);
      return Promise.reject(err);
    }

    // For the MockDevice we create the device now, so that we can
    // deliver the propertyChanged notifications that show up before
    // the handleDeviceAdded notification comes in. The device we
    // create now will be replaced when the handleDeviceAdded
    // notification shows up.

    this.getDevices()[deviceId] = new DeviceProxy(this, deviceDescription);

    this.deferredMock = Object.assign(new Deferred<Device | void, unknown>(), { device: null });
    this.sendMsg(MessageType.MOCK_ADAPTER_ADD_DEVICE_REQUEST, {
      deviceId: deviceId,
      deviceDescr: deviceDescription,
    });
    return <Promise<void>>this.deferredMock.getPromise();
  }

  removeDevice(deviceId: string): Promise<void> {
    if (this.deferredMock) {
      const err = 'removeDevice: deferredMock already in progress';
      console.error(err);
      return Promise.reject(err);
    }
    this.deferredMock = Object.assign(new Deferred<Device | void, unknown>(), { device: null });

    // We need the actual device object when we resolve the promise
    // so we stash it here since it gets removed under our feet.
    this.deferredMock.device = this.getDevice(deviceId);
    this.sendMsg(MessageType.MOCK_ADAPTER_REMOVE_DEVICE_REQUEST, {
      deviceId: deviceId,
    });
    return <Promise<void>>this.deferredMock.getPromise();
  }

  pairDevice(deviceId: string, deviceDescription: DeviceSchema): void {
    this.sendMsg(MessageType.MOCK_ADAPTER_PAIR_DEVICE_COMMAND, {
      deviceId: deviceId,
      deviceDescr: deviceDescription,
    });
  }

  unpairDevice(deviceId: string): void {
    this.sendMsg(MessageType.MOCK_ADAPTER_UNPAIR_DEVICE_COMMAND, {
      deviceId: deviceId,
    });
  }
}
