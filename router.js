/**
 * Router.
 *
 * Configure web app routes.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

var express = require('express');
var Constants = require('./constants');

/**
 * Router.
 */
var Router = {
  /**
   * Configure web app routes.
   */
  configure: function(app, opt) {
    app.use('/', require('./controllers/root_controller'));
    app.use(Constants.USERS_PATH, require('./controllers/users_controller'));
    app.use(Constants.THINGS_PATH, require('./controllers/things_controller'));
    app.use(Constants.NEW_THINGS_PATH,
      require('./controllers/new_things_controller'));
    app.use(Constants.ADAPTERS_PATH,
      require('./controllers/adapters_controller'));
    app.use(Constants.ACTIONS_PATH,
      require('./controllers/actions_controller'));
    app.use(Constants.LOGIN_PATH, require('./controllers/login_controller'));
    app.use(Constants.LOG_OUT_PATH,
      require('./controllers/log_out_controller'));
    if (opt.options.debug) {
      app.use(Constants.DEBUG_PATH, require('./controllers/debug_controller'));
    }
    app.use(express.static(Constants.STATIC_PATH));
  }
};

module.exports = Router;
