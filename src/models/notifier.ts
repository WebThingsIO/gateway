/**
 * Action Model.
 *
 * Manages Action data model and business logic.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Outlet from './outlet';
import NotifierManager from '../plugin/notifier-manager';
import {NotifierDescription} from 'gateway-addon/lib/notifier';

export default class Notifier {
  private outlets = new Map<string, Outlet>();

  constructor(private id: string, private name: string, private notifierManager: NotifierManager) {
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  asDict(): NotifierDescription {
    return {
      id: this.id,
      name: this.name,
      ready: true,
    };
  }

  addOutlet(id: string, name: string): Outlet {
    const outlet = new Outlet(id, name, this, this.notifierManager);
    this.outlets.set(id, outlet);
    return outlet;
  }
}
