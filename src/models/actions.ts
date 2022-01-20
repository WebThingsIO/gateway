/**
 * Actions.
 *
 * Manages a collection of Actions.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Action, { ActionDescription } from './action';
import * as Constants from '../constants';
import { EventEmitter } from 'events';
import Things from './things';
import AddonManager from '../addon-manager';

class Actions extends EventEmitter {
  private actions: Record<string, Action>;

  private nextId: number;

  private _onActionStatus: (action: Action) => void;

  constructor() {
    super();

    /**
     * A map of action requests.
     */
    this.actions = {};

    /**
     * A counter to generate action IDs.
     */
    this.nextId = 0;

    this._onActionStatus = this.onActionStatus.bind(this);
  }

  /**
   * Reset actions state.
   */
  clearState(): void {
    this.nextId = 0;
    for (const id in this.actions) {
      this.remove(id);
    }
  }

  /**
   * Generate an ID for a new action.
   *
   * @returns {String} An id.
   */
  generateId(): string {
    return `${++this.nextId}`;
  }

  /**
   * Get a particular action.
   *
   * @returns {Object} The specified action, or undefined if the action
   * doesn't exist.
   */
  get(id: string): Action {
    return this.actions[id];
  }

  /**
   * Get a list of all current actions.
   *
   * @returns {Array} A list of current actions.
   */
  getAll(): Action[] {
    return Object.keys(this.actions).map((id) => {
      return this.actions[id];
    });
  }

  /**
   * Get only the actions which are not associated with a specific thing and
   * therefore belong to the root Gateway
   */
  getGatewayActions(actionName?: string): { [name: string]: ActionDescription }[] {
    return this.getAll()
      .filter((action) => {
        return !action.getThingId();
      })
      .filter((action) => {
        if (actionName) {
          return actionName === action.getName();
        }

        return true;
      })
      .map((action) => {
        return { [action.getName()]: action.getDescription() };
      });
  }

  /**
   * Get only the actions which are associated with a specific thing
   */
  getByThing(thingId: string, actionName?: string): { [name: string]: ActionDescription }[] {
    return this.getAll()
      .filter((action) => {
        return action.getThingId() === thingId;
      })
      .filter((action) => {
        if (actionName) {
          return actionName === action.getName();
        }

        return true;
      })
      .map((action) => {
        return { [action.getName()]: action.getDescription() };
      });
  }

  /**
   * Add a new action.
   *
   * @param {Action} action An Action object.
   * @return {Promise} resolved when action added or rejected if failed
   */
  add(action: Action): Promise<void> {
    const id = action.getId();
    this.actions[id] = action;

    // Call this initially for the 'created' status.
    this.onActionStatus(action);

    action.on(Constants.ACTION_STATUS, this._onActionStatus);

    if (action.getThingId()) {
      return Things.getThing(action.getThingId()!).then((thing) => {
        const success = thing.addAction(action);
        if (!success) {
          delete this.actions[id];
          throw new Error(`Invalid thing action name: "${action.getName()}"`);
        }
      });
    }

    // Only update the action status if it's being handled internally
    action.updateStatus(Constants.ActionStatusValues.RUNNING);

    switch (action.getName()) {
      case 'pair':
        AddonManager.addNewThing((<Record<string, number>>action.getInput()!).timeout)
          .then(() => {
            action.updateStatus(Constants.ActionStatusValues.COMPLETED);
          })
          .catch((error: unknown) => {
            action.setError({
              type: 'https://webthings.io/errors/pair-failed',
              title: 'Failed to pair device',
            });
            action.updateStatus(Constants.ActionStatusValues.FAILED);
            console.error('Thing was not added');
            console.error(error);
          });
        break;
      case 'unpair': {
        const thingId = (<Record<string, string>>action.getInput()!).id;
        if (thingId) {
          const _finally = (): void => {
            console.log('unpair: thing:', thingId, 'was unpaired');
            Things.removeThing(thingId)
              .then(() => {
                action.updateStatus(Constants.ActionStatusValues.COMPLETED);
              })
              .catch((error: unknown) => {
                action.setError({
                  type: 'https://webthings.io/errors/unpair-failed',
                  title: 'Failed to unpair device',
                });
                action.updateStatus(Constants.ActionStatusValues.FAILED);
                console.error('unpair of thing:', thingId, 'failed.');
                console.error(error);
              });
          };

          AddonManager.removeThing(thingId).then(_finally, _finally);
        } else {
          action.setError({
            type: 'https://webthings.io/errors/unpair-failed-missing-id',
            title: 'Failed to unpair device because device ID not provided',
          });
          action.updateStatus(Constants.ActionStatusValues.FAILED);
          console.error('unpair missing "id" parameter.');
        }
        break;
      }
      default:
        delete this.actions[id];
        return Promise.reject(new Error(`Invalid action name: "${action.getName()}"`));
    }
    return Promise.resolve();
  }

  /**
   * Forward the actionStatus event
   */
  onActionStatus(action: Action): void {
    this.emit(Constants.ACTION_STATUS, action);
  }

  /**
   * Remove an action from the action list.
   *
   * @param {String} id Action ID.
   *
   * If the action has not yet been completed, it is cancelled.
   */
  remove(id: string): void {
    const action = this.actions[id];
    if (!action) {
      throw new Error(`Invalid action id: ${id}`);
    }

    if (
      action.getStatus() === Constants.ActionStatusValues.PENDING ||
      action.getStatus() === Constants.ActionStatusValues.RUNNING
    ) {
      if (action.getThingId()) {
        Things.getThing(action.getThingId()!)
          .then((thing) => {
            if (!thing.removeAction(action)) {
              throw new Error(`Invalid thing action name: "${action.getName()}"`);
            }
          })
          .catch((err: unknown) => {
            console.error('Error removing thing action:', err);
          });
      } else {
        switch (action.getName()) {
          case 'pair':
            AddonManager.cancelAddNewThing();
            break;
          case 'unpair':
            AddonManager.cancelRemoveThing((<Record<string, string>>action.getInput()!).id);
            break;
          default:
            throw new Error(`Invalid action name: "${action.getName()}"`);
        }
      }
    }

    action.updateStatus('deleted');
    action.removeListener(Constants.ACTION_STATUS, this._onActionStatus);
    delete this.actions[id];
  }
}

export default new Actions();
