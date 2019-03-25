/**
 * Client side URL router.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

const App = require('./app');
const page = require('page');

// eslint-disable-next-line no-unused-vars
const Router = {
  init: () => {
    page('/', '/things');
    page('/assistant', App.showAssistant.bind(App));
    page('/things', App.showThings.bind(App));
    page('/things/:thingId', App.showThings.bind(App));
    page('/things/:thingId/actions/:actionName', App.showThings.bind(App));
    page('/things/:thingId/events', App.showThings.bind(App));
    page('/settings', App.showSettings.bind(App));
    page('/settings/:section', App.showSettings.bind(App));
    page('/settings/:section/:subsection', App.showSettings.bind(App));
    page('/settings/:section/:subsection/:id', App.showSettings.bind(App));
    page('/floorplan', App.showFloorplan.bind(App));
    page('/rules', App.showRules.bind(App));
    page('/rules/:rule', App.showRule.bind(App));
    page('/logs', App.showLogs.bind(App));
    page('/logs/things/:thingId/properties/:propId', App.showLogs.bind(App));
    page();
  },
};

module.exports = Router;
