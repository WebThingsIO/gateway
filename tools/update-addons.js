const migrate = require('../build/migrate').default;
const db = require('../build/db').default;
db.open();

const AddonManager = require('../build/addon-manager').default;

migrate().then(() => {
  return AddonManager.updateAddons({
    forceUpdateBinary: true,
    skipLoad: true,
  });
}).catch(console.error);
