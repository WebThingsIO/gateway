import {URL} from 'url';
import * as Constants from './constants';

type Read = 'read';
type ReadWrite = 'readwrite';
export type ScopeAccess = Read | ReadWrite;
export type Scope = {[path: string]: ScopeAccess};

export type ScopeRaw = string;
export type ClientId = string;

export class ClientRegistry {
  public redirect_uri: URL;

  public id: ClientId;

  public name: string;

  public secret: string;

  public scope: ScopeRaw;

  constructor(redirect_uri: URL, id: ClientId, name: string, secret: string, scope: ScopeRaw) {
    this.redirect_uri = redirect_uri;
    this.id = id;
    this.name = name;
    this.secret = secret;
    this.scope = scope;
  }

  getDescription(): {id: ClientId, name: string, redirect_uri: URL, scope: ScopeRaw} {
    return {
      id: this.id,
      name: this.name,
      redirect_uri: this.redirect_uri,
      scope: this.scope,
    };
  }
}

function stringToScope(scopeRaw: ScopeRaw): Scope {
  const scope: Scope = {};
  const scopeParts = scopeRaw.split(' ');
  for (const scopePart of scopeParts) {
    const parts = scopePart.split(':');
    const path = parts[0];
    let readwrite = parts[1];
    if (readwrite !== 'read' && readwrite !== 'readwrite') {
      readwrite = 'read';
    }
    scope[path] = readwrite as 'read' | 'readwrite';
  }

  return scope;
}

export function scopeValidSubset(clientScopeRaw: ScopeRaw, requestScopeRaw: ScopeRaw): boolean {
  if (clientScopeRaw === requestScopeRaw) {
    return true;
  }
  const clientScope = stringToScope(clientScopeRaw);
  const requestScope = stringToScope(requestScopeRaw);

  if (!clientScope || !requestScope) {
    return false;
  }

  for (const requestPath in requestScope) {
    if (!requestPath.startsWith(Constants.THINGS_PATH)) {
      console.warn('Invalid request for out-of-bounds scope', requestScopeRaw);
      return false;
    }
    const requestAccess = requestScope[requestPath];
    let access: ScopeAccess | undefined;
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
