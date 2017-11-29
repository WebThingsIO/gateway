import { URL } from 'url';

export type Scope = 'readwrite';
export type ClientId = string;

export class ClientRegistry {
  constructor(public redirect_uri: URL, public id: ClientId, public name: string,
              public secret: string, public scope: Scope) {
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


