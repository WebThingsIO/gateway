const {assert} = require('./common');
const Passwords = require('../passwords');

describe('Passwords', () => {
  it('should be able to generate and compare hashes', async () => {
    const pass = 'apple';
    const passFake = 'orange';

    const passHash = await Passwords.hash(pass);
    const passHashSync = Passwords.hashSync(pass);
    const passFakeHashSync = Passwords.hashSync(passFake);

    assert(Passwords.compareSync(pass, passHash),
      'hash should compare correctly to original password');
    const compareAsync = await Passwords.compare(pass, passHash);
    assert(compareAsync,
      'hash should async compare correctly to original password');
    assert(Passwords.compareSync(pass, passHashSync),
      'hashSync should compare correctly to original password');
    assert(!Passwords.compareSync(passFake, passHash),
      'hash should not match fake password');
    assert(!Passwords.compareSync(pass, passFakeHashSync),
      'fake hash sync should not match original password');
  });
})

