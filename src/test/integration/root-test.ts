import { server, chai } from '../common';

describe('/', function () {
  it('Serves a Thing Description for the gateway', async () => {
    const res = await chai.request(server).get('/').set('Accept', 'application/td+json');
    expect(res.status).toEqual(200);
    expect(res.header['content-type']).toEqual(expect.stringContaining('application/td+json'));
    const td = res.body;
    expect(td['@context']).toContain('https://www.w3.org/2022/wot/discovery');
    expect(td['@type']).toContain('ThingDirectory');
  });

  it('Serves the HTML web interface', async () => {
    const res = await chai.request(server).get('/').set('Accept', 'text/html');
    expect(res.status).toEqual(200);
    expect(res.header['content-type']).toEqual(expect.stringContaining('text/html'));
  });
});
