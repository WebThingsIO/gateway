/**
 * Action Model.
 *
 * Manages Action data model and business logic.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import NotifierManager from '../plugin/notifier-manager';
import {Level} from 'gateway-addon/lib/schema';
import Notifier from './notifier';

export default class Outlet {
  constructor(
    private id: string, private name: string, private notifier: Notifier,
    private notifierManager: NotifierManager) {
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  notifiy(title: string, message: string, level: Level): Promise<void> {
    return this.notifierManager.notifiy(this.notifier.getId(), this.id, title, message, level);
  }
}
