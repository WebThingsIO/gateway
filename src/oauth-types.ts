'use strict';

import { URL } from 'url';
import * as Constants from './constants';

type Read = 'read';
type ReadWrite = 'readwrite';
export type ScopeAccess = Read|ReadWrite;
export type Scope = {[path: string]: ScopeAccess};

export type ScopeRaw = string;
export type ClientId = string;

export class ClientRegistry {
  constructor(public redirect_uri: URL, public id: ClientId, public name: string,
              public secret: string, public scope: ScopeRaw) {
  }

  getDescription() {
    return {
      id: this.id,
      name: this.name,
      redirect_uri: this.redirect_uri,
      scope: this.scope
    };
  }
}

function stringToScope(scopeRaw: ScopeRaw): Scope {
  let scope: Scope = {};
  let scopeParts = scopeRaw.split(' ');
  for (let scopePart of scopeParts) {
    let parts = scopePart.split(':');
    let path = parts[0];
    let readwrite = parts[1];
    if (readwrite !== 'read' && readwrite !== 'readwrite') {
      readwrite = 'read';
    }
    scope[path] = readwrite as 'read'|'readwrite';
  }

  return scope;
}

export function scopeValidSubset(clientScopeRaw: ScopeRaw, requestScopeRaw: ScopeRaw): boolean {
  if (clientScopeRaw === requestScopeRaw) {
    return true;
  }
  let clientScope = stringToScope(clientScopeRaw);
  let requestScope = stringToScope(requestScopeRaw);

  if (!clientScope || !requestScope) {
    return false;
  }

  for (let requestPath in requestScope) {
    if (!requestPath.startsWith(Constants.THINGS_PATH)) {
      console.warn('Invalid request for out-of-bounds scope', requestScopeRaw);
      return false;
    }
    let requestAccess = requestScope[requestPath];
    let access: ScopeAccess|undefined;
    if (clientScope[requestPath]) {
      access = clientScope[requestPath];
    } else {
      access = clientScope[Constants.THINGS_PATH];
    }

    if (!access) {
      return false;
    }

    if (requestAccess === 'readwrite') {
      if (access !== 'readwrite') {
        return false;
      }
    }
  }
  return true;
}
