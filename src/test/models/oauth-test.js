const {scopeValidSubset} = require('../../oauth-types');

describe('OAuth types', () => {
  it('should verify scopes', () => {
    expect(
      scopeValidSubset('/things:read', '/things/potato:readwrite')).toBeFalsy();

    expect(
      scopeValidSubset('/things:readwrite',
                       '/things/potato:readwrite')).toBeTruthy();

    expect(
      scopeValidSubset('/things/potato:readwrite /things/tomato:read',
                       '/things/potato:readwrite')).toBeTruthy();

    expect(
      scopeValidSubset('/things/potato:read /things/tomato:readwrite',
                       '/things/potato:readwrite')).toBeFalsy();

    expect(
      scopeValidSubset('/things/potato:read /things/tomato:readwrite',
                       '/things:readwrite')).toBeFalsy();
  });
});
