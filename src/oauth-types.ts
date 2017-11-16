import { URL } from 'url';

export type Scope = 'readwrite';
export type ClientId = string;

export class ClientRegistry {
  constructor(public redirect_uri: URL, public id: ClientId, public scope: Scope) {
  }
}


