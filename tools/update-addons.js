const UserProfile = require('../src/user-profile');
UserProfile.init();

const AddonManager = require('../src/addon-manager');

AddonManager.updateAddons(true).catch(console.error);
