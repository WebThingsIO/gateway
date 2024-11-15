const migrate = require('../build/migrate');
const db = require('../build/db');
db.open();

const AddonManager = require('../build/addon-manager');

migrate()
  .then(() => {
    return AddonManager.updateAddons({
      forceUpdateBinary: true,
      skipLoad: true,
    });
  })
  .catch(console.error);
