import sinon from 'sinon';
import {JSDOM} from 'jsdom';

// Setup the jsdom environment
const {document} = (new JSDOM('<!doctype html><html><body></body></html>')).window;
global.document = document;
global.window = document.defaultView!;
global.navigator = global.window.navigator;

const storage = new Map<string, string>();
global.localStorage = {
  getItem: (key: string) => storage.has(key) ? storage.get(key)! : null,
  setItem: (key: string, value: unknown) => storage.set(key, `${value}`),
  removeItem: (key: string) => storage.delete(key),
  clear: () => storage.clear(),
  key: (idx: number) => Array.from(storage.keys())[idx],
  get length() {
    return storage.size;
  },
};

beforeEach(() => {
  (global as any).sandbox = sinon.createSandbox();
});

afterEach(() => {
  (global as any).sandbox.restore();
});
