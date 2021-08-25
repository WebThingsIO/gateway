import * as Constants from '../../constants';
import { server, chai, mockAdapter } from '../common';
import { getBrowser } from './browser-common';
import { TEST_USER, createUser, headerAuth } from '../user';

let jwt: string;

beforeEach(async () => {
  const browser = getBrowser();
  jwt = await createUser(server, TEST_USER);
  await browser.url('/');

  const email = await browser.$('#email');
  const password = await browser.$('#password');
  const loginButton = await browser.$('#login-button');

  await email.waitForExist({ timeout: 5000 });
  await email.setValue(TEST_USER.email);
  await password.setValue(TEST_USER.password);
  await loginButton.click();
});

export async function getAddons(): Promise<Map<string, string>> {
  const res = await chai
    .request(server)
    .keepOpen()
    .get(`${Constants.ADDONS_PATH}`)
    .set('Accept', 'application/json')
    .set(...headerAuth(jwt));

  const installedAddons = new Map<string, string>();
  // Store a map of name->version.
  for (const s of res.body) {
    installedAddons.set(s.id, s);
  }
  return installedAddons;
}

export async function addThing(desc: Record<string, unknown>): Promise<void> {
  const { id } = desc;

  if (
    desc.hasOwnProperty('@type') &&
    (<string[]>desc['@type']).length > 0 &&
    !desc.hasOwnProperty('selectedCapability')
  ) {
    desc.selectedCapability = (<string[]>desc['@type'])[0];
  }
  await chai
    .request(server)
    .keepOpen()
    .post(Constants.THINGS_PATH)
    .set('Accept', 'application/json')
    .set(...headerAuth(jwt))
    .send(desc);
  await mockAdapter().addDevice(<string>id, desc);
}

export async function getProperty<T>(id: string, property: string): Promise<T> {
  const res = await chai
    .request(server)
    .keepOpen()
    .get(`${Constants.THINGS_PATH}/${id}/properties/${property}`)
    .set('Accept', 'application/json')
    .set(...headerAuth(jwt));
  return res.body;
}

export async function setProperty(id: string, property: string, value: unknown): Promise<void> {
  await chai
    .request(server)
    .keepOpen()
    .put(`${Constants.THINGS_PATH}/${id}/properties/${property}`)
    .set(...headerAuth(jwt))
    .send(value);
}

export function escapeHtmlForIdClass(text: string): string {
  if (typeof text !== 'string') {
    text = `${text}`;
  }

  text = text.replace(/[^_a-zA-Z0-9-]/g, '_');
  if (/^[0-9-]/.test(text)) {
    text = `_${text}`;
  }

  return text;
}
