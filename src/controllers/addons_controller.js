const PromiseRouter = require('express-promise-router');
const fetch = require('node-fetch');
const AddonManager = require('../addon-manager');

const AddonsController = PromiseRouter();

AddonsController.get('/discover', async (request, response) => {
  let addons;
  try {
    const res = await fetch('https://raw.githubusercontent.com/mozilla-iot/' +
                            'addon-list/master/list.json');
    addons = await res.json();
  } catch (e) {
    response.status(400).send(e);
    return;
  }

  let discovered = addons.map((a) => {
    a.installed = AddonManager.isAddonAvailable(a.name);
    return a;
  });
  response.status(200).json(discovered);
});

module.exports = AddonsController;
