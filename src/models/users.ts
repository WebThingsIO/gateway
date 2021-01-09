/**
 * User Manager.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import User from './user';
import Database from '../db';

/**
 * Get a user from the database.
 *
 * @param {String} email Email address of user to look up.
 * @return {Promise} Promise which resolves to user object
 *   or null if user doesn't exist.
 */
export async function getUser(email: string): Promise<User|null> {
  const result = await Database.getUser(email);

  if (!result) {
    return null;
  }

  return new User(
    result.id,
    result.email,
    result.password,
    result.name,
    result.mfaSharedSecret,
    result.mfaEnrolled,
    result.mfaBackupCodes
  );
}

export function getCount(): Promise<number> {
  return Database.getUserCount();
}

/**
 * Get a user from the database.
 *
 * @param {number} id primary key.
 * @return {Promise} Promise which resolves to user object
 *   or null if user doesn't exist.
 */
export async function getUserById(id: number|string): Promise<User|null> {
  if (typeof id !== 'number') {
    id = parseInt(id, 10);
    if (isNaN(id)) {
      return Promise.reject('Invalid user ID');
    }
  }

  const row = await Database.getUserById(id);
  if (!row) {
    return null;
  }

  return new User(
    row.id,
    row.email,
    row.password,
    row.name,
    row.mfaSharedSecret,
    row.mfaEnrolled,
    row.mfaBackupCodes
  );
}

/**
 * Get all Users stored in the database
 * @return {Promise<Array<User>>}
 */
export async function getUsers(): Promise<User[]> {
  const userRows = await Database.getUsers();

  return userRows.map((row) => {
    return new User(
      row.id,
      row.email,
      row.password,
      row.name,
      row.mfaSharedSecret,
      row.mfaEnrolled,
      row.mfaBackupCodes
    );
  });
}

/**
 * Create a new User
 * @param {String} email
 * @param {String} password
 * @param {String?} name - optional name of user
 * @return {User} user object.
 */
export async function createUser(email: string, password: string, name: string|null):
Promise<User> {
  const user =
    new User(null, email.toLowerCase(), password, name, '', false, '');
  user.setId(await Database.createUser(user));
  return user;
}

/**
 * Edit an existing User
 * @param {User} user to edit
 * @return {Promise} Promise which resolves when operation is complete.
 */
export async function editUser(user: User): Promise<void> {
  user.setEmail(user.getEmail().toLowerCase());
  await Database.editUser(user);
}

/**
 * Delete an existing User
 * @param {Number} userId
 * @return {Promise} Promise which resolves when operation is complete.
 */
export async function deleteUser(userId: number|string): Promise<void> {
  if (typeof userId !== 'number') {
    userId = parseInt(userId, 10);
    if (isNaN(userId)) {
      return Promise.reject('Invalid user ID');
    }
  }

  await Database.deleteUser(userId);
}
