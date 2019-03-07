const Settings = require('../../models/settings');

describe('Settings', () => {
  it('should be able to round trip', async () => {
    const key = 'yes.it is a.Setting';
    const value = {something: 'complicated'};
    const newValue = 'less complicated';

    expect(await Settings.get(key)).toBeFalsy();

    await Settings.set(key, value);
    expect(await Settings.get(key)).toMatchObject(value);

    await Settings.set(key, newValue);
    expect(await Settings.get(key)).toEqual(newValue);
  });
});

