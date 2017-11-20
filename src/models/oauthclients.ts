import { URL } from 'url';
import {Scope, ClientId, ClientRegistry} from '../oauth-types';

const OAuthClients = new Map();
OAuthClients.set('hello',
                  new ClientRegistry(new URL('http://127.0.0.1:31338/callback'),
                                     'hello', 'super secret', 'readwrite'));

export default OAuthClients;
