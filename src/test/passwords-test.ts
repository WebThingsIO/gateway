import * as Passwords from '../passwords';

describe('Passwords', () => {
  it('should be able to generate and compare hashes', async () => {
    const pass = 'apple';
    const passFake = 'orange';

    const passHash = await Passwords.hash(pass);
    const passHashSync = Passwords.hashSync(pass);
    const passFakeHashSync = Passwords.hashSync(passFake);

    expect(Passwords.compareSync(pass, passHash)).toBeTruthy();
    const compareAsync = await Passwords.compare(pass, passHash);
    expect(compareAsync).toBeTruthy();
    expect(Passwords.compareSync(pass, passHashSync)).toBeTruthy();
    expect(Passwords.compareSync(passFake, passHash)).toBeFalsy();
    expect(Passwords.compareSync(pass, passFakeHashSync)).toBeFalsy();
  });
});
