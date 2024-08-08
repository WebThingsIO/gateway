import { server, chai } from '../common';

describe('/.well-known', function () {
  it('Serves OAuth metadata at a well-known URL', async () => {
    const res = await chai
      .request(server)
      .keepOpen()
      .get('/.well-known/oauth-authorization-server')
      .set('Accept', 'application/json');
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('issuer');
    expect(res.body).toHaveProperty('authorization_endpoint');
    expect(res.body.authorization_endpoint).toEqual(expect.stringContaining('authorize'));
    expect(res.body).toHaveProperty('token_endpoint');
    expect(res.body.token_endpoint).toEqual(expect.stringContaining('token'));
    expect(res.body).toHaveProperty('response_types_supported');
    expect(res.body.response_types_supported.length).toEqual(1);
    expect(res.body.response_types_supported[0]).toEqual('code');
    expect(res.body).toHaveProperty('scopes_supported');
    expect(res.body.scopes_supported.length).toEqual(2);
    expect(res.body.scopes_supported).toContain('/things');
    expect(res.body.scopes_supported).toContain('/things:readwrite');
  });

  it('Serves a Thing Description for the gateway at a well-known URL', async () => {
    const res = await chai
      .request(server)
      .get('/.well-known/wot')
      .set('Accept', 'application/td+json');
    expect(res.status).toEqual(200);
    expect(res.header['content-type']).toEqual(expect.stringContaining('application/td+json'));
    const td = res.body;
    expect(td['@context']).toContain('https://www.w3.org/2022/wot/discovery');
    expect(td['@type']).toContain('ThingDirectory');
    expect(td.links[0].rel).toEqual('canonical');
  });
});
