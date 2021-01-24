/**
 * @module Plugin
 *
 * Object created for each plugin that the gateway talks to.
 */
/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import PluginServer from './plugin-server';
import Deferred from '../deferred';
import {Constants as AddonConstants} from 'gateway-addon';
import {
  Level,
  Message,
  NotifierAddedNotificationMessageData,
  NotifierUnloadRequest,
  NotifierUnloadResponseMessageData,
  OutletAddedNotificationMessageData,
  OutletNotifyRequest,
  OutletNotifyResponseMessageData,
  OutletRemovedNotificationMessageData,
} from 'gateway-addon/lib/schema';
import {NotifierDescription} from 'gateway-addon/lib/notifier';
import Plugin from './plugin';
import Notifier from '../models/notifier';

const MessageType = AddonConstants.MessageType;

export default class NotifierManager {
  private notifiers = new Map<string, Notifier>();

  private notifications = new Map<number, Deferred<void, void>>();

  private unloadRequest: Deferred<void, void> | null = null;

  constructor(
    private pluginId: string,
    private pluginServer: PluginServer,
    private plugin: Plugin) {
  }

  asDict(): NotifierDescription[] {
    return Array.from(this.notifiers.values()).map((notifier) => {
      return notifier.asDict();
    });
  }

  onMsg(msg: Message): void {
    switch (msg.messageType) {
      case MessageType.NOTIFIER_ADDED_NOTIFICATION: {
        const data = msg.data as NotifierAddedNotificationMessageData;
        const notifier = new Notifier(data.notifierId, data.name, this);
        this.notifiers.set(data.notifierId, notifier);
        this.pluginServer.addNotifier(notifier);
        return;
      }
      case MessageType.OUTLET_ADDED_NOTIFICATION: {
        const data = msg.data as OutletAddedNotificationMessageData;
        const notifier = this.notifiers.get(data.notifierId);

        if (!notifier) {
          console.error('Plugin:', this.plugin.getPluginId(),
                        'Unrecognized notifier:', data.notifierId,
                        'Ignoring msg:', msg);
          return;
        }

        const outlet = notifier.addOutlet(data.outlet.id, data.outlet.name);
        break;
      }
      case MessageType.OUTLET_NOTIFY_RESPONSE: {
        const data = msg.data as OutletNotifyResponseMessageData;
        const messageId = data.messageId;
        const deferred = this.notifications.get(messageId);
        if (typeof messageId === 'undefined' ||
            typeof deferred === 'undefined') {
          console.error('Plugin:', this.pluginId,
                        'Unrecognized message id:', messageId,
                        'Ignoring msg:', msg);
          return;
        }

        if (msg.data.success) {
          deferred.resolve();
        } else {
          deferred.reject();
        }

        this.notifications.delete(messageId);
        return;
      }
      case MessageType.OUTLET_REMOVED_NOTIFICATION: {
        const data = msg.data as OutletRemovedNotificationMessageData;

        const notifier = this.notifiers.get(data.notifierId);

        if (!notifier) {
          console.error('Plugin:', this.plugin.getPluginId(),
                        'Unrecognized notifier:', data.notifierId,
                        'Ignoring msg:', msg);
          return;
        }

        const outlet = notifier.getOutlet(data.outletId);

        if (outlet) {
          notifier.handleOutletRemoved(outlet);
        }
        break;
      }
      case MessageType.NOTIFIER_UNLOAD_RESPONSE: {
        const data = msg.data as NotifierUnloadResponseMessageData;
        this.notifiers.delete(data.notifierId);
        this.plugin.checkUnload();
        break;
      }
      default:
        console.error('Plugin: unrecognized msg:', msg);
        break;
    }
  }

  notifiy(
    notifierId: string, outletId: string, title: string,
    message: string, level: Level): Promise<void> {
    const deferred = new Deferred<void, void>();
    const messageId = this.plugin.generateMsgId();

    this.notifications.set(messageId, deferred);

    const msg: OutletNotifyRequest = {
      messageType: MessageType.OUTLET_NOTIFY_REQUEST,
      data: {
        pluginId: this.plugin.getPluginId(),
        notifierId,
        outletId,
        messageId,
        title,
        message,
        level,
      },
    };

    this.plugin.sendMessage(msg);

    return deferred.getPromise();
  }

  unload(notifierId: string): Promise<void> {
    if (this.unloadRequest) {
      console.error('NotifierProxy: unload already in progress');
      return Promise.reject();
    }

    this.unloadRequest = new Deferred<void, void>();

    const msg: NotifierUnloadRequest = {
      messageType: MessageType.NOTIFIER_UNLOAD_REQUEST,
      data: {
        pluginId: this.plugin.getPluginId(),
        notifierId,
      },
    };

    this.plugin.sendMessage(msg);


    return this.unloadRequest.getPromise();
  }

  shutdown(): void {
    for (const [, deferred] of Object.entries(this.notifications)) {
      deferred.reject();
    }

    this.notifications.clear();
  }
}
