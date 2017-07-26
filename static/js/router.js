/**
 * Client side URL router.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

/* globals App, page */

// eslint-disable-next-line no-unused-vars
var Router = {
  init: function() {

    page('/', '/things');
    page('/things', App.showThings.bind(App));
    page('/adapters', App.showAdapters.bind(App));
    page('/settings', App.showSettings.bind(App));
    page();
  }
};
