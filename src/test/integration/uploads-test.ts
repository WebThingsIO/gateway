import { server, chai } from '../common';
import fs from 'fs';
import path from 'path';
import * as Constants from '../../constants';
import { TEST_USER, createUser, headerAuth } from '../user';

describe('uploads/', () => {
  let jwt: string;
  beforeEach(async () => {
    jwt = await createUser(server, TEST_USER);
  });

  it('Upload a file', async () => {
    const res = await chai
      .request(server)
      .post(Constants.UPLOADS_PATH)
      .set(...headerAuth(jwt))
      .attach('file', fs.readFileSync(path.join(__dirname, 'assets/test.svg')), 'test.svg');

    expect(res.status).toEqual(201);
  });
});
