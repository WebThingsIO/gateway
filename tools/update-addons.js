const UserProfile = require('../src/user-profile');
UserProfile.init();

const db = require('../src/db');
db.open();

const AddonManager = require('../src/addon-manager');

UserProfile.migrate().then(() => {
  return AddonManager.updateAddons({
    forceUpdateBinary: true,
    skipLoad: true,
  });
}).catch(console.error);
