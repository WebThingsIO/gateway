import * as Settings from '../../models/settings';

describe('Settings', () => {
  it('should be able to round trip', async () => {
    const key = 'yes.it is a.Setting';
    const value = {something: 'complicated'};
    const newValue = 'less complicated';

    expect(await Settings.getSetting(key)).toBeFalsy();

    await Settings.setSetting(key, value);
    expect(await Settings.getSetting(key)).toMatchObject(value);

    await Settings.setSetting(key, newValue);
    expect(await Settings.getSetting(key)).toEqual(newValue);
  });
});
